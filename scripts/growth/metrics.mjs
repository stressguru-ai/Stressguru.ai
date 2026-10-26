const ALLOWED_WINDOWS = new Set([30, 60, 90]);
const SENSITIVE_FIELD = /^(?:api[-_]?key|authorization|cookie|credential|email|e-mail|phone|ip(?:address)?|token|password|secret|user(?:name|id)?)$/i;

/**
 * Normalize untrusted measurement records into safe, serializable observations. No
 * credentials or personal-data fields are copied into the returned records. A null
 * value represents unavailable measurement; numeric zero remains an observed zero.
 *
 * @param {Array<object>|{records?: Array<object>}} input measurement records
 * @returns {{records: Array<object>, rejected: Array<object>}}
 */
export function ingestMetrics(input) {
  const records = Array.isArray(input) ? input : isPlainObject(input) ? input.records : null;
  if (!Array.isArray(records)) throw new TypeError("Metric input must be an array or an object with a records array");

  const safeRecords = [];
  const rejected = [];
  records.forEach((record, index) => {
    const result = normalizeMetricRecord(record);
    if (result.ok) safeRecords.push(result.record);
    else rejected.push({ index, reason: result.reason });
  });
  return { records: safeRecords, rejected };
}

/** Alias with a more explicit name for callers that persist an approved report. */
export const safeIngestMetrics = ingestMetrics;

/**
 * Compare two complete, like-for-like 30/60/90-day windows. Results report observed
 * changes only; they do not make causal claims and preserve unavailable values.
 *
 * @param {object} baseline an earlier window
 * @param {object} comparison a later window
 * @returns {object} comparison validity, metric deltas, confounders and safe language
 */
export function compareComparableWindows(baseline, comparison) {
  const left = normalizeWindow(baseline, "baseline");
  const right = normalizeWindow(comparison, "comparison");
  const validationErrors = [...left.errors, ...right.errors];
  if (left.windowDays !== right.windowDays) validationErrors.push("Windows must use the same duration");
  if (!ALLOWED_WINDOWS.has(left.windowDays) || !ALLOWED_WINDOWS.has(right.windowDays)) {
    validationErrors.push("Only 30, 60, or 90 day windows are comparable");
  }
  if (left.end && right.start && left.end >= right.start) {
    validationErrors.push("Comparison window must begin after the baseline window ends");
  }

  for (const [metric, earlier] of left.metrics) {
    const later = right.metrics.get(metric);
    if (later && (earlier.source !== later.source || earlier.property !== later.property || earlier.segment !== later.segment)) {
      validationErrors.push(`Metric ${metric} has different source, property or segment definitions`);
    }
  }

  if (validationErrors.length) {
    return {
      valid: false,
      reason: "unrelated-period",
      errors: [...new Set(validationErrors)],
      windowDays: null,
      metrics: [],
      confounders: uniqueStrings([...left.confounders, ...right.confounders]),
      language: "No comparison is reported because the supplied periods are not comparable.",
    };
  }

  const metricNames = [...new Set([...left.metrics.keys(), ...right.metrics.keys()])].sort();
  const metrics = metricNames.map((metric) => compareMetric(metric, left.metrics.get(metric), right.metrics.get(metric)));
  const confounders = uniqueStrings([...left.confounders, ...right.confounders]);
  return {
    valid: true,
    reason: null,
    errors: [],
    windowDays: left.windowDays,
    baseline: { start: left.start.toISOString().slice(0, 10), end: left.end.toISOString().slice(0, 10) },
    comparison: { start: right.start.toISOString().slice(0, 10), end: right.end.toISOString().slice(0, 10) },
    metrics,
    confounders,
    language: buildNonCausalLanguage(metrics, confounders),
  };
}

/** Alias retained for runner ergonomics. */
export const comparePeriods = compareComparableWindows;

/**
 * Keep unlinked brand mentions distinct from citations that contain an actual source
 * URL. A mention is never promoted to a citation merely because it was observed.
 */
export function separateMentionsAndCitations(records) {
  if (!Array.isArray(records)) throw new TypeError("records must be an array");
  const mentions = [];
  const citations = [];
  const rejected = [];
  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      rejected.push({ index, reason: "Record must be an object" });
      return;
    }
    const observedAt = parseObservedDate(record.observedAt);
    if (!observedAt) {
      rejected.push({ index, reason: "A valid observedAt date is required" });
      return;
    }
    const base = safeObservationIdentity(record, observedAt);
    if (!base) {
      rejected.push({ index, reason: "A non-empty engine or source identifier is required" });
      return;
    }
    const mention = record.mentioned === true || record.mention === true || typeof record.mentionText === "string";
    const citationUrls = citationUrlsFor(record);
    if (mention) mentions.push({ ...base, kind: "mention" });
    for (const url of citationUrls) citations.push({ ...base, kind: "citation", url });
  });
  return { mentions, citations, rejected };
}

