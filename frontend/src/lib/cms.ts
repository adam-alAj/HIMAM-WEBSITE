/**
 * CMS API client — the only way the frontend reads content (docs/architecture.md §4).
 *
 * - Dev: the Vite dev server proxies /api → Strapi (frontend/vite.config.ts), so the
 *   browser uses same-origin relative URLs and no CORS config is needed.
 * - Prod: VITE_CMS_API_URL points at the public CMS origin (frontend/.env.example),
 *   falling back to same-origin /api.
 *
 * All reads are unauthenticated GETs — the Strapi public role is scoped to
 * find/findOne on the Service API only (see cms/src/seed). The frontend never writes.
 */

const API_BASE = (import.meta.env.VITE_CMS_API_URL as string | undefined) ?? '/api'

/**
 * Origin the CMS serves media from (API base minus the /api suffix). In dev
 * this is empty, so uploads resolve through the Vite /uploads proxy (see
 * frontend/vite.config.ts); in prod it's the CMS origin.
 */
const CMS_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

/**
 * Absolute URL for a Strapi media file (relative paths are relative to the
 * CMS, not the frontend). Returns null for empty input.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  return `${CMS_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Icon names allowed by the CMS `service.icon` enum. Each must exist in the
 * frontend Icon set (frontend/src/components/Icon/icons.tsx) — the enum and this
 * list are documented as a shared contract in cms/src/api/service schema.
 */
export const SERVICE_ICONS = [
  'monitor',
  'phone',
  'database',
  'bot',
  'code',
  'layers',
  'shield',
  'globe',
  'users',
  'message-square',
  'search',
  'calendar',
  'clock',
  'send',
  'mail',
  'map-pin',
] as const
export type ServiceIconName = (typeof SERVICE_ICONS)[number]

/* ------------------------------------------------------------------ *
 * Strapi "blocks" rich text (docs/content-model.md — rich text fields
 * use the blocks format; rendered by components/Blocks).
 * ------------------------------------------------------------------ */

export interface BlocksText {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}
export interface BlocksLink {
  type: 'link'
  url: string
  children: BlocksText[]
  rel?: string
  target?: string
}
export type BlocksInline = BlocksText | BlocksLink

export interface BlocksParagraph {
  type: 'paragraph'
  children: BlocksInline[]
}
export interface BlocksHeading {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: BlocksInline[]
}
export interface BlocksQuote {
  type: 'quote'
  children: BlocksInline[]
}
export interface BlocksCode {
  type: 'code'
  language?: string
  children: BlocksInline[]
}
export interface BlocksList {
  type: 'list'
  format: 'ordered' | 'unordered'
  children: BlocksListItem[]
}
export interface BlocksListItem {
  type: 'list-item'
  children: (BlocksInline | BlocksParagraph | BlocksList)[]
}
export interface BlocksImage {
  type: 'image'
  image?: { url?: string; alternativeText?: string; name?: string }
}
export type BlocksBlock =
  | BlocksParagraph
  | BlocksHeading
  | BlocksQuote
  | BlocksCode
  | BlocksList
  | BlocksImage
export type Blocks = BlocksBlock[]

/* ------------------------------------------------------------------ *
 * Service content type — mirrors cms/src/api/service/content-types/service/schema.json
 * ------------------------------------------------------------------ */

export interface ServiceFeature {
  id: number
  text: string
}

export interface Service {
  id: number
  documentId: string
  title: string
  slug: string
  shortDescription: string
  longDescription: Blocks
  icon: ServiceIconName
  features: ServiceFeature[]
  /** Optional price or engagement type, e.g. "From $18,000". */
  startingFrom: string | null
  /** Manual sort order on the Services page (ascending). */
  order: number | null
  publishedAt: string
}

interface StrapiListResponse<T> {
  data: T[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`CMS request failed (${response.status} ${response.statusText})`)
  }
  return (await response.json()) as T
}

/**
 * All published services, sorted by the CMS `order` field.
 * Endpoint: GET /api/services?populate=features&sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchServices(): Promise<Service[]> {
  const params = new URLSearchParams({
    populate: 'features',
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<Service>>(`/services?${params}`)
  return data
}

/**
 * A single published service by slug, or null when it doesn't resolve.
 * Endpoint: GET /api/services?filters[slug][$eq]=<slug>&populate=features
 */
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const params = new URLSearchParams({
    populate: 'features',
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': '1',
  })
  const { data } = await get<StrapiListResponse<Service>>(`/services?${params}`)
  return data[0] ?? null
}

/* ------------------------------------------------------------------ *
 * Team members + values (About page)
 * ------------------------------------------------------------------ */

/** Strapi media file (populated for the optional `photo` field). */
export interface MediaFile {
  url: string
  alternativeText: string | null
  name: string
  width: number | null
  height: number | null
}

export type TeamFocusArea = 'Frontend' | 'Backend' | 'AI' | 'Full-stack'

export interface TeamMember {
  id: number
  documentId: string
  name: string
  role: string
  focusArea: TeamFocusArea
  bio: Blocks
  photo: MediaFile | null
  order: number | null
  publishedAt: string
}

/** Working principle shown in the About "How we work" section. */
export interface StudioValue {
  id: number
  documentId: string
  title: string
  text: string
  icon: ServiceIconName
  order: number | null
  publishedAt: string
}

