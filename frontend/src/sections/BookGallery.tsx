import { useRef, useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Container, Section } from '../components/Layout'
import { Heading, Text } from '../components/Typography'
import { approvedCopy } from '../content'
import { galleryImages, gallerySrc, mediaTitle } from './homepageMediaContent'
import { useMediaReducedMotion } from './useMediaReducedMotion'

function GalleryIcon({ name }: { name: 'previous' | 'next' | 'close' }) {
  const paths = { previous: 'M20 12H5M11 5l-7 7 7 7', next: 'M4 12h15M13 5l7 7-7 7', close: 'm6 6 12 12M18 6 6 18' }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}

/** Gallery and physical presentation share the original section, without another wrapper. */
export function BookGallery({ children }: { children?: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null)
  const lastTrigger = useRef<HTMLButtonElement>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const [position, setPosition] = useState(0)
  const [openedIndex, setOpenedIndex] = useState<number | null>(null)
  const reduced = useMediaReducedMotion()
  const active = openedIndex === null ? null : galleryImages[openedIndex]
  const heading = mediaTitle('home.gallery.title')
  function move(next: number) {
    const root = rail.current
    if (!root) return
    const bounded = Math.max(0, Math.min(galleryImages.length - 1, next))
    const card = root.children[bounded] as HTMLElement | undefined
    if (card) root.scrollTo({ left: card.offsetLeft - root.offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
  }
  function updatePosition() {
    const root = rail.current
    if (!root) return
    const first = root.children[0] as HTMLElement | undefined
    const second = root.children[1] as HTMLElement | undefined
    const interval = first && second ? second.offsetLeft - first.offsetLeft : 1
    const atEnd = root.scrollLeft >= root.scrollWidth - root.clientWidth - 5
    setPosition(atEnd ? galleryImages.length - 1 : Math.min(galleryImages.length - 1, Math.round(root.scrollLeft / interval)))
  }
  function changeLightbox(delta: number) {
    setOpenedIndex(current => current === null ? null : Math.max(0, Math.min(galleryImages.length - 1, current + delta)))
  }
  return <Section id="samples" className="sl-samples-section" spacing="none" aria-labelledby="samples-title">
    <Container className="sl-samples-frame">
      <div className="sl-samples-heading">
        <div><Heading id="samples-title" variant="feature">{heading.title} <em>{heading.emphasis}</em></Heading><Text className="sl-section-lead">{approvedCopy('home.gallery.intro')}</Text></div>
        <div className="sl-gallery-controls">
          <button type="button" className="sl-media-icon-button" aria-label={approvedCopy('home.gallery.previous')} onClick={() => move(position - 1)} disabled={position === 0}><GalleryIcon name="previous" /></button>
          <button type="button" className="sl-media-icon-button" aria-label={approvedCopy('home.gallery.next')} data-testid="sample-next" onClick={() => move(position + 1)} disabled={position === galleryImages.length - 1}><GalleryIcon name="next" /></button>
        </div>
      </div>
    </Container>
    <div className="sl-sample-rail-outer">
      <div className="sl-sample-rail" ref={rail} tabIndex={0} role="region" aria-label={approvedCopy('home.gallery.rail')} data-testid="sample-rail" onScroll={updatePosition} onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowRight') { event.preventDefault(); move(position + 1) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(position - 1) }
      }}>
        {galleryImages.map((sample, index) => <article className={'sl-sample-card sl-sample-card-' + sample.id} key={sample.id}>
          <button type="button" className="sl-sample-open" aria-label={approvedCopy(sample.openId)} data-testid={'sample-' + sample.id} onClick={event => { lastTrigger.current = event.currentTarget; setOpenedIndex(index) }}>
            <span className="sl-sample-photo-frame"><img src={gallerySrc(sample.file)} alt={sample.alt} width={sample.width} height={sample.height} loading="lazy" decoding="async" /></span>
            <span className="sl-sample-card-caption"><strong>{approvedCopy(sample.nameId)}</strong></span>
          </button>
        </article>)}
      </div>
    </div>
    {children}
    <Dialog.Root open={openedIndex !== null} onOpenChange={open => { if (!open) setOpenedIndex(null) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="sl-sample-lightbox-overlay" />
        <Dialog.Content className="sl-sample-lightbox" onCloseAutoFocus={event => { event.preventDefault(); lastTrigger.current?.focus() }} onKeyDown={event => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); changeLightbox(-1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); changeLightbox(1) }
        }}>
          {active && <>
            <div className="sl-sample-lightbox-topline">
              <Dialog.Title className="sl-sample-lightbox-title">{approvedCopy(active.nameId)}</Dialog.Title>
              <Dialog.Close className="sl-media-icon-button sl-sample-lightbox-close" aria-label={approvedCopy('home.gallery.close')}><GalleryIcon name="close" /></Dialog.Close>
            </div>
            <Dialog.Description className="sl-sample-lightbox-description">{approvedCopy('home.gallery.instructions')}</Dialog.Description>
            <div className="sl-sample-lightbox-stage" onTouchStart={event => {
              if (event.touches.length === 1) swipeStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
            }} onTouchEnd={event => {
              const start = swipeStart.current; swipeStart.current = null
              if (!start || event.changedTouches.length === 0) return
              const dx = event.changedTouches[0].clientX - start.x, dy = event.changedTouches[0].clientY - start.y
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) changeLightbox(dx < 0 ? 1 : -1)
            }}>
              <button type="button" className="sl-sample-lightbox-arrow" aria-label={approvedCopy('home.gallery.previous-book')} onClick={() => changeLightbox(-1)} disabled={openedIndex === 0}><GalleryIcon name="previous" /></button>
              <img key={active.id} className="sl-sample-lightbox-image" src={gallerySrc(active.file)} alt={active.alt} width={active.width} height={active.height} draggable={false} decoding="async" />
              <button type="button" className="sl-sample-lightbox-arrow" aria-label={approvedCopy('home.gallery.next-book')} onClick={() => changeLightbox(1)} disabled={openedIndex === galleryImages.length - 1}><GalleryIcon name="next" /></button>
            </div>
          </>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </Section>
}
