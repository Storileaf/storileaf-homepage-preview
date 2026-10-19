import { ActionLink } from '../components/ActionLink'
import { Container, Section } from '../components/Layout'
import { Heading, Text } from '../components/Typography'
import { approvedCopy, verifiedHref } from '../content'
import { editorialTitle } from './homepageEditorialContent'
import { FinalInvitation } from './FinalInvitation'
import { homepageQuestions } from './homepageQuestionsContent'

function DisclosureIcon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14" />
  </svg>
}

export function FaqSection({ booksHref }: { booksHref?: string } = {}) {
  const heading = editorialTitle('home.faq.title')

  return <Section id="questions" className="sl-home-faq" spacing="none" aria-labelledby="faq-title">
    <Container>
      <div className="sl-faq-grid">
        <div className="sl-faq-intro">
          <Heading id="faq-title" variant="feature">{heading.title} <em>{heading.emphasis}</em></Heading>
          <ActionLink href={verifiedHref('home.faq.cta')}>{approvedCopy('home.faq.cta')}</ActionLink>
        </div>
        <div className="sl-faq-list">
          {homepageQuestions.map(question => <details className="sl-faq-item" data-testid={question.id} key={question.id}>
            <summary><span>{approvedCopy(question.questionId)}</span><DisclosureIcon /></summary>
            <div className="sl-faq-answer">
              <Text>{approvedCopy(question.answerId)}</Text>
              {question.actionId && <ActionLink href={verifiedHref(question.actionId)}>{approvedCopy(question.actionId)}</ActionLink>}
            </div>
          </details>)}
        </div>
      </div>
      <FinalInvitation booksHref={booksHref} />
    </Container>
  </Section>
}
