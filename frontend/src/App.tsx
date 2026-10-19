import { useState } from 'react'
import { NewsletterFooter, type Currency } from './components/NewsletterFooter'
import { SiteHeader } from './components/SiteHeader'
import { previewRoutesForCurrency } from './siteRoutes'
import { GiftingSection } from './sections/GiftingSection'
import { ResourcesSection } from './sections/ResourcesSection'
import './styles/homepage-editorial.css'

// This is a source-driven component reference, NOT the full published homepage.
// Do not deploy this in place of the current GitHub Pages root until parity.
export function App() {
  const [currency, setCurrency] = useState<Currency>('inr')
  const routes = previewRoutesForCurrency(currency)
  return <div className="sl-site">
    <SiteHeader routes={routes} />
    <main id="main-content">
      <GiftingSection />
      <ResourcesSection />
    </main>
    <NewsletterFooter currency={currency} onCurrencyChange={setCurrency} routes={routes} />
  </div>
}
