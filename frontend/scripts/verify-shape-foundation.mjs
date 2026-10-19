import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import http from 'node:http'

// Read-only browser evidence. Neither source builds nor reports replace the Pages root.
const root = path.resolve('..')
const baseline = '1433a413917a63df47e05f5c2d39283689624f37'
const sourceBaseline = 'a80e7dfd0b5fa18acdfabe34c54ab75492e026da'
const out = 'qa/shape-foundation'
const problems = []
const report = { baseline, sourceBaseline, scope: 'Two authorised source corrections; published root unchanged', staticReferences: [], browser: [], problems }
const check = (ok, message) => { if (!ok) problems.push(message) }
const vendorPattern = /macaly|qcx8qibycrjhsu3gv7vr1spg/i
await fs.mkdir(out, { recursive: true })
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
const files = git(['ls-files', '-z']).split('\0').filter(Boolean)
const runtimeFiles = files.filter(f => /^(index\.html|404\.html|assets\/|pricing\/|frontend\/src\/|frontend\/index\.html|frontend\/package(?:-lock)?\.json|frontend\/vite\.config\.ts)/.test(f) && /\.(html|css|js|mjs|ts|tsx|json)$/.test(f))
report.scannedFiles = runtimeFiles.length
for (const file of runtimeFiles) {
  const text = await fs.readFile(path.join(root, file), 'utf8')
  const at = text.search(vendorPattern)
  if (at >= 0) report.staticReferences.push({ file, excerpt: text.slice(Math.max(0, at - 100), at + 180) })
}

// Temporary package guard. A future authorised styling package must deliberately update it.
const original = git(['show', sourceBaseline + ':frontend/src/styles/components.css'])
const oldFocus = '.sl-resource-link:focus-visible { outline:3px solid var(--sl-teal); outline-offset:-5px; border-radius:var(--sl-radius-card); }'
const newFocus = '.sl-resource-link:focus-visible { outline:3px solid var(--sl-teal); outline-offset:-5px; border-radius:inherit; }'
check(original.split(oldFocus).length === 2, 'Focus baseline must contain one exact reviewed rule')
check(original.split('min-height:43px;').length === 2, 'Mobile action baseline must contain one 43px rule')
const expected = original.replace(oldFocus, newFocus).replace('min-height:43px;', 'min-height:45px;')
check(expected.trimEnd() === (await fs.readFile('src/styles/components.css', 'utf8')).trimEnd(), 'Changes exceed the two authorised source corrections')
check(git(['show', sourceBaseline + ':frontend/src/styles/tokens.css']).trimEnd() === (await fs.readFile('src/styles/tokens.css', 'utf8')).trimEnd(), 'Radius unification has not been approved; retain existing tokens')

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' }
const tracked = new Set(files)
const server = http.createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/storileaf-homepage-preview\/?/, '').replace(/^\/+/, '') || 'index.html'
    if (!tracked.has(rel) && tracked.has(rel.replace(/\/$/, '') + '/index.html')) rel = rel.replace(/\/$/, '') + '/index.html'
    if (!tracked.has(rel)) { res.writeHead(404); res.end('Not found'); return }
    res.writeHead(200, { 'Content-Type': mime[path.extname(rel)] || 'application/octet-stream' })
    res.end(await fs.readFile(path.join(root, rel)))
  } catch { res.writeHead(500); res.end('Read failed') }
})
await new Promise(resolve => server.listen(4181, '127.0.0.1', resolve))
let browser
const widths = [320, 360, 390, 430, 768, 820, 1024, 1280, 1440]
const sourceSelectors = ['.sl-header', '.sl-header-primary', '.sl-newsletter-controls input', '.sl-newsletter-subscribe', '.sl-resource-card', '.sl-footer-currency']
const measure = (page, selectors) => page.evaluate(list => Object.fromEntries(list.map(selector => {
  const el = document.querySelector(selector)
  if (!el) return [selector, null]
  const s = getComputedStyle(el), r = el.getBoundingClientRect()
  return [selector, { radius: s.borderTopLeftRadius, width: r.width, height: r.height, fontSize: s.fontSize, lineHeight: s.lineHeight, display: s.display, background: s.backgroundColor, colour: s.color }]
})), selectors)
const focusMeasure = locator => locator.evaluate(el => ({ radius: getComputedStyle(el).borderTopLeftRadius, parentRadius: getComputedStyle(el.parentElement).borderTopLeftRadius, visible: el.matches(':focus-visible'), outline: getComputedStyle(el).outlineWidth, offset: getComputedStyle(el).outlineOffset }))

