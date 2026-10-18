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
  check(heights.length === 4 && heights.every(h => h >= 85 && h <= 108), 'Desktop process steps not condensed')
  const desktopSectionLayout = await desktop.locator('.process-grid').evaluate(el => ({
    copyDisplay: getComputedStyle(el.querySelector('.process-copy')).display,
    photoRow: getComputedStyle(el.querySelector('.process-visual')).gridRowStart,
    firstBorder: getComputedStyle(el.querySelector('.process-steps li:first-child')).borderTopWidth,
    lastBorder: getComputedStyle(el.querySelector('.process-steps li:last-child')).borderBottomWidth,
    middleBorder: getComputedStyle(el.querySelector('.process-steps li:nth-child(2)')).borderBottomWidth
  }))
  observations.processLayout = desktopSectionLayout
  check(desktopSectionLayout.copyDisplay === 'contents' && desktopSectionLayout.photoRow === '2', 'Photograph does not align with the list rows')
  check(desktopSectionLayout.firstBorder === '0px' && desktopSectionLayout.lastBorder === '0px', 'Unwanted first or last divider')
  check(desktopSectionLayout.middleBorder !== '0px', 'Internal divider was removed')
    observations.processGridPosition = await desktop.locator('.process-grid').evaluate(el => getComputedStyle(el).position)
  check(observations.processGridPosition === 'sticky', 'Sticky process grid missing')
  observations.processRunwayHeight = await desktop.locator('.process-section').evaluate(el =>
    Math.round(el.getBoundingClientRect().height - el.querySelector('.process-grid').getBoundingClientRect().height))
  check(observations.processRunwayHeight >= 450, 'Independent scroll runway missing')
  check(await desktop.getByRole('link', { name: /Choose a book/i }).count() >= 1, 'Choose a book CTA missing')
  check(await desktop.getByRole('link', { name: /Explore gifting/i }).count() >= 1, 'Explore gifting CTA missing')
  check((await desktop.locator('.process-bottom-actions a').first().getAttribute('href'))?.includes('#books'), 'Temporary Choose a book destination broken')
  check((await desktop.locator('.process-bottom-actions a').nth(1).getAttribute('href'))?.includes('/gift/'), 'Gifting destination broken')
  check(await desktop.locator('.final-invitation h2').innerText() === 'Let’s find your book.', 'Missing FAQ CTA heading')
  check(await desktop.locator('.final-invitation-intro').innerText() === 'One question is enough to begin.', 'Missing original FAQ CTA line')
  check((await desktop.locator('.final-invitation a').getAttribute('href'))?.includes('#books'), 'Restored CTA target incorrect')
  check(await desktop.evaluate(() => Boolean(document.querySelector('.final-invitation').compareDocumentPosition(document.querySelector('.newsletter-strip')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'CTA must be before newsletter')
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
  const photoChanges = []
  const pinnedTopPositions = []
  for (let i = 0; i < 4; i++) {
    await desktop.evaluate(index => {
      const rect = document.querySelector('.process-section').getBoundingClientRect()
      window.scrollTo({ top: Math.max(0, scrollY + rect.top - 20 + index * 112 + 6), behavior:'instant' })
    }, i)
    await desktop.waitForTimeout(220)
    scrollStages.push(await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index'))
    photoChanges.push(await desktop.locator('.process-photo').getAttribute('src'))
    pinnedTopPositions.push(await desktop.locator('.process-grid').evaluate(el => Math.round(el.getBoundingClientRect().top)))
  }
  observations.desktopScrollStages = scrollStages
  check(scrollStages.join(',') === '0,1,2,3', 'Independent scroll activation failed')
  check(new Set(photoChanges).size === 4, 'All four process photographs must change')
  observations.processPinnedTopPositions = pinnedTopPositions
  check(Math.max(...pinnedTopPositions) - Math.min(...pinnedTopPositions) <= 2, 'The compact stages should remain pinned while the photos advance')
  const pinnedGeometry = await desktop.evaluate(() => {
    const bounds = s => { const r = document.querySelector(s).getBoundingClientRect(); return { top:r.top, bottom:r.bottom, height:r.height } }
    return { header:bounds('.site-header'), title:bounds('.process-copy h2'),
      first:bounds('.process-steps li:first-child'), last:bounds('.process-steps li:last-child'),
      photo:bounds('.process-visual'), grid:bounds('.process-grid'), actions:bounds('.process-bottom-actions') }
  })
  observations.desktopPinnedGeometry = pinnedGeometry
  check(pinnedGeometry.title.top >= pinnedGeometry.header.bottom + 20, 'Heading still touches or hides behind header')
  check(pinnedGeometry.grid.top >= 120 && pinnedGeometry.grid.top <= 175, 'The process does not pin at a comfortable viewport height')
  check(Math.abs(pinnedGeometry.photo.top - pinnedGeometry.first.top) <= 5, 'Photograph top does not align with first step')
  check(pinnedGeometry.photo.bottom >= pinnedGeometry.last.bottom, 'Photograph does not cover the four-step group')
  check(pinnedGeometry.photo.bottom <= pinnedGeometry.actions.bottom + 10, 'Photograph extends beyond the bottom actions')
  await desktop.screenshot({ path:path.join(folder,'process-stage-four-desktop.png'), animations:'disabled' })
  const reverseStages = []
  for (let i = 3; i >= 0; i--) {
    await desktop.evaluate(index => {
      const rect = document.querySelector('.process-section').getBoundingClientRect()
      window.scrollTo({ top: Math.max(0, scrollY + rect.top - 20 + index * 112 + 6), behavior:'instant' })
    }, i)
    await desktop.waitForTimeout(160)
    reverseStages.push(await desktop.locator('.process-steps li.is-active').getAttribute('data-step-index'))
  }
  observations.reverseScrollStages = reverseStages
  check(reverseStages.join(',') === '3,2,1,0', 'Reverse scrolling through stages failed')
  await desktop.locator('.final-invitation').scrollIntoViewIfNeeded()
  await desktop.locator('.faq-section').screenshot({ path:path.join(folder,'faq-final-invitation-desktop.png'), animations:'disabled' })
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
  check(await desktop.locator('.process-copy').evaluate(el => getComputedStyle(el).display) !== 'contents', 'Mobile should retain normal process reading order')
  await desktop.locator('#how-it-works').screenshot({ path:path.join(folder,'process-mobile.png'), animations:'disabled' })
  await desktop.locator('.final-invitation').scrollIntoViewIfNeeded()
  await desktop.locator('.final-invitation').screenshot({ path:path.join(folder,'faq-final-invitation-mobile.png'), animations:'disabled' })
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
