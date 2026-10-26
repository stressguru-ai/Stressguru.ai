const MANDATORY_APPROVAL_TERMS = [
  ["product", "product-capability"],
  ["capability", "product-capability"],
  ["pricing", "pricing"],
  ["price", "pricing"],
  ["hero", "locked-hero"],
  ["privacy", "privacy-or-legal"],
  ["legal", "privacy-or-legal"],
  ["clinical", "clinical-or-health-claim"],
  ["medical", "clinical-or-health-claim"],
  ["diagnos", "clinical-or-health-claim"],
  ["treatment", "clinical-or-health-claim"],
  ["crisis", "crisis-guidance"],
  ["suicid", "crisis-guidance"],
  ["988", "crisis-guidance"],
  ["delete", "destructive-url-change"],
  ["redirect", "destructive-url-change"],
  ["consolidat", "destructive-url-change"],
  ["training permission", "training-permissions"],
  ["change policy", "policy-change"],
  ["infrastructure", "infrastructure"],
  ["hosting", "infrastructure"],
  ["deploy", "infrastructure"],
  ["aws", "infrastructure"],
  ["outreach", "external-outreach"],
  ["backlink", "external-outreach"],
  ["email", "external-outreach"],
];

const DEFAULT_WEIGHTS = Object.freeze({
  demand: 35,
  impact: 25,
  evidence: 20,
  effort: 10,
  freshness: 10,
});

/**
 * Rank candidate work without granting approval. Scores are deterministic and only use
 * supplied, observed values. Missing metrics/demand never become positive evidence.
 * Mandatory policy domains always remain approval-required, even if a caller supplies
 * a permissive policy object.
 *
 * @param {Array<object>} candidates candidate opportunity records
 * @param {{history?: Array<object>, policy?: object}} options records from prior runs and policy flags
 * @returns {Array<object>} ranked candidate decisions, highest score first
 */
export function prioritizeOpportunities(candidates, { history = [], policy = {} } = {}) {
  if (!Array.isArray(candidates)) throw new TypeError("candidates must be an array");
  if (!Array.isArray(history)) throw new TypeError("history must be an array");
  if (!isPlainObject(policy)) throw new TypeError("policy must be an object");

  const normalizedHistory = history.filter(isPlainObject).map(normalizeHistoryRecord);
  const weights = normalizeWeights(policy.weights);

  return candidates
    .map((candidate, index) => scoreCandidate(candidate, index, normalizedHistory, policy, weights))
    .sort((left, right) => right.score - left.score || left.priorityKey.localeCompare(right.priorityKey))
    .map(({ priorityKey, ...decision }) => decision);
}

/**
 * Exposed so runners can show the reason a sensitive proposal was stopped before it is
 * added to a backlog. It is pure and makes no policy changes.
 */
export function riskGatesForCandidate(candidate, policy = {}) {
  if (!isPlainObject(candidate)) throw new TypeError("candidate must be an object");
  if (!isPlainObject(policy)) throw new TypeError("policy must be an object");

  const gates = new Set();
  const text = candidateText(candidate);
  for (const [term, gate] of MANDATORY_APPROVAL_TERMS) {
    if (text.includes(term)) gates.add(gate);
  }

  const explicitRisk = valuesAsStrings(candidate.risks ?? candidate.risk ?? candidate.riskTags);
  for (const risk of explicitRisk) {
    const normalized = risk.toLowerCase();
    if (normalized.includes("clinical") || normalized.includes("health") || normalized.includes("medical")) gates.add("clinical-or-health-claim");
    if (normalized.includes("crisis") || normalized.includes("suicid")) gates.add("crisis-guidance");
    if (normalized.includes("hero")) gates.add("locked-hero");
    if (normalized.includes("pricing") || normalized.includes("product")) gates.add(normalized.includes("pricing") ? "pricing" : "product-capability");
    if (normalized.includes("privacy") || normalized.includes("legal")) gates.add("privacy-or-legal");
    if (normalized.includes("url") || normalized.includes("redirect") || normalized.includes("delete")) gates.add("destructive-url-change");
    if (normalized.includes("infrastructure") || normalized.includes("deploy")) gates.add("infrastructure");
    if (normalized.includes("outreach") || normalized.includes("external")) gates.add("external-outreach");
  }

  const configuredApprovalTypes = new Set(valuesAsStrings(policy.requiresApprovalFor ?? policy.approvalRequired).map((item) => item.toLowerCase()));
  const type = stringOrNull(candidate.type)?.toLowerCase();
  const action = stringOrNull(candidate.action)?.toLowerCase();
  if (type && configuredApprovalTypes.has(type)) gates.add("policy-approval-required");
  if (action && configuredApprovalTypes.has(action)) gates.add("policy-approval-required");
  if (candidate.requiresApproval === true) gates.add("candidate-approval-required");

  return [...gates].sort();
}

