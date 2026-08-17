import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { fetchLegalPageBySlug, type LegalPage as LegalPageData } from '../lib/cms'
import { formatDate } from '../lib/format'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Legal.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; page: LegalPageData | null }

/**
 * Privacy Policy and Terms of Service — both render from a Strapi LegalPage
 * entry (docs/content-model.md §12), so the team can edit them without a
 * redeploy. The seeded copy is a starting template, not final legal advice —
 * flagged in the hero and meant to be reviewed by a lawyer before launch.
 */
export default function Legal({ slug }: { slug: string }) {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const page = await fetchLegalPageBySlug(slug)
      setState({ status: 'ready', page })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    }
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  // Meta reflects the page title once loaded (title only — description comes
  // from the CMS-free site tagline so the tag is present on every page).
  useEffect(() => {
    if (state.status !== 'ready' || !state.page) return
    setPageMeta({
      title: `${state.page.title} — Himam`,
      description:
        `${state.page.title} for Himam software engineering studio. ` +
        'Last updated ' +
        formatDate(state.page.lastUpdated) +
        '.',
    })
  }, [state])

  if (state.status === 'loading') {
    return (
      <>
        <Section background="default" padding="lg">
          <div className={styles.hero} aria-hidden="true">
            <Skeleton width={200} height={16} radius="sm" />
            <Skeleton width="50%" height={40} radius="sm" />
            <Skeleton width={140} height={16} radius="sm" />
          </div>
        </Section>
        <Section background="subtle" padding="lg" container="narrow">
          <div className={styles.bodySkeleton} aria-hidden="true">
            <Skeleton width="100%" height={16} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="92%" height={16} />
            <Skeleton width="40%" height={24} radius="sm" />
            <Skeleton width="100%" height={16} />
            <Skeleton width="88%" height={16} />
          </div>
        </Section>
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <Section background="default" padding="lg">
        <div className={styles.statePanel} role="alert">
          <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
          <h1 className={styles.stateTitle}>Couldn’t load this page</h1>
          <p className={styles.stateBody}>
            The content service isn’t responding right now ({state.message}). Please try
            again.
          </p>
          <Button onClick={() => void load()}>Try again</Button>
        </div>
      </Section>
    )
  }

  if (!state.page) {
    return (
      <Section background="default" padding="lg">
        <div className={styles.statePanel}>
          <h1 className={styles.stateTitle}>Page not found</h1>
          <p className={styles.stateBody}>
            This legal page hasn’t been published yet. If you were expecting it, email us
            and we’ll point you at the right place.
          </p>
          <Button href={`mailto:${siteEmail}`}>Email us</Button>
        </div>
      </Section>
    )
  }

  const page = state.page

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <Badge variant="light" icon="shield">
            Template — have a lawyer review before relying on it
          </Badge>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.lastUpdated}>
            <Icon name="calendar" size={16} aria-hidden="true" />
            Last updated {formatDate(page.lastUpdated)}
          </p>
        </div>
      </Section>

      {/* Body */}
      <Section background="subtle" padding="lg" container="narrow">
        <div className={styles.body}>
          <Blocks blocks={page.body} />
        </div>
        <p className={styles.notice}>
          This document is a starting template prepared for Himam and does not constitute
          legal advice. Please have a lawyer review it before launch.
        </p>
      </Section>
    </>
  )
}
