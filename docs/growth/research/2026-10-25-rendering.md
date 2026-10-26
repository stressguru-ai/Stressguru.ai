# October 25 rendering and structured-data review

The current generator places fallback article content inside noscript while the React client fills an empty root. That remains a limitation, not complete server rendering. The existing extensionless-route correction is already implemented locally and must not be redone while GitHub shipping and AWS deployment remain unconfirmed.

Google describes crawling, rendering, and indexing as separate stages. It recommends meaningful HTTP status codes and consistent initial/rendered canonicals, and notes that not all bots can execute JavaScript. Its structured-data guidance requires markup to represent information visible to readers. Parseable JSON-LD and a status of 200 therefore cannot establish complete visible-content parity or rich-result eligibility. [1] [2]

For this first recurring cycle, full SSR, a new rendering stack, a visual fallback redesign, or changes to wellness claims are not justified within the narrow unattended scope. A deterministic generator defect can be corrected without altering page copy or deployment: repeated generation currently reads the previously generated homepage as its base, duplicating heading/body/schema material across subsequent snapshots. The reproduction uses a disposable fixture and no database or site writes.

The six-competitor source review was completed yesterday. Its content-gap hypotheses and availability findings are reused with their October 24 evidence dates rather than relabeled as fresh research or measured query demand. No new URL is justified from unavailable demand data. Search volume, attributed installs, engine citations, conversion changes, and Core Web Vitals remain unavailable unless actual authorized observations are supplied.

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics "Google Search JavaScript SEO basics"
[2]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies "Google Search general structured data guidelines"
