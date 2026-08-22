# Content Model Contract — Himam Website

This document is the **contract** between the CMS and the frontend. It defines the
content types Phase 2 will create in Strapi. The frontend should be built against these
shapes; the CMS should not rename or restructure them without updating this doc and the
frontend in the same PR.

Status: **in progress** — `service`, `team-member`, `accomplishment`, `metric`,
`value`, `testimonial`, `faq`, `blog-post`, and `contact-submission` exist.
Schemas/seeds/public APIs are live for the content types; `contact-submission` is
user-generated (created only by the Contact form, read only in the admin).
Remaining types are planned.

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

**Live.** Schema: `cms/src/api/blog-post/content-types/blog-post/schema.json`.
Seed: three posts authored by the seeded team members, published on first boot
with staggered dates.

| Field          | Type     | Notes                                     |
| -------------- | -------- | ----------------------------------------- |
| title          | string   | required                                  |
| slug           | uid      | unique, from title — routes on this       |
| excerpt        | text     | required, ≤ 220 chars — card teaser       |
| coverImage     | media    | optional — also used as og:image          |
| body           | blocks   | required — the article                    |
| author         | relation | manyToOne → `api::team-member.team-member` (optional) |
| category       | enum     | required — Engineering / AI & Automation / Process / Company |
| seoTitle       | string   | optional — overrides page/social title    |
| seoDescription | text     | optional, ≤ 160 chars — falls back to excerpt |

Inverse relation on `team-member`: `blogPosts` (oneToMany, mappedBy `author`).

API: `GET /api/blog-posts?populate[0]=author&populate[1]=coverImage&sort[0]=publishedAt:desc&pagination[page]=1&pagination[pageSize]=6`
(list) and `GET /api/blog-posts?filters[slug][$eq]=<slug>&populate[0]=author&populate[1]=coverImage`
(detail).

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

### 4. `team-member` — the three founding engineers

**Live.** Schema: `cms/src/api/team-member/content-types/team-member/schema.json`.
Seed: three founders with specific bios, published on first boot.

| Field      | Type   | Notes                                       |
| ---------- | ------ | ------------------------------------------- |
| name       | string | required                                    |
| role       | string | required — e.g. "Co-founder & Frontend Engineer" |
| focusArea  | enum   | required — Frontend / Backend / AI / Full-stack |
| bio        | blocks | required — short, specific bio              |
| photo      | media  | optional headshot; frontend shows initials placeholder until uploaded |
| order      | integer | manual sort on About page (ascending)      |

API: `GET /api/team-members?sort[0]=order:asc&populate=photo`.

### 5. `accomplishment` — case studies

**Live.** Schema: `cms/src/api/accomplishment/content-types/accomplishment/schema.json`.
Seed: four fictional-but-plausible case studies, published on first boot.

| Field        | Type   | Notes                                          |
| ------------ | ------ | ---------------------------------------------- |
| projectName  | string | required                                       |
| slug         | uid    | unique, from projectName                       |
| client       | string | optional                                       |
| industry     | string | optional                                       |
| year         | string | optional                                       |
| metric       | string | optional headline result, e.g. "38% fewer support tickets" |
| problem      | blocks | required                                       |
| solution     | blocks | required                                       |
| outcome      | blocks | required — specific numbers over vague claims  |
| order        | integer | manual sort on Accomplishments page (ascending) |

API: `GET /api/accomplishments?sort[0]=order:asc`.

### 6. `metric` — metrics band numbers

**Live.** Schema: `cms/src/api/metric/content-types/metric/schema.json`.
Seed: five metrics, published on first boot.

| Field | Type   | Notes                                        |
| ----- | ------ | -------------------------------------------- |
| value | string | required — e.g. "40+"                        |
| label | string | required — e.g. "Products shipped"           |
| order | integer | manual sort in the band (ascending)         |

API: `GET /api/metrics?sort[0]=order:asc`.

### 7. `value` — how we work

**Live.** Schema: `cms/src/api/value/content-types/value/schema.json`.
Seed: four working principles, published on first boot.

| Field | Type   | Notes                                       |
| ----- | ------ | ------------------------------------------- |
| title | string | required — e.g. "No hand-offs"              |
| text  | text   | required                                    |
| icon  | enum   | required — must match the frontend Icon set |
| order | integer | manual sort in the "How we work" section   |

API: `GET /api/values?sort[0]=order:asc`.

### 8. `testimonial` — client quotes

**Live.** Schema: `cms/src/api/testimonial/content-types/testimonial/schema.json`.
Seed: six testimonials, each linked to a seeded Service by slug, published on
first boot.

