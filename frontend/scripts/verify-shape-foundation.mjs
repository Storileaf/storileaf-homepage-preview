import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import http from 'node:http'
import { settledSnapshot } from './browser-readiness.mjs'
import { compareAutoMargins } from './computed-style-parity.mjs'

// Read-only checks. The experimental build never replaces the published root.
const root = path.resolve('..')
const baseline = '1433a413917a63df47e05f5c2d39283689624f37'
const sourceBaseline = '4b14b91b642795d2b466a0c018f84f3474d44991'
const out = 'qa/shape-foundation'
const problems = []
const report = { baseline, sourceBaseline, scope: 'Approved 6px action family, forest outline text and existing primary/gold hover colours; source and published controls', staticReferences: [], browser: [], problems }
const check = (ok, message) => { if (!ok) problems.push(message) }
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
const vendorPattern = /macaly|qcx8qibycrjhsu3gv7vr1spg/i
const widths = [320, 360, 390, 430, 768, 820, 1024, 1280, 1440]
await fs.mkdir(out, { recursive: true })
const files = git(['ls-files', '-z']).split('\0').filter(Boolean)
const runtimeFiles = files.filter(f => /^(index\.html|404\.html|assets\/|pricing\/|frontend\/src\/|frontend\/index\.html|frontend\/package(?:-lock)?\.json|frontend\/vite\.config\.ts)/.test(f) && /\.(html|css|js|mjs|ts|tsx|json)$/.test(f))
report.scannedFiles = runtimeFiles.length
for (const file of runtimeFiles) {
  const text = await fs.readFile(path.join(root, file), 'utf8')
  const at = text.search(vendorPattern)
  if (at >= 0) report.staticReferences.push({ file, excerpt: text.slice(Math.max(0, at - 100), at + 180) })
}
check(report.staticReferences.length === 0, 'A runtime dependency on the retired preview vendor appeared')

// Package 1 is now a semantic regression, not a prohibition on authorised source work.
// The original generic primitives remain a valid comparison. The former shared
// header/footer references never matched the published page. Group 3 replaces
// them under authorisation and compares their geometry to the actual protected
// homepage in verify-shared-parity, not to the obsolete source approximation.
const original = git(['show', sourceBaseline + ':frontend/src/styles/components.css']).split('/* Shared public site ending.')[0] + '\n.sl-action--text { font-size:var(--sl-text-editorial-action); }'
report.sourceGeometryScope = 'Original generic primitive CSS only; shared header/footer use the dedicated protected-homepage parity gate. Every node, rectangle and typography value remains asserted after bounded stable sampling. A raw CSSOM auto-margin discrepancy is accepted only for the observed centred craft container when its typed auto declarations, exact parent/child geometry and actual gaps agree; raw values and the proof remain in autoMarginResolutionDifferences.'
const originalTokens = git(['show', sourceBaseline + ':frontend/src/styles/tokens.css'])
const tokens = await fs.readFile('src/styles/tokens.css', 'utf8')
for (const alias of ['header-action', 'newsletter-control', 'gold-action']) {
  check(tokens.includes('--sl-radius-' + alias + ': var(--sl-radius-action)'), 'Action alias drifted: ' + alias)
}
check(tokens.includes('--sl-radius-action: 6px'), 'Approved 6px action value changed')
check(tokens.includes('--sl-teal-hover: #0b5848') && tokens.includes('--sl-gold-action-hover: #e9cb93'), 'Approved hover palette changed')

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
const sourceSelectors = ['.sl-header', '.sl-header-primary', '.sl-newsletter-controls input', '.sl-newsletter-subscribe', '.sl-resource-card', '.sl-footer-currency']
const changedCorners = new Set(['.sl-header-primary', '.sl-newsletter-controls input', '.sl-newsletter-subscribe'])
const measure = (page, selectors) => page.evaluate(list => Object.fromEntries(list.map(selector => {
  const el = document.querySelector(selector)
  if (!el) return [selector, null]
  const s = getComputedStyle(el), r = el.getBoundingClientRect()
  return [selector, { radius: s.borderTopLeftRadius, width: r.width, height: r.height, fontSize: s.fontSize, lineHeight: s.lineHeight, display: s.display, background: s.backgroundColor, colour: s.color }]
})), selectors)
const geometry = page => settledSnapshot(page, () => page.evaluate(() => [...document.querySelectorAll('body *:not(script):not(style)')].map(el => {
  const r = el.getBoundingClientRect(), s = getComputedStyle(el)
  const value = [el.tagName, el.getAttribute('class'), [r.x, r.y, r.width, r.height].map(n => Math.round(n * 100) / 100), s.fontFamily, s.fontSize, s.fontWeight, s.lineHeight, s.padding, s.margin]
  // Chromium can report an offscreen grid's resolved auto margins as zero even
  // though its unchanged box is centred. Record independent declaration and
  // layout evidence for this observed container; never replace its raw values.
  if (el.matches('#samples > .sl-container.sl-samples-frame.sl-book-craft')) {
    const parent = el.parentElement, p = parent.getBoundingClientRect(), ps = getComputedStyle(parent)
    const raw = { marginLeft: s.marginLeft, marginRight: s.marginRight }
    const top = s.marginTop, bottom = s.marginBottom
    const available = typeof el.computedStyleMap === 'function'
    const typed = available ? el.computedStyleMap() : null
    const parentEdges = { borderLeft: parseFloat(ps.borderLeftWidth), paddingLeft: parseFloat(ps.paddingLeft), borderRight: parseFloat(ps.borderRightWidth), paddingRight: parseFloat(ps.paddingRight) }
    value.push({ top, bottom, autoMargins: {
      bounded: el.className === 'sl-container sl-samples-frame sl-book-craft'
        && parent.tagName === 'SECTION' && parent.id === 'samples' && ps.display === 'block'
        && s.display === 'grid' && s.position === 'static' && s.transform === 'none' && ps.transform === 'none'
        && s.writingMode === 'horizontal-tb' && ps.writingMode === 'horizontal-tb',
      available,
      typed: { marginLeft: typed?.get('margin-left')?.toString(), marginRight: typed?.get('margin-right')?.toString() },
      raw,
      rect: [r.x, r.y, r.width, r.height], parentRect: [p.x, p.y, p.width, p.height], parentEdges,
      layout: { display: s.display, position: s.position, transform: s.transform, parentTransform: ps.transform },
      measured: {
        marginLeft: r.left - p.left - parentEdges.borderLeft - parentEdges.paddingLeft,
        marginRight: p.right - parentEdges.borderRight - parentEdges.paddingRight - r.right,
      },
    } })
  }
  return value
})))
function equivalentCraftAutoMargins(before, after) {
  if (!before || !after || before.length !== 10 || after.length !== 10) return false
  if (before[0] !== 'DIV' || before[1] !== 'sl-container sl-samples-frame sl-book-craft') return false
  // All original fields other than the resolved margin shorthand remain exact.
  if (JSON.stringify(before.slice(0, 8)) !== JSON.stringify(after.slice(0, 8))) return false
  const b = before[9], a = after[9]
  if (b.top !== a.top || b.bottom !== a.bottom) return false
  return compareAutoMargins(b.autoMargins, a.autoMargins, { tolerance: 0 }).equal
}

