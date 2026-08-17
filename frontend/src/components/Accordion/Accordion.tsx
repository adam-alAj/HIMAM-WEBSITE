import { useId, useState, type ReactNode } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './Accordion.module.css'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

/**
 * Accessible expand/collapse list (MASTER.md §16): each item is a button with
 * aria-expanded/aria-controls and a labelled region. Items toggle
 * independently; the global :focus-visible rule covers keyboard focus and
 * the reduced-motion kill switch freezes the panel animation.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const baseId = useId()
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set<string>())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id)
        const buttonId = `${baseId}-${index}-button`
        const panelId = `${baseId}-${index}-panel`
        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className={styles.triggerText}>{item.title}</span>
                <Icon name="chevron-down" size={20} className={styles.chevron} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
              hidden={!isOpen}
            >
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
