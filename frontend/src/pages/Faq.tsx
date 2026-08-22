import { useCallback, useEffect, useMemo, useState } from 'react'
import { Accordion } from '../components/Accordion/Accordion'
import { Blocks } from '../components/Blocks/Blocks'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { FAQJsonLd } from '../components/JsonLd/JsonLd'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { fetchFaqs, type Faq, type FaqCategory } from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Faq.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; faqs: Faq[] }

/** Display order of categories on the page (matches the CMS enum). */
const CATEGORY_ORDER: FaqCategory[] = ['Pricing', 'Process', 'Technology', 'Support']

function FaqSkeleton() {
  return (
    <div className={styles.categories} aria-hidden="true">
      {CATEGORY_ORDER.map((category, categoryIndex) => (
        <div key={category} className={styles.category}>
          <Skeleton width={140} height={26} radius="sm" />
          {Array.from({ length: 2 }, (_, itemIndex) => (
            <div key={itemIndex} className={styles.skeletonItem}>
              <Skeleton
                width={`${categoryIndex % 2 === 0 ? 62 : 48}%`}
                height={18}
                radius="sm"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * FAQ page — questions read live from Strapi and grouped by category
 * (docs/content-model.md §9). Each question expands/collapses via the shared
 * Accordion component, which is keyboard operable and aria-labelled.
 */
export default function Faq() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const faqs = await fetchFaqs()
      setState({ status: 'ready', faqs })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPageMeta({
      title: 'FAQ — Himam',
      description:
        'Pricing, process, technology, and support questions answered — the things buyers ask us before they start a project.',
    })
  }, [])

  /** FAQs grouped by category, preserving each category's `order` sort. */
  const grouped = useMemo(() => {
    if (state.status !== 'ready') return new Map<FaqCategory, Faq[]>()
    const map = new Map<FaqCategory, Faq[]>()
    for (const faq of state.faqs) {
      const bucket = map.get(faq.category) ?? []
      bucket.push(faq)
      map.set(faq.category, bucket)
    }
    return map
  }, [state])

  /** Strip Strapi blocks to plain text for JSON-LD answer field. */
  const faqJsonLdItems = useMemo(() => {
    if (state.status !== 'ready') return []
    return state.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer
        .map((block) => {
          if (block.type === 'paragraph' || block.type === 'heading') {
            return (block as { children?: Array<{ text?: string }> }).children
              ?.map((child) => child.text ?? '')
              .join('') ?? ''
          }
          return ''
        })
        .join(' ')
        .trim(),
    }))
  }, [state])

  return (
    <>
      <FAQJsonLd items={faqJsonLdItems} />
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>FAQ</p>
          <h1 className={styles.title}>Questions, answered.</h1>
          <p className={styles.lead}>
            The things buyers ask us before they start — pricing, process, tech stack,
            and what happens after launch. Can’t find your question? Email us and we’ll
            answer within one business day.
          </p>
        </div>
      </Section>

      {/* Categories */}
      <Section background="subtle" padding="lg">
        {state.status === 'loading' && <FaqSkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h2 className={styles.stateTitle}>Couldn’t load the FAQ</h2>
            <p className={styles.stateBody}>
              The content service isn’t responding right now ({state.message}). Please try
              again.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.faqs.length === 0 && (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>No questions published yet</h2>
            <p className={styles.stateBody}>
              We’re writing up the answers. Meanwhile, ask us anything directly.
            </p>
            <Button href={`mailto:${siteEmail}`}>Email us</Button>
          </div>
        )}

        {state.status === 'ready' && state.faqs.length > 0 && (
          <div className={styles.categories}>
            {CATEGORY_ORDER.map((category) => {
              const faqs = grouped.get(category)
              if (!faqs || faqs.length === 0) return null
              return (
                <div key={category} className={styles.category}>
                  <h2 className={styles.categoryTitle}>{category}</h2>
                  <Accordion
                    items={faqs.map((faq) => ({
                      id: faq.documentId,
                      title: faq.question,
                      content: <Blocks blocks={faq.answer} />,
                    }))}
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Still have questions?</h2>
          <p className={styles.ctaLead}>
            Ask us directly — we’ll give you a straight answer, even if it’s “that’s not
            what we do”.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/testimonials">
              Read what clients say
            </Button>
            <Button size="lg" variant="ghost" href={`mailto:${siteEmail}`}>
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
