import { PhysicalBookPresentation } from './sections/PhysicalBookPresentation'
import { NewsletterFooter } from './components/NewsletterFooter'
import { SiteHeader } from './components/SiteHeader'
import { previewRoutesForCurrency } from './siteRoutes'
import { usePreviewCurrency } from './usePreviewCurrency'
import { approvedCopy } from './content'
import { GiftingSection } from './sections/GiftingSection'
import { ResourcesSection } from './sections/ResourcesSection'
import { ReassuranceBand } from './sections/ReassuranceBand'
import { FaqSection } from './sections/FaqSection'
import { BookGallery } from './sections/BookGallery'
import './styles/homepage-media.css'
import './styles/homepage-craft.css'
import { BookDiscovery } from './sections/BookDiscovery'
import './styles/homepage-editorial.css'
import './styles/homepage-questions.css'
import './styles/homepage-discovery.css'

// This is a source-driven component reference, NOT the full published homepage.
// Do not deploy this in place of the current GitHub Pages root until parity.
export function App() {
  const [currency, setCurrency] = usePreviewCurrency()
  // Only migrated, uniquely rendered targets can use local native anchors.
  const routes = previewRoutesForCurrency(currency, ['top', 'main-content', 'books', 'samples', 'resources', 'resources-activity', 'questions'])
  return <div className="sl-site" id="top">
    <a className="sl-skip-link" href={routes.mainContent}>{approvedCopy('shared.header.skip')}</a>
    <SiteHeader routes={routes} />
    <main id="main-content">
      {/* The hero will precede this band when migrated; no placeholder section is inserted. */}
      <ReassuranceBand />
      <BookDiscovery />
      <BookGallery><PhysicalBookPresentation /></BookGallery>
      <GiftingSection />
      <ResourcesSection />
      <FaqSection booksHref={routes.books} />
    </main>
    <NewsletterFooter currency={currency} onCurrencyChange={setCurrency} routes={routes} />
  </div>
}
