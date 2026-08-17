import { Icon } from '../Icon/Icon'
import styles from './StarRating.module.css'

interface StarRatingProps {
  /** Rating 1–5; clamped defensively. */
  rating: number
  className?: string
}

/**
 * Five-star rating indicator (design-system/MASTER.md §16). Decorative stars
 * with a text label for assistive tech — meaning is never color-only.
 */
export function StarRating({ rating, className }: StarRatingProps) {
  const clamped = Math.min(Math.max(Math.round(rating), 0), 5)

  return (
    <span
      className={`${styles.rating} ${className ?? ''}`}
      role="img"
      aria-label={`Rated ${clamped} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={16}
          className={star <= clamped ? styles.filled : styles.empty}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}
