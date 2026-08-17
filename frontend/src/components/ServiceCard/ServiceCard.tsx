import { Badge } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Card } from '../Card/Card'
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
 */
export function ServiceCard({ service }: { service: Service }) {
  const icon: IconName = isIconName(service.icon) ? service.icon : 'layers'

  return (
    <Card padding="lg" className={styles.card}>
      <span className={styles.iconTile}>
        <Icon name={icon} size={24} aria-hidden="true" />
      </span>

      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.body}>{service.shortDescription}</p>

      <ul className={styles.features}>
        {service.features.map((feature) => (
          <li key={feature.id} className={styles.feature}>
            <Icon name="check" size={14} aria-hidden="true" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        {service.startingFrom ? (
          <Badge variant="light">{service.startingFrom}</Badge>
        ) : (
          <span aria-hidden="true" />
        )}
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" to={`/services/${service.slug}`}>
            Learn more
            <Icon name="arrow-right" size={16} aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="sm" to="/contact">
            Start a project
          </Button>
        </div>
      </div>
    </Card>
  )
}
