# StressGuru project-code delivery: October 26, 2026

## User authorization and destination

The user explicitly requested a push of the project code to main in stressguru-ai/Stressguru.ai. The repository is public, as discussed before approval. It is separate from the historical zigroninc/StressGuru.ai destination recorded in the earlier growth policy. This delivery does not switch the Manus-managed repository or alter its origin.

The user then approved: "Approve the credential correction, validate, and push to main." The approved change replaces the hard-coded admin password in both existing login implementations with runtime ADMIN_PASSWORD configuration, updates tests, and publishes only sanitized current code. There is no built-in password fallback. Missing or blank configuration rejects admin login and does not issue a cookie. The existing username remains admin.

## Deployment prerequisite

Before the separate AWS deployment agent deploys this code, configure ADMIN_PASSWORD securely in the backend runtime environment or its secret manager. Do not put the value in Git, frontend VITE variables, a build argument, a README or a command line. Use a strong unique value. The password is read at login request time, not baked into the bundle or read from the database. No environment or infrastructure files were changed here, and no AWS deployment or database access is part of this delivery.

This is a narrow password-exposure correction, not a complete authentication redesign or security certification. Existing admin cookies, login/logout/check endpoints and public website behavior are preserved. Further authentication hardening should be reviewed separately.

## Snapshot and preservation rules

Publish the sanitized current tracked project tree, including every one of its 54 self-hosted content image assets plus favicon.png and apple-touch-icon.png (56 tracked images total), source, content generators, existing project schema migrations, build scripts and growth-agent utilities. Keep external SQL migrations, rollback/dump/backups, .env files, Dockerfile, .dockerignore, node_modules, dist and temporary artifacts out of the upload. The tracked local-development MySQL examples in DOCKER.md and docker-compose.yml refer to localhost or the Compose db service, not a production database secret, and remain unchanged.

Do not publish the older private Git history because it contains the removed real admin password. Preserve the destination's existing initial commit and README, and add the sanitized project as a new normal commit on main without force-pushing. Keep the internal repository and source history intact. Historical October 24-25 reports remain historical evidence rather than being rewritten to imply deployment or improved rankings.

## Validation and delivery evidence

Both tRPC and REST login tests cover configured, incorrect, missing and blank runtime-password cases using isolated synthetic credentials. Validate the existing TypeScript, test, content-audit and production-build commands. Verify the destination main SHA after the push, compare every source file against the internal sanitized snapshot, and confirm the image inventory. No publication receipt means no claim of AWS deployment.

Validated internally: TypeScript passed; 80 tests passed; content audit reported zero errors and zero warnings; the existing production build generated 228 snapshots. No actual production credential remains in the scanned current tracked files. The two unchanged Compose-only connection-string examples were reviewed separately.

Read-only implementation review approved the narrow runtime-password correction and confirmed that the two root public icons must accompany the 54 content images. GitHub delivery is verified separately after the push.
