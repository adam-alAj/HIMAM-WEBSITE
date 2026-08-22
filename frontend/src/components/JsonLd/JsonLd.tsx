/**
 * JSON-LD structured data for SEO (SRS §8.4).
 *
 * Each page inserts a <script type="application/ld+json"> block with
 * schema.org data matching the page's content. This is the single
 * structured-data mechanism — consistent with the setPageMeta pattern.
 *
 * Reference: https://schema.org/docs/documents.html
 */

/** Organization schema for the homepage. */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Himam',
    url: 'https://himam.dev',
    logo: 'https://himam.dev/logo.png',
    description:
      'Software engineering studio building apps, websites, systems, and AI chatbots for ambitious teams.',
    sameAs: [
      'https://github.com/himam',
      'https://linkedin.com/company/himam',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@himam.dev',
      contactType: 'customer service',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** WebSite schema for the homepage — enables sitelinks search box. */
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Himam',
    url: 'https://himam.dev',
    description:
      'Software engineering studio building apps, websites, systems, and AI chatbots.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  image?: string | null
  author?: string | null
  datePublished: string
}

/** Article schema for blog posts (SRS §8.4). */
export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  author,
  datePublished,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(image ? { image } : {}),
    author: author ? { '@type': 'Person', name: author } : { '@type': 'Organization', name: 'Himam' },
    publisher: {
      '@type': 'Organization',
      name: 'Himam',
      logo: { '@type': 'ImageObject', url: 'https://himam.dev/logo.png' },
    },
    datePublished,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface FAQJsonLdProps {
  items: Array<{ question: string; answer: string }>
}

/** FAQPage schema for the FAQ page (SRS §8.4). */
export function FAQJsonLd({ items }: FAQJsonLdProps) {
  if (items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Service schema for individual service detail pages. */
interface ServiceJsonLdProps {
  name: string
  description: string
  url: string
}

export function ServiceJsonLd({ name, description, url }: ServiceJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Himam',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
