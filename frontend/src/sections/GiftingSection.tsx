import { ActionLink } from '../components/ActionLink'
import { Container, Section } from '../components/Layout'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { Heading, Text } from '../components/Typography'
import { approvedCopy, verifiedHref } from '../content'
import { editorialImage, editorialTitle } from './homepageEditorialContent'

export function GiftingSection() {
  const heading = editorialTitle('home.gifting.title')
  const photo = editorialImage('home.gifting.photo')

  return <Section id="gifting" className="sl-home-gifting" spacing="none" aria-labelledby="gift-title">
    <Container>
      <div className="sl-gift-panel">
        <div className="sl-gift-copy">
          <Heading id="gift-title" variant="compact">{heading.title} <em>{heading.emphasis}</em></Heading>
          <Text>{approvedCopy('home.gifting.description')}</Text>
          <ActionLink variant="gold" href={verifiedHref('home.gifting.cta')}>
            {approvedCopy('home.gifting.cta')}
          </ActionLink>
        </div>
        <div className="sl-gift-image">
          <ResponsiveImage
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 480px) calc(100vw - 42px), (max-width: 720px) calc(100vw - 66px), (max-width: 900px) calc((100vw - 66px) / 2), (max-width: 1280px) calc((100vw - 98px) * .53), 626.46px"
            objectPosition="52% 50%"
          />
        </div>
      </div>
    </Container>
  </Section>
}
