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
  questions:'https://storileaf.github.io/storileaf-homepage-preview/#questions',
  gift:'https://storileaf.com/gift/',
  login:'https://app.storileaf.com/login',
}
