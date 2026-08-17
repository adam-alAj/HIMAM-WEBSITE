import { useLocation } from 'react-router-dom'
import { Button } from '../components/Button/Button'
import { Section } from '../components/Section/Section'
import { navLinks } from '../lib/site'
import styles from './PagePlaceholder.module.css'

/** Future routes (Phase 9) shown with their real page names, not slugs. */
const labelByPath: Record<string, string> = {
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
}

/**
 * Catch-all for routes whose pages land in later phases. Keeps navigation
 * from dead-ending while those pages are built — token-based, no new styles.
 */
export default function PagePlaceholder() {
  const { pathname } = useLocation()
  const pageLabel =
    labelByPath[pathname] ?? navLinks.find((link) => link.to === pathname)?.label ?? 'Page'

  return (
    <Section background="subtle" padding="lg">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{pageLabel}</p>
        <h1 className={styles.title}>This page is coming soon.</h1>
        <p className={styles.lead}>
          We’re building it right now. In the meantime, explore what we build or start a
          conversation about your project.
        </p>
        <div className={styles.actions}>
          <Button to="/services">Explore services</Button>
          <Button variant="secondary" to="/contact">
            Start a project
          </Button>
        </div>
      </div>
    </Section>
  )
}
