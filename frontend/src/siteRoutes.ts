/**
 * Explicit routing contract for current and future PUBLIC site pages.
 * No invented /books or /resources route is allowed until those pages exist.
 * Unmigrated destinations stay on the published preview. The page shell may
 * explicitly opt into local fragments only when their targets are rendered.
 */
export type PublicSiteRoutes = {
  home: string
  mainContent: string
  books: string
  seeInside: string
  howItWorks: string
  pricing: string
  resources: string
  resourcesActivity: string
  questions: string
  gift: string
  login: string
}

export const previewRoutes: PublicSiteRoutes = {
  home:'https://storileaf.github.io/storileaf-homepage-preview/#top',
  mainContent:'https://storileaf.github.io/storileaf-homepage-preview/#main-content',
  books:'https://storileaf.github.io/storileaf-homepage-preview/#books',
  seeInside:'https://storileaf.github.io/storileaf-homepage-preview/#samples',
  howItWorks:'https://storileaf.github.io/storileaf-homepage-preview/#how-it-works',
  pricing:'https://storileaf.github.io/storileaf-homepage-preview/pricing/inr',
  resources:'https://storileaf.github.io/storileaf-homepage-preview/#resources',
  resourcesActivity:'https://storileaf.github.io/storileaf-homepage-preview/#resources-activity',
  questions:'https://storileaf.github.io/storileaf-homepage-preview/#questions',
  gift:'https://storileaf.com/gift/',
  login:'https://app.storileaf.com/login',
}

const homepageAnchors = {
  top: 'home',
  'main-content': 'mainContent',
  books: 'books',
  samples: 'seeInside',
  'how-it-works': 'howItWorks',
  resources: 'resources',
  'resources-activity': 'resourcesActivity',
  questions: 'questions',
} as const
export type HomepageAnchor = keyof typeof homepageAnchors

/** Currency changes the shared Pricing links and clears any book query.
 * FAQ pricing actions retain their separately approved generic destination.
 */
export function previewRoutesForCurrency(currency:'inr'|'usd'|'cad'|'gbp', localAnchors: readonly HomepageAnchor[] = []): PublicSiteRoutes {
  const pricingByCurrency = {
    inr: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/inr',
    usd: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/usd',
    cad: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/cad',
    gbp: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/gbp',
  }
  const routes = {...previewRoutes, pricing:pricingByCurrency[currency]}
  for (const anchor of localAnchors) routes[homepageAnchors[anchor]] = '#' + anchor
  return routes
}
