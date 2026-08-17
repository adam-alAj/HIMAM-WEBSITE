# Content Model Contract — Himam Website

This document is the **contract** between the CMS and the frontend. It defines the
content types Phase 2 will create in Strapi. The frontend should be built against these
shapes; the CMS should not rename or restructure them without updating this doc and the
frontend in the same PR.

Status: **in progress** — the `service` content type exists (schema, seed, and public
API are live; the React Services page consumes it). Remaining types are planned.

## Conventions

- Content types are created under `cms/src/api/<name>/` (Strapi 5, singular folder,
  plural API route).
- All types use `draftAndPublish: true`; the public site only reads published entries.
- List endpoints are paginated by Strapi (`?pagination[page]=1&pagination[pageSize]=10`).
- Rich text fields use Strapi's `blocks` format (rendered server-side or via a blocks
  renderer on the client — decision recorded in `docs/architecture.md`).
- Reusable building blocks (SEO, CTA, rich text) are Strapi **components**, not content
  types, because they are never top-level routable resources.

## Content types

### 1. `page` — marketing pages (Home, About, Services, Contact…)

| Field     | Type            | Notes                                  |
| --------- | --------------- | -------------------------------------- |
| title     | string          |                                        |
| slug      | uid             | unique, from title                     |
| sections  | dynamic zone    | hero, features, cta, faq, testimonials…|
| seo       | component `seo` | title, description, ogImage            |
| publishedAt | datetime     | draftAndPublish                        |

API: `GET /api/pages?filters[slug][$eq]=home` — the frontend fetches a page by slug.

### 2. `blog-post` — studio articles

| Field       | Type            | Notes                          |
| ----------- | --------------- | ------------------------------ |
| title       | string          |                                |
| slug        | uid             | unique                         |
| excerpt     | text            | list teaser                    |
| content     | blocks (richtext)| main body                     |
| coverImage  | media (image)   | single                        |
| publishedAt | datetime        |                                |

API: `GET /api/blog-posts` (list) and `GET /api/blog-posts/:slug` (detail via
`filters[slug][$eq]`). Sorted by `publishedAt` descending.

### 3. `service` — offerings (apps, websites, systems, AI chatbots)

**Live.** Schema: `cms/src/api/service/content-types/service/schema.json`.
Seed: `cms/src/seed/index.ts` (four core services, idempotent, published on first boot).

| Field            | Type          | Notes                                              |
| ---------------- | ------------- | -------------------------------------------------- |
| title            | string        | required                                           |
| slug             | uid           | unique, from title                                 |
| shortDescription | text          | required, ≤ 220 chars — card teaser                |
| longDescription  | blocks        | required — full service copy (rendered by frontend `Blocks`) |
| icon             | enumeration   | required — must match the frontend Icon set (see schema) |
| features         | component `service.feature` | required, repeatable, min 1 — checklist items |
| startingFrom     | string        | optional — price or engagement type ("From $18,000") |
| order            | integer       | manual sort on Services page (ascending)           |

Component `service.feature` (`cms/src/components/service/feature.json`):
`text` (string, required).

API: `GET /api/services?sort[0]=order:asc&populate=features` (list) and
`GET /api/services?filters[slug][$eq]=<slug>&populate=features` (detail). Public
role is scoped to `find`/`findOne` only — read-only, no auth required (see
`cms/src/seed/index.ts`). Only published entries are returned.

### 4. `testimonial` — client quotes

| Field      | Type   | Notes                 |
| ---------- | ------ | --------------------- |
| quote      | text   |                       |
| authorName | string |                       |
| authorRole | string | e.g. "CTO, Acme Corp" |
| avatar     | media  | optional              |
| featured   | boolean | show on home page    |

API: `GET /api/testimonials?filters[featured][$eq]=true`.

### 5. `faq` — single question/answer pairs

| Field    | Type   | Notes                          |
| -------- | ------ | ------------------------------ |
| question | string |                                |
| answer   | blocks |                                |
| category | enum   | optional grouping              |
| order    | integer | manual sort                   |

API: `GET /api/faqs?sort=order:asc`.

## Components (reusable, not routable)

| Component | Fields                              | Used by        |
| --------- | ----------------------------------- | -------------- |
| `seo`     | metaTitle, metaDescription, ogImage | page, blog-post |
| `cta`     | heading, text, buttonLabel, buttonLink | page sections |
| `hero`    | heading, subheading, image, cta     | page sections  |

## Boundary rules

1. The frontend **reads** these endpoints via the `/api` proxy (dev) or
   `VITE_CMS_API_URL` (prod). It never writes.
2. Content types are created in Phase 2 **exactly** as named above — no renames later.
3. If a field must change after content exists, add the field; don't rename (Strapi
   migrations for renames are error-prone with real content).
4. New content types follow the same pattern: plural route, singular folder, draft &
   publish, schema committed.
