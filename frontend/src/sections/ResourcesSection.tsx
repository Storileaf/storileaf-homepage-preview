import { ActionLink } from '../components/ActionLink'
import { EditorialHeading } from '../components/EditorialHeading'
import { Container, Section } from '../components/Layout'
import { ResourceCategoryCard } from '../components/ResourceCategoryCard'
import { approvedCopy, verifiedHref } from '../content'
import { editorialImage, editorialTitle } from './homepageEditorialContent'

export function ResourcesSection() {
  const heading = editorialTitle('home.resources.title')
  const activities = editorialImage('home.resources.activities.photo')
  const guides = editorialImage('home.resources.guides.photo')

  return <Section id="resources" className="sl-home-resources" spacing="none" aria-labelledby="resources-title">
    <Container>
      <EditorialHeading
        id="resources-title"
        title={heading.title}
        emphasis={heading.emphasis}
        introduction={approvedCopy('home.resources.intro')}
      />
      <div className="sl-resources-grid">
        <ResourceCategoryCard
          id="resources-activity"
          title={approvedCopy('home.resources.activities.title')}
          description={approvedCopy('home.resources.activities.description')}
          action={approvedCopy('home.resources.activities.cta')}
          href={verifiedHref('home.resources.activities.cta')}
          image={activities.src}
          alt={activities.alt}
          imageWidth={activities.width}
          imageHeight={activities.height}
        />
        <ResourceCategoryCard
          title={approvedCopy('home.resources.guides.title')}
          description={approvedCopy('home.resources.guides.description')}
          action={approvedCopy('home.resources.guides.cta')}
          href={verifiedHref('home.resources.guides.cta')}
          image={guides.src}
          alt={guides.alt}
          imageWidth={guides.width}
          imageHeight={guides.height}
        />
      </div>
      <div className="sl-centred-action">
        <ActionLink>{approvedCopy('home.resources.all.cta')}</ActionLink>
      </div>
    </Container>
  </Section>
}
