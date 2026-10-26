# Initial growth baseline, October 24, 2026

The source inventory contains 228 public routes: 25 core pages, 160 guides, and 43 published articles in the checked-in content package. The package also includes a preserved draft, excluded from public inventory. There are 54 local image files in this restored source; additional GitHub-only images from prior delivery must be preserved when shipping access returns. These are source observations, not a fresh AWS database count.

## Public initial HTML

All 228 public URLs returned HTTP 200 to the audit crawler. Every response shared the homepage title, description, body hash, and homepage canonical. Thus status 200 did not establish distinct crawler-first content at deep routes. This is consistent with the confirmed production SPA fallback masking generated snapshots. JavaScript was not executed, so this finding does not claim the visible browser pages are all identical.

## Local technical correction

The new production static helper serves the existing generated snapshot for extensionless public paths before the fallback, preserves assets and private admin pages, and returns real 404s for missing paths. The local audit has distinct initial title/description/body groups and the correct route canonicals across the 228 source paths. Regression tests verify missing assets/API 404s and private admin noindex behavior.

Publication state for blog routes remains owned by AWS MySQL. At runtime, the server refuses an unapproved database, checks published status before serving a blog snapshot, blocks unpublished/draft snapshots, keeps newly published posts usable before the next snapshot rebuild, and returns 503 rather than inventing publication when the lookup is unavailable. Local tests use an injected mock; no database was queried. Newly published posts need a rebuilt snapshot for distinct crawler-first article content.

The generated answer material remains inside noscript. It is not complete SSR or a rendered/hydration parity guarantee. This is a visible limitation, not a closed optimization success. Medium accessibility findings, claim-to-source fit, and real Core Web Vitals also remain follow-up work.

## Research and measurement

The first seed contains thirty commercial candidates and 671 unique source-linked editorial problem questions. They are not a measured top-thirty ranking, volume/difficulty dataset, or proof of exact-query demand. Six competitors were reviewed, and fifteen bounded gaps map to existing StressGuru routes rather than require duplicate new pages. Five editorial outreach prospects are draft-only and not authorized contact.

The fixed twenty-five-prompt AI benchmark is prepared, but no live engine benchmark responses were collected. Citation/mention rates, five commonly cited sources, organic visits, rankings, keyword volume/difficulty, conversion rates, attributed installs, and growth are unavailable. No missing measurement is reported as zero.

The App Store conflicts are captured in claim-conflicts.md. Approved website pricing and the hero stay unchanged until owner review resolves them. Current GitHub and recurring schedule access/deployment blockers are explicit in the run record. No AWS deployment, external outreach, database write, SQL commit, infrastructure change, or new dashboard occurred.

## Evidence files

Raw public baseline: `runs/2026-10-24/public-before.json`. Local generated snapshot comparison: `runs/2026-10-24/local-after.json`. Core, missing, and private HTTP checks: `runs/2026-10-24/http-regression.json`. Repository source inventory: `content-inventory.json`. Research and conflict review: `research/competitor-map.md` and `claim-conflicts.md`.
