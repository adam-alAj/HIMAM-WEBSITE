/**
 * Site-wide content data (navigation, footer) — single place to edit the
 * global layout. Copy follows design-system/MASTER.md; no lorem ipsum.
 * Page content types for individual services/posts land in Phase 3+ and
 * will be fetched from the CMS; routes already point where they'll live.
 */
import type { FooterColumn } from '../components/Footer/Footer'
import type { NavbarLink } from '../components/Navbar/Navbar'

export const siteName = 'Himam'
export const siteEmail = 'hello@himam.dev'
export const siteTagline =
  'Software engineering studio building apps, websites, systems, and AI chatbots.'

/** Primary navigation — order matters (MASTER.md §16 / Navbar). */
export const navLinks: NavbarLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
  { label: 'Accomplishments', to: '/accomplishments' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export const navCta: NavbarLink = { label: 'Start a project', to: '/contact' }

/**
 * Footer link columns. Privacy Policy and Terms of Service live here only —
 * they are intentionally not in the primary navigation.
 */
export const footerColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'Web applications', to: '/services' },
      { label: 'Mobile applications', to: '/services' },
      { label: 'Custom systems', to: '/services' },
      { label: 'AI & automation', to: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Accomplishments', to: '/accomplishments' },
      { label: 'Testimonials', to: '/testimonials' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
      { label: 'Style guide', to: '/style-guide' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
]
