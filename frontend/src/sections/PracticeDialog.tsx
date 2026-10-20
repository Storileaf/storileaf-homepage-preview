import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { approvedCopy } from '../content'

function PracticeIcon({ name }: { name: 'arrow' | 'close' | 'check' }) {
  const paths = { arrow: 'M4 12h15M13 5l7 7-7 7', close: 'm6 6 12 12M18 6 6 18', check: 'm5 12 4 4 10-10' }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}

/** Local, unsaved practice only. Every dismissal clears the controlled answer.
 * Radix retains the published modal focus, dismissal and scroll behaviour.
 * The privacy paragraph is referenced explicitly by both consumers. Using a
 * native paragraph avoids the installed Radix Description registering a second,
 * missing generated ID when its rendered ID is overridden (P4-05). */
export function PracticeDialog() {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0
  return <Dialog.Root open={open} onOpenChange={next => { setOpen(next); if (!next) setAnswer('') }}>
    <Dialog.Trigger asChild><button type="button" className="button button-outline" data-testid="try-question">{approvedCopy('home.writing.try')} <PracticeIcon name="arrow" /></button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="sl-practice-overlay" />
      <Dialog.Content className="sl-practice-dialog question-dialog" data-testid="question-dialog" aria-describedby="demo-privacy">
        <div className="dialog-topline"><Dialog.Close className="icon-button" aria-label={approvedCopy('home.writing.close_label')}><PracticeIcon name="close" /></Dialog.Close></div>
        <Dialog.Title>{approvedCopy('home.writing.question')}</Dialog.Title>
        <p id="demo-privacy">{approvedCopy('home.writing.privacy')}</p>
        <label className="demo-label" htmlFor="demo-answer">{approvedCopy('home.writing.answer_label')}</label>
        <textarea id="demo-answer" data-testid="demo-answer" aria-describedby="demo-privacy" value={answer} onChange={event => setAnswer(event.target.value)} maxLength={2000} rows={6} placeholder={approvedCopy('home.writing.placeholder')} />
        <div className="demo-answer-meta"><span>{wordCount} {wordCount === 1 ? approvedCopy('home.writing.word') : approvedCopy('home.writing.words')}</span><button type="button" className="subtle-button" onClick={() => setAnswer('')} disabled={!answer}>{approvedCopy('home.writing.clear')}</button></div>
        <Dialog.Close className="button">{approvedCopy('home.writing.close')} <PracticeIcon name="check" /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
