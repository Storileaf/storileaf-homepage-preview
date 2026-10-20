import { useEffect, useRef, useState } from 'react'
import manifest from '../../content/media-images.json'
import { Container } from '../components/Layout'
import { Heading, Text } from '../components/Typography'
import { ActionLink } from '../components/ActionLink'
import { approvedCopy, verifiedHref } from '../content'
import { mediaTitle } from './homepageMediaContent'
import { useMediaReducedMotion } from './useMediaReducedMotion'

const details = [
  { copyId: 'home.craft.detail.0.heading', introId: 'home.craft.detail.0.description', paths: ['M12 7c-2.7-2.1-5.8-2.7-9-1.6V19c3.2-1 6.3-.4 9 1.8', 'M12 7c2.7-2.1 5.8-2.7 9-1.6V19c-3.2-1-6.3-.4-9 1.8', 'M12 7v13.8'] },
  { copyId: 'home.craft.detail.1.heading', introId: 'home.craft.detail.1.description', paths: ['m12 3 9 6-9 6-9-6 9-6Z', 'M3 14l9 6 9-6'] },
  { copyId: 'home.craft.detail.2.heading', introId: 'home.craft.detail.2.description', paths: ['M7 3h8l4 4v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M15 3v5h4', 'm8.5 15 2.4 2.3 4.6-4.8'] },
]

/** Reproduce the existing visible-only interval and reset it after manual selection. */
function CraftPhotoSlideshow() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const reduced = useMediaReducedMotion()
  useEffect(() => {
    const node = root.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(entries => setVisible(!!entries[0]?.isIntersecting), { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (reduced || !visible) return
    const timer = window.setInterval(() => setActive(current => (current + 1) % manifest.craftAssets.length), 6500)
    return () => window.clearInterval(timer)
  }, [active, reduced, visible])
  return <div className="sl-book-craft-image sl-book-craft-slideshow" ref={root} role="group" aria-label={approvedCopy('home.craft.slideshow')} data-active-slide={active}>
    {manifest.craftAssets.map((slide, index) => <img key={slide.id} className={'sl-book-craft-slide' + (index === active ? ' is-active' : '')} src={slide.src} alt={index === active ? slide.alt : ''} aria-hidden={index !== active} width={slide.width} height={slide.height} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />)}
    <div className="sl-book-craft-indicators" role="group" aria-label={approvedCopy('home.craft.indicators')}>
      {manifest.craftAssets.map((slide, index) => <button type="button" key={slide.id} className={'sl-book-craft-indicator' + (index === active ? ' is-active' : '')} aria-label={approvedCopy(slide.labelId)} aria-pressed={index === active} data-testid={'book-craft-slide-' + (index + 1)} onClick={() => setActive(index)}><span aria-hidden="true" /></button>)}
    </div>
  </div>
}

export function PhysicalBookPresentation() {
  const heading = mediaTitle('home.craft.title')
  return <Container className="sl-samples-frame sl-book-craft" aria-labelledby="book-craft-title">
    <CraftPhotoSlideshow />
    <div className="sl-book-craft-copy">
      <Heading as="h3" variant="feature" id="book-craft-title">{heading.title} <em>{heading.emphasis}</em></Heading>
      <Text>{approvedCopy('home.craft.intro')}</Text>
      <div className="sl-book-craft-details">
        {details.map(detail => <div className="sl-book-craft-detail" key={detail.copyId}>
          <div className="sl-book-craft-detail-heading">
            <span className="sl-book-craft-detail-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{detail.paths.map(d => <path key={d} d={d} />)}</svg></span>
            <Heading as="h4" variant="card">{approvedCopy(detail.copyId)}</Heading>
          </div>
          <Text className="sl-book-craft-detail-description">{approvedCopy(detail.introId)}</Text>
        </div>)}
      </div>
      <ActionLink href={verifiedHref('home.craft.cta')}>{approvedCopy('home.craft.cta')}</ActionLink>
    </div>
  </Container>
}
