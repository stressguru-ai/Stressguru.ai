# StressGuru growth agent, without a dashboard

The autonomous executor is a recurring Manus instruction using `RUNBOOK.md`. The dependency-light Node utilities prepare and validate its work. They do not independently publish articles, impersonate search engines, query the database, deploy AWS, or run a persistent daemon. Recurring activation and GitHub delivery are currently blocked as recorded in `schedule.json` and the initial run report.

## Commands

Run from the existing repository root with its current Node/pnpm environment. The established build additionally requires Python 3; no new dependency or environment file is introduced.

```bash
node scripts/growth/seed-research.mjs
node scripts/growth/run.mjs --run-id YYYY-MM-DD --crawl
node scripts/growth/run.mjs --run-id YYYY-MM-DD --metrics /private/path/aggregate-metrics.json
pnpm check
pnpm test
pnpm audit:content
pnpm build
node scripts/growth/verify-http.mjs --run-id YYYY-MM-DD
node scripts/growth/validate-release.mjs
node scripts/growth/validate-release.mjs --staged
```

The initial seed command is for deliberate reseeding, not a mandatory weekly step: it would replace the seed database, so preserve subsequently enriched keyword evidence. A same-day audit is reused unless `--refresh-audit` is intentionally supplied. A temporary lock prevents duplicate runs. Inspect the process before removing a stale lock; do not run a second unattended copy.

`verify-http.mjs` bundles only the production static-serving helper, starts a temporary local HTTP fixture over the actual build, crawls all sitemap paths, records core/404/private-route checks, and shuts down. It does not import the application entry point, authentication, tRPC routes, or database. It requires an explicit run date, writes only that run directory, and rejects existing verification evidence unless an intentional `--refresh-verification` is supplied. Every snapshot must pass the high-severity metadata/heading/schema gate and include its direct-answer marker; the noscript limitation remains visible. It does not prove AWS has deployed.

## Measurement input contract

Metrics use aggregate, observed records from an authorized property. Store the original export privately outside the repo, then import only validated aggregate fields. Missing values stay null. Do not include lead identities, health conversations, credentials, personal identifiers, or individual user analytics.

```json
{
  "records": [
    {"metric":"organicVisits","value":null,"status":"unavailable","observedAt":"2026-10-24","source":"GA4 StressGuru property, access unavailable"},
    {"metric":"appStoreOutboundClicks","value":null,"status":"unavailable","observedAt":"2026-10-24","source":"GA4 aggregate event, access unavailable"},
    {"metric":"installations","value":null,"status":"unavailable","observedAt":"2026-10-24","source":"App Store attribution, access unavailable"}
  ]
}
```

An observed numeric zero must use `status: observed`. A conversion click is not an installation. Comparison utilities require complete inclusive thirty-, sixty-, or ninety-day windows of the same duration, nonoverlapping periods, matching metric/source/property definitions, and documented confounders. Missing or incomparable periods cannot establish a growth outcome. Current code validates durations and numeric/null semantics; the Manus agent must also verify property and segment identity against the original authorized aggregate exports.

## Benchmark observations

`ai-benchmark.json` contains twenty-five fixed prompts and no fabricated results. A planned prompt set is not a tested baseline. Record real engine responses using the utility contract: `engine`, `query` or `prompt`, `observedAt`, `observed: true`, `status: observed`, `result`, `mentioned`, and `citations` as the actual linked source URLs. Add prompt ID, environment/locale, and the actual evidence artifact to the durable benchmark record. A publisher link cited inside our own content is not an AI-engine citation.

No observation should be added merely because the question was searched in a general search tool. Keep mentions, citations, quoted excerpts, recommendations, and tests with inaccessible responses distinct. The initial test count is zero because no engines were actually observed; citation and mention rates remain unavailable rather than inferred zero visibility.

## Persistent records and approval

The source inventory, keyword universe, content-gap hypotheses, benchmark, backlog, experiments, history, per-run artifacts, and latest-run pointer form one shared knowledge system. Reuse exact URLs and current routes. Classify knowledge by verified product fact, source evidence, measured observation, hypothesis, or review requirement. Technical defect evidence is not search-demand evidence.

The path-level release gate locks the homepage hero and stops protected product, pricing, privacy, clinical, policy, infrastructure, and external-SQL changes without recorded user approval. It is an additional control, not a substitute for semantic review or user confirmation. A routine editorial correction may require a targeted scope approval because a centralized content file can contain sensitive health material.

The operating limits remain in `policy.json`. The agent cannot relax those limits to raise an optimization score. Actual outcome evidence may change prioritization but may not authorize a new product claim, manipulate users, invent citations, migrate infrastructure, or change checkout terms.
