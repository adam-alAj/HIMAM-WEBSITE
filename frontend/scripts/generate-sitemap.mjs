/**
 * Static sitemap generator for the Himam website.
 *
 * Run during the Vite build to produce `public/sitemap.xml`. Lists all
 * public routes with appropriate priority and change frequency.
 * CMS-driven routes use known seed-data slugs — regenerate from live
 * CMS API for production.
 *
 * SRS §8.4: "A sitemap.xml file shall be generated listing all public
 * routes with lastmod dates."
 *
 * Usage: node frontend/scripts/generate-sitemap.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://himam.dev'
const TODAY = new Date().toISOString().split('T')[0]

/** @type {{ loc: string, lastmod: string, changefreq: string, priority: string }[]} */
const staticRoutes = [
  { loc: '/', lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
  { loc: '/services', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: '/about', lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  { loc: '/accomplishments', lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  { loc: '/testimonials', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { loc: '/contact', lastmod: TODAY, changefreq: 'monthly', priority: '0.9' },
  { loc: '/privacy', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
]

const serviceSlugs = [
  'custom-applications',
  'website-development',
  'business-systems',
  'ai-chatbots',
]

const blogSlugs = [
  'how-we-approach-ai-chatbot-projects',
  'choosing-the-right-tech-stack-for-your-startup',
  'a-day-in-the-life-of-our-team',
]

const serviceRoutes = serviceSlugs.map((slug) => ({
  loc: `/services/${slug}`,
  lastmod: TODAY,
  changefreq: 'monthly',
  priority: '0.7',
}))

const blogRoutes = blogSlugs.map((slug) => ({
  loc: `/blog/${slug}`,
  lastmod: TODAY,
  changefreq: 'monthly',
  priority: '0.6',
}))

const allRoutes = [...staticRoutes, ...serviceRoutes, ...blogRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (entry) => `  <url>
    <loc>${SITE_URL}${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outDir = resolve(__dirname, '..', 'public')
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}
writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf-8')
console.log(`[sitemap] Generated sitemap.xml with ${allRoutes.length} routes.`)
