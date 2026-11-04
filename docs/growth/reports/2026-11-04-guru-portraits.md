# Guru portrait correction: November 4, 2026

The user identified the two supplied portraits: Relationship Guru wears beige-and-olive clothes; Anxiety Guru wears maroon. The existing self-hosted PNGs match those portraits, so only assignments were swapped. Original image files remain unchanged and no new remote asset dependency was introduced.

| Guru | Correct self-hosted portrait | Appearance |
| --- | --- | --- |
| Relationship Guru, AWS ID 5 | `/images/RiYvCLRiSOOKHHcr.png` | Beige-and-olive outfit |
| Anxiety Guru, AWS ID 3 | `/images/RjEvlDvMOtWTRzEq.png` | Maroon outfit |

The correction covers both individual Guru pages, the Guru directory, desktop/mobile navigation, homepage and standalone quiz recommendations, future database seeds, the blog generator, all 14 affected author-image fields in the generated blog package, and the current source-derived growth inventory. Guide and blog editorial background/hero images are separate assets and were not changed. No page or article copy, layouts, Guru identity, attribution, pricing, or unrelated portraits were changed.

The user-owned AWS MySQL database contained 57 blogs at inspection, including newer records not present in the generated package. A read-only full backup of Guru and blog tables was saved outside the repository. After an image-only transaction test and rollback, the same guarded correction was applied and verified: two Guru rows and 18 blog author-image rows were updated, comprising 12 Anxiety and six Relationship articles. All non-image columns, other Guru rows, and unrelated blog rows remained unchanged, including publication state and dates. Backup, migration, rollback, credentials, and connection helpers remain outside GitHub. TiDB was not accessed.

Both portrait URLs returned HTTP 200 with `image/png`. After the database commit, the public blog API returned the correct author portraits for all 18 affected articles. Future manual and AI-created blogs copy the corrected current Guru record; the checked-in generator and seed definitions also use the corrected mapping.

Validation passed: TypeScript, all 90 tests including eight portrait-mapping regressions, the content audit with zero errors or warnings, and the production build generating 228 static snapshots. An exact comparison proved that all eight source/generator/package edits change only the two portrait paths. All image asset bytes were preserved. The standard release classifier labels Guru and blog files health-sensitive regardless of diff contents; the explicit user-requested image-only scope is recorded separately in `docs/growth/approvals/2026-11-04-guru-portraits.json`, leaving the protected policy and initial registry unchanged.

Delivery uses the existing `stressguru-ai/Stressguru.ai` repository and normal main-branch GitHub synchronization. The final verified GitHub SHA is reported in the conversation. Database-backed portraits are already corrected, but hardcoded website pages, menus, and quiz code require the user's separate AWS deployment. This task does not deploy AWS or change infrastructure.
