import { AuthorByline } from '../AuthorByline/AuthorByline'
import { Badge } from '../Badge/Badge'
import { Card } from '../Card/Card'
import { resolveMediaUrl, type BlogPost } from '../../lib/cms'
import { readingTime } from '../../lib/format'
import styles from './BlogPostCard.module.css'

/**
 * One post in the blog grid — whole card links to /blog/<slug>. The cover
 * image falls back to a navy tile with the category when none is uploaded.
 */
export function BlogPostCard({ post }: { post: BlogPost }) {
  const coverUrl = resolveMediaUrl(post.coverImage?.url)

  return (
    <Card to={`/blog/${post.slug}`} interactive padding="none" className={styles.card}>
      {coverUrl ? (
        <img
          className={styles.cover}
          src={coverUrl}
          alt={post.coverImage?.alternativeText ?? post.title}
          loading="lazy"
        />
      ) : (
        <span className={styles.coverPlaceholder} aria-hidden="true">
          {post.category}
        </span>
      )}

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <Badge variant="light" size="sm">
            {post.category}
          </Badge>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.byline}>
          <AuthorByline author={post.author} date={post.publishedAt} readingTime={readingTime(post.body)} />
        </div>
      </div>
    </Card>
  )
}
