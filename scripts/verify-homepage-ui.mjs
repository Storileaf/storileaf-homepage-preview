import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const base = 'http://127.0.0.1:4173/storileaf-homepage-preview/'
const folder = 'qa/screenshots'
await fs.mkdir(folder, { recursive: true })
const problems = []
const observations = {}
function check(ok, message) { if (!ok) problems.push(message) }
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
const desktop = await context.newPage()
desktop.on('pageerror', e => problems.push('Browser error: ' + e.message))
try {
  await desktop.goto(base, { waitUntil: 'domcontentloaded' })
  await desktop.waitForTimeout(1300)
  observations.title = await desktop.title()
  check(await desktop.getByRole('heading', { name: /The stories of your life/i }).count() > 0, 'Homepage hero absent')
  const steps = desktop.locator('.process-steps li')
  const heights = await steps.evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().height)))
  observations.desktopStepHeights = heights
  check(heights.length === 4 && heights.every(h => h >= 120 && h <= 200), 'Desktop process steps not condensed')
  observations.processVisualPosition = await desktop.locator('.process-visual').evaluate(el => getComputedStyle(el).position)
  check(observations.processVisualPosition === 'sticky', 'Sticky process photograph missing on desktop')
  check(await desktop.getByRole('link', { name: /Choose a book/i }).count() >= 1, 'Choose a book CTA missing')
  check(await desktop.getByRole('link', { name: /Explore gifting/i }).count() >= 1, 'Explore gifting CTA missing')
  check((await desktop.locator('.process-bottom-actions a').first().getAttribute('href'))?.includes('#books'), 'Temporary Choose a book destination broken')
  check((await desktop.locator('.process-bottom-actions a').nth(1).getAttribute('href'))?.includes('/gift/'), 'Gifting destination broken')
  check(await desktop.locator('.newsletter-inline-preview input:disabled').count() === 1, 'Newsletter email field should be visibly disabled')
  check((await desktop.locator('.newsletter-inline-preview a').getAttribute('href')) === 'https://storileaf.com/#newsletter-heading', 'Newsletter link incorrect')

  for (let i = 0; i < 4; i++) {
    await desktop.locator('.process-step').nth(i).click()
    await desktop.waitForTimeout(130)
    check((await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index')) === String(i), 'Process step '+(i+1)+' click failed')
  }
  await desktop.locator('.process-step').first().click()
  const number = await desktop.locator('.process-steps li.is-active .step-number').evaluate(el => {
    const s = getComputedStyle(el)
    return { color:s.color, background:s.backgroundColor }
  })
  observations.activeNumber = number
  check(number.color === 'rgb(255, 255, 255)', 'Active step number contrast failed')
  await desktop.locator('#how-it-works').scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(200)
  await desktop.locator('#how-it-works').screenshot({ path:path.join(folder,'process-desktop.png'), animations:'disabled' })
  const scrollStages = []
  for (let i = 0; i < 4; i++) {
    await desktop.evaluate(index => {
      const el = document.querySelectorAll('.process-step')[index]
      const r = el.getBoundingClientRect()
      window.scrollTo({ top: Math.max(0,scrollY + r.top + r.height * .38 - innerHeight * .41), behavior:'instant' })
    }, i)
    await desktop.waitForTimeout(250)
    scrollStages.push(await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index'))
  }
  observations.desktopScrollStages = scrollStages
  check(scrollStages.join(',') === '0,1,2,3', 'Scroll activation is not following all four steps')
  await desktop.screenshot({ path:path.join(folder,'process-stage-four-desktop.png'), animations:'disabled' })
  await desktop.locator('.newsletter-strip').scrollIntoViewIfNeeded()
  await desktop.locator('.newsletter-strip').screenshot({ path:path.join(folder,'newsletter-desktop.png'), animations:'disabled' })
  const booksTrigger = desktop.getByRole('button', {name:'The books', exact:true}).first()
  await booksTrigger.hover()
  await desktop.waitForTimeout(320)
  observations.bookMenuVisible = await desktop.locator('.books-dropdown').first().isVisible()
  check(observations.bookMenuVisible, 'Desktop Books hover dropdown not visible')
  if(observations.bookMenuVisible) await desktop.screenshot({ path:path.join(folder,'books-menu-desktop.png'), animations:'disabled' })

  const widths=[320,360,390,430,768,820,1024,1280,1440]
  for(const width of widths) {
    await desktop.setViewportSize({width,height:900})
    await desktop.waitForTimeout(90)
    const dimensions=await desktop.evaluate(()=>({vw:innerWidth,doc:document.documentElement.scrollWidth}))
    check(dimensions.doc <= dimensions.vw + 1, 'Document horizontal overflow at '+width+'px')
  }
  observations.checkedWidths = widths

  await desktop.setViewportSize({ width:390, height:844 })
  await desktop.goto(base,{waitUntil:'domcontentloaded'})
  await desktop.waitForTimeout(1100)
  await desktop.locator('#how-it-works').scrollIntoViewIfNeeded()
  await desktop.locator('#how-it-works').screenshot({ path:path.join(folder,'process-mobile.png'), animations:'disabled' })
  await desktop.locator('.newsletter-strip').scrollIntoViewIfNeeded()
  await desktop.locator('.newsletter-strip').screenshot({ path:path.join(folder,'newsletter-mobile.png'), animations:'disabled' })
  const mobileMenu=desktop.getByRole('button',{name:/Open navigation/i}).first()
  if(await mobileMenu.count()) {
    await mobileMenu.click()
    await desktop.waitForTimeout(150)
    await desktop.screenshot({path:path.join(folder,'mobile-menu.png'),animations:'disabled'})
  } else problems.push('Mobile navigation trigger missing')

  const reduced = await browser.newContext({ viewport: { width: 1440,height:900 }, reducedMotion:'reduce' })
  const reducedPage=await reduced.newPage()
  await reducedPage.goto(base,{waitUntil:'domcontentloaded'})
  observations.prefersReducedMotion=await reducedPage.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
  check(observations.prefersReducedMotion, 'Reduced motion context not applied')
  await reduced.close()
} catch (error) {
  problems.push('Test execution error: '+String(error))
} finally {
  await fs.mkdir('qa',{recursive:true})
  await fs.writeFile('qa/homepage-qa-report.json',JSON.stringify({date:new Date().toISOString(),commit:process.env.GITHUB_SHA||'',observations,problems},null,2)+'\n')
  await browser.close()
}
console.log(JSON.stringify({observations,problems},null,2))
if(problems.length) process.exitCode=1
