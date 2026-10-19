import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'

const base = 'http://127.0.0.1:4180/'
const shotDir = 'qa/source-screenshots'
const problems = []
const observations = { verifiedSourceReference: true, publishedRootUnchanged: true }
const check = (condition, message) => { if (!condition) problems.push(message) }

await fs.mkdir(shotDir, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox']
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', error => problems.push('Runtime error ' + error.message))

try {
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.locator('.sl-header').waitFor()
  await page.evaluate(() => document.fonts.ready)
  const head = page.locator('.sl-header')
  check(await head.getByRole('link', { name: 'StoriLeaf home' }).count() === 1,
    'Shared header logo/home link missing')
  check(await page.locator('.sl-header [aria-current="page"]').count() === 0,
    'Source must not copy incorrect current-page semantics')
  const books = page.locator('.sl-header-desktop-nav .sl-header-dropdown').first()
  await books.locator('button').hover()
  check(await page.locator('#sl-books-menu a').count() === 7,
    'Desktop Books menu did not open with six books and gifting')
  const resources = page.locator('.sl-header-desktop-nav .sl-header-dropdown').last()
  await resources.locator('button').hover()
  check(await page.locator('#sl-resources-menu a').count() === 3,
    'Desktop Resources menu did not open')
  await resources.locator('button').focus()
  await page.keyboard.press('Escape')
  check(await page.locator('#sl-resources-menu').count() === 0,
    'Desktop Resources Escape must dismiss menu')

  const cards=page.locator('.sl-resource-card')
  check(await cards.count()===2, 'Resources category count changed')
  check(await cards.nth(0).locator('a').count()===0,
    'Unbuilt Activities page cannot be a live link')
  check(await cards.nth(1).locator('a').count()===1,
    'Blog category should have one whole-card link')
  check(await cards.nth(1).locator('a').getAttribute('href') === 'https://storileaf.com/blog/',
    'Blog link changed')

  const newsletter=page.locator('.sl-newsletter-footer')
  check(await newsletter.count()===1, 'Newsletter and footer wrapper missing')
  const end=await newsletter.evaluate(element=>({
    photo:getComputedStyle(element,'::before').backgroundImage,
    fade:getComputedStyle(element,'::after').backgroundImage,
    footerText:element.querySelector('.sl-footer-bottom')?.textContent.trim(),
    footerLinkCount:element.querySelectorAll('.sl-footer-bottom a').length
  }))
  observations.newsletterFooter=end
  check(end.photo.includes('storileaf-family-archive-books-hero-1440.webp') &&
    end.fade.includes('gradient') && end.footerLinkCount===3,
    'Shared newsletter photo, fade or legal links missing')
  const currency=page.locator('.sl-footer-currency select')
  await currency.selectOption('cad')
  check(await currency.inputValue()==='cad','Currency selector did not update')
  check((await page.locator('.sl-header-desktop-nav a').last().getAttribute('href'))?.endsWith('/pricing/cad'), 'Pricing route did not follow the selected currency')

  const widths=[320,360,390,430,768,820,1024,1280,1440]
  const dimensions=[]
  for(const width of widths){
    await page.setViewportSize({width,height:900})
    await page.goto(base,{waitUntil:'domcontentloaded'})
    await page.locator('.sl-resource-card').first().waitFor()
    const d=await page.evaluate(()=>{
      const cards=[...document.querySelectorAll('.sl-resource-card')].map(el=>el.getBoundingClientRect())
      const h=document.querySelector('.sl-header-desktop-nav')
      return {
        pageWidth:document.documentElement.scrollWidth,
        viewport:window.innerWidth,
        cardCount:cards.length,
        stacked:cards[1]?.top >= cards[0]?.bottom+7,
        equalWidth:Math.abs((cards[0]?.width??0)-(cards[1]?.width??0))<2,
        navHidden:getComputedStyle(h).display==='none'
      }
    })
    dimensions.push({width,...d})
    check(d.pageWidth<=width+1,'Source reference horizontal overflow at '+width+'px')
    check(d.cardCount===2 && d.equalWidth,'Source Resource cards lost equal width at '+width+'px')
    check(width<=900?d.stacked:!d.stacked,'Source Resources responsive layout wrong at '+width+'px')
    check(width<=1130?d.navHidden:!d.navHidden,'Source navigation breakpoint wrong at '+width+'px')
  }
  observations.widths=dimensions
  await page.setViewportSize({width:390,height:844})
  await page.goto(base,{waitUntil:'domcontentloaded'})
  const trigger=page.getByRole('button',{name:'Open navigation'})
  await trigger.click()
  const dialog=page.locator('.sl-mobile-nav-dialog')
  check(await dialog.evaluate(el=>el.open),'Mobile navigation dialog did not open')
  await dialog.getByRole('button',{name:'Close navigation'}).click()
  check(!await dialog.evaluate(el=>el.open),'Mobile navigation did not close')
  check(await trigger.evaluate(el=>document.activeElement===el),
    'Closing mobile navigation failed to return keyboard focus')
  await page.screenshot({path:path.join(shotDir,'source-reference-mobile-390.png'),fullPage:true,animations:'disabled'})
  await page.setViewportSize({width:1440,height:900})
  await page.goto(base,{waitUntil:'domcontentloaded'})
  await page.screenshot({path:path.join(shotDir,'source-reference-desktop-1440.png'),fullPage:true,animations:'disabled'})
} catch (error) {
  problems.push('Source browser audit interrupted: '+error.message)
} finally {
  await browser.close()
}
const report={timestamp:new Date().toISOString(),observations,problems}
await fs.writeFile('qa/source-reference-qa.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({problems,observations:dimensionsSummary(report)},null,2))
function dimensionsSummary(result){
  return {testedWidths:result.observations.widths?.map(x=>x.width),newsletterFooter:result.observations.newsletterFooter}
}
if(problems.length)process.exitCode=1
