import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assertHeroUnchanged, containsSecret, releaseScope, sha256File } from "./guardrails.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const policyPath = "docs/growth/policy.json";
const approvalsPath = "docs/growth/approvals.json";
const policy = JSON.parse(fs.readFileSync(path.join(root, policyPath), "utf8"));
const approvals = JSON.parse(fs.readFileSync(path.join(root, approvalsPath), "utf8"));
const staged = process.argv.includes("--staged");
const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 30_000_000 });
const tracked = git(["diff", ...(staged ? ["--cached"] : []), "--name-only", "-z"]).split("\0").filter(Boolean);
const untracked = staged ? [] : git(["ls-files", "--others", "--exclude-standard", "-z"]).split("\0").filter(Boolean);
const files = [...new Set([...tracked, ...untracked])];

function optionValue(name) {
  const indexes = process.argv.reduce((all, value, index) => value === name ? [...all, index] : all, []);
  if (indexes.length > 1) throw new Error(`${name} may be supplied only once`);
  if (!indexes.length) return undefined;
  const value = process.argv[indexes[0] + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires the current approvals.json SHA256`);
  return value;
}

function headContains(file) {
  try {
    execFileSync("git", ["cat-file", "-e", `HEAD:${file}`], { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const bootstrapApprovalSha = optionValue("--bootstrap-approval-sha");
const registryChanged = files.includes(approvalsPath);
if (bootstrapApprovalSha) {
  if (headContains(approvalsPath)) {
    throw new Error("--bootstrap-approval-sha is only permitted before docs/growth/approvals.json exists in Git HEAD");
  }
  if (!registryChanged) {
    throw new Error("--bootstrap-approval-sha may only authorize the initial changed docs/growth/approvals.json registry");
  }
  const currentHash = sha256File(root, approvalsPath);
  if (!/^[a-f0-9]{64}$/.test(bootstrapApprovalSha) || bootstrapApprovalSha !== currentHash) {
    throw new Error("--bootstrap-approval-sha must exactly match the current docs/growth/approvals.json SHA256");
  }
}

let scope = releaseScope(files, policy, approvals, { root });
if (bootstrapApprovalSha) {
  scope = scope.map(entry => entry.file === approvalsPath
    ? { ...entry, allowed: true, approvalRequired: false, bootstrapApprovalRegistry: true }
    : entry);
}
const blocked = scope.filter(file => !file.allowed);
assertHeroUnchanged(root, policy);
for (const file of files) {
  if (/\.sql$|(?:migration|rollback|backup).*\.sql$/i.test(file)) throw new Error("External SQL must not enter this release");
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute) || !/\.(?:mjs|js|ts|tsx|json|md|txt|py|ya?ml|html|css)$/.test(file)) continue;
  if (containsSecret(fs.readFileSync(absolute, "utf8"))) throw new Error(`Possible secret in ${file}; value withheld`);
}
if (blocked.length) throw new Error(`Explicit user review required for: ${blocked.map(file => `${file.file} (${file.risk})`).join(", ")}`);
console.log(`PASS: ${files.length} intended files satisfy path/secret/locked-hero guards. Semantic health, legal, capability and attribution review remains required.`);
console.log("Approval records are review metadata, not cryptographic user authentication. This gate does not claim a passing build, GitHub delivery, deployment, or clinical approval.");