| Field      | Type     | Notes                                          |
| ---------- | -------- | ---------------------------------------------- |
| clientName | string   | required                                       |
| clientRole | string   | required — e.g. "VP of Product, Northwind"     |
| quote      | text     | required — specific results over vague praise  |
| photo      | media    | optional avatar; initials placeholder until uploaded |
| rating     | integer  | optional, 1–5 (default 5)                      |
| service    | relation | manyToOne → `api::service.service` (optional)  |
| order      | integer  | manual sort (ascending)                        |

Inverse relation on `service`: `testimonials` (oneToMany, mappedBy `service`).

API: `GET /api/testimonials?populate=service&sort[0]=order:asc`.

### 9. `faq` — question/answer pairs, grouped by category

**Live.** Schema: `cms/src/api/faq/content-types/faq/schema.json`.
Seed: twelve FAQs across Pricing (3), Process (3), Technology (4), and
Support (2), published on first boot.

| Field    | Type   | Notes                                    |
| -------- | ------ | ---------------------------------------- |
| question | string | required                                 |
| answer   | blocks | required — rich text                    |
| category | enum   | required — Pricing / Process / Technology / Support |
| order    | integer | manual sort within category (ascending) |

API: `GET /api/faqs?sort[0]=order:asc`.

### 10. `legal-page` — Privacy Policy / Terms of Service

**Live.** Schema: `cms/src/api/legal-page/content-types/legal-page/schema.json`.
Seed: two entries — Privacy Policy (`privacy-policy`) and Terms of Service
(`terms-of-service`), published on first boot. The seeded copy is a starting
template, not final legal advice; the frontend flags this in the page hero and
it should be reviewed by a lawyer before launch.

| Field        | Type   | Notes                                          |
| ------------ | ------ | ---------------------------------------------- |
| title        | string | required                                       |
| slug         | uid    | required, unique — `privacy-policy` / `terms-of-service` |
| body         | blocks | required — the policy/terms document           |
| lastUpdated  | date   | required — shown as "Last updated" on the page |

API: `GET /api/legal-pages?filters[slug][$eq]=<slug>&pagination[pageSize]=1`.
Routes: `/privacy` and `/terms` (both render the same page component with the
slug as a prop).

## Contact submissions (user-generated — never seeded)

**Live.** Schema: `cms/src/api/contact-submission/content-types/contact-submission/schema.json`.
Not seeded — entries are created by real form submissions only.

| Field        | Type     | Notes                                          |
| ------------ | -------- | ---------------------------------------------- |
| name         | string   | required, ≤ 120                                |
| email        | email    | required, ≤ 254 — format validated             |
| company      | string   | optional, ≤ 200                                |
| service      | relation | manyToOne → `api::service.service` (optional)  |
| budgetRange  | enum     | optional — Under $10k / $10k–$25k / $25k–$50k / $50k+ / Not sure yet |
| message      | text     | required, ≤ 5000                               |
| source       | string   | referrer set by the submit handler             |

**Budget field decision (Phase 8):** The SRS §4.6.4 uses `budget`
(decimal, example `"300.00"`), but the live schema uses `budgetRange`
(enum of five ranges). Decision: **keep the enum as shipped.**
Reasons: (1) the enum provides better UX (no arbitrary number entry),
(2) produces clean, segmentable data for the sales team, (3) avoids
free-text/decimal validation edge cases on a public form, and (4) is
already live and tested in both frontend and CMS. The SRS's decimal
wording is treated as functionally satisfied by an equivalent optional
budget-qualification field. This should be flagged to the SRS owner as
a documentation update for §4.6.4.

API: the public API exposes **exactly one** endpoint —
`POST /api/contact-submissions` (custom `submit` action, `auth: false`). It
validates required fields + email format, drops honeypot-filled requests, and
rate-limits per IP (see the controller). **There are no public GET routes** —
submissions contain lead PII and are read only via the Strapi admin (Content
Manager).

## Public API boundary

All content APIs are scoped to `find`/`findOne` on the public role — read-only,
no auth required (see `cms/src/seed/index.ts`). Only published entries are
returned. The single exception is the contact form: `POST /api/contact-submissions`
is the one public write, and it is the only way entries are created.

## Components (reusable, not routable)

| Component | Fields                              | Used by        |
| --------- | ----------------------------------- | -------------- |
| `seo`     | metaTitle, metaDescription, ogImage | page, blog-post |
| `cta`     | heading, text, buttonLabel, buttonLink | page sections |
| `hero`    | heading, subheading, image, cta     | page sections  |

## Boundary rules

1. The frontend **reads** these endpoints via the `/api` proxy (dev) or
   `VITE_CMS_API_URL` (prod). Its only write is the Contact form
   (`POST /api/contact-submissions`), which the CMS validates server-side.
2. Content types are created in Phase 2 **exactly** as named above — no renames later.
3. If a field must change after content exists, add the field; don't rename (Strapi
   migrations for renames are error-prone with real content).
4. New content types follow the same pattern: plural route, singular folder, draft &
   publish, schema committed.
