import { HeroSection } from './sections/HeroSection'
import './styles/homepage-hero.css'
import { HowItWorks } from './sections/HowItWorks'
import './styles/homepage-process.css'
import { WritingShowcase } from './sections/WritingShowcase'
import './styles/homepage-writing.css'
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

// The complete source composition remains isolated from the published export.
// Publication requires full verification and explicit founder approval.
export function App() {
  const [currency, setCurrency] = usePreviewCurrency()
  // Only migrated, uniquely rendered targets can use local native anchors.
  const routes = previewRoutesForCurrency(currency, ['top', 'main-content', 'books', 'samples', 'how-it-works', 'resources', 'resources-activity', 'questions'])
  return <div className="sl-site" id="top">
    <a className="sl-skip-link" href={routes.mainContent}>{approvedCopy('shared.header.skip')}</a>
    <SiteHeader routes={routes} />
    <main id="main-content">
      <HeroSection booksHref={routes.books} samplesHref={routes.seeInside} />
      <ReassuranceBand />
      <BookDiscovery />
      <BookGallery><PhysicalBookPresentation /></BookGallery>
      <HowItWorks booksHref={routes.books} />
      <WritingShowcase />
      <GiftingSection />
      <ResourcesSection />
      <FaqSection booksHref={routes.books} />
    </main>
    <NewsletterFooter currency={currency} onCurrencyChange={setCurrency} routes={routes} />
  </div>
}
