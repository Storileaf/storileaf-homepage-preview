import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import hero from '../../content/hero.json'
import { ActionLink } from '../components/ActionLink'
import { Container } from '../components/Layout'
import { Heading, Text } from '../components/Typography'
import { approvedCopy } from '../content'
import { useMediaReducedMotion } from './useMediaReducedMotion'
import { useProgressionTextFit } from './useProgressionTextFit'

type HeroStyle = CSSProperties & { '--tile-angle'?: string; '--slide-direction'?: number }

/** Decorative covers counter rotate within the two published orbit tracks. */
function HeroCoverOrbits({ paused }: { paused: boolean }) {
  return <div className="hero-orbit-layer" data-orbits-paused={paused} aria-hidden="true">
    <div className="hero-orbit-stage">
      {(['inner', 'outer'] as const).map(ring => <div className={'hero-orbit-ring hero-orbit-' + ring} key={ring}>
        {hero.orbits[ring].map(({ angle, cover_index }) => {
          const cover = hero.covers[cover_index]
          return <span className="hero-orbit-position" style={{ '--tile-angle': angle + 'deg' } as HeroStyle} key={angle}>
            <span className={'hero-orbit-face orbit-shade-' + cover_index}>
              <img className="hero-orbit-square" src={import.meta.env.BASE_URL + cover.src.replace(/^\//, '')} alt="" width={cover.width} height={cover.height} loading="eager" decoding="async" fetchPriority="low" />
            </span>
          </span>
        })}
      </div>)}
    </div>
  </div>
}

function Chevron({ previous = false }: { previous?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={previous ? 'm16 4-8 8 8 8' : 'm8 4 8 8-8 8'} /></svg>
}

/** Reconstruct the published hero without changing its independent motion states. */
export function HeroSection({ booksHref, samplesHref }: { booksHref: string; samplesHref: string }) {
  const progressionRef = useProgressionTextFit()
  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const [tickerHeld, setTickerHeld] = useState(false)
  const [tickerHover, setTickerHover] = useState(false)
  const [tickerFocus, setTickerFocus] = useState(false)
  const [slidesHover, setSlidesHover] = useState(false)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const reduced = useMediaReducedMotion()
  const root = useRef<HTMLElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const paused = reduced || !visible || !pageVisible
  const tickerPlaying = !paused && !tickerHeld && !tickerHover && !tickerFocus

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .04 })
      : null
    if (root.current) observer?.observe(root.current)
    return () => {
      document.removeEventListener('visibilitychange', update)
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setPrevious(null), reduced ? 0 : 690)
    return () => window.clearTimeout(timer)
  }, [active, reduced])

  // Manual selection does not restart this interval. Hover/focus and visibility do.
  useEffect(() => {
    if (paused || slidesHover) return
    const timer = window.setInterval(() => {
      setDirection(1)
      setActive(current => {
        setPrevious(current)
        return (current + 1) % hero.photos.length
      })
    }, 7600)
    return () => window.clearInterval(timer)
  }, [paused, slidesHover])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new Image()
      next.src = hero.photos[(active + 1) % hero.photos.length].src
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [active])

  function goTo(next: number, way: number) {
    if (next === active) return
    setDirection(way)
    setPrevious(active)
    setActive((next + hero.photos.length) % hero.photos.length)
  }

  function touchEnd(event: PointerEvent<HTMLDivElement>) {
    if (!touch.current) return
    const dx = event.clientX - touch.current.x
    const dy = event.clientY - touch.current.y
    if (Math.abs(dx) > 50 && Math.abs(dy) < Math.abs(dx) / 2) {
      goTo(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
    }
    touch.current = null
  }

  const toggleTicker = () => setTickerHeld(value => !value)
  const scene = hero.photos[active]
  const emphasis = hero.records.find(record => record.id === 'home.hero.title')?.emphasis ?? ''
  const title = approvedCopy('home.hero.title').slice(0, -emphasis.length).trimEnd()

  return <section ref={root} className="hero" aria-labelledby="hero-title" data-playing={!paused} data-marquee-playing={tickerPlaying} data-orbit-paused={paused}>
    <HeroCoverOrbits paused={paused} />
    <div className="hero-orbit-fade" aria-hidden="true" />
    <Container className="hero-intro">
      <Heading as="h1" variant="hero" id="hero-title">{title}<em>{emphasis}</em></Heading>
      <div className="hero-progression" ref={progressionRef} aria-label={approvedCopy('home.hero.progression.label')}>
        {hero.progression.map((step, index) => <Fragment key={step.number}>
          {index > 0 && <i aria-hidden="true">→</i>}
          <span><b>{step.number}</b>{' '}{approvedCopy(step.copy_id)}</span>
        </Fragment>)}
      </div>
    </Container>
    <div className="hero-window" role="region" aria-roledescription="carousel" aria-label={approvedCopy('home.hero.carousel.label')}
      onMouseEnter={() => setSlidesHover(true)} onMouseLeave={() => setSlidesHover(false)}
      onFocusCapture={() => setSlidesHover(true)} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setSlidesHover(false)
      }}>
      <div className="hero-image-frame" style={{ '--slide-direction': direction } as HeroStyle}
        onPointerDown={event => {
          if (event.pointerType === 'touch') touch.current = { x: event.clientX, y: event.clientY }
        }} onPointerUp={touchEnd} onPointerCancel={() => { touch.current = null }}>
        {previous !== null && !reduced && <img key={'previous-' + previous + '-' + active}
          className="hero-photo hero-photo-previous" src={hero.photos[previous].src} alt="" aria-hidden="true"
          style={{ objectPosition: hero.photos[previous].object_position }} width="1400" height="650" />}
        <img key={'current-' + active} data-testid="hero-image" data-slide={active}
          className={'hero-photo' + (previous !== null ? ' hero-photo-enter' : '')} src={scene.src} alt={scene.alt}
          style={{ objectPosition: scene.object_position }} width={scene.width} height={scene.height} fetchPriority={active === 0 ? 'high' : 'auto'} />
        <span className="hero-sr-only" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">{scene.label}</span>
        <div className="hero-image-controls">
          <div className="hero-image-dots" aria-label={approvedCopy('home.hero.carousel.choose')}>
            {hero.photos.map((photo, index) => <button type="button" key={photo.id} className={'hero-dot' + (index === active ? ' is-active' : '')}
              aria-label={approvedCopy('home.hero.carousel.show.' + index)} aria-current={index === active ? 'true' : undefined}
              onClick={() => goTo(index, index > active ? 1 : -1)}><span /></button>)}
          </div>
          <div className="hero-image-buttons">
            <button type="button" className="icon-button carousel-control" aria-label={approvedCopy('home.hero.carousel.previous')} data-testid="hero-previous" onClick={() => goTo(active - 1, -1)}><Chevron previous /></button>
            <button type="button" className="icon-button carousel-control" aria-label={approvedCopy('home.hero.carousel.next')} data-testid="hero-next" onClick={() => goTo(active + 1, 1)}><Chevron /></button>
          </div>
        </div>
      </div>
    </div>
    <Container className="hero-outro">
      <Text className="hero-description">{approvedCopy('home.hero.description')}</Text>
      <div className="hero-actions">
        <ActionLink href={booksHref} variant="primary" data-testid="explore-books">{approvedCopy('home.hero.explore')}</ActionLink>
        <ActionLink href={samplesHref} variant="outline" arrow={false}>{approvedCopy('home.hero.samples')}</ActionLink>
      </div>
    </Container>
    <div className="hero-marquee" onMouseEnter={() => setTickerHover(true)} onMouseLeave={() => setTickerHover(false)}
      onFocus={() => setTickerFocus(true)} onBlur={() => setTickerFocus(false)} onClick={toggleTicker}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleTicker() } }}
      tabIndex={0} role="button" aria-pressed={tickerHeld} aria-label={approvedCopy(tickerHeld ? 'home.hero.ticker.resume' : 'home.hero.ticker.pause')}>
      <div className="hero-marquee-viewport" aria-hidden="true">
        <div className="hero-marquee-track">
          {[0, 1].map(copy => <div className="hero-marquee-group" key={copy}>
            {hero.ticker.map(id => <span key={id}>{approvedCopy(id)}<i>✦</i></span>)}
          </div>)}
        </div>
      </div>
    </div>
  </section>
}
