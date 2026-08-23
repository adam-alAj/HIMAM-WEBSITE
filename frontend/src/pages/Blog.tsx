import { useCallback, useEffect, useState } from 'react'
import { BlogPostCard } from '../components/BlogPostCard/BlogPostCard'
import { Button } from '../components/Button/Button'
import { Icon } from '../components/Icon/Icon'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchBlogPosts,
  type BlogCategory,
  type BlogPost,
} from '../lib/cms'
import { setPageMeta } from '../lib/seo'
import { siteEmail, siteTagline } from '../lib/site'
import styles from './Blog.module.css'

const PAGE_SIZE = 6

/** Display order of category filter tabs (matches the CMS enum). */
const BLOG_CATEGORIES: BlogCategory[] = [
  'Engineering',
  'AI & Automation',
  'Process',
  'Company',
]

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; posts: BlogPost[]; page: number; pageCount: number; total: number }

function BlogSkeleton() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton width="100%" height={150} radius="md" />
          <Skeleton width="35%" height={20} radius="sm" />
          <Skeleton width="70%" height={18} radius="sm" />
          <Skeleton width="100%" height={14} />
          <Skeleton width="92%" height={14} />
          <Skeleton width={140} height={14} radius="sm" />
        </div>
      ))}
    </div>
  )
}

/**
 * Blog listing — posts fetched and paginated from Strapi
 * (docs/content-model.md §2), filterable by category. Everything an editor
 * changes in the CMS (title, excerpt, cover, author, date) renders here with
 * no redeploy.
 */
export default function Blog() {
  const [state, setState] = useState<FetchState>({ status: 'loading' })
  const [category, setCategory] = useState<BlogCategory | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPageMeta({ title: 'Blog — Himam', description: siteTagline })
  }, [])

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const result = await fetchBlogPosts({ page, pageSize: PAGE_SIZE, category })
      setState({
        status: 'ready',
        posts: result.posts,
        page: result.pagination.page,
        pageCount: result.pagination.pageCount,
        total: result.pagination.total,
      })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    }
  }, [page, category])

  useEffect(() => {
    void load()
  }, [load])

  const selectCategory = (next: BlogCategory | null) => {
    setCategory(next)
    setPage(1)
  }

  return (
    <>
      {/* Hero */}
      <Section background="default" padding="lg">
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>Notes from the studio.</h1>
          <p className={styles.lead}>
            How we think about AI, systems, and running a small engineering team —
            written by the people who do the work.
          </p>
        </div>
      </Section>

      {/* Filter + grid */}
      <Section background="subtle" padding="lg">
        <h2 className="sr-only">All posts</h2>
        <div className={styles.tabs} role="group" aria-label="Filter posts by category">
          <button
            type="button"
            className={`${styles.tab} ${category === null ? styles.tabActive : ''}`}
            aria-pressed={category === null}
            onClick={() => selectCategory(null)}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tab} ${category === tab ? styles.tabActive : ''}`}
              aria-pressed={category === tab}
              onClick={() => selectCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {state.status === 'loading' && <BlogSkeleton />}

        {state.status === 'error' && (
          <div className={styles.statePanel} role="alert">
            <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
            <h2 className={styles.stateTitle}>Couldn’t load the blog</h2>
            <p className={styles.stateBody}>
              The content service isn’t responding right now ({state.message}). Please try
              again.
            </p>
            <Button onClick={() => void load()}>Try again</Button>
          </div>
        )}

        {state.status === 'ready' && state.total === 0 && (
          <div className={styles.statePanel}>
            <h2 className={styles.stateTitle}>
              {category ? `No posts in ${category} yet` : 'No posts published yet'}
            </h2>
            <p className={styles.stateBody}>
              The editors are writing. Meanwhile, we’d love to hear about your project.
            </p>
            <Button to="/contact">Start a project</Button>
          </div>
        )}

        {state.status === 'ready' && state.posts.length > 0 && (
          <>
            <div className={styles.grid}>
              {state.posts.map((post) => (
                <BlogPostCard key={post.documentId} post={post} />
              ))}
            </div>

            {state.pageCount > 1 && (
              <nav className={styles.pagination} aria-label="Blog pagination">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={state.page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <Icon name="chevron-left" size={16} aria-hidden="true" />
                  Previous
                </Button>
                <span className={styles.pageInfo}>
                  Page {state.page} of {state.pageCount}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={state.page >= state.pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <Icon name="chevron-right" size={16} aria-hidden="true" />
                </Button>
              </nav>
            )}
          </>
        )}
      </Section>

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Prefer to talk it through?</h2>
          <p className={styles.ctaLead}>
            The blog is the long version. Tell us what you’re working on and we’ll give
            you the short one.
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
