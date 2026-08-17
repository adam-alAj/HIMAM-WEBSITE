import styles from './Skeleton.module.css'

export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: SkeletonRadius
  /** Renders a perfect circle (forces square ratio via width/height). */
  circle?: boolean
  className?: string
}

/**
 * Loading placeholder (MASTER.md §16). Decorative only — aria-hidden;
 * real content must never be announced as a skeleton. The shimmer is an
 * animation, so the global prefers-reduced-motion rule renders it static.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 'md',
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[radius]} ${circle ? styles.circle : ''} ${className ?? ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
