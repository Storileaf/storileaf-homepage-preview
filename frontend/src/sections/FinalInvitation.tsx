import { ActionLink } from '../components/ActionLink'
import { Heading, Text } from '../components/Typography'
import { approvedCopy, verifiedHref } from '../content'

/** This invitation belongs beneath the disclosures in the published FAQ section. */
export function FinalInvitation() {
  return <div className="sl-final-invitation">
    <div>
      <Text className="sl-final-invitation-intro">{approvedCopy('home.invitation.intro')}</Text>
      <Heading variant="compact">{approvedCopy('home.invitation.title')}</Heading>
    </div>
    <ActionLink variant="primary" href={verifiedHref('home.invitation.cta')}>
      {approvedCopy('home.invitation.cta')}
    </ActionLink>
  </div>
}