/**
 * Count AI-engine benchmark tests only when an actual result was observed, dated and
 * valid. An unavailable/untested prompt produces no fabricated zero result.
 */
export function summarizeEngineBenchmark(records) {
  if (!Array.isArray(records)) throw new TypeError("records must be an array");
  const validResults = [];
  const rejected = [];
  const mentionInput = [];

  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      rejected.push({ index, reason: "Record must be an object" });
      return;
    }
    const observedAt = parseObservedDate(record.observedAt);
    const engine = safeShortString(record.engine);
    const query = safeShortString(record.query ?? record.prompt);
    const normalizedStatus = typeof record.status === "string" ? record.status.toLowerCase() : "observed";
    const hasActualResult = record.observed === true
      && record.valid !== false
      && !["unavailable", "untested", "invalid", "failed", "error"].includes(normalizedStatus)
      && hasResult(record.result);
    if (!observedAt || !engine || !query || !hasActualResult) {
      rejected.push({
        index,
        reason: !observedAt ? "A valid observedAt date is required" : !engine ? "Engine is required" : !query ? "Query is required" : "An actual observed result is required",
      });
      return;
    }
    const result = {
      engine,
      query,
      observedAt: observedAt.toISOString(),
      result: safeResult(record.result),
    };
    validResults.push(result);
    mentionInput.push({ engine, query, observedAt: result.observedAt, mentioned: record.mentioned, mention: record.mention, mentionText: record.mentionText, citationUrl: record.citationUrl, citations: record.citations });
  });

  const separated = separateMentionsAndCitations(mentionInput);
  return {
    observedValidResultCount: validResults.length,
    // This count intentionally never treats a planned 25-prompt set or an unavailable
    // response as a tested benchmark result.
    testCount: validResults.length,
    results: validResults,
    mentionCount: separated.mentions.length,
    citationCount: separated.citations.length,
    mentions: separated.mentions,
    citations: separated.citations,
    rejected,
    language: "Counts reflect only observed, dated, valid engine results. Mentions and citations are reported separately and do not establish causation or rankings.",
  };
}

function normalizeMetricRecord(record) {
  if (!isPlainObject(record)) return { ok: false, reason: "Record must be an object" };
  const metric = safeMetricName(record.metric);
  if (!metric) return { ok: false, reason: "Metric must be a short non-sensitive identifier" };
  const observedAt = parseObservedDate(record.observedAt);
  if (!observedAt) return { ok: false, reason: "A valid observedAt date is required" };
  const value = record.value;
  const explicitlyUnavailable = record.status === "unavailable" || record.status === "untested" || value === null || value === undefined;
  if (!explicitlyUnavailable && (!Number.isFinite(value) || value < 0)) {
    return { ok: false, reason: "Observed metric value must be a non-negative finite number" };
  }
  const period = normalizePeriod(record.period);
  if (record.period !== undefined && !period) return { ok: false, reason: "Period must have valid start and end dates" };

  // `outboundClicks` is intentionally just a click metric. It is never renamed or
  // aggregated into installations, downloads, or conversions without source evidence.
  return {
    ok: true,
    record: {
      metric,
      value: explicitlyUnavailable ? null : value,
      status: explicitlyUnavailable ? "unavailable" : "observed",
      observedAt: observedAt.toISOString(),
      source: safeShortString(record.source) || "unspecified",
      property: safeShortString(record.property) ?? null,
      segment: safeShortString(record.segment) ?? null,
      ...(period ? { period } : {}),
    },
  };
}

function normalizeWindow(window, label) {
  const errors = [];
  if (!isPlainObject(window)) {
    return { errors: [`${label} window must be an object`], windowDays: null, start: null, end: null, metrics: new Map(), confounders: [] };
  }
  const windowDays = Number(window.windowDays ?? window.days);
  const start = parseObservedDate(window.start ?? window.period?.start);
  const end = parseObservedDate(window.end ?? window.period?.end);
  if (!Number.isInteger(windowDays)) errors.push(`${label} windowDays must be an integer`);
  if (!start || !end) errors.push(`${label} requires valid start and end dates`);
  if (start && end && start > end) errors.push(`${label} start must not be after end`);
  if (start && end && Number.isInteger(windowDays)) {
    const actualDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    if (actualDays !== windowDays) errors.push(`${label} dates do not span ${windowDays} inclusive days`);
  }

  const ingestion = ingestMetrics(window.metrics ?? []);
  if (ingestion.rejected.length) errors.push(`${label} contains invalid metric records`);
  const metrics = new Map();
  for (const record of ingestion.records) {
    if (record.period && start && end && (record.period.start.slice(0, 10) !== start.toISOString().slice(0, 10) || record.period.end.slice(0, 10) !== end.toISOString().slice(0, 10))) {
      errors.push(`${label} metric ${record.metric} period differs from the comparison window`);
    }
    if (metrics.has(record.metric)) {
      errors.push(`${label} has duplicate metric ${record.metric}`);
      continue;
    }
    metrics.set(record.metric, record);
  }
  return { errors, windowDays, start, end, metrics, confounders: normalizeConfounders(window.confounders) };
}

