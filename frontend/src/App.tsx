import { useState } from 'react'
import { NewsletterFooter, type Currency } from './components/NewsletterFooter'
import { SiteHeader } from './components/SiteHeader'
import { previewRoutes } from './siteRoutes'
import { EditorialHeading } from './components/EditorialHeading'
import { ResourceCategoryCard } from './components/ResourceCategoryCard'
import { ActionLink } from './components/ActionLink'
import { approvedCopy, verifiedHref } from './content'

// This is a source-driven component reference, NOT the full published homepage.
// Do not deploy this in place of the current GitHub Pages root until parity.
export function App() {
  const [currency,setCurrency]=useState<Currency>('inr')
  return <div className="sl-site"><SiteHeader routes={previewRoutes} /><main id="main-content"><section className="sl-reference-section" aria-labelledby="sl-resources-title"><div className="sl-container">
    <EditorialHeading id="sl-resources-title" title="A little curiosity" emphasis="can go a long way." introduction={approvedCopy('home.resources.intro')} />
    <div className="sl-resources-grid">
      <ResourceCategoryCard title={approvedCopy('home.resources.activities.title')} description={approvedCopy('home.resources.activities.description')} action={approvedCopy('home.resources.activities.cta')} href={verifiedHref('home.resources.activities.cta')} image="https://storileaf.com/images/brand/collections/life-story/life-story-family-sharing-memories-1200.webp" alt="An adult daughter and her father sharing memories over family photographs" imageWidth={1200} imageHeight={800} />
      <ResourceCategoryCard title={approvedCopy('home.resources.guides.title')} description={approvedCopy('home.resources.guides.description')} action={approvedCopy('home.resources.guides.cta')} href={verifiedHref('home.resources.guides.cta')} image="https://storileaf.com/images/brand/collections/relationship-memoir/storileaf-relationship-memoir-hands-photographs-cafe-square-800.webp" alt="Photographs on a café table beside two people's hands" imageWidth={800} imageHeight={800} />
    </div>
    <div className="sl-centred-action"><ActionLink>{approvedCopy('home.resources.all.cta')}</ActionLink></div>
  </div></section></main>
    <NewsletterFooter currency={currency} onCurrencyChange={setCurrency} routes={previewRoutes} />
  </div>
}
