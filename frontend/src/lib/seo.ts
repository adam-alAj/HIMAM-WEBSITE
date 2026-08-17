/**
 * Lightweight, dependency-free page meta manager for the client-side SPA
 * (no SSR in this stack). Each page calls setPageMeta on mount to update
 * document.title plus the description / Open Graph / Twitter tags that
 * social scrapers and search engines read.
 *
 * For a server-rendered site this would live in the HTML head per route;
 * here the tags are created once and updated in place, so deep links and
 * shares still carry the right title, description, and image.
 */

export interface PageMeta {
  title: string
  description?: string
  /** Absolute image URL (use resolveMediaUrl for CMS uploads). */
  image?: string | null
  /** Open Graph type — 'article' for blog posts, 'website' otherwise. */
  type?: 'website' | 'article'
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function setPageMeta({ title, description, image, type = 'website' }: PageMeta) {
  document.title = title

  if (description) {
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:description', description)
    upsertMeta('name', 'twitter:description', description)
  }

  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', window.location.href)
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')

  if (image) {
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:image', image)
  }
}
