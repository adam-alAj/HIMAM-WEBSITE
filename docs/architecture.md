# Architecture — Himam Website Monorepo

This document records the structural decisions made in Phase 1 (skeleton) so that later
phases build **on** the structure instead of restructuring it. If a decision changes,
update this file and say why.

## 1. What we're building

A marketing website for Himam, a 3-person software engineering studio selling apps,
websites, systems, and AI chatbots. Content is managed by non-technical editors in a CMS;
the site renders it. All content lives in the CMS, the frontend only displays it.

## 2. Monorepo layout

```
frontend/   React + Vite + TypeScript — the public site
cms/        Strapi 5 (TypeScript) — headless CMS, owns ALL content
docs/       Decisions, content model contract, conventions
```

**Independent npm projects, not workspaces.** Each app has its own `package.json` and
lockfile. Reasons:

- Strapi 5 has a large dependency tree and historically misbehaves under workspace
  hoisting; isolation removes that failure mode entirely.
- Three engineers can `npm install` / upgrade dependencies in one app without touching
  the others — no lockfile merge conflicts.
- `docker-compose.yml` and root `package.json` scripts are thin conveniences, not a
  coupling mechanism.

The root has **no dependencies** and no build step.

## 3. Environment separation

| Concern            | Dev (local)                                    | Prod (cloud)                          |
| ------------------ | ---------------------------------------------- | ------------------------------------- |
| Database           | PostgreSQL 17 container (`docker compose up`)  | Managed PostgreSQL (RDS/Neon/Supabase) via `DATABASE_URL` / `DATABASE_*` |
| CMS                | `npm run dev:cms` (watch mode), port 1337      | `npm run start` behind a reverse proxy / container |
| Frontend           | `npm run dev:frontend` (Vite), port 5173       | Static build (`npm run build`) served by CDN/host |

Rules:

- **`.env.example` files are committed; `.env` files are gitignored.**
  `frontend/.env.example` and `cms/.env.example` document every variable and its purpose.
  Only secrets that don't exist yet have placeholder values (`tobemodified`).
- **Variable naming conventions:** the browser only ever sees `VITE_*` variables
  (inlined by Vite at build time). Server-side/ops variables used by the CMS and Docker
  (`DATABASE_*`, `POSTGRES_*`) never ship to the client.
- **Docker Compose defaults match the dev defaults** in `cms/.env.example`, so a fresh
  checkout runs with zero configuration. Overrides go in a root `.env` (see
  `docker-compose.yml`), never by editing the compose file.
- **SSL is off in dev, on in prod.** The CMS reads `DATABASE_SSL`; cloud-managed
  Postgres requires `DATABASE_SSL=true` (and often `DATABASE_URL`).

## 4. Frontend ↔ CMS boundary

```
Browser ── HTTP ──> Vite dev server ──/api proxy──> Strapi (:1337) ──> PostgreSQL (:5432)
                        │                                              ▲
                        └────────── (prod) static build ───────────────┘
```

- The frontend consumes the Strapi REST API at `/api/*` and **never** touches the
  database. There is exactly one way for the site to get data: the CMS API.
- **Dev:** Vite proxies `/api` → `http://localhost:1337` (`frontend/vite.config.ts`), so
  the browser uses relative URLs and there is no CORS configuration to maintain in dev.
  Override the target with `CMS_API_URL` in `frontend/.env` when Strapi runs elsewhere.
- **Prod:** the frontend build targets the public CMS origin via `VITE_CMS_API_URL`
  (falls back to same-origin `/api`). CORS/API-token setup is a Phase 2 concern; the
  plumbing (`VITE_CMS_API_URL`) is already in place.
- **API tokens:** when the site goes public, the frontend authenticates with a Strapi
  API token stored in `VITE_CMS_API_TOKEN`-style config (secret, server-side env at build
  time). Content types will be published-only for public reads.

## 5. Data ownership (the important boundary)

- **All marketing content** — pages, blog posts, services, testimonials, FAQs — is owned
  by the CMS and stored in PostgreSQL. Content is **data**, not code; it is never edited
  in the frontend repo and never committed to git.
- **The content model** (content types and fields) is **code**: schema files under
  `cms/src/api/<name>/content-types/`, created via the admin panel or edited directly,
  and **committed** so all three engineers share one model.
- The **contract** between CMS and frontend (which content types exist, their fields, and
  their API routes) is frozen in [`docs/content-model.md`](docs/content-model.md). Phase 2
  fills in content types per that contract; nothing here will need renaming or moving.

## 6. Frontend structure (stable from today)

```
frontend/src/
├── main.tsx            # entry point
├── App.tsx             # router shell (routes: / placeholder, /style-guide)
├── pages/              # one file per route (ComingSoon, StyleGuide; Home, Blog, … later)
├── components/         # shared components — one folder each (Button, Card, Navbar, …)
├── features/           # feature-scoped logic (e.g. blog feed, contact form) — Phase 3+
├── lib/                # API client, formatting, hooks — Phase 3+
└── styles/             # tokens.css (design tokens) + global styles in index.css
```

The **design system** is the contract for all UI: `design-system/MASTER.md` at the repo
root is the single source of truth (colors, typography, tokens, components). Its values
live in `frontend/src/styles/tokens.css`. The `/style-guide` route renders every token
and component as a visual QA environment; it must stay current when components change.

Routes today: `/` (Phase 1 placeholder) and `/style-guide` (design system QA). Real
pages land in Phase 3+.

## 7. Stability guarantees (why this won't need restructuring)

1. Service names are stable: `frontend/`, `cms/`, `db` (compose service), containers
   `himam-*`, npm names `himam-frontend` / `himam-cms`.
2. Ports are stable: 5173 / 1337 / 5432, all overridable via env.
3. Env contract is stable: every variable is already documented in `.env.example` files;
   adding a new one in Phase 2 is additive, not a rename.
4. The CMS↔frontend API boundary (proxy in dev, `VITE_CMS_API_URL` in prod) is in place.
5. The content model contract lives in `docs/content-model.md` and is reviewed before
   schema changes.
