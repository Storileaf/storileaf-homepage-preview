import { ActionLink } from './ActionLink'

type Props = { title: string; description: string; image: string; alt: string; action: string; href?: string }

export function ResourceCategoryCard({title, description, image, alt, action, href}: Props) {
  return <article className="sl-resource-card">
    <div className="sl-resource-image"><img src={image} alt={alt} width={1200} height={800} loading="lazy" decoding="async" /></div>
    <div className="sl-resource-copy"><h3>{title}</h3><p>{description}</p><ActionLink href={href}>{action}</ActionLink></div>
  </article>
}
