import { useEffect, useRef } from 'react'
import writingContent from '../../content/writing.json'
import { Container } from '../components/Layout'
import { Heading, Text } from '../components/Typography'
import { approvedCopy } from '../content'
import { PracticeDialog } from './PracticeDialog'

function EditorScreen({ format }: { format: 'laptop' | 'tablet' | 'phone' }) {
  const logo = writingContent.assets[0]
  return <div className={'editor-screen editor-' + format}>
    <div className="editor-topbar"><img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" /><span className="editor-avatar">{approvedCopy('home.writing.editor.avatar')}</span></div>
    <div className="editor-layout">
      {format === 'laptop' && <div className="editor-sidebar">
        <strong>{approvedCopy('home.writing.editor.title')}</strong>
        <span className="screen-sidebar-label">{approvedCopy('home.writing.editor.chapters')}</span>
        <span className="screen-active-chapter">{approvedCopy('home.writing.editor.chapter.0')}</span>
        <span>{approvedCopy('home.writing.editor.chapter.1')}</span>
        <span>{approvedCopy('home.writing.editor.chapter.2')}</span>
        <span>{approvedCopy('home.writing.editor.chapter.3')}</span>
        <div className="screen-sidebar-bottom">{approvedCopy('home.writing.editor.aside')}</div>
      </div>}
      <div className="editor-main">
        <div className="screen-breadcrumb"><span>{approvedCopy('home.writing.editor.chapter.0')}</span><span className="screen-draft">{approvedCopy('home.writing.editor.draft')}</span></div>
        <h3>{approvedCopy('home.writing.question')}</h3>
        <p className="screen-helper">{approvedCopy('home.writing.helper')}</p>
        <div className="screen-answer">{approvedCopy('home.writing.editor.answer')}<span className="screen-cursor" /></div>
        <div className="screen-bottom"><span>{approvedCopy('home.writing.editor.reminder')}</span><span className="screen-next">{approvedCopy('home.writing.editor.continue')} <span>→</span></span></div>
      </div>
    </div>
  </div>
}

/** Preserves the published decorative device composition and mobile alternative.
 * Its one-time entrance is independent of the unsaved practice interaction. */
export function WritingShowcase() {
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !stage.current) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .12 })
    observer.observe(stage.current)
    return () => observer.disconnect()
  }, [])
  const title = approvedCopy('home.writing.title')
  const emphasis = writingContent.records[0].emphasis!
  return <section className="sl-writing-section devices-section" id="writing-space" aria-labelledby="devices-title">
    <Container>
      <div className="centred-section-heading editorial-device-heading">
        <Heading id="devices-title" variant="feature">{title.slice(0, -emphasis.length)}<em>{emphasis}</em></Heading>
        <Text className="section-lead">{approvedCopy('home.writing.intro')}</Text>
      </div>
      <div className="device-stage" aria-hidden="true" data-visual-entrance ref={stage}>
        <div className="device-floor" />
        <div className="device-laptop"><div className="laptop-display"><span className="device-camera" /><EditorScreen format="laptop" /></div><div className="laptop-base"><span /></div></div>
        <div className="device-tablet"><span className="device-camera" /><EditorScreen format="tablet" /></div>
        <div className="device-phone"><span className="phone-island" /><EditorScreen format="phone" /><span className="phone-home-bar" /></div>
      </div>
      <div className="mobile-workspace-preview"><h3>{approvedCopy('home.writing.question')}</h3><p>{approvedCopy('home.writing.helper')}</p></div>
      <div className="device-demo-action"><PracticeDialog /></div>
    </Container>
  </section>
}
