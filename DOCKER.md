# Docker Setup for StressGuru.ai

This guide explains how to run the full StressGuru stack locally using Docker.

## Quick Start

```bash
# 1. Copy the env template and fill in your values
#    (see "Environment Variables" section below)
cp .env.example .env

# 2. Build and start everything
docker-compose up --build

# 3. Open http://localhost:3000
```

## Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: install deps, build frontend + server, produce a lean production image |
| `docker-compose.yml` | Orchestrates the app container and a MySQL 8.0 database with one command |
| `.env.example` | Template listing every environment variable the app needs |

## Environment Variables

Copy the block below into a file named `.env` at the project root, then replace the placeholder values with your real credentials.

```env
# ── Database ──────────────────────────────────────────────────
DATABASE_URL=mysql://stressguru:stressguru_pass@db:3306/stressguru   # MySQL connection string (docker-compose default shown)

# ── Server ────────────────────────────────────────────────────
PORT=3000                                                            # port the Express server listens on
NODE_ENV=production                                                  # "production" or "development"
JWT_SECRET=change-me-to-a-long-random-string                         # secret used to sign session cookies

# ── Manus OAuth ───────────────────────────────────────────────
VITE_APP_ID=your-manus-app-id                                        # Manus OAuth application ID
OAUTH_SERVER_URL=https://oauth.example.com                           # Manus OAuth backend base URL
VITE_OAUTH_PORTAL_URL=https://login.example.com                      # Manus login portal URL (used by frontend)

# ── Owner Info ────────────────────────────────────────────────
OWNER_OPEN_ID=owner-open-id-here                                     # owner's Manus OpenID (auto-assigned admin role)
OWNER_NAME=Owner Name                                                # owner's display name

# ── Manus Forge API (server-side) ─────────────────────────────
BUILT_IN_FORGE_API_URL=https://forge.example.com                     # Manus built-in API base URL (LLM, storage, etc.)
BUILT_IN_FORGE_API_KEY=your-forge-api-key                            # bearer token for server-side Forge API calls

# ── Manus Forge API (frontend) ────────────────────────────────
VITE_FRONTEND_FORGE_API_URL=https://forge.example.com                # Forge API URL exposed to the browser
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key              # bearer token for client-side Forge API calls

# ── Gmail SMTP (stress report emails) ────────────────────────
GMAIL_SMTP_USER=support@stressguru.ai                                # Gmail address used as the sender
GMAIL_SMTP_APP_PASSWORD=your-gmail-app-password                      # Gmail App Password (not your regular password)

# ── Analytics (Umami) ─────────────────────────────────────────
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com                # Umami analytics script endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id                            # Umami website tracking ID

# ── Branding ──────────────────────────────────────────────────
VITE_APP_TITLE=StressGuru                                            # site title shown in browser tab and UI
VITE_APP_LOGO=                                                       # URL to the site logo image (optional)
```

## Notes

- The `docker-compose.yml` creates a MySQL 8.0 container with a persistent volume. Your data survives container restarts.
- `VITE_` prefixed variables are baked into the frontend JavaScript bundle at build time. If you change them, you need to rebuild: `docker-compose up --build`.
- Server-side variables (DATABASE_URL, JWT_SECRET, etc.) are read at runtime, so you can change them and just restart: `docker-compose restart app`.
- The database healthcheck ensures the app container waits for MySQL to be fully ready before starting.
- To run database migrations inside the container: `docker-compose exec app npx drizzle-kit generate && docker-compose exec app npx drizzle-kit migrate`.
