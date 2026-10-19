import { useState } from 'react'
import { NewsletterFooter, type Currency } from './components/NewsletterFooter'
import { SiteHeader } from './components/SiteHeader'
import { previewRoutesForCurrency } from './siteRoutes'
import { GiftingSection } from './sections/GiftingSection'
import { ResourcesSection } from './sections/ResourcesSection'
import { ReassuranceBand } from './sections/ReassuranceBand'
import { FaqSection } from './sections/FaqSection'
import './styles/homepage-editorial.css'
import './styles/homepage-questions.css'

// This is a source-driven component reference, NOT the full published homepage.
// Do not deploy this in place of the current GitHub Pages root until parity.
export function App() {
  const [currency, setCurrency] = useState<Currency>('inr')
  const routes = previewRoutesForCurrency(currency)
  return <div className="sl-site">
    <SiteHeader routes={routes} />
    <main id="main-content">
      {/* The hero precedes this band and book discovery follows it in the full homepage.
          Their later migrations fill those positions without placeholder sections. */}
      <ReassuranceBand />
      <GiftingSection />
      <ResourcesSection />
      <FaqSection />
    </main>
    <NewsletterFooter currency={currency} onCurrencyChange={setCurrency} routes={routes} />
  </div>
}
