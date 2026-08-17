# Contributing to Himam Website

This guide is written for a 3-person team. The goal is boring, predictable collaboration:
nobody should ever wonder where a change belongs, how to run the project, or what the
definition of done is.

## Getting started

1. Clone the repo and run the [Quick start](README.md#quick-start) steps once.
2. Copy `.env.example` → `.env` for the services you touch:
   - `frontend/.env.example` → `frontend/.env` (all optional at this stage)
   - `cms/.env.example` → `cms/.env` (the Strapi installer may have generated one already)
3. Verify your setup: frontend at `http://localhost:5173`, CMS at `http://localhost:1337/admin`.

> `.env` files are gitignored. Never commit real secrets — only `.env.example` with
> placeholders is committed.

## Where changes go (boundaries)

| Change is about…                    | Goes in…                    |
| ----------------------------------- | --------------------------- |
| Page/site UI, components, styling   | `frontend/` (all styling must use the design tokens — no hardcoded values) |
| Brand, design tokens, new shared components | `design-system/MASTER.md` + `frontend/src/styles/tokens.css` + `frontend/src/components/` (keep them in sync; the `/style-guide` route is the visual QA) |
| Content types, API routes, CMS logic | `cms/src/api/`              |
| Content itself (posts, services…)   | the Strapi admin panel (data lives in Postgres, not in git) |
| Architecture / conventions / plans  | `docs/`                     |

The frontend **never** talks to PostgreSQL directly — it only consumes the Strapi REST
API. The CMS **never** imports frontend code. Keep it that way.

## Branching & pull requests

- `main` is the stable branch and should always run.
- Create a feature branch per task: `git checkout -b feat/<short-name>`
  (e.g. `feat/homepage-hero`, `fix/cms-cors`).
- Open a PR and get **at least one review** from another engineer before merging.
  With 3 people, pair the two of you who didn't write the code.
- Keep PRs small and focused on one thing. Small PRs review faster.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) — short and descriptive:

```
feat(frontend): add hero section to home page
fix(cms): allow CORS for production domain
docs: define content model for blog posts
chore: update dependency versions
```

## Changing the content model (CMS)

Content types are defined by schema files under `cms/src/api/<name>/content-types/`
and can be created or edited two ways:

1. **Admin panel** (fastest for iterating) — Strapi generates the schema files; commit them.
2. **Directly editing schema files** — prefer for reviewable diffs; restart `npm run dev:cms`.

Whichever way you choose, **commit the schema changes** so everyone's local CMS stays in
sync. Data itself (entries) lives in the database and is not committed. Before changing a
content type that already has data, check `docs/content-model.md` so you don't break the
frontend contract.

## Database workflow

- Postgres runs in Docker: `npm run db:up` / `npm run db:down`.
- Never commit the database or its data; it's disposable local dev state.
- If you change `docker-compose.yml`, verify a fresh teammate can still `db:up` from scratch.
- The optional Strapi container in `docker-compose.yml` is for people who prefer
  containerized CMS; the default workflow is `npm run dev:cms` locally.

## Definition of done

- [ ] Runs locally: frontend, CMS, and Postgres all start from a clean checkout
- [ ] TypeScript compiles (`npm run build` in the affected app)
- [ ] No secrets or `.env` files committed
- [ ] Schema/API changes are committed and documented in `docs/content-model.md` if they
      change the contract
- [ ] PR reviewed by at least one other engineer
