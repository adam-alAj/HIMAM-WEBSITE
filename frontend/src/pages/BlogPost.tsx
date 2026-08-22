import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthorByline } from '../components/AuthorByline/AuthorByline'
import { Badge } from '../components/Badge/Badge'
import { Blocks } from '../components/Blocks/Blocks'
import { BlogPostCard } from '../components/BlogPostCard/BlogPostCard'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Icon } from '../components/Icon/Icon'
import { ArticleJsonLd } from '../components/JsonLd/JsonLd'
import { Section } from '../components/Section/Section'
import { Skeleton } from '../components/Skeleton/Skeleton'
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
  resolveMediaUrl,
  type BlogPost as BlogPostType,
} from '../lib/cms'
import { readingTime } from '../lib/format'
import { setPageMeta } from '../lib/seo'
import { siteEmail } from '../lib/site'
import styles from './BlogPost.module.css'

type DetailState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; post: BlogPostType | null; related: BlogPostType[] }

/** Same category first (excluding the current post), then the rest — max 3. */
function pickRelated(posts: BlogPostType[], current: BlogPostType): BlogPostType[] {
  const others = posts.filter((post) => post.documentId !== current.documentId)
  const sameCategory = others.filter((post) => post.category === current.category)
  const rest = others.filter((post) => post.category !== current.category)
  return [...sameCategory, ...rest].slice(0, 3)
}

function PostSkeleton() {
  return (
    <>
      <Section background="default" padding="lg">
        <div className={styles.hero} aria-hidden="true">
          <Skeleton width={120} height={16} radius="sm" />
          <Skeleton width="70%" height={40} radius="sm" />
          <Skeleton width={220} height={16} radius="sm" />
          <Skeleton width="100%" height={300} radius="lg" />
        </div>
      </Section>
      <Section background="subtle" padding="lg" container="narrow">
        <div className={styles.bodySkeleton} aria-hidden="true">
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="95%" height={16} />
          <Skeleton width="45%" height={24} radius="sm" />
          <Skeleton width="100%" height={16} />
          <Skeleton width="88%" height={16} />
        </div>
      </Section>
    </>
  )
}

/**
 * Blog detail — renders one post by slug (routes on /blog/<slug>, never on
 * numeric IDs), sets per-post meta tags for SEO/social, and shows the author
 * byline (linked to About) plus related posts from the same category.
 */
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  const load = useCallback(async () => {
    if (!slug) return
    setState({ status: 'loading' })
    try {
      const post = await fetchBlogPostBySlug(slug)
      if (!post) {
        setState({ status: 'ready', post: null, related: [] })
        return
      }
      const { posts } = await fetchBlogPosts({ pageSize: 100 })
      setState({ status: 'ready', post, related: pickRelated(posts, post) })
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

  // Per-post meta tags: SEO title/description from the CMS, cover as og:image.
  useEffect(() => {
    if (state.status !== 'ready' || !state.post) return
    const post = state.post
    setPageMeta({
      title: post.seoTitle ?? `${post.title} — Himam`,
      description: post.seoDescription ?? post.excerpt,
      image: resolveMediaUrl(post.coverImage?.url),
      type: 'article',
    })
  }, [state])

  if (state.status === 'loading') return <PostSkeleton />

  if (state.status === 'error') {
    return (
      <Section background="subtle" padding="lg">
        <div className={styles.statePanel} role="alert">
          <Icon name="alert-triangle" size={24} className={styles.errorIcon} aria-hidden="true" />
          <h1 className={styles.stateTitle}>Couldn’t load this post</h1>
          <p className={styles.stateBody}>
            The content service isn’t responding right now ({state.message}). Please try
            again.
          </p>
          <div className={styles.stateActions}>
            <Button onClick={() => void load()}>Try again</Button>
            <Button variant="secondary" to="/blog">
              Back to the blog
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  if (state.post === null) {
    return (
      <Section background="subtle" padding="lg">
        <div className={styles.statePanel}>
          <h1 className={styles.stateTitle}>Post not found</h1>
          <p className={styles.stateBody}>
            That post may have been unpublished or renamed in the CMS.
          </p>
          <Button to="/blog">Back to the blog</Button>
        </div>
      </Section>
    )
  }

  const post = state.post
  const coverUrl = resolveMediaUrl(post.coverImage?.url)
  const minutes = readingTime(post.body)

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.seoDescription ?? post.excerpt}
        url={window.location.href}
        image={coverUrl}
        author={post.author?.name ?? null}
        datePublished={post.publishedAt}
      />
      {/* Hero — title, byline, cover */}
      <Section background="default" padding="lg">
        <Link to="/blog" className={styles.back}>
          <Icon name="chevron-left" size={16} aria-hidden="true" />
          All posts
        </Link>
        <article className={styles.hero}>
          <div className={styles.heroMeta}>
            <Badge variant="light">{post.category}</Badge>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <AuthorByline
            author={post.author}
            date={post.publishedAt}
            readingTime={minutes}
            link="/about"
            className={styles.byline}
          />
          {coverUrl && (
            <img
              className={styles.cover}
              src={coverUrl}
              alt={post.coverImage?.alternativeText ?? post.title}
            />
          )}
        </article>
      </Section>

      {/* Body + author card */}
      <Section background="subtle" padding="lg" container="narrow">
        <Blocks blocks={post.body} />

        {post.author && (
          <Card variant="subtle" padding="lg" className={styles.authorCard}>
            <div className={styles.authorCardBody}>
              <AuthorByline author={post.author} link="/about" />
              <p className={styles.authorRole}>{post.author.role}</p>
              <Link to="/about" className={styles.aboutLink}>
                Meet the team
                <Icon name="arrow-right" size={16} aria-hidden="true" />
              </Link>
            </div>
          </Card>
        )}
      </Section>

      {/* Related posts */}
      {state.related.length > 0 && (
        <Section background="default" padding="lg">
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Keep reading</p>
            <h2 className={styles.sectionTitle}>Related posts</h2>
          </header>
          <div className={styles.relatedGrid}>
            {state.related.map((related) => (
              <BlogPostCard key={related.documentId} post={related} />
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section background="navy" padding="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Like what you read?</h2>
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
