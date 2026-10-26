import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import express from "express";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { crawlRoutes } from "./crawler.mjs";
import { safeWriteJson } from "./guardrails.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const runId = args[args.indexOf("--run-id") + 1];
if (!args.includes("--run-id") || !/^\d{4}-\d{2}-\d{2}$/.test(runId) || Number.isNaN(Date.parse(runId))) throw new Error("Supply --run-id YYYY-MM-DD to preserve per-run verification evidence");
const directory = path.join(root, "docs/growth/runs", runId);
if ((fs.existsSync(path.join(directory, "local-after.json")) || fs.existsSync(path.join(directory, "http-regression.json"))) && !args.includes("--refresh-verification")) throw new Error("Verification evidence already exists. Use --refresh-verification only for an intentional same-run remeasurement.");
const output = path.join(root, `node_modules/.cache/stressguru-seoStatic-${runId}.mjs`);
fs.mkdirSync(path.dirname(output), { recursive: true });
execFileSync("pnpm", ["exec", "esbuild", "server/seoStatic.ts", "--bundle", "--platform=node", "--external:express", "--format=esm", `--outfile=${output}`], { cwd: root, stdio: "inherit" });
const { installSeoStatic } = await import(pathToFileURL(output));
const app = express();
installSeoStatic(app, { staticPath: path.join(root, "dist/public") });
const server = createServer(app);
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  const routes = [...fs.readFileSync(path.join(root, "client/public/sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  const report = await crawlRoutes(origin, routes, { concurrency: 3, onProgress: (done, total, row) => {
    if (done % 50 === 0 || done === total) console.log(`Local snapshot verification: ${done}/${total}, HTTP ${row.status}`);
  } });
  const qualityFailures = report.routes.flatMap(row => [
    ...(row.issues ?? []).filter(i => ["critical", "high"].includes(i.priority)).map(i => ({ url: row.url, code: i.code })),
    ...(!row.answerFirst ? [{ url: row.url, code: "missing-answer-first" }] : []),
    ...(!row.schemaTypes?.length ? [{ url: row.url, code: "missing-schema" }] : [])
  ]);
  const checks = [];
  for (const [route, expectedStatus] of [["/", 200], ["/anxiety-support/sunday-scaries", 200], ["/blogs/stress-management-guide", 200], ["/images/RWUZzJBIfZqvGUel.jpg", 200], ["/sitemap.xml", 200], ["/llms-full.txt", 200], ["/definitely-not-a-real-page-growth-audit", 404], ["/images/not-a-real-image-growth-audit.png", 404], ["/api/not-a-real-endpoint", 404], ["/admin/login", 200]]) {
    const response = await fetch(`${origin}${route}`, { redirect: "manual" });
    const text = await response.text();
    checks.push({ route, actualStatus: response.status, expectedStatus, pass: response.status === expectedStatus, noindex: response.headers.get("x-robots-tag"),
      ...(route === "/" ? { heroMatches: text.includes("Stop Stress Today.") } : {}),
      ...(route === "/anxiety-support/sunday-scaries" ? { answerFirst: text.includes('data-answer="true"'), canonicalMatches: text.includes('href="https://stressguru.ai/anxiety-support/sunday-scaries"') } : {}) });
  }
  safeWriteJson(path.join(directory, "local-after.json"), report);
  safeWriteJson(path.join(directory, "http-regression.json"), { checkedAt: new Date().toISOString(), scope: "database-free actual production static helper with generated local build; not AWS", checks, qualityFailures, intentionalLimitations: ["noscript-snapshot remains visible; this is not full SSR or rendered parity", "medium warnings require editorial/accessibility review"] });
  if (report.totals.failures || qualityFailures.length || checks.some(c => !c.pass || c.heroMatches === false || c.answerFirst === false || c.canonicalMatches === false)) throw new Error(`Local raw HTTP regression failed: ${qualityFailures.length} high-severity or required-content findings; inspect evidence`);
  console.log(`${report.totals.http200}/${report.totals.checked} source routes HTTP 200, zero high-severity snapshot findings; ${checks.length} core/missing/private HTTP checks passed.`);
} finally {
  await new Promise(resolve => server.close(resolve));
  fs.unlinkSync(output);
}