async function auditStates(page) {
  // Test-only markup probes ActionLink CSS variants. It is never committed as public copy.
  await page.evaluate(() => {
    const section = document.createElement('section')
    section.id = 'shape-probes'
    section.style.cssText = 'padding:60px;background:#f9f8f6;display:flex;gap:30px;'
    for (const variant of ['primary', 'outline', 'gold', 'text']) {
      const a = document.createElement('a')
      a.href = '#shape-probes'; a.className = 'sl-action sl-action--' + variant; a.textContent = 'Review action'
      a.addEventListener('click', event => event.preventDefault()); section.append(a)
    }
    document.body.append(section)
  })
  const result = {}
  const selectors = ['.sl-header-primary', '.sl-newsletter-subscribe', ...['primary', 'outline', 'gold', 'text'].map(v => '#shape-probes .sl-action--' + v)]
  for (const selector of selectors) {
    const el = page.locator(selector).first()
    await el.scrollIntoViewIfNeeded()
    await page.evaluate(() => document.activeElement?.blur())
    await page.mouse.move(0, 0)
    const read = () => el.evaluate(node => {
      const s = getComputedStyle(node), r = node.getBoundingClientRect()
      return { radius: s.borderTopLeftRadius, background: s.backgroundColor, colour: s.color, outline: s.outlineWidth, outlineColour: s.outlineColor, focusVisible: node.matches(':focus-visible'), width: r.width, height: r.height, transform: s.transform }
    })
    const normal = await read()
    await el.hover(); const hover = await read()
    await page.mouse.down(); const pressed = await read()
    await page.mouse.move(0, 0); await page.mouse.up()
    const focusable = await el.evaluate(node => node.tabIndex >= 0)
    let focus = null
    if (focusable) { await page.keyboard.press('Tab'); await el.focus(); focus = await read(); check(focus.focusVisible && focus.outline !== '0px', 'Missing keyboard focus in ' + selector) }
    result[selector] = { normal, hover, pressed, focus, disabled: 'No disabled ActionLink API; do not simulate approval', loading: 'No asynchronous ActionLink API; not applicable to static links' }
  }
  await page.locator('#shape-probes').evaluate(el => el.remove())
  return result
}

