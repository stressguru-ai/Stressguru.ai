import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ALWAYS_PROTECTED_PATHS = new Set(["docs/growth/policy.json", "docs/growth/approvals.json"]);
const TRAINING_AGENTS = ["gptbot", "claudebot", "google-extended"];
const PRIVATE_ROBOTS_PREFIXES = ["/api", "/admin", "/account", "/preview"];

export function assertAwsDatabaseUrl(value, policy) {
  if (!value) throw new Error("AWS database access is unavailable; no fallback database is permitted");
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error("Database URL is invalid; value withheld"); }
  const expected = policy.database;
  if (parsed.protocol !== "mysql:" || parsed.hostname !== expected.approvedHost || decodeURIComponent(parsed.pathname.slice(1)) !== expected.approvedDatabase || (parsed.port && parsed.port !== "3306")) {
    throw new Error("Database rejected: only the approved user-owned AWS MySQL database is permitted");
  }
  if (/tidb/i.test(parsed.hostname)) throw new Error("TiDB is forbidden");
  return { host: parsed.hostname, database: expected.approvedDatabase, port: 3306 };
}

export function assertHeroUnchanged(root, policy) {
  const home = fs.readFileSync(path.join(root, "client/src/pages/Home.tsx"), "utf8");
  const generator = fs.readFileSync(path.join(root, "scripts/generate-static-seo.js"), "utf8");
  if (!/Stop Stress\s*<br\s*\/?\s*>/.test(home) || !/>\s*Today\.\s*</.test(home) || !home.includes(policy.hero.subtitle) || !generator.includes(`h1: "${policy.hero.headline}"`)) {
    throw new Error("Locked homepage hero differs from user-approved text; review required");
  }
}

export function containsSecret(value) {
  return /(?:mysql|postgres(?:ql)?):\/\/[^\s"']+:[^\s"']+@/i.test(value)
    || /(?:sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})/.test(value)
    || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(value)
    || /(?:password|api[_-]?key|jwt[_-]?secret|access[_-]?token)\s*[=:]\s*["'](?!\*|\[|<|process\.env|__|\$|\s*['"])[^"'\s]{12,}["']/i.test(value);
}

export function assertSafeRecord(record) {
  const serialized = JSON.stringify(record);
  if (containsSecret(serialized)) throw new Error("A record contains a possible credential; it must not be persisted");
  const inspect = value => {
    if (Array.isArray(value)) return value.forEach(inspect);
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (/^(email|phone|password|api_?key|token|jwt_?secret|conversation|answers|userId)$/i.test(key)) throw new Error(`Sensitive field is not permitted in growth records: ${key}`);
      inspect(child);
    }
  };
  inspect(record);
  return record;
}

function repoPath(file) {
  return path.posix.normalize(String(file).replace(/\\/g, "/")).replace(/^\.\//, "");
}

function globMatches(file, pattern) {
  const source = String(pattern).replace(/\\/g, "/");
  let expression = "^";
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === "*") {
      if (source[index + 1] === "*") {
        index += 1;
        if (source[index + 1] === "/") {
          index += 1;
          expression += "(?:.*/)?";
        } else {
          expression += ".*";
        }
      } else {
        expression += "[^/]*";
      }
    } else if (character === "?") {
      expression += "[^/]";
    } else {
      expression += character.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    }
  }
  return new RegExp(`${expression}$`).test(file);
}

export function isProtectedPath(file, policy) {
  const normalized = repoPath(file);
  if (ALWAYS_PROTECTED_PATHS.has(normalized)) return true;
  return (policy?.protectedPaths ?? []).some(pattern => globMatches(normalized, pattern));
}

export function sha256File(root, file) {
  const absolute = path.resolve(root, repoPath(file));
  const normalizedRoot = path.resolve(root);
  if (absolute !== normalizedRoot && !absolute.startsWith(`${normalizedRoot}${path.sep}`)) return undefined;
  try {
    return crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
  } catch {
    return undefined;
  }
}

