import { useRef, useState } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { approvedCopy, verifiedHref } from '../content'
import type { PublicSiteRoutes } from '../siteRoutes'
import { ResponsiveImage } from './ResponsiveImage'

type Props = { routes: PublicSiteRoutes }
const bookKeys = ['life', 'travel', 'relationship', 'founder', 'letters', 'occasions'] as const
const copy = (id: string) => approvedCopy('shared.footer.' + id)
const href = (id: string) => verifiedHref('shared.footer.' + id)

function Icon({ name }: { name: 'arrow' | 'chevron' | 'close' | 'menu' }) {
  const paths = {
    arrow: 'M4 12h15M13 5l7 7-7 7',
    chevron: 'm8 4 8 8-8 8',
    close: 'm6 6 12 12M18 6 6 18',
    menu: 'M4 7h16M4 12h16M4 17h16',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}
function DropdownChevron() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
}

function HeaderNavigation({ routes }: Props) {
  return <NavigationMenu.Root className="sl-header-desktop-nav" delayDuration={170} skipDelayDuration={200} aria-label={approvedCopy('shared.header.main_navigation')}>
    <NavigationMenu.List className="sl-header-nav-list">
      <NavigationMenu.Item className="sl-header-dropdown" value="books">
        <NavigationMenu.Trigger className="sl-header-nav-trigger">{copy('books.heading')} <DropdownChevron /></NavigationMenu.Trigger>
        <NavigationMenu.Content className="sl-header-popup sl-header-books-menu" data-testid="books-dropdown">
          <div className="sl-books-menu-grid">
            {bookKeys.map(id => <NavigationMenu.Link asChild key={id}>
              <a className="sl-books-menu-item" href={href('books.' + id)}>
                <strong>{copy('books.' + id)}</strong>
                <span>{approvedCopy('shared.header.books.' + id + '.description')}</span>
              </a>
            </NavigationMenu.Link>)}
          </div>
          <div className="sl-books-menu-gift">
            <NavigationMenu.Link asChild><a href={routes.gift}>{copy('gift')} <Icon name="arrow" /></a></NavigationMenu.Link>
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item><NavigationMenu.Link asChild><a className="sl-header-simple-link" href={routes.seeInside}>{copy('internal.see_inside')}</a></NavigationMenu.Link></NavigationMenu.Item>
      <NavigationMenu.Item><NavigationMenu.Link asChild><a className="sl-header-simple-link" href={routes.howItWorks}>{copy('internal.how_it_works')}</a></NavigationMenu.Link></NavigationMenu.Item>
      <NavigationMenu.Item className="sl-header-dropdown" value="resources">
        <NavigationMenu.Trigger className="sl-header-nav-trigger">{copy('internal.resources')} <DropdownChevron /></NavigationMenu.Trigger>
        <NavigationMenu.Content className="sl-header-popup sl-resources-menu" data-testid="resources-dropdown">
          <NavigationMenu.Link asChild><a href={routes.resources}>{approvedCopy('shared.header.all_resources')} <Icon name="arrow" /></a></NavigationMenu.Link>
          <NavigationMenu.Link asChild><a href={routes.resourcesActivity}>{approvedCopy('shared.header.activities')} <Icon name="arrow" /></a></NavigationMenu.Link>
          <NavigationMenu.Link asChild><a href={href('blog')}>{copy('blog')} <Icon name="arrow" /></a></NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item><NavigationMenu.Link asChild><a className="sl-header-simple-link" href={routes.pricing}>{copy('internal.pricing')}</a></NavigationMenu.Link></NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
}

/** Published Radix navigation behaviour, with explicit route props for the source shell.
 * Homepage fragments are section destinations and never receive aria-current="page".
 */
export function SiteHeader({ routes }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const closeMenu = () => setMenuOpen(false)
  const restoreTriggerFocus = (event: Event) => {
    event.preventDefault()
    // Native hash scrolling can finish before Radix restores focus. Keep that
    // destination in place while returning keyboard focus to the menu trigger.
    menuTrigger.current?.focus({ preventScroll: true })
  }
  return <header className="sl-header">
    <div className="sl-header-inner">
      <a className="sl-header-logo" href={routes.home} aria-label={approvedCopy('shared.header.home_label')}>
        <ResponsiveImage src="https://storileaf.com/logo.png" width={500} height={125} sizes="(max-width:360px) 105px, (max-width:480px) 114px, (max-width:720px) 130px, 151px" alt="StoriLeaf" loading="eager" />
      </a>
      <HeaderNavigation routes={routes} />
      <div className="sl-header-actions">
        <a className="sl-header-login" href={routes.login}>{copy('login')}</a>
        <a className="sl-header-primary" href={routes.books}>{approvedCopy('shared.header.start')} <Icon name="arrow" /></a>
      </div>
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Trigger asChild>
          <button ref={menuTrigger} type="button" className="sl-header-mobile-trigger" aria-label={approvedCopy('shared.header.open')} data-testid="mobile-menu"><Icon name="menu" /></button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="sl-mobile-nav-overlay" />
          <Dialog.Content className="sl-mobile-nav-dialog" onCloseAutoFocus={restoreTriggerFocus}>
            <div className="sl-mobile-nav-title-row">
              <Dialog.Title><ResponsiveImage src="https://storileaf.com/logo.png" alt={approvedCopy('shared.header.navigation_alt')} width={164} height={41} sizes="145px" loading="eager" /></Dialog.Title>
              <Dialog.Close className="sl-mobile-nav-close" aria-label={approvedCopy('shared.header.close')}><Icon name="close" /></Dialog.Close>
            </div>
            <Dialog.Description className="sl-mobile-nav-description">{approvedCopy('shared.header.intro')}</Dialog.Description>
            <nav aria-label={approvedCopy('shared.header.mobile_navigation')}>
              <details className="sl-mobile-nav-disclosure">
                <summary>{copy('books.heading')} <Icon name="chevron" /></summary>
                <div className="sl-mobile-nav-submenu">
                  <a href={routes.books} onClick={closeMenu}>{approvedCopy('shared.header.explore_books')}</a>
                  {bookKeys.map(id => <a key={id} href={href('books.' + id)} onClick={closeMenu}>{copy('books.' + id)}</a>)}
                  <a className="sl-mobile-gift-entry" href={routes.gift} onClick={closeMenu}>{copy('gift')}</a>
                </div>
              </details>
              <a href={routes.seeInside} onClick={closeMenu}>{copy('internal.see_inside')} <Icon name="arrow" /></a>
              <a href={routes.howItWorks} onClick={closeMenu}>{copy('internal.how_it_works')} <Icon name="arrow" /></a>
              <details className="sl-mobile-nav-disclosure">
                <summary>{copy('internal.resources')} <Icon name="chevron" /></summary>
                <div className="sl-mobile-nav-submenu">
                  <a href={routes.resources} onClick={closeMenu}>{approvedCopy('shared.header.all_resources')}</a>
                  <a href={routes.resourcesActivity} onClick={closeMenu}>{approvedCopy('shared.header.activities')}</a>
                  <a href={href('blog')} onClick={closeMenu}>{copy('blog')}</a>
                </div>
              </details>
              <a href={routes.pricing} onClick={closeMenu}>{copy('internal.pricing')} <Icon name="arrow" /></a>
            </nav>
            <div className="sl-mobile-nav-actions">
              <a className="sl-mobile-primary" href={routes.books} onClick={closeMenu}>{approvedCopy('shared.header.start')} <Icon name="arrow" /></a>
              <a href={routes.login} onClick={closeMenu}>{approvedCopy('shared.header.login_long')}</a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  </header>
}
