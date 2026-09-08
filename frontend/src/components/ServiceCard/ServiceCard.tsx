import { useState, useCallback } from 'react'
import { Button } from '../Button/Button'
import { Icon, type IconName } from '../Icon/Icon'
import { iconPaths } from '../Icon/icons'
import type { Service } from '../../lib/cms'
import styles from './ServiceCard.module.css'

/** Guards a CMS icon name against the frontend Icon set; falls back to 'layers'. */
function isIconName(name: string): name is IconName {
  return name in iconPaths
}

/**
 * One service in the Services grid. Renders CMS content (title, teaser,
 * features, optional "starting from" price) with a detail link and a
 * contact CTA — built on the Phase 2 Card (MASTER.md §16).
 *
 * Click anywhere on the card to flip and reveal the description.
 */
export function ServiceCard({ service }: { service: Service }) {
  const icon: IconName = isIconName(service.icon) ? service.icon : 'layers'
  const [flipped, setFlipped] = useState(false)

  const flip = useCallback(() => setFlipped((f) => !f), [])

  return (
    <div className={styles.flipContainer}>
      <div className={`${styles.flipper} ${flipped ? styles.flipped : ''}`}>
        {/* ── Front face ── */}
        <div className={`${styles.face} ${styles.front}`} onClick={flip}>
          <span className={styles.iconTile}>
            <Icon name={icon} size={32} className={styles.icon} aria-hidden="true" />
          </span>

          <h3 className={styles.title}>{service.title}</h3>
          <span className={styles.divider} aria-hidden="true" />

          <ul className={styles.features}>
            {service.features.map((feature) => (
              <li key={feature.id} className={styles.feature}>
                <Icon name="check" size={14} aria-hidden="true" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.footer} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              fullWidth
              to={`/services/${service.slug}`}
            >
              Learn more
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── Back face ── */}
        <div className={`${styles.face} ${styles.back}`} onClick={flip}>
          <h3 className={styles.title}>{service.title}</h3>
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.backBody}>{service.shortDescription}</p>

          <div className={styles.footer} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              fullWidth
              to={`/services/${service.slug}`}
            >
              Learn more
              <Icon name="arrow-right" size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
