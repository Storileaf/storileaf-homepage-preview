import { useEffect, useRef, useState } from 'react'
import processContent from '../../content/process.json'
import { Container } from '../components/Layout'
import { Heading } from '../components/Typography'
import { ActionLink } from '../components/ActionLink'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { approvedCopy, verifiedHref } from '../content'
import { processMotionQuery, processStageAt, processStageScrollTop } from './processProgress'

/** Faithful public Process reconstruction. Manual selection remains available
 * on narrow/short screens and with reduced motion. No scroll hijacking. */
export function HowItWorks({ booksHref }: { booksHref?: string }) {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLElement>(null)
  const scrollFrame = useRef<number | null>(null)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(processMotionQuery)
    function measure() {
      if (!media.matches || !root.current) return
      const frame = root.current.getBoundingClientRect()
      if (frame.top > window.innerHeight * .7 || frame.bottom < window.innerHeight * .35) return
      const next = processStageAt(frame.top)
      setActive(current => current === next ? current : next)
    }
    function schedule() {
      if (scrollFrame.current !== null) return
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = null
        measure()
      })
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', schedule)
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = null
    }
  }, [])
  function select(stage: number) {
    setActive(stage)
    if (typeof window.matchMedia === 'function' && window.matchMedia(processMotionQuery).matches && root.current) {
      const top = window.scrollY + root.current.getBoundingClientRect().top
      window.scrollTo({ top: processStageScrollTop(top, stage), behavior: 'instant' })
    }
  }
  const visual = processContent.assets[active]
  const title = approvedCopy('home.process.title')
  const emphasis = processContent.records[0].emphasis!
  return <section className="sl-process-section" id="how-it-works" aria-labelledby="process-title" ref={root}>
    <Container className="sl-process-grid">
      <div className="sl-process-copy">
        <Heading variant="feature" id="process-title">{title.slice(0, -emphasis.length)}<strong>{emphasis}</strong></Heading>
        <ol className="sl-process-steps">
          {processContent.assets.map((asset, index) => <li key={asset.id} className={active === index ? 'is-active' : ''} data-step-index={index}>
            <button type="button" className="sl-process-step" aria-pressed={active === index} aria-controls="process-visual" data-testid={'process-step-' + (index + 1)} onClick={() => select(index)}>
              <span className="sl-step-number">0{index + 1}</span>
              <span className="sl-step-text"><strong>{approvedCopy('home.process.step.' + index + '.title')}</strong><span>{approvedCopy('home.process.step.' + index + '.description')}</span></span>
            </button>
          </li>)}
        </ol>
        <div className="sl-process-bottom-actions">
          <ActionLink variant="primary" href={booksHref ?? verifiedHref('home.process.choose')}>{approvedCopy('home.process.choose')}</ActionLink>
          <ActionLink variant="outline" href={verifiedHref('home.process.gift')}>{approvedCopy('home.process.gift')}</ActionLink>
        </div>
      </div>
      <div className="sl-process-visual" id="process-visual">
        <ResponsiveImage key={visual.src} className="sl-process-photo" src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes="(max-width: 900px) calc(100vw - 40px), 50vw" />
      </div>
    </Container>
  </section>
}