/**
 * All published team members, sorted by the CMS `order` field.
 * Endpoint: GET /api/team-members?populate=photo&sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const params = new URLSearchParams({
    populate: 'photo',
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<TeamMember>>(`/team-members?${params}`)
  return data
}

/**
 * All published values, sorted by the CMS `order` field.
 * Endpoint: GET /api/values?sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchValues(): Promise<StudioValue[]> {
  const params = new URLSearchParams({
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<StudioValue>>(`/values?${params}`)
  return data
}

/* ------------------------------------------------------------------ *
 * Accomplishments + metrics (Accomplishments page)
 * ------------------------------------------------------------------ */

export interface Accomplishment {
  id: number
  documentId: string
  projectName: string
  slug: string
  client: string | null
  industry: string | null
  year: string | null
  /** Headline result shown at the top of the card, e.g. "88% daily active field staff". */
  metric: string | null
  problem: Blocks
  solution: Blocks
  outcome: Blocks
  order: number | null
  publishedAt: string
}

export interface Metric {
  id: number
  documentId: string
  value: string
  label: string
  order: number | null
  publishedAt: string
}

/**
 * All published case studies, sorted by the CMS `order` field.
 * Endpoint: GET /api/accomplishments?sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchAccomplishments(): Promise<Accomplishment[]> {
  const params = new URLSearchParams({
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<Accomplishment>>(`/accomplishments?${params}`)
  return data
}

/**
 * All published metrics, sorted by the CMS `order` field.
 * Endpoint: GET /api/metrics?sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchMetrics(): Promise<Metric[]> {
  const params = new URLSearchParams({
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<Metric>>(`/metrics?${params}`)
  return data
}

/* ------------------------------------------------------------------ *
 * Testimonials + FAQs
 * ------------------------------------------------------------------ */

export interface Testimonial {
  id: number
  documentId: string
  clientName: string
  clientRole: string
  quote: string
  photo: MediaFile | null
  /** Optional star rating, 1–5. */
  rating: number | null
  /** The related Service (populated via `populate=service`), or null. */
  service: Pick<Service, 'id' | 'documentId' | 'title' | 'slug'> | null
  order: number | null
  publishedAt: string
}

export type FaqCategory = 'Pricing' | 'Process' | 'Technology' | 'Support'

export interface Faq {
  id: number
  documentId: string
  question: string
  answer: Blocks
  category: FaqCategory
  order: number | null
  publishedAt: string
}

/**
 * All published testimonials with their related service, sorted by `order`.
 * Endpoint: GET /api/testimonials?populate=service&sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const params = new URLSearchParams({
    populate: 'service',
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<Testimonial>>(`/testimonials?${params}`)
  return data
}

/**
 * All published FAQs, sorted by `order` (grouping by category happens on the page).
 * Endpoint: GET /api/faqs?sort[0]=order:asc&pagination[pageSize]=100
 */
export async function fetchFaqs(): Promise<Faq[]> {
  const params = new URLSearchParams({
    'sort[0]': 'order:asc',
    'pagination[pageSize]': '100',
  })
  const { data } = await get<StrapiListResponse<Faq>>(`/faqs?${params}`)
  return data
}

/* ------------------------------------------------------------------ *
 * Blog posts
 * ------------------------------------------------------------------ */

export type BlogCategory = 'Engineering' | 'AI & Automation' | 'Process' | 'Company'

export interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  coverImage: MediaFile | null
  body: Blocks
  /** Populated via `populate=author` (name/role/photo used by bylines). */
  author: Pick<TeamMember, 'id' | 'documentId' | 'name' | 'role' | 'photo'> | null
  category: BlogCategory
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string
}

export interface BlogPostsPage {
  posts: BlogPost[]
  pagination: { page: number; pageSize: number; pageCount: number; total: number }
}

/** Query params shared by every blog fetch — author + cover populated. */
function blogParams(): URLSearchParams {
  const params = new URLSearchParams()
  params.append('populate[0]', 'author')
  params.append('populate[1]', 'coverImage')
  return params
}

/**
 * A page of published posts, newest first, with author + cover populated.
 * Endpoint: GET /api/blog-posts?populate[0]=author&populate[1]=coverImage&sort[0]=publishedAt:desc&pagination[page]=N&pagination[pageSize]=M[&filters[category][$eq]=…]
 */
export async function fetchBlogPosts(params: {
  page?: number
  pageSize?: number
  category?: BlogCategory | null
}): Promise<BlogPostsPage> {
  const query = blogParams()
  query.set('sort[0]', 'publishedAt:desc')
  query.set('pagination[page]', String(params.page ?? 1))
  query.set('pagination[pageSize]', String(params.pageSize ?? 6))
  if (params.category) query.set('filters[category][$eq]', params.category)

  const { data, meta } = await get<StrapiListResponse<BlogPost>>(`/blog-posts?${query}`)
  return { posts: data, pagination: meta.pagination }
}

/**
 * A single published post by slug, or null when it doesn't resolve.
 * Endpoint: GET /api/blog-posts?filters[slug][$eq]=<slug>&populate[0]=author&populate[1]=coverImage
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = blogParams()
  query.set('filters[slug][$eq]', slug)
  query.set('pagination[pageSize]', '1')
  const { data } = await get<StrapiListResponse<BlogPost>>(`/blog-posts?${query}`)
  return data[0] ?? null
}
