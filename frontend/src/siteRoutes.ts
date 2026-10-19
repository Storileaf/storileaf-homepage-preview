/**
 * Explicit routing contract for current and future PUBLIC site pages.
 * No invented /books or /resources route is allowed until those pages exist.
 * The isolated reference links to the already published homepage anchors.
 */
export type PublicSiteRoutes = {
  home: string
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

/** Currency follows the site-wide selector. Each URL remains explicit. */
export function previewRoutesForCurrency(currency:'inr'|'usd'|'cad'|'gbp'): PublicSiteRoutes {
  const pricingByCurrency = {
    inr: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/inr',
    usd: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/usd',
    cad: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/cad',
    gbp: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/gbp',
  }
  return {...previewRoutes, pricing:pricingByCurrency[currency]}
}
