import { useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import { approvedCopy, verifiedHref } from '../content'
import type { PublicSiteRoutes } from '../siteRoutes'
import { ResponsiveImage } from './ResponsiveImage'

type MenuName = 'books' | 'resources'
type Props = { routes: PublicSiteRoutes }

const copy = (id:string) => approvedCopy('shared.footer.' + id)
const href = (id:string) => verifiedHref('shared.footer.' + id)

function Chevron() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 9 6 6 6-6" /></svg>
}
function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
}

/**
 * Source-only reference to the approved public header. The current published
 * Radix header is the behavioural and visual baseline until explicit parity.
 * A native dialog handles mobile focus; desktop hover is accompanied by
 * click, focus and Escape for keyboard and touch alternatives.
 */
export function SiteHeader({ routes }: Props) {
  const [openMenu,setOpenMenu]=useState<MenuName|null>(null)
  const drawer=useRef<HTMLDialogElement>(null)
  const drawerTrigger=useRef<HTMLButtonElement>(null)
  const toggle=(name:MenuName)=>setOpenMenu(current=>current===name?null:name)
  const handleEscape=(event:KeyboardEvent<HTMLElement>)=>{
    if(event.key==='Escape'){ setOpenMenu(null) }
  }
  const loseFocus=(event:FocusEvent<HTMLElement>)=>{
    if(!event.currentTarget.contains(event.relatedTarget as Node|null)) setOpenMenu(null)
  }
  const openDrawer=()=>drawer.current?.showModal()
  const closeDrawer=()=>drawer.current?.close()
  const drawerClosed=()=>drawerTrigger.current?.focus()

  return <>
    <header className="sl-header">
      <div className="sl-header-inner">
        <a className="sl-header-logo" href={routes.home} aria-label="StoriLeaf home">
          <ResponsiveImage src="https://storileaf.com/logo.png" width={500} height={125} sizes="(max-width:480px) 114px, 151px" alt="StoriLeaf" loading="eager" />
        </a>
        <nav className="sl-header-desktop-nav" aria-label="Main navigation" onKeyDown={handleEscape} onBlurCapture={loseFocus}>
          <div className="sl-header-dropdown" onMouseEnter={()=>setOpenMenu('books')} onMouseLeave={()=>setOpenMenu(null)}>
            <button type="button" aria-expanded={openMenu==='books'} aria-controls="sl-books-menu" onClick={()=>toggle('books')}>{copy('books.heading')} <Chevron /></button>
            {openMenu==='books' && <div id="sl-books-menu" className="sl-header-popup sl-header-books-menu">
              {(['life','travel','relationship','founder','letters','occasions'] as const).map(id=><a key={id} href={href('books.'+id)}>{copy('books.'+id)}</a>)}
              <a className="sl-header-books-gift" href={routes.gift}>{copy('gift')}</a>
            </div>}
          </div>
          <a href={routes.seeInside}>{copy('internal.see_inside')}</a>
          <a href={routes.howItWorks}>{copy('internal.how_it_works')}</a>
          <div className="sl-header-dropdown" onMouseEnter={()=>setOpenMenu('resources')} onMouseLeave={()=>setOpenMenu(null)}>
            <button type="button" aria-expanded={openMenu==='resources'} aria-controls="sl-resources-menu" onClick={()=>toggle('resources')}>{copy('internal.resources')} <Chevron /></button>
            {openMenu==='resources' && <div id="sl-resources-menu" className="sl-header-popup">
              <a href={routes.resources}>All resources <Arrow /></a>
              <a href={routes.resources+'-activity'}>Activities and games <Arrow /></a>
              <a href={href('blog')}>{copy('blog')} <Arrow /></a>
            </div>}
          </div>
          <a href={routes.pricing}>{copy('internal.pricing')}</a>
        </nav>
        <div className="sl-header-actions">
          <a href={routes.login}>{copy('login')}</a>
          <a className="sl-header-primary" href={routes.books}>{approvedCopy('shared.header.start')} <Arrow /></a>
        </div>
        <button type="button" className="sl-header-mobile-trigger" onClick={openDrawer} ref={drawerTrigger} aria-label={approvedCopy('shared.header.open')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" width="22" height="22"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
      </div>
    </header>
    <dialog className="sl-mobile-nav-dialog" ref={drawer} onClose={drawerClosed} aria-label="Mobile navigation">
      <div className="sl-mobile-nav-top">
        <span className="sl-mobile-nav-title">{copy('books.heading')}</span>
        <button type="button" onClick={closeDrawer} aria-label={approvedCopy('shared.header.close')}>×</button>
      </div>
      <nav aria-label="Mobile main navigation">
        <a href={routes.books} onClick={closeDrawer}>{approvedCopy('shared.header.start')}</a>
        {(['life','travel','relationship','founder','letters','occasions'] as const).map(id=><a key={id} href={href('books.'+id)} onClick={closeDrawer}>{copy('books.'+id)}</a>)}
        <a href={routes.gift} onClick={closeDrawer}>{copy('gift')}</a>
        <a href={routes.seeInside} onClick={closeDrawer}>{copy('internal.see_inside')}</a>
        <a href={routes.howItWorks} onClick={closeDrawer}>{copy('internal.how_it_works')}</a>
        <a href={routes.resources} onClick={closeDrawer}>{copy('internal.resources')}</a>
        <a href={href('blog')} onClick={closeDrawer}>{copy('blog')}</a>
        <a href={routes.pricing} onClick={closeDrawer}>{copy('internal.pricing')}</a>
        <a href={routes.login} onClick={closeDrawer}>{copy('login')}</a>
      </nav>
    </dialog>
  </>
}
