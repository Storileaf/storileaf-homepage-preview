import { Container, Section } from '../components/Layout'
import { approvedCopy } from '../content'
import { reassuranceItems, type ReassuranceIconName } from './homepageQuestionsContent'

function ReassuranceIcon({ name }: { name: ReassuranceIconName }) {
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {name === 'clock' && <><circle cx="12" cy="12" r="10" /><path d="M12 6v6h4" /></>}
    {name === 'book' && <><path d="M12 21V7" /><path d="m16 12 2 2 4-4" /><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" /></>}
    {name === 'card' && <><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></>}
  </svg>
}

/** Remains immediately after the hero and before discovery in the complete homepage. */
export function ReassuranceBand() {
  return <Section className="sl-home-reassurance" spacing="none" aria-label={approvedCopy('home.reassurance.label')}>
    <Container className="sl-trust-band-inner">
      {reassuranceItems.map(item => <div className="sl-trust-band-item" key={item.copyId}>
        <span className="sl-trust-icon"><ReassuranceIcon name={item.icon} /></span>
        <span>{approvedCopy(item.copyId)}</span>
      </div>)}
    </Container>
  </Section>
}
