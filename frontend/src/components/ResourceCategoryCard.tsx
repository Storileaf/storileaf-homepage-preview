import { ResponsiveImage } from './ResponsiveImage'

type Props = {
  title: string
  description: string
  image: string
  alt: string
  imageWidth: number
  imageHeight: number
  action: string
  href?: string
}

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
}

/**
 * The entire card links only when the destination is verified.
 * Planned pages retain the visual treatment without invented or inert links.
 * A clickable card never contains a second link or button.
 */
export function ResourceCategoryCard({ title, description, image, alt, imageWidth, imageHeight, action, href }: Props) {
  const content = <>
    <div className="sl-resource-image">
      <ResponsiveImage
        src={image}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1280px) 46vw, 577px"
      />
    </div>
    <div className="sl-resource-copy">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="sl-action sl-action--text">{action}<Arrow /></span>
    </div>
  </>

  return <article className="sl-resource-card">
    {href
      ? <a className="sl-resource-link" href={href}>{content}</a>
      : <div className="sl-resource-link">{content}</div>}
  </article>
}
