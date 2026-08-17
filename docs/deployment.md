# Deployment & CI/CD — Himam Website

This document describes how the site is tested, built, and shipped, where it
runs, and exactly what to do when a production deploy goes wrong.

## Architecture

```
                         ┌──────────────────────────────────────────────┐
                         │                 Browser                       │
                         └───────────────┬──────────────┬───────────────┘
                                         │              │
                        static assets    │              │  /api + /uploads
                        (HTML/JS/CSS)    ▼              ▼
                    ┌─────────────────────────┐  ┌─────────────────────────┐
                    │  Vercel (frontend)      │  │  Render (Strapi CMS)    │
                    │  React SPA, edge CDN    │  │  Node web service       │
                    │  PR previews per branch │  │  Docker image (GHCR)    │
                    └─────────────────────────┘  └────────────┬────────────┘
                                                              │ DATABASE_URL
                                                              ▼
                                                    ┌─────────────────────┐
                                                    │ Render Postgres     │
                                                    │ managed PostgreSQL  │
                                                    └─────────────────────┘
```

| Piece | Host | How it deploys |
| --- | --- | --- |
| Frontend (React SPA) | **Vercel** | CD workflow: `vercel build` → `vercel deploy --prebuilt --prod`; PR previews are automatic when the repo is connected to Vercel |
| Backend (Strapi CMS) | **Render** (web service, `runtime: image`) | CD workflow: Docker image → GHCR → Render Deploy Hook triggers a rollout |
| Database (PostgreSQL) | **Render Postgres** (managed) | Created once (blueprint `render.yaml`); schema migrations run automatically when Strapi boots |

The frontend talks to the CMS through `/api` (dev proxy) or the baked-in
`VITE_CMS_API_URL` (production). Content is fetched client-side, so the two
deploys are independent — but CD still runs both on every merge to main.

## Pipeline

### CI — `.github/workflows/ci.yml` (blocks merging)

Runs on **every pull request** (and on push to main, so CD only ever ships
checked code). Any failure fails the check:

| Job | What it runs |
| --- | --- |
| `frontend` | oxlint, `tsc -b` + Vite build, Vitest unit tests (45 tests: components + Home/Services/Contact) |
| `cms` | `tsc --noEmit`, `strapi build` |
| `backend-api` | boots Strapi against a Postgres service container, runs the `node:test` API suite (shapes + permission scoping + contact-form validation/honeypot/rate-limit) |
| `e2e` | Playwright boots Strapi + the Vite app and runs the real contact-form submission flow |

### CD — `.github/workflows/cd.yml` (on merge to main)

1. `deploy-frontend` — `npm ci`, build with `VITE_CMS_API_URL` from secrets,
   then `vercel pull/build/deploy --prebuilt --prod`.
2. `deploy-cms` — build `cms/Dockerfile` → push `ghcr.io/<owner>/<repo>/cms:<sha>`
   and `:latest` → POST the Render Deploy Hook → poll the deployed CMS health
   endpoint (a successful boot against the managed Postgres *is* the migration
   step for Strapi — it applies schema changes on startup).

### Secrets — GitHub repo → Settings → Secrets and variables → Actions

Never hardcode these. All are injected by the workflows:

| Secret | Used by | Purpose |
| --- | --- | --- |
| `VERCEL_TOKEN` | CD | Vercel API token (Account → Settings → Tokens) |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | CD | Vercel project scoping for `vercel pull` |
| `CMS_API_URL` | CD | Public CMS origin (e.g. `https://cms.onrender.com`) — baked into the frontend build and used for the post-deploy health check |
| `RENDER_DEPLOY_HOOK` | CD | Render web service Deploy Hook URL (Render dashboard → service → Deploy Hook) |
| `GHCR` registry credential | Render dashboard | Fine-grained PAT so Render can pull the private GHCR image (Render → Account → Settings → Registry Credentials) |

