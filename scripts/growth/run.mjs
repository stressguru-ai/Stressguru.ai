import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildInventory } from "./inventory.mjs";
import { crawlRoutes } from "./crawler.mjs";
import { prioritizeOpportunities } from "./decision-engine.mjs";
import { ingestMetrics, summarizeEngineBenchmark } from "./metrics.mjs";
import { assertHeroUnchanged, safeWriteJson, assertSafeRecord } from "./guardrails.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const runId = option("--run-id") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(runId) || Number.isNaN(Date.parse(runId))) throw new Error("Run ID must be a valid YYYY-MM-DD date");
const origin = option("--origin") ?? "https://stressguru.ai";
const label = origin.startsWith("http://127.0.0.1:") || origin.startsWith("http://localhost:") ? "local-after" : "public-before";
const growth = path.join(root, "docs/growth");
const runDirectory = path.join(growth, "runs", runId);
fs.mkdirSync(runDirectory, { recursive: true });
const lock = path.join(runDirectory, ".run.lock");
let fd;
try { fd = fs.openSync(lock, "wx", 0o600); } catch { throw new Error("This run is already active. Inspect its process before removing a stale lock; do not start a duplicate."); }

const read = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
try {
  const policy = read(path.join(growth, "policy.json"), null);
  if (!policy || policy.dashboard !== false || policy.deployAws !== false || !policy.database.forbidTiDB) throw new Error("Approved policy missing or altered; stop for review");
  assertHeroUnchanged(root, policy);
  const inventory = buildInventory(root);
  safeWriteJson(path.join(growth, "content-inventory.json"), inventory);
  const inputMetrics = option("--metrics");
  const metrics = inputMetrics ? ingestMetrics(read(path.resolve(inputMetrics), [])) : { records: [], rejected: [], status: "unavailable: analytics properties have not been connected" };
  safeWriteJson(path.join(runDirectory, "metrics.json"), metrics);
  const benchmark = read(path.join(growth, "ai-benchmark.json"), { observations: [] });
  const benchmarkSummary = summarizeEngineBenchmark(benchmark.observations ?? []);
  safeWriteJson(path.join(runDirectory, "benchmark-summary.json"), { ...benchmarkSummary, plannedPrompts: benchmark.prompts?.length ?? 0, observationStatus: benchmarkSummary.testCount ? "observed" : "untested", mentionRate: null, citationRate: null });

  const auditPath = path.join(runDirectory, `${label}.json`);
  let audit = read(auditPath, null);
  if (args.includes("--crawl")) {
    if (audit && !args.includes("--refresh-audit")) console.log(`Reuse existing ${label} evidence; use --refresh-audit only for a new intentional measurement.`);
    else {
      audit = await crawlRoutes(origin, inventory.publicRoutes, { concurrency: 3, onProgress: (done, total, row) => {
        if (done % 25 === 0 || done === total) console.log(`${label}: ${done}/${total} requests; last HTTP ${row.status}`);
      } });
      safeWriteJson(auditPath, audit);
    }
  }
  const history = read(path.join(growth, "history.json"), []);
  const backlog = read(path.join(growth, "backlog.json"), []);
  const candidates = backlog.filter(c => c.status !== "completed");
  const priorities = prioritizeOpportunities(candidates, { history, policy: { ...policy, requiresApprovalFor: policy.approvalRequired, asOf: runId } });
  safeWriteJson(path.join(runDirectory, "priorities.json"), priorities);
  const issueRegister = (audit?.routes ?? []).flatMap(row => (row.issues ?? []).map(issue => ({
    url: row.url, problem: issue.code, evidence: issue.evidence, priority: issue.priority,
    businessImpact: issue.priority === "critical" ? "The intended initial page answer may not be available" : "May affect discovery, page clarity or trust",
    seoImpact: "Investigate initial HTML and indexing suitability; no ranking effect is claimed",
    aiSearchImpact: "May affect accessible source content; no citation change is measured",
    proposedFix: "Inspect the actual route response and apply the smallest verified correction",
    estimatedEffort: null, implementationStatus: label === "local-after" ? "local verification only" : "public baseline, not changed by this audit"
  })));
  safeWriteJson(path.join(runDirectory, `${label}-issue-register.json`), issueRegister);
  const existing = read(path.join(runDirectory, "run.json"), {});
  const record = assertSafeRecord({ ...existing, runId, updatedAt: new Date().toISOString(), stage: "prepared",
    repositoryScope: inventory.snapshot.description,
    counts: { publicRoutes: inventory.publicRoutes.length, guides: inventory.guides.length, publishedBlogPackage: inventory.publishedBlogs.length, localImages: inventory.localImages.count },
    audit: audit ? { artifact: `docs/growth/runs/${runId}/${label}.json`, totals: audit.totals, javascriptExecuted: false } : null,
    metricsStatus: metrics.records.length ? "imported aggregate records; inspect rejected records and comparability" : "unavailable",
    aiBenchmarkStatus: benchmarkSummary.testCount ? "actual observed responses recorded" : "untested",
    github: existing.github ?? { status: "unverified", sha: null },
    schedule: read(path.join(growth, "schedule.json"), { status: "unconfigured" }).status,
    nextStage: "Manus agent researches and implements approved priorities, runs release validation, delivers through verified GitHub access, records actual outcomes. No dashboard or automatic content quota." });
  safeWriteJson(path.join(runDirectory, "run.json"), record);
  safeWriteJson(path.join(growth, "latest-run.json"), { runId, artifact: `docs/growth/runs/${runId}/run.json` });
  console.log(`Prepared ${runId}: ${inventory.publicRoutes.length} public source routes, ${priorities.length} ranked backlog items. Missing metrics remain unavailable.`);
  console.log("No database accessed, content published, Git operation performed, or deployment triggered by this runner.");
} finally {
  if (fd !== undefined) fs.closeSync(fd);
  fs.unlinkSync(lock);
}
