import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const tokens=readFileSync(new URL('../src/styles/tokens.css',import.meta.url),'utf8') + readFileSync(new URL('../src/styles/foundations.css',import.meta.url),'utf8')
const styles=readFileSync(new URL('../src/styles/components.css',import.meta.url),'utf8')
const ledger=JSON.parse(readFileSync(new URL('../content/ledger.json',import.meta.url),'utf8'))

test('uses Newsreader and Manrope for public pages',()=>{
  assert.ok(tokens.includes('Newsreader'))
  assert.ok(tokens.includes('Manrope'))
})
test('retains approved colour and editorial width tokens',()=>{
  for(const token of ['#253526','#0c6753','#cca86b','#f9f8f6','1184px'])assert.ok(tokens.includes(token))
})
test('resource overview CTA remains centred',()=>{
  assert.ok(styles.includes('justify-content:center'))
  assert.equal(ledger.records.find(item=>item.id==='home.resources.all.cta')?.copy,'Browse all resources')
})
test('planned activity and overview destinations are not made-up URLs',()=>{
  for(const id of ['home.resources.activities.cta','home.resources.all.cta']){
    const record=ledger.records.find(item=>item.id===id)
    assert.equal(record?.destination_state,'unbuilt')
    assert.equal(record?.href,null)
  }
})

test('responsive editorial images require dimensions and default to lazy loading',()=>{
  const source=readFileSync(new URL('../src/components/ResponsiveImage.tsx',import.meta.url),'utf8')
  assert.ok(source.includes('width: number'))
  assert.ok(source.includes('height: number'))
  assert.ok(source.includes("loading = 'lazy'"))
  assert.ok(source.includes('sizes={sizes}'))
})
test('resource cards use one whole-card link only for existing pages',()=>{
  const source=readFileSync(new URL('../src/components/ResourceCategoryCard.tsx',import.meta.url),'utf8')
  assert.ok(source.includes('href={href}>{content}</a>'))
  assert.ok(source.includes('<div className="sl-resource-link">{content}</div>'))
  assert.ok(!source.includes('<button'))
})
test('font loading is explicit in the source preview',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8')
  assert.ok(html.includes('fonts.googleapis.com/css2'))
  assert.ok(html.includes('family=Newsreader:'))
  assert.ok(html.includes('family=Manrope:'))
})

test('shared newsletter and footer use one photo field with verified CTAs',()=>{
  const source=readFileSync(new URL('../src/components/NewsletterFooter.tsx',import.meta.url),'utf8')
  const styles=readFileSync(new URL('../src/styles/components.css',import.meta.url),'utf8')
  assert.ok(source.includes('className="sl-newsletter-footer"'))
  assert.ok(source.includes("verifiedHref('shared.newsletter.subscribe')"))
  assert.ok(source.includes('routes: FooterRoutes'))
  assert.ok(styles.includes('.sl-newsletter-footer::before'))
  assert.ok(styles.includes('.sl-newsletter-footer::after'))
})

test('source header has hover, keyboard Escape and a native mobile dialog',()=>{
  const file=readFileSync(new URL('../src/components/SiteHeader.tsx',import.meta.url),'utf8')
  assert.ok(file.includes("onMouseEnter={()=>setOpenMenu('books')}"))
  assert.ok(file.includes("event.key==='Escape'"))
  assert.ok(file.includes('showModal()'))
  assert.ok(file.includes('onClose={drawerClosed}'))
  assert.ok(!file.includes('aria-current="page"'))
})