The Strapi secrets (`APP_KEYS`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, …) live in
the Render dashboard as env vars on the web service — they are never in the
repo. `DATABASE_URL` is wired automatically by the blueprint.

## Preview / staging path

- **Frontend — automatic per-PR previews.** Connect the GitHub repo to Vercel
  (one click in the Vercel dashboard). Every PR gets a `*.vercel.app` preview
  URL posted to the PR, built from the PR branch, with the SPA rewrite
  already configured (`frontend/vercel.json`). This is the primary preview
  environment.
- **Backend — manual staging (documented process, no extra cost).** Render
  does not give free per-PR services, so staging the CMS is a manual step you
  run when a PR touches the CMS schema or seed:
  1. From the PR branch, build and push a staging image:
     `docker build -t ghcr.io/<owner>/<repo>/cms:staging ./cms && docker push …`
  2. In Render, create (or reuse) a second web service `himam-cms-staging`
     pointing at the `:staging` tag, with its own free Postgres database
     (`render.yaml` is the template — duplicate the services block).
  3. Point the frontend dev server at it via `VITE_CMS_API_URL` /
     `CMS_API_URL` and verify the schema + seed changes against the staging
     DB before merging.
  4. On merge, the CI backend-api + e2e jobs re-verify everything against a
     clean database anyway.

## Rollback procedure (failed production deploy)

**Frontend (Vercel) — seconds, zero risk:**

1. Vercel dashboard → project → **Deployments**.
2. Find the last known-good deployment (the one before the failing one).
3. Click the **⋯ menu → Rollback to this deployment** (or "Promote to
   Production"). Vercel instantly serves the previous build.
4. CLI alternative:
   `npx vercel rollback <deployment-url> --token=$VERCEL_TOKEN`

**CMS (Render):**

1. Render dashboard → `himam-cms` → **Events** or **Deploys** tab.
2. Find the last successful deploy (green) before the failure.
3. Click **⋯ → Deploy** (Render re-runs that exact commit/image), or if the
   failure was the image itself, update the service to the previous image tag
   (`ghcr.io/<owner>/<repo>/cms:<previous-sha>`) and deploy.
4. If the service is failing to boot (e.g. migration error), the old code
   won't help if the database was already migrated forward — see below.

**Database caveat — the one irreversible piece:**

Strapi applies PostgreSQL schema changes at boot, and a Strapi downgrade is
**not** supported. Rules:

- If the new deploy failed *before* completing migrations (boot error), the
  DB is untouched — roll back the image freely.
- If the new version **migrated successfully** but then misbehaved (bad seed,
  broken content), roll back the image to the previous tag. Content written by
  the new version is retained (Strapi keeps it; the old version ignores new
  columns), so this is safe for content — verify in the admin afterward.
- Never roll a database back to an old schema snapshot. If you ever need that
  (very rare, only for schema-level corruption), it is a manual, documented
  `pg_restore` from the Render Postgres backups — do this only after
  consulting the team and ideally on a copy first.

**General playbook:**

1. **Stop the bleeding**: roll back the frontend (instant) and, if the CMS is
   down, the CMS image. The frontend renders graceful error states when the
   CMS is unavailable, so the site stays up either way.
2. **Communicate**: post the incident in the team channel with the failing
   SHA and what changed.
3. **Diagnose**: Render logs for the failed boot; Vercel deployment logs for
   a bad build.
4. **Fix forward**: the failing SHA never ships again — CI now blocks it.
5. **Post-mortem**: add a regression test (the suite in Phase 10 exists
   exactly for this).

## Local equivalents

- Unit tests: `npm --prefix frontend test`
- E2E: `npm run db:up` (Postgres) then `npm --prefix frontend run e2e`
  (Playwright boots both servers; `reuseExistingServer` lets you keep
  `npm run dev:cms` up)
- Backend API tests: `npm run db:up` then `npm --prefix cms run test:api`
- Docker image locally: `docker build -t himam-cms ./cms`