function scoreCandidate(candidate, index, history, policy, weights) {
  if (!isPlainObject(candidate)) {
    return invalidDecision(index, "Candidate is not an object");
  }

  const id = firstNonEmpty(candidate.id, candidate.path, candidate.title, `candidate-${index + 1}`);
  const kind = inferKind(candidate);
  const evidence = observedEvidence(candidate);
  const demand = observedDemand(candidate);
  const gates = riskGatesForCandidate(candidate, policy);
  const reasons = [];
  const historyState = historyForCandidate(history, id, candidate, policy);

  if (!evidence.hasAny) reasons.push("No observed valid metric evidence was supplied; missing metrics are not scored as opportunity.");
  if (kind === "new-page" && !demand.available) {
    gates.push("new-page-demand-unavailable");
    reasons.push("A new page lacks observed demand evidence, so it cannot be automatically authorized.");
  }
  if (historyState.pendingMeasurement) {
    gates.push("duplicate-implementation-pending-measurement");
    reasons.push("A comparable implementation is pending measurement; avoid duplicating it before evidence arrives.");
  }
  if (historyState.inconclusiveAfterSevenDays) {
    gates.push("inconclusive-history-not-reversal-evidence");
    reasons.push("Inconclusive evidence after seven days does not establish a reversal or rollback decision.");
  }

  const base = evidence.hasAny
    ? weightedScore({ candidate, demand, evidence, weights })
    : 0;
  const duplicatePenalty = historyState.pendingMeasurement ? 35 : 0;
  const score = clamp(Math.round(base - duplicatePenalty), 0, 100);
  const requiresApproval = gates.length > 0;
  const authorization = requiresApproval ? "approval-required" : evidence.hasAny ? "eligible-for-low-risk-review" : "insufficient-evidence";

  if (evidence.hasAny) {
    reasons.push(`Observed evidence score ${evidence.score}/100 was used; unavailable values were excluded.`);
  }
  if (demand.available) {
    reasons.push(`Observed demand score ${demand.score}/100 supports evaluation${kind === "new-page" ? " of a new page" : ""}.`);
  }
  if (gates.length > 0) reasons.push(`Approval gate${gates.length === 1 ? "" : "s"}: ${[...new Set(gates)].sort().join(", ")}.`);
  if (reasons.length === 0) reasons.push("Candidate has limited observed evidence and remains subject to normal review.");

  return {
    id,
    kind,
    title: firstNonEmpty(candidate.title, candidate.path, id),
    path: stringOrNull(candidate.path),
    score,
    confidence: confidenceFor({ evidence, demand, historyState }),
    authorization,
    requiresApproval,
    riskGates: [...new Set(gates)].sort(),
    reason: reasons.join(" "),
    reasonDetails: reasons,
    measurement: {
      observedMetricEvidence: evidence.hasAny,
      observedDemand: demand.available,
      historyStatus: historyState.status,
    },
    priorityKey: `${String(999 - score).padStart(3, "0")}:${id.toLowerCase()}`,
  };
}

function invalidDecision(index, reason) {
  return {
    id: `candidate-${index + 1}`,
    kind: "unknown",
    title: `candidate-${index + 1}`,
    path: null,
    score: 0,
    confidence: "none",
    authorization: "approval-required",
    requiresApproval: true,
    riskGates: ["invalid-candidate"],
    reason,
    reasonDetails: [reason],
    measurement: { observedMetricEvidence: false, observedDemand: false, historyStatus: "none" },
    priorityKey: `999:candidate-${index + 1}`,
  };
}

function weightedScore({ candidate, demand, evidence, weights }) {
  const impact = normalizedSignal(candidate.impact ?? candidate.expectedImpact ?? candidate.impactScore);
  const effort = normalizedSignal(candidate.effort ?? candidate.effortScore);
  const freshness = normalizedSignal(candidate.freshness ?? candidate.freshnessScore);
  const values = {
    demand: demand.available ? demand.score : 0,
    impact: impact.available ? impact.score : 0,
    evidence: evidence.score,
    // Lower observed effort is preferable. An absent effort estimate contributes nothing.
    effort: effort.available ? 100 - effort.score : 0,
    freshness: freshness.available ? freshness.score : 0,
  };
  const availableWeights = Object.entries(values)
    .filter(([name]) => name === "evidence" || (name === "demand" ? demand.available : normalizedSignal(candidate[name] ?? candidate[`${name}Score`] ?? candidate[name === "impact" ? "expectedImpact" : name]).available))
    .reduce((sum, [name]) => sum + weights[name], 0);
  if (availableWeights === 0) return 0;
  return Object.entries(values).reduce((sum, [name, value]) => sum + (value * weights[name]) / availableWeights, 0);
}

function observedEvidence(candidate) {
  const values = [];
  const metricContainers = [candidate.metrics, candidate.observedMetrics, candidate.evidence];
  for (const container of metricContainers) {
    if (Array.isArray(container)) {
      for (const entry of container) {
        const signal = metricSignal(entry);
        if (signal.available) values.push(signal.score);
      }
    } else {
      const signal = metricSignal(container);
      if (signal.available) values.push(signal.score);
    }
  }
  // Explicit validated evidence score may be used, but a bare `metrics: null` never is.
  const direct = normalizedSignal(candidate.evidenceScore);
  if (direct.available && candidate.evidenceObserved === true) values.push(direct.score);
  return { hasAny: values.length > 0, score: values.length ? average(values) : 0 };
}

