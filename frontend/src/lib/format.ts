import type { Blocks } from './cms'

/** "12 Aug 2026" — used by blog bylines and cards. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

/** Rough reading time in minutes (≈200 wpm), walking Strapi blocks text. */
export function readingTime(blocks: Blocks): number {
  let words = 0

  const walk = (nodes: readonly unknown[]): void => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const candidate = node as { type?: string; text?: string; children?: unknown[] }
      if (candidate.type === 'text' && candidate.text) {
        words += candidate.text.split(/\s+/).filter(Boolean).length
      }
      if (Array.isArray(candidate.children)) walk(candidate.children)
    }
  }

  walk(blocks)
  return Math.max(1, Math.round(words / 200))
}