const focusMeasure = locator => locator.evaluate(el => ({ radius: getComputedStyle(el).borderTopLeftRadius, parentRadius: getComputedStyle(el.parentElement).borderTopLeftRadius, visible: el.matches(':focus-visible'), outline: getComputedStyle(el).outlineWidth, offset: getComputedStyle(el).outlineOffset }))
const clearSelection = page => page.evaluate(() => window.getSelection()?.removeAllRanges())
// Responsive viewport units and media queries can settle on the next frame.
// Measure both styles only after layout has caught up with the requested width.
const settleLayout = async page => {
  await page.bringToFront()
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}
const shot = async (page, name) => {
  // A pointer-held test can select text when released outside a control.
  // Clear only transient selection, preserving focus and all page styling.
  await clearSelection(page)
  return page.screenshot({ path: path.join(out, name + '.png'), animations: 'disabled' })
}

async function auditStates(page) {
  // Test-only fixtures, never public copy and never a new working destination.
  await page.evaluate(() => {
    const section = document.createElement('section')
    section.id = 'shape-probes'
    section.style.cssText = 'padding:90px 24px;min-height:650px;background:#f9f8f6;display:flex;align-content:center;align-items:center;flex-wrap:wrap;gap:30px;'
    for (const variant of ['primary', 'outline', 'gold', 'text']) {
      for (const planned of [false, true]) {
        const el = document.createElement(planned ? 'span' : 'a')
        if (!planned) el.href = '#shape-probes'
        el.className = 'sl-action sl-action--' + variant + (planned ? ' sl-action--planned' : '')
        el.textContent = planned ? 'Planned action' : 'Review action'
        el.addEventListener('click', e => e.preventDefault()); section.append(el)
      }
    }
    document.body.append(section)
  })
  const result = {}
  const selectors = ['.sl-header-primary', '.sl-newsletter-subscribe', ...['primary', 'outline', 'gold', 'text'].flatMap(v => ['#shape-probes a.sl-action--' + v, '#shape-probes span.sl-action--' + v])]
  for (const selector of selectors) {
    const el = page.locator(selector).first()
    const planned = selector.includes('span.')
    const primary = selector.includes('primary')
    const gold = selector.includes('gold') || selector === '.sl-newsletter-subscribe'
    const base = primary ? 'rgb(12, 103, 83)' : gold ? 'rgb(215, 182, 126)' : null
    const target = planned ? base : primary ? 'rgb(11, 88, 72)' : gold ? 'rgb(233, 203, 147)' : null
    // The migrated shared actions retain the published transitions. An event
    // completing does not mean its paint or colour transition has completed.
    // Observe the real pseudo-class and the existing exact palette, with a
    // bounded failure, instead of sampling the start of the animation.
    const waitState = async (background, hovered, pressed = false) => {
      await page.bringToFront()
      await page.waitForFunction(({ selector, background, hovered, pressed }) => {
        const node = document.querySelector(selector)
        return node.matches(':hover') === hovered && node.matches(':active') === pressed
          && (background === null || getComputedStyle(node).backgroundColor === background)
      }, { selector, background, hovered, pressed }, { timeout: 5000 })
    }
    await el.scrollIntoViewIfNeeded()
    await page.evaluate(() => document.activeElement?.blur())
    await clearSelection(page)
    await page.mouse.move(0, 0)
    const read = () => el.evaluate(node => {
      const s = getComputedStyle(node), r = node.getBoundingClientRect()
      return { radius: s.borderTopLeftRadius, background: s.backgroundColor, colour: s.color, outline: s.outlineWidth, outlineColour: s.outlineColor, focusVisible: node.matches(':focus-visible'), width: r.width, height: r.height, transform: s.transform }
    })
    await waitState(base, false)
    const normal = await read()
    await el.hover(); await waitState(target, true); const hover = await read()
    await page.mouse.down(); await waitState(target, true, true); const pressed = await read()
    // Release outside the control. Never navigate or submit the newsletter.
    await page.mouse.move(0, 0); await page.mouse.up()
    await clearSelection(page)
    const focusable = await el.evaluate(node => node.tabIndex >= 0)
    let focus = null
    if (focusable) {
      await page.keyboard.press('Tab'); await el.focus()
      await waitState(base, false)
      await page.waitForFunction(selector => document.querySelector(selector).matches(':focus-visible'), selector, { timeout: 5000 })
      focus = await read()
      check(focus.focusVisible && focus.outline !== '0px', 'Missing keyboard focus in ' + selector)
    }
    result[selector] = { normal, hover, pressed, focus, disabled: 'Not part of ActionLink API', loading: 'No asynchronous operation added' }
    for (const state of [hover, pressed, ...(focus ? [focus] : [])]) {
      check(state.width === normal.width && state.height === normal.height && state.transform === normal.transform, 'State changes geometry in ' + selector)
    }
    if (!selector.endsWith('--text')) check(normal.radius === '6px', 'Action radius must be 6px in ' + selector)
    if (primary || gold) {
      check(normal.background === base && hover.background === target && pressed.background === target, 'Incorrect normal/hover/pressed colours in ' + selector)
      check(normal.colour === (primary ? 'rgb(255, 255, 255)' : 'rgb(37, 53, 38)') && hover.colour === normal.colour, 'Action text colour changed in ' + selector)
    }
    if (selector.includes('--outline')) check(normal.colour === 'rgb(37, 53, 38)' && hover.colour === normal.colour, 'Outlined action must use forest text')
    if (planned) check(!focusable && normal.background === hover.background, 'Planned treatment must remain non-interactive')
  }
  await page.locator('#shape-probes').scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur())
  await shot(page, 'action-states-normal-1440')
  await page.locator('#shape-probes a.sl-action--primary').hover()
  await shot(page, 'action-primary-hover-1440')
  await page.locator('#shape-probes a.sl-action--gold').hover()
  await shot(page, 'action-gold-hover-1440')
  await page.mouse.move(0, 0); await page.keyboard.press('Tab'); await page.locator('#shape-probes a.sl-action--outline').focus()
  await shot(page, 'action-outline-focus-1440')
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
      await settleLayout(page)
      await page.mouse.move(0, 0); await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0) })
      const measured = await settledSnapshot(page, () => measure(page, targets))
      const row = { width, controls: measured }
      result.widths.push(row)
      if (kind === 'source') {
        for (const selector of changedCorners) check(measured[selector]?.radius === '6px', 'Unified source action radius incorrect at ' + width + ' ' + selector)
        if (width > 360) check(measured['.sl-header-primary']?.height === 45, 'Source header must preserve the published 45px action at ' + width)
        const afterGeometry = await geometry(page)
        const priorStyle = await page.addStyleTag({ content: originalTokens + '\n' + original })
        await settleLayout(page)
        const before = await settledSnapshot(page, () => measure(page, targets))
        row.before = before
        const beforeGeometry = await geometry(page)
        row.autoMarginResolutionDifferences = []
        row.geometryChanges = beforeGeometry.flatMap((before, index) => {
          const after = afterGeometry[index]
          if (JSON.stringify(before) === JSON.stringify(after)) return []
          const difference = { index, before, after }
          if (equivalentCraftAutoMargins(before, after)) {
            row.autoMarginResolutionDifferences.push(difference)
            return []
          }
          return [difference]
        })
        row.geometryUnchanged = beforeGeometry.length === afterGeometry.length && row.geometryChanges.length === 0
        check(row.geometryUnchanged, 'Retained primitive styles changed normal page geometry or typography at ' + width)
        for (const selector of targets) {
          const b = { ...before[selector] }, a = { ...measured[selector] }
          if (changedCorners.has(selector)) {
            check(b.radius === '6px' && a.radius === '6px', 'Retained 6px corner changed in ' + selector)
            delete b.radius; delete a.radius
          }
          check(JSON.stringify(b) === JSON.stringify(a), 'Unexpected normal style change in ' + selector + ' at ' + width)
        }
        if (width === 390 || width === 1440) {
          await page.locator('.sl-header').screenshot({ path: path.join(out, 'header-before-' + width + '.png'), animations: 'disabled' })
          await page.locator('.sl-newsletter-controls').screenshot({ path: path.join(out, 'newsletter-before-' + width + '.png'), animations: 'disabled' })
        }
        await priorStyle.evaluate(el => el.remove())
        await settleLayout(page)
        if (width === 390 || width === 1440) {
          await page.evaluate(() => scrollTo(0, 0))
          await page.locator('.sl-header').screenshot({ path: path.join(out, 'header-after-' + width + '.png'), animations: 'disabled' })
          await page.locator('.sl-newsletter-controls').screenshot({ path: path.join(out, 'newsletter-after-' + width + '.png'), animations: 'disabled' })
        }
        const link = page.locator('a.sl-resource-link')
        await page.keyboard.press('Tab'); await link.focus()
        row.focusAfter = await focusMeasure(link)
        check(row.focusAfter.visible && row.focusAfter.radius === row.focusAfter.parentRadius && row.focusAfter.radius === (width <= 480 ? '17px' : '20px'), 'Responsive resource focus regression at ' + width)
        await link.evaluate(el => el.blur())
      } else {
        check(measured['.header-find-book']?.radius === '6px', 'Published header baseline changed at ' + width)
        check(measured['.hero .button']?.radius === '6px' && measured['.newsletter-inline-preview input']?.radius === '6px', 'Published control baseline changed at ' + width)
      }
      check(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), kind + ' overflows at ' + width)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    if (kind === 'source') result.states = await auditStates(page)
    const tabs = page.getByRole('tab'); result.tabCount = await tabs.count()
    for (let i = 0; i < result.tabCount; i++) if (await tabs.nth(i).isVisible()) { await tabs.nth(i).click(); await page.waitForTimeout(120) }
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 650) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(60) }
    await page.waitForTimeout(1000)
    result.missingImages = await page.evaluate(() => [...document.images].filter(img => img.currentSrc && (!img.complete || !img.naturalWidth)).map(img => img.currentSrc))
    await page.evaluate(() => { document.activeElement?.blur(); window.getSelection()?.removeAllRanges(); scrollTo(0, 0) })
    await page.screenshot({ path: path.join(out, kind + '-desktop-1440.png'), fullPage: true, animations: 'disabled' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: path.join(out, kind + '-mobile-390.png'), fullPage: true, animations: 'disabled' })
    result.requestHosts = [...hosts].sort(); report.browser.push(result)
    check(result.runtimeErrors.length === 0, kind + ' runtime errors')
    check(result.blockedVendorRequests.length === 0, kind + ' requested the retired vendor')
    check(result.missingImages.length === 0, kind + ' has missing images')
    await context.close()
  }
} catch (error) { problems.push('Shape/state audit interrupted: ' + error.message) }
finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)) }
report.deletionAssessment = 'Evidence for tested public preview/source only; not unconditional permission to delete external projects or unique assets.'
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
console.log('SHAPE_FOUNDATION_REPORT ' + JSON.stringify({ baseline, sourceBaseline, problems, testedWidths: report.browser.map(item => ({ kind: item.kind, widths: item.widths.map(row => row.width) })) }))
if (problems.length) process.exitCode = 1