export function classifyPath(file) {
  const normalized = repoPath(file);
  if (/^(?:\.env(?:\.|$)|Dockerfile$|\.dockerignore$|docker-compose|Jenkinsfile|\.github\/)/i.test(normalized)) return "infrastructure";
  if (/^(?:drizzle\/|server\/db|server\/_core\/(?:env|oauth|sdk)|server\/adminRoutes)/.test(normalized)) return "product";
  if (/Home\.tsx$/.test(normalized)) return "hero";
  if (/Plans\.tsx$|pricing|CostCalculator|PlanWizard/.test(normalized)) return "pricing";
  if (/PrivacyPolicy|TermsAndConditions/.test(normalized)) return "privacy";
  if (/ScienceAndSafety|crisis/i.test(normalized)) return "crisis";
  if (/docs\/growth\/(?:policy|approvals)\.json$/.test(normalized)) return "policy";
  if (/contentPages\.generated|blogs\.generated|pages\/gurus|generate_blog_content/.test(normalized)) return "sensitive-health";
  return "low-risk";
}

export function parseRobotsGroups(source) {
  const groups = [];
  let agents = [];
  let rules = [];
  const finishGroup = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.split("#", 1)[0].trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (key === "user-agent") {
      if (rules.length) finishGroup();
      if (value) agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && agents.length) {
      rules.push({ type: key, value });
    }
  }
  finishGroup();
  return groups;
}

function effectiveRobotsRules(groups, agent) {
  const named = groups.filter(group => group.agents.includes(agent));
  const matchingGroups = named.length ? named : groups.filter(group => group.agents.includes("*"));
  return matchingGroups.flatMap(group => group.rules);
}

function isPrivateRobotsPath(value) {
  const pathname = value.split(/[?#]/, 1)[0];
  return PRIVATE_ROBOTS_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function changesTrainingPermissions(robots) {
  const groups = parseRobotsGroups(robots);
  return TRAINING_AGENTS.some(agent => {
    const rules = effectiveRobotsRules(groups, agent);
    const hasPublicRootAllow = rules.some(rule => rule.type === "allow" && rule.value === "/");
    const blocksPublicPath = rules.some(rule => rule.type === "disallow" && rule.value && !isPrivateRobotsPath(rule.value));
    return !hasPublicRootAllow || blocksPublicPath;
  });
}

function robotsNeedsTrainingApproval(file, root) {
  if (repoPath(file) !== "client/public/robots.txt") return false;
  try {
    return changesTrainingPermissions(fs.readFileSync(path.join(root, repoPath(file)), "utf8"));
  } catch {
    return true;
  }
}

function hashForFile(file, root, fileHashes) {
  const normalized = repoPath(file);
  if (fileHashes && Object.prototype.hasOwnProperty.call(fileHashes, normalized)) return fileHashes[normalized];
  return sha256File(root, normalized);
}

function reviewedApproval(file, approvals, isProtected, hash) {
  if (repoPath(file) === "docs/growth/approvals.json") return undefined;
  return approvals.find(approval => {
    if (approval?.author !== "user" || approval.status !== "approved" || !approval.reason || !approval.approvedAt || !approval.paths?.includes(file)) return false;
    return !isProtected || (typeof hash === "string" && approval.fileHashes?.[file] === hash);
  });
}

// Approval entries are review records, not cryptographic proof of a user's identity.
export function releaseScope(files, policy, approvals = [], options = {}) {
  const root = options.root ?? projectRoot;
  return files.map(file => {
    const normalized = repoPath(file);
    const protectedPath = isProtectedPath(normalized, policy);
    const hash = hashForFile(normalized, root, options.fileHashes);
    let risk = classifyPath(normalized);
    if (robotsNeedsTrainingApproval(normalized, root)) risk = "training-permissions";
    else if (protectedPath && risk === "low-risk") risk = "protected";
    const requiresApproval = protectedPath || risk !== "low-risk";
    const approval = requiresApproval ? reviewedApproval(normalized, approvals, protectedPath, hash) : undefined;
    return {
      file: normalized,
      risk,
      allowed: requiresApproval ? Boolean(approval) : policy.autonomousLowRiskDelivery === true,
      approvalRequired: requiresApproval && !approval,
      protected: protectedPath,
      approval,
    };
  });
}

export function safeWriteJson(file, record) {
  assertSafeRecord(record);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temp, file);
}