function compareMetric(metric, baseline, comparison) {
  const left = baseline ?? unavailableMetric(metric);
  const right = comparison ?? unavailableMetric(metric);
  const observed = left.status === "observed" && right.status === "observed";
  if (!observed) {
    return {
      metric,
      baseline: left.value,
      comparison: right.value,
      status: "unavailable",
      absoluteChange: null,
      percentChange: null,
      reason: "At least one period is unavailable; no zero was inferred.",
    };
  }
  const absoluteChange = right.value - left.value;
  if (left.value === 0) {
    return {
      metric,
      baseline: left.value,
      comparison: right.value,
      status: "observed",
      absoluteChange,
      percentChange: null,
      reason: "Baseline is true zero; percentage change is undefined.",
    };
  }
  return {
    metric,
    baseline: left.value,
    comparison: right.value,
    status: "observed",
    absoluteChange,
    percentChange: Number(((absoluteChange / left.value) * 100).toFixed(2)),
    reason: null,
  };
}

function buildNonCausalLanguage(metrics, confounders) {
  const observed = metrics.filter((metric) => metric.status === "observed");
  if (observed.length === 0) return "No observed comparable metric change is available; no conclusion is drawn.";
  const direction = observed.filter((metric) => metric.absoluteChange > 0).length > observed.filter((metric) => metric.absoluteChange < 0).length ? "higher" : "lower or mixed";
  const confounderText = confounders.length ? ` Potential confounders noted: ${confounders.join("; ")}.` : " No confounders were supplied.";
  return `The comparison observed ${direction} values in the later window. This descriptive comparison does not show that any change caused the observed result.${confounderText}`;
}

function unavailableMetric(metric) {
  return { metric, value: null, status: "unavailable" };
}

function normalizePeriod(value) {
  if (!isPlainObject(value)) return null;
  const start = parseObservedDate(value.start);
  const end = parseObservedDate(value.end);
  if (!start || !end || start > end) return null;
  return { start: start.toISOString(), end: end.toISOString() };
}

function safeObservationIdentity(record, observedAt) {
  const engine = safeShortString(record.engine ?? record.source);
  const query = safeShortString(record.query ?? record.prompt);
  if (!engine) return null;
  return {
    engine,
    ...(query ? { query } : {}),
    observedAt: observedAt.toISOString(),
  };
}

function citationUrlsFor(record) {
  const candidates = [record.citationUrl, ...(Array.isArray(record.citations) ? record.citations : [])];
  return [...new Set(candidates.map(safeHttpUrl).filter(Boolean))];
}

function hasResult(result) {
  if (typeof result === "string") return result.trim().length > 0;
  if (typeof result === "number") return Number.isFinite(result);
  return isPlainObject(result) && Object.keys(result).length > 0;
}

function safeResult(result) {
  if (typeof result === "string") return result.slice(0, 1000);
  if (typeof result === "number") return result;
  // Copy only shallow primitive result fields, excluding sensitive fields and arbitrary
  // remote instructions/payloads.
  const safe = {};
  if (isPlainObject(result)) {
    for (const [key, value] of Object.entries(result)) {
      if (SENSITIVE_FIELD.test(key)) continue;
      if (typeof value === "string") safe[key] = value.slice(0, 1000);
      else if (typeof value === "number" || typeof value === "boolean" || value === null) safe[key] = value;
    }
  }
  return safe;
}

function safeMetricName(value) {
  if (typeof value !== "string" || !/^[a-z][a-zA-Z0-9_-]{0,63}$/.test(value) || SENSITIVE_FIELD.test(value)) return null;
  return value;
}

function safeShortString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500 || /(?:mysql|postgres(?:ql)?):\/\/[^\s]+@|\b(?:sk-|ghp_)[A-Za-z0-9_-]{20,}/.test(trimmed)) return null;
  return trimmed;
}

function safeHttpUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return !url.username && !url.password && (url.protocol === "https:" || url.protocol === "http:") ? url.toString() : null;
  } catch {
    return null;
  }
}

function parseObservedDate(value) {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeConfounders(value) {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean));
}

function uniqueStrings(values) {
  return [...new Set(values)].sort();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
