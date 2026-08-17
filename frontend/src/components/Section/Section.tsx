import type { ElementType, ReactNode } from 'react'
import styles from './Section.module.css'

export type SectionBackground = 'default' | 'subtle' | 'light' | 'navy'
export type SectionContainer = 'default' | 'narrow' | 'wide'
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg'

interface SectionProps {
  /** Semantic element — 'section' | 'div' | 'header' | 'footer' … */
  as?: ElementType
  background?: SectionBackground
  container?: SectionContainer
  padding?: SectionPadding
  id?: string
  className?: string
  children: ReactNode
}

const paddingClass: Record<SectionPadding, string> = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
}

const backgroundClass: Record<SectionBackground, string> = {
  default: styles.bgDefault,
  subtle: styles.bgSubtle,
  light: styles.bgLight,
  navy: styles.bgNavy,
}

const containerClass: Record<SectionContainer, string> = {
  default: styles.widthDefault,
  narrow: styles.widthNarrow,
  wide: styles.widthWide,
}

/**
 * Layout building block: semantic section + background band + centered,
 * width-constrained container with fluid padding (MASTER.md §8–9).
 */
export function Section({
  as: Tag = 'section',
  background = 'default',
  container = 'default',
  padding = 'lg',
  id,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={`${styles.section} ${backgroundClass[background]} ${paddingClass[padding]} ${className ?? ''}`}
    >
      <div className={`${styles.container} ${containerClass[container]}`}>{children}</div>
    </Tag>
  )
}
