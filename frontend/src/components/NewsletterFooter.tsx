import type { ChangeEvent } from 'react'
import { approvedCopy, verifiedHref } from '../content'
import { ResponsiveImage } from './ResponsiveImage'
import type { PublicSiteRoutes } from '../siteRoutes'

export type Currency = 'inr' | 'usd' | 'cad' | 'gbp'
export type FooterRoutes = PublicSiteRoutes

type Props = {
  routes: FooterRoutes
  currency: Currency
  onCurrencyChange: (currency: Currency) => void
}
const options: { value: Currency; label: string }[] = [
  {value:'inr',label:'INR · ₹'}, {value:'usd',label:'USD · US$'},
  {value:'cad',label:'CAD · C$'}, {value:'gbp',label:'GBP · £'},
]
const words = (id: string) => approvedCopy('shared.footer.' + id)
const outward = (id: string) => verifiedHref('shared.footer.' + id)

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
}

function Globe() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20"><circle cx="12" cy="12" r="8.5" /><ellipse cx="12" cy="12" rx="4" ry="8.5" /><path d="M4 9h16M4 15h16" /></svg>
}

function Chevron() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20"><path d="m8 4 8 8-8 8" /></svg>
}

/**
 * Source migration of the published shared photograph-to-forest ending.
 * The current newsletter is an editable input and an ordinary external link,
 * not a submission form. Route and currency state belong to the page shell.
 */
export function NewsletterFooter({routes,currency,onCurrencyChange}: Props) {
  const updateCurrency=(event: ChangeEvent<HTMLSelectElement>)=>{
    onCurrencyChange(event.target.value as Currency)
  }
  return <div className="sl-newsletter-footer">
    <section className="sl-newsletter" aria-labelledby="newsletter-title">
      <div className="sl-container sl-newsletter-layout">
        <div>
          <h2 id="newsletter-title">{approvedCopy('shared.newsletter.title.prefix')} <em>{approvedCopy('shared.newsletter.title.emphasis')}</em></h2>
          <p>{approvedCopy('shared.newsletter.description')}</p>
        </div>
        <div className="sl-newsletter-form-area">
          <div className="sl-newsletter-controls">
            <input type="email" aria-label={approvedCopy('shared.newsletter.email.label')} placeholder={approvedCopy('shared.newsletter.email.placeholder')} autoComplete="email" />
            <a className="sl-newsletter-subscribe" href={verifiedHref('shared.newsletter.subscribe')}>{approvedCopy('shared.newsletter.subscribe')} <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
    <footer className="sl-footer">
      <div className="sl-container">
        <div className="sl-footer-grid">
          <div className="sl-footer-brand">
            <a className="sl-footer-logo" href={routes.home} aria-label={approvedCopy('shared.header.home_label')}>
              <ResponsiveImage src="https://storileaf.com/logo.png" alt="StoriLeaf" width={500} height={125} sizes="(max-width:360px) 105px, (max-width:480px) 114px, (max-width:720px) 130px, 151px" />
            </a>
            <p>{words('brand.description')}</p>
            <label className="sl-footer-currency">
              <Globe />
              <span className="sl-footer-currency-label">{words('currency_label')}</span>
              <select value={currency} onChange={updateCurrency} aria-label="Pricing currency">
                {options.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
              <Chevron />
            </label>
          </div>
          <div className="sl-footer-column">
            <h3>{words('books.heading')}</h3>
            {(['life','travel','relationship','founder','letters','occasions'] as const).map(id=>
              <a href={outward('books.'+id)} key={id}>{words('books.'+id)}</a>)}
          </div>
          <div className="sl-footer-column">
            <h3>{words('explore.heading')}</h3>
            <a href={routes.seeInside}>{words('internal.see_inside')}</a>
            <a href={routes.howItWorks}>{words('internal.how_it_works')}</a>
            <a href={routes.pricing}>{words('internal.pricing')}</a>
            <a href={outward('gift')}>{words('gift')}</a>
            <a href={routes.resources}>{words('internal.resources')}</a>
            <a href={outward('blog')}>{words('blog')}</a>
            <a href={outward('about')}>{words('about')}</a>
          </div>
          <div className="sl-footer-column">
            <h3>{words('help.heading')}</h3>
            <a href={outward('contact')}>{words('contact')}</a>
            <a href={routes.questions}>{words('internal.questions')}</a>
            <a href={outward('shipping')}>{words('shipping')}</a>
            <a href={outward('login')}>{words('login')}</a>
          </div>
        </div>
        <div className="sl-footer-bottom">
          <span>{words('copyright')}</span>
          <div>
            <a href={outward('privacy')}>{words('privacy')}</a>
            <a href={outward('terms')}>{words('terms')}</a>
            <a href={outward('get_in_touch')}>{words('get_in_touch')}</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
}
