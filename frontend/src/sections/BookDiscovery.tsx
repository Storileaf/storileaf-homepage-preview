import { useEffect, useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { ActionLink } from '../components/ActionLink'
import { Container, Section } from '../components/Layout'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { Heading, Text } from '../components/Typography'
import { approvedCopy, verifiedHref } from '../content'
import { homepageDiscoveryBooks } from './homepageDiscoveryContent'
import { editorialImage, editorialTitle } from './homepageEditorialContent'

/** Keep the published motion preference lifecycle, including live preference changes. */
function useDiscoveryReducedMotion() {
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  return reduced
}

export function BookDiscovery() {
  const [selected, setSelected] = useState('life-story')
  const tabRail = useRef<HTMLDivElement>(null)
  const reduced = useDiscoveryReducedMotion()
  const heading = editorialTitle('home.discovery.title')

  function changeBook(slug: string) {
    setSelected(slug)
    const reveal = () => {
      Array.from(tabRail.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])
        .find(tab => tab.getAttribute('data-state') === 'active')
        ?.scrollIntoView?.({ behavior: reduced ? 'instant' : 'smooth', block: 'nearest', inline: 'nearest' })
    }
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(reveal)
    else window.setTimeout(reveal, 0)
  }

  return <Section id="books" className="sl-book-discovery" spacing="none" aria-labelledby="books-title">
    <Container>
      <div className="sl-discovery-heading">
        <Heading id="books-title" className="sl-discovery-title" variant="feature">
          {heading.title} <em>{heading.emphasis}</em>
        </Heading>
        <Text className="sl-discovery-description">{approvedCopy('home.discovery.description')}</Text>
      </div>
      <Tabs.Root className="sl-book-discovery-tabs" value={selected} onValueChange={changeBook} data-slot="tabs" data-testid="books-grid">
        <div className="sl-book-tabs-scroll" ref={tabRail} aria-label={approvedCopy('home.discovery.label')}>
          <Tabs.List className="sl-book-tabs-list" loop data-slot="tabs-list" data-variant="line">
            {homepageDiscoveryBooks.map(book => <Tabs.Trigger
              key={book.slug}
              value={book.slug}
              className="sl-book-tab-trigger"
              data-slot="tabs-trigger"
              data-testid={'book-' + book.slug}
            >{approvedCopy(book.labelId)}</Tabs.Trigger>)}
          </Tabs.List>
        </div>
        {homepageDiscoveryBooks.map(book => {
          const image = editorialImage(book.imageId)
          return <Tabs.Content key={book.slug} value={book.slug} className="sl-book-detail-stage" data-slot="tabs-content" data-testid="book-detail-stage">
            <div className="sl-book-detail-copy">
              <Text className="sl-book-detail-intro">{approvedCopy(book.introId)}</Text>
              <ul className="sl-book-detail-points">
                {book.pointIds.map(pointId => <li key={pointId}>{approvedCopy(pointId)}</li>)}
              </ul>
              <ActionLink variant="primary" href={verifiedHref(book.labelId)}>{approvedCopy('home.discovery.cta')}</ActionLink>
            </div>
            <div className="sl-book-detail-visual">
              <ResponsiveImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                objectPosition={image.object_position}
                sizes="(max-width: 480px) calc(100vw - 42px), (max-width: 720px) calc(100vw - 66px), (max-width: 900px) calc(55vw - 36.3px), (max-width: 1280px) calc(56vw - 54.88px), 662px"
              />
            </div>
          </Tabs.Content>
        })}
      </Tabs.Root>
    </Container>
  </Section>
}
