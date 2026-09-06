import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { StarRating } from '../components/StarRating/StarRating'
import { fetchTestimonials, resolveMediaUrl, type Testimonial } from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './Testimonials.module.css'

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; testimonials: Testimonial[] }

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}


function Avatar({
  photo,
  name,
  size = 'md',
}: {
  photo: Testimonial['photo']
  name: string
  size?: 'md' | 'lg'
}) {
  const resolvedUrl = resolveMediaUrl(photo?.url)
  if (resolvedUrl) {
    return (
      <img
        className={`${styles.avatar} ${size === 'lg' ? styles.avatarLg : ''}`}
        src={resolvedUrl}
        alt={photo?.alternativeText ?? name}
        loading="lazy"
      />
    )
  }
  return (
    <span
      className={`${styles.avatarPlaceholder} ${size === 'lg' ? styles.avatarPlaceholderLg : ''}`}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  )
}

function FeaturedCard({ testimonial }: { testimonial: Testimonial }) {
  const service = testimonial.service
  const imageUrl = resolveMediaUrl(testimonial.image?.url)

  return (
    <div className={styles.featured}>
      <div className={styles.featuredInner}>
        {imageUrl ? (
          <div className={styles.featuredImageArea}>
            <img
              className={styles.featuredImage}
              src={imageUrl}
              alt={testimonial.image?.alternativeText ?? testimonial.clientName}
              loading="lazy"
            />
            <div className={styles.featuredImageOverlay} />
            <div className={styles.featuredImageContent}>
              {testimonial.rating != null && (
                <StarRating rating={testimonial.rating} className={styles.rating} />
              )}
              <blockquote className={styles.featuredQuoteImage}>
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <footer className={styles.featuredAuthorImage}>
                <Avatar photo={testimonial.photo} name={testimonial.clientName} size="lg" />
                <div className={styles.authorText}>
                  <span className={styles.authorNameLight}>{testimonial.clientName}</span>
                  <span className={styles.authorRoleLight}>{testimonial.clientRole}</span>
                </div>
              </footer>
              {service && (
                <div className={styles.featuredServiceLight}>
                  <Icon name="arrow-up-right" size={14} aria-hidden="true" />
                  <span>{service.title}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.featuredContent}>
            {testimonial.rating != null && (
              <StarRating rating={testimonial.rating} className={styles.rating} />
            )}
            <blockquote className={styles.featuredQuote}>
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <footer className={styles.featuredAuthor}>
              <Avatar photo={testimonial.photo} name={testimonial.clientName} size="lg" />
              <div className={styles.authorText}>
                <span className={styles.authorName}>{testimonial.clientName}</span>
                <span className={styles.authorRole}>{testimonial.clientRole}</span>
              </div>
            </footer>
            {service && (
              <div className={styles.featuredService}>
                <Icon name="arrow-up-right" size={14} aria-hidden="true" />
                <span>{service.title}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StandardCard({ testimonial }: { testimonial: Testimonial }) {
  const service = testimonial.service
  const imageUrl = resolveMediaUrl(testimonial.image?.url)

  return (
    <div className={styles.card}>
      {imageUrl && (
        <div className={styles.cardImageWrap}>
          <img
            className={styles.cardImage}
            src={imageUrl}
            alt={testimonial.image?.alternativeText ?? testimonial.clientName}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.cardBody}>
        {testimonial.rating != null && (
          <StarRating rating={testimonial.rating} className={styles.rating} />
        )}
        <blockquote className={styles.quote}>
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <footer className={styles.cardFooter}>
          <div className={styles.author}>
            <Avatar photo={testimonial.photo} name={testimonial.clientName} />
            <div className={styles.authorText}>
              <span className={styles.authorName}>{testimonial.clientName}</span>
              <span className={styles.authorRole}>{testimonial.clientRole}</span>
            </div>
          </div>
          {service && (
            <span className={styles.serviceTag}>{service.title}</span>
          )}
        </footer>
      </div>
    </div>
  )
}

function TestimonialsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className={styles.skeletonFeatured}>
        <Skeleton width={88} height={16} radius="sm" />
        <Skeleton width="100%" height={18} />
        <Skeleton width="96%" height={18} />
        <Skeleton width="85%" height={18} />
        <Skeleton width="60%" height={18} />
        <div className={styles.skeletonAuthor}>
          <Skeleton circle width={48} height={48} />
          <div className={styles.skeletonAuthorText}>
            <Skeleton width={140} height={14} radius="sm" />
            <Skeleton width={180} height={12} radius="sm" />
          </div>
        </div>
      </div>
      <div className={styles.grid} style={{ marginTop: 'var(--space-8)' }}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <Skeleton width={88} height={14} radius="sm" />
            <Skeleton width="100%" height={14} />
            <Skeleton width="92%" height={14} />
            <Skeleton width="68%" height={14} />
            <div className={styles.skeletonAuthor}>
              <Skeleton circle width={40} height={40} />
              <div className={styles.skeletonAuthorText}>
                <Skeleton width={110} height={14} radius="sm" />
                <Skeleton width={150} height={12} radius="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Testimonials page — client quotes read live from Strapi, filterable by the
 * Service each quote relates to (docs/content-model.md §8). A visitor reading
 * the AI Chatbots service can see proof specific to that offering.
 *
 * Layout: featured first testimonial (full-width, prominent) + staggered
 * two-column grid for the rest.
 */
export default function Testimonials() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const testimonials = await fetchTestimonials()
      setState({ status: 'ready', testimonials })
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
      title: 'Testimonials — Himam',
      description:
        'What clients say about working with Himam — reviews by service, from custom applications to AI chatbots.',
    })
  }, [])

  /** Filter tabs: distinct services present in the data, in display order. */
  const tabs = useMemo(() => {
    if (state.status !== 'ready') return []
    const seen = new Map<string, { slug: string; title: string }>()
    for (const testimonial of state.testimonials) {
      const service = testimonial.service
      if (service && !seen.has(service.slug)) {
        seen.set(service.slug, { slug: service.slug, title: service.title })
      }
    }
    return [...seen.values()]
  }, [state])

  const filtered =
    state.status === 'ready'
      ? activeSlug
        ? state.testimonials.filter((t) => t.service?.slug === activeSlug)
        : state.testimonials
      : []

  /** Split into featured (first) and remaining cards. */
  const featured = filtered.length > 0 ? filtered[0] : null
  const remaining = filtered.length > 0 ? filtered.slice(1) : []

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Testimonials</p>
          <h1 className={styles.title}>What our clients say.</h1>
          <p className={styles.lead}>
            We're a small studio, so we live on word of mouth. Here's what the people
            we've worked with say — filter by the service you're interested in.
          </p>
          {state.status === 'ready' && (
            <p className={styles.count}>{state.testimonials.length} client reviews</p>
          )}
        </div>
      </Section>

      {/* Filter + testimonials */}
      <Section background="subtle" padding="lg">
        {state.status === 'ready' && tabs.length > 0 && (
          <div className={styles.tabs} role="group" aria-label="Filter testimonials by service">
            <button
              type="button"
              className={`${styles.tab} ${activeSlug === null ? styles.tabActive : ''}`}
              aria-pressed={activeSlug === null}
              onClick={() => setActiveSlug(null)}
            >
              All
              <span className={styles.tabCount}>{state.testimonials.length}</span>
            </button>
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                className={`${styles.tab} ${activeSlug === tab.slug ? styles.tabActive : ''}`}
                aria-pressed={activeSlug === tab.slug}
                onClick={() => setActiveSlug(tab.slug)}
              >
                {tab.title}
              </button>
            ))}
          </div>
        )}

        {state.status === 'loading' && <TestimonialsSkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h2 className={styles.stateTitle}>Couldn't load testimonials</h2>
            <p className={styles.stateBody}>
              The content service isn't responding right now ({state.message}). Please try
              again.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.testimonials.length === 0 && (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>No testimonials published yet</h2>
            <p className={styles.stateBody}>
              Client quotes are being collected. Meanwhile, we'd love to hear about your
              project.
            </p>
            <Button to="/contact">Start a project</Button>
          </div>
        )}

        {state.status === 'ready' && state.testimonials.length > 0 && filtered.length === 0 && (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>No testimonials for this service yet</h2>
            <p className={styles.stateBody}>
              We haven't published quotes for this offering yet — but the projects are
              real. See what we've shipped, or ask us directly.
            </p>
            <div className={styles.stateActions}>
              <Button variant="secondary" onClick={() => setActiveSlug(null)}>
                Show all testimonials
              </Button>
              <Button to="/accomplishments">View our projects</Button>
            </div>
          </div>
        )}

        {state.status === 'ready' && featured && (
          <>
            <FeaturedCard testimonial={featured} />
            {remaining.length > 0 && (
              <div className={styles.grid}>
                {remaining.map((testimonial) => (
                  <StandardCard key={testimonial.documentId} testimonial={testimonial} />
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Want a reference you can call?</h2>
          <p className={styles.ctaLead}>
            We're happy to put you in touch with a past client who's worked on something
            similar to what you're planning.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" to="/contact">
              Start a project
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/accomplishments">
              View our projects
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