function observedDemand(candidate) {
  const demand = candidate.demand ?? candidate.demandEvidence ?? candidate.searchDemand;
  if (isPlainObject(demand)) {
    if (demand.status && String(demand.status).toLowerCase() !== "observed") return { available: false, score: 0 };
    const value = normalizedSignal(demand.score ?? demand.value ?? demand.volume);
    return value.available && demand.observed !== false ? { available: true, score: value.score } : { available: false, score: 0 };
  }
  const direct = normalizedSignal(demand);
  return direct.available && candidate.demandObserved === true ? { available: true, score: direct.score } : { available: false, score: 0 };
}

function metricSignal(value) {
  if (!isPlainObject(value)) return normalizedSignal(value);
  if (value.status && String(value.status).toLowerCase() !== "observed") return { available: false, score: 0 };
  if (value.observed === false || value.valid === false) return { available: false, score: 0 };
  return normalizedSignal(value.score ?? value.value ?? value.normalizedScore);
}

function normalizedSignal(value) {
  // Null, undefined, and blank strings mean unavailable. They must never become a
  // numeric zero through JavaScript coercion because zero is valid observed evidence.
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
    return { available: false, score: 0 };
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return { available: false, score: 0 };
  return { available: true, score: clamp(number, 0, 100) };
}

function historyForCandidate(history, id, candidate, policy) {
  const candidatePath = stringOrNull(candidate.path);
  const related = history.filter((entry) => {
    const entryId = firstNonEmpty(entry.candidateId, entry.id, entry.path, entry.title, "");
    return entryId === id || (candidatePath && entry.path === candidatePath);
  });
  // A seven-day conclusion needs an explicit, supplied observation date. Falling back
  // to the machine clock would make an otherwise identical input score differently on
  // different days, which is unsuitable for a deterministic decision record.
  const now = validDate(candidate.asOf) || validDate(candidate.now) || validDate(policy.asOf);
  let pendingMeasurement = false;
  let inconclusiveAfterSevenDays = false;
  for (const record of related) {
    const implemented = record.implemented === true || /implemented|shipped|live/i.test(String(record.status || ""));
    const measurementObserved = record.measurementObserved === true || record.observedMeasurement === true || /measured|positive|negative|conclusive/i.test(String(record.outcome || ""));
    if (implemented && !measurementObserved) pendingMeasurement = true;
    const completedAt = validDate(record.implementedAt) || validDate(record.completedAt) || validDate(record.date);
    const isInconclusive = /inconclusive|no.?change|uncertain/i.test(String(record.outcome || record.status || ""));
    if (now && completedAt && isInconclusive && now.getTime() - completedAt.getTime() >= 7 * 24 * 60 * 60 * 1000) {
      inconclusiveAfterSevenDays = true;
    }
  }
  return {
    pendingMeasurement,
    inconclusiveAfterSevenDays,
    status: related.length === 0 ? "none" : pendingMeasurement ? "pending-measurement" : inconclusiveAfterSevenDays ? "inconclusive" : "measured-or-historical",
  };
}

function normalizeHistoryRecord(record) {
  return {
    id: stringOrNull(record.id),
    candidateId: stringOrNull(record.candidateId),
    path: stringOrNull(record.path),
    title: stringOrNull(record.title),
    status: stringOrNull(record.status),
    outcome: stringOrNull(record.outcome),
    implemented: record.implemented === true,
    measurementObserved: record.measurementObserved === true,
    observedMeasurement: record.observedMeasurement === true,
    implementedAt: stringOrNull(record.implementedAt),
    completedAt: stringOrNull(record.completedAt),
    date: stringOrNull(record.date),
  };
}

function confidenceFor({ evidence, demand, historyState }) {
  if (!evidence.hasAny) return "none";
  if (historyState.pendingMeasurement) return "low";
  if (evidence.hasAny && demand.available) return "medium";
  return "low";
}

function inferKind(candidate) {
  const explicit = stringOrNull(candidate.kind) || stringOrNull(candidate.type) || stringOrNull(candidate.action);
  if (explicit && /new[-_ ]?page|author|create[-_ ]?page/i.test(explicit)) return "new-page";
  return explicit ? explicit.toLowerCase().replaceAll(/\s+/g, "-") : "existing-page";
}

function normalizeWeights(raw) {
  if (!isPlainObject(raw)) return DEFAULT_WEIGHTS;
  const weights = {};
  for (const [key, fallback] of Object.entries(DEFAULT_WEIGHTS)) {
    const value = Number(raw[key]);
    weights[key] = Number.isFinite(value) && value >= 0 ? value : fallback;
  }
  return Object.freeze(weights);
}

function candidateText(candidate) {
  return [
    candidate.title,
    candidate.description,
    candidate.action,
    candidate.type,
    candidate.kind,
    candidate.path,
    ...valuesAsStrings(candidate.tags),
    ...valuesAsStrings(candidate.risks),
  ]
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function valuesAsStrings(value) {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  return typeof value === "string" ? [value] : [];
}

function validDate(value) {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function firstNonEmpty(...values) {
  for (const value of values) if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function stringOrNull(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