try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const kind of ['source', 'published']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' })
    const page = await context.newPage()
    const result = { kind, blockedVendorRequests: [], requestHosts: [], runtimeErrors: [], widths: [], missingImages: [], tabCount: 0 }
    const hosts = new Set()
    await context.route('**/*', route => {
      const url = route.request().url(), host = new URL(url).hostname
      hosts.add(host)
      if (vendorPattern.test(host) || url.includes('qcx8qibycrjhsu3gv7vr1spg')) { result.blockedVendorRequests.push(url); return route.abort() }
      return route.continue()
    })
    page.on('pageerror', error => result.runtimeErrors.push(error.message))
    const url = kind === 'source' ? 'http://127.0.0.1:4180/' : 'http://127.0.0.1:4181/storileaf-homepage-preview/'
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.locator(kind === 'source' ? '.sl-header' : '.site-header').waitFor()
    await page.evaluate(() => document.fonts.ready)
    const targets = kind === 'source' ? sourceSelectors : ['.site-header', '.header-find-book', '.hero .button', '.newsletter-inline-preview input']
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      const measured = await measure(page, targets)
      const row = { width, controls: measured }
      result.widths.push(row)
      if (kind === 'source') {
        check(measured['.sl-header-primary']?.radius === '9px', 'Source header radius changed at ' + width)
        if (width > 360) check(measured['.sl-header-primary']?.height === (width <= 480 ? 45 : 46), 'Source header action height incorrect at ' + width)
        check(measured['.sl-newsletter-controls input']?.radius === '9px' && measured['.sl-newsletter-subscribe']?.radius === '9px', 'Newsletter radius changed at ' + width)
        const link = page.locator('a.sl-resource-link')
        await page.keyboard.press('Tab'); await link.focus()
        row.focusAfter = await focusMeasure(link)
        check(row.focusAfter.visible && row.focusAfter.radius === row.focusAfter.parentRadius, 'Resource focus does not follow card radius at ' + width)
        check(row.focusAfter.radius === (width <= 480 ? '17px' : '20px'), 'Unexpected responsive resource focus radius at ' + width)
        if (width === 390 || width === 1440) {
          await link.screenshot({ path: path.join(out, 'resource-focus-after-' + width + '.png'), animations: 'disabled' })
          await page.evaluate(() => scrollTo(0, 0))
          await page.locator('.sl-header').screenshot({ path: path.join(out, 'header-after-' + width + '.png'), animations: 'disabled' })
        }
        const priorStyle = await page.addStyleTag({ content: original })
        const before = await measure(page, targets)
        row.headerBefore = before['.sl-header-primary']
        row.focusBefore = await focusMeasure(link)
        for (const selector of targets) {
          const b = { ...before[selector] }, a = { ...measured[selector] }
          if (selector === '.sl-header-primary' && width > 360 && width <= 480) {
            check(b.height === 43 && a.height === 45, 'Expected only the 43px to 45px mobile height correction')
            delete b.height; delete a.height
          }
          check(JSON.stringify(b) === JSON.stringify(a), 'Unexpected geometry or style change in ' + selector + ' at ' + width)
        }
        if (width === 390 || width === 1440) {
          await page.locator('.sl-header').screenshot({ path: path.join(out, 'header-before-' + width + '.png'), animations: 'disabled' })
          await link.screenshot({ path: path.join(out, 'resource-focus-before-' + width + '.png'), animations: 'disabled' })
        }
        await priorStyle.evaluate(el => el.remove())
        await link.evaluate(el => el.blur())
      } else {
        check(measured['.header-find-book']?.radius === '9px', 'Published header baseline changed at ' + width)
        if (width === 390 || width === 430) check(measured['.header-find-book']?.height === 45, 'Published mobile action is no longer 45px')
      }
      check(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), kind + ' overflows at ' + width)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    if (kind === 'source') result.states = await auditStates(page)
    const tabs = page.getByRole('tab')
    result.tabCount = await tabs.count()
    for (let i = 0; i < result.tabCount; i++) if (await tabs.nth(i).isVisible()) { await tabs.nth(i).click(); await page.waitForTimeout(120) }
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 650) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(60) }
    await page.waitForTimeout(1000)
    result.missingImages = await page.evaluate(() => [...document.images].filter(img => img.currentSrc && (!img.complete || !img.naturalWidth)).map(img => img.currentSrc))
    await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0) })
    await page.screenshot({ path: path.join(out, kind + '-desktop-1440.png'), fullPage: true, animations: 'disabled' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: path.join(out, kind + '-mobile-390.png'), fullPage: true, animations: 'disabled' })
    result.requestHosts = [...hosts].sort()
    report.browser.push(result)
    check(result.runtimeErrors.length === 0, kind + ' runtime errors while vendor requests are blocked')
    await context.close()
  }
} catch (error) { problems.push('Shape/dependency audit interrupted: ' + error.message) }
finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)) }
report.deletionAssessment = 'Evidence for tested public preview/source only; not unconditional permission to delete external projects or unique assets.'
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
console.log('SHAPE_FOUNDATION_REPORT ' + JSON.stringify({ baseline, sourceBaseline, problems, testedWidths: report.browser.map(item => ({ kind: item.kind, widths: item.widths.map(row => row.width) })) }))
if (problems.length) process.exitCode = 1
