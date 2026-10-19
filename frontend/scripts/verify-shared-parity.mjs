import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

// Compare the protected, fully hydrated static homepage with the separate React
// build. This gate never alters published files or supplies replacement content.
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/',
}
const publicHome = 'https://storileaf.github.io/storileaf-homepage-preview/'
const requiredWidths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const widths = process.env.STORILEAF_SHARED_WIDTHS ? process.env.STORILEAF_SHARED_WIDTHS.split(',').map(Number) : requiredWidths
const folder = 'qa/shared'
const problems = []
const check = (ok, message) => { if (!ok) problems.push(message) }
const hash = value => createHash('sha256').update(value).digest('hex')
const report = {
  protectedBaseline: 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b',
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(), urls, requestedWidths: widths, browser: '',
  widths: [], states: [], captures: [], qualityFindings: [], inheritedNavigationFindings: [], problems,
  thresholds: { geometryCssPixels: 0.15, screenshotChannelDifference: 24, screenshotChangedRatio: 0.01 },
  routeContract: 'External and pricing links must retain their published destination. Source links to the existing top, main-content, Books, Resources, Activities and Questions IDs may use the local homepage hash. Group 4 authorises the Books target when discovery is rendered. They must resolve to the actual source origin and source homepage path, have no query string, and target one existing ID. Other homepage anchors must retain the exact absolute public destination until their sections are migrated. Canonical comparison maps only these explicitly permitted local hashes to the published URL; raw and effective hrefs remain recorded. Functional tests activate the actual source anchors and inspect URL fragments, history and settled scroll position.',
  semanticCorrection: 'Homepage fragment links must not claim aria-current=page. Source scoped navigation contains no incorrect current page state. The restored skip link retains its focused appearance and actual main-content destination while native hash navigation correctly moves the next keyboard Tab into main. The published router keeps the skip link focused and the next Tab returns to the header; this inherited keyboard limitation is recorded explicitly rather than required in the React source. Published attributes and behaviour remain recorded as inherited evidence and are never edited by this gate.',
  equivalentRepresentations: [
    'The loaded first font family must match on rendered text. Unused fallback lists may differ.',
    'Font inheritance on a pixel-sized img or SVG has no rendered text. Its geometry, image or path data and colour remain compared.',
    'A zero-width border has no visible colour. Outlines with style none have no visible width or offset. Their raw values remain recorded.',
    'Both 0s and 0.00001s are treated as effectively instantaneous reduced motion. Longer source transitions and animations still fail.',
    'The photograph origin position 0% and 0px are equivalent zero offsets. Other image positioning remains exact.',
  ],
  captureMethod: 'Actual fonts, logo and shared photograph are loaded. Header and menu crops retain their real context and receive no hiding CSS. Footer crops temporarily extend viewport height, apply a recorded subpixel body padding-top adjustment below one CSS pixel and add one body padding-bottom pixel outside the final section to avoid fractional maximum-scroll clipping. Section geometry must remain unchanged and the whole ending must fit below the visible sticky header. Both body paddings and the viewport are restored. Menu crops compare the complete visible panel. Full viewport context captures retain the actual surrounding page and are informational because the React homepage is incomplete. No target CSS, content, image or route response is substituted.',
  viewportReadinessMethod: 'The foreground page must match its requested innerWidth and innerHeight and an inert hidden fixed 100vw by 100vh probe within 0.01 CSS pixels, then complete two animation frames. The wait is bounded.',
  limits: 'Chromium automation with emulated touch and targeted text enlargement. This is not native browser zoom, cross browser, physical device or accessibility certification. Pricing diagnostic evidence is kept separately; this workflow does not replace the protected pricing preview.',
}
await fs.mkdir(folder, { recursive: true })
report.publishedFiles = {}
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/content-sections-CfrmOVRI.js', 'assets/routes-DrwDv2x2.js', 'pricing/index.html']) report.publishedFiles[file] = hash(await fs.readFile('../' + file))
report.sourceFiles = {}
async function recordFiles(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await recordFiles(file)
    else report.sourceFiles[file] = hash(await fs.readFile(file))
  }
}
await recordFiles('src'); await recordFiles('content')
report.sourceBuildFiles = { 'index.html': hash(await fs.readFile('dist/index.html')) }
for (const entry of await fs.readdir('dist/assets')) {
  if (/\.(css|js)$/.test(entry)) report.sourceBuildFiles['assets/' + entry] = hash(await fs.readFile('dist/assets/' + entry))
}
report.harnessSha256 = hash(await fs.readFile('scripts/verify-shared-parity.mjs'))
const styles = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderRadius', 'boxShadow', 'backdropFilter', 'textAlign', 'display', 'gap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'transform', 'textDecorationLine', 'textUnderlineOffset', 'transitionDuration', 'transitionTimingFunction', 'transitionProperty', 'animationDuration', 'animationTimingFunction', 'animationDelay', 'animationFillMode']

function groupsFor(kind) {
  const source = kind === 'source'
  const choose = (published, editable) => source ? editable : published
  const header = choose('.site-header', '.sl-header')
  const ending = choose('.newsletter-footer-unit', '.sl-newsletter-footer')
  const menu = name => choose('.' + name + '-dropdown', name === 'books' ? '.sl-header-books-menu' : '.sl-resources-menu')
  const column = choose('.footer-column', '.sl-footer-column')
  const mobile = choose('.redesigned-mobile-menu', '.sl-mobile-nav-dialog')
  const disclosure = choose('.mobile-nav-disclosure', '.sl-mobile-nav-disclosure')
  const mobileNav = mobile + ' nav'
  return {
    skip: { kind, selector: choose('.skip-link', '.sl-skip-link'), nodes: [['root', ':scope']] },
    header: { kind, selector: header, nodes: [
      ['root', ':scope'], ['inner', choose('.site-header-inner', '.sl-header-inner')],
      ['logo', choose('.brand', '.sl-header-logo')], ['logoImage', choose('.brand img', '.sl-header-logo img')],
      ['navigation', choose('.desktop-nav-root', '.sl-header-desktop-nav')],
      ['booksTrigger', choose('.header-nav-trigger', '.sl-header-dropdown > button'), 0],
      ['resourcesTrigger', choose('.header-nav-trigger', '.sl-header-dropdown > button'), 1],
      ['seeInside', choose('.desktop-nav-root a', '.sl-header-desktop-nav a'), 'See inside'],
      ['process', choose('.desktop-nav-root a', '.sl-header-desktop-nav a'), 'How it works'],
      ['pricing', choose('.desktop-nav-root a', '.sl-header-desktop-nav a'), 'Pricing'],
      ['actions', choose('.header-actions', '.sl-header-actions')],
      ['login', choose('.header-actions a', '.sl-header-actions a'), 'Log in'],
      ['start', choose('.header-find-book', '.sl-header-primary')],
      ['mobileTrigger', choose('.mobile-menu-trigger', '.sl-header-mobile-trigger')],
    ] },
    books: { kind, selector: menu('books'), nodes: [
      ['root', ':scope'], ['grid', choose('.books-menu-grid', '.sl-books-menu-grid')],
      ...Array.from({ length: 6 }, (_, i) => [
        ['link' + i, choose('.books-menu-item', '.sl-books-menu-item'), i],
        ['label' + i, choose('.books-menu-item strong', '.sl-books-menu-item strong'), i],
        ['description' + i, choose('.books-menu-item span', '.sl-books-menu-item span'), i],
      ]).flat(),
      ['giftRow', choose('.books-menu-gift', '.sl-books-menu-gift')], ['gift', 'a', 6],
    ] },
    resources: { kind, selector: menu('resources'), nodes: [
      ['root', ':scope'], ...Array.from({ length: 3 }, (_, i) => [['link' + i, 'a', i], ['arrow' + i, 'a svg', i]]).flat(),
    ] },
    mobile: { kind, selector: mobile, nodes: [
      ['root', ':scope'], ['titleRow', choose('.menu-title-row', '.sl-mobile-nav-title-row')],
      ['logo', choose('.menu-title-row img', '.sl-mobile-nav-title-row img')],
      ['close', '[aria-label="Close navigation"]'], ['description', choose('.menu-description', '.sl-mobile-nav-description')],
      ['navigation', 'nav'], ['booksSummary', disclosure + ' summary', 0], ['resourcesSummary', disclosure + ' summary', 1],
      ['booksSubmenu', choose('.mobile-nav-submenu', '.sl-mobile-nav-submenu'), 0],
      ['resourcesSubmenu', choose('.mobile-nav-submenu', '.sl-mobile-nav-submenu'), 1],
      ...Array.from({ length: 14 }, (_, i) => ['navLink' + i, mobileNav + ' a', i]),
      ['actions', choose('.mobile-menu-actions', '.sl-mobile-nav-actions')],
      ['start', choose('.mobile-menu-actions a', '.sl-mobile-nav-actions a'), 0],
      ['login', choose('.mobile-menu-actions a', '.sl-mobile-nav-actions a'), 1],
    ] },
    ending: { kind, selector: ending, nodes: [
      ['root', ':scope'], ['newsletter', choose('.newsletter-strip', '.sl-newsletter')],
      ['newsletterLayout', choose('.newsletter-layout', '.sl-newsletter-layout')],
      ['heading', 'h2'], ['emphasis', 'h2 em'], ['description', choose('.newsletter-layout > div:first-child > p', '.sl-newsletter-layout > div:first-child > p')],
      ['controls', choose('.newsletter-inline-preview', '.sl-newsletter-controls')],
      ['email', 'input'], ['subscribe', choose('.newsletter-inline-preview a', '.sl-newsletter-subscribe')],
      ['subscribeArrow', choose('.newsletter-inline-preview a svg', '.sl-newsletter-subscribe svg')],
      ['footer', 'footer'], ['container', 'footer > div'], ['grid', choose('.footer-grid', '.sl-footer-grid')],
      ['brand', choose('.footer-brand', '.sl-footer-brand')], ['logo', choose('.footer-logo', '.sl-footer-brand > a')],
      ['logoImage', choose('.footer-logo img', '.sl-footer-brand > a img')], ['brandDescription', choose('.footer-brand > p', '.sl-footer-brand > p')],
      ['currency', choose('.currency-picker', '.sl-footer-currency')], ['select', 'select'],
      ['globe', choose('.currency-picker > svg', '.sl-footer-currency > svg'), 0],
      ['currencyChevron', choose('.currency-picker > svg', '.sl-footer-currency > svg'), 1],
      ...Array.from({ length: 3 }, (_, i) => [['column' + i, column, i], ['columnHeading' + i, column + ' h3', i]]).flat(),
      ...Array.from({ length: 17 }, (_, i) => ['footerLink' + i, column + ' a', i]),
      ['bottom', choose('.footer-bottom', '.sl-footer-bottom')], ['copyright', choose('.footer-bottom > span', '.sl-footer-bottom > span')],
      ['legal', choose('.footer-bottom > div', '.sl-footer-bottom > div')],
      ...Array.from({ length: 3 }, (_, i) => ['legalLink' + i, choose('.footer-bottom a', '.sl-footer-bottom a'), i]),
    ] },
  }
}
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
report.browser = browser.version()
const contexts = {}, pages = {}
for (const kind of ['published', 'source']) {
  contexts[kind] = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  pages[kind] = await contexts[kind].newPage()
  pages[kind].on('pageerror', error => problems.push(kind + ' runtime error ' + error.message))
}
const pixelPage = await browser.newPage()
async function within(promise, name, timeout = 15000) {
  let timer
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(name + ' timed out after ' + timeout + 'ms')), timeout) })]) }
  finally { clearTimeout(timer) }
}
async function settle(page) {
  await page.bringToFront()
  await page.evaluate(() => {
    if (document.querySelector('[data-qa-css-viewport]')) return
    const probe = document.createElement('div'); probe.dataset.qaCssViewport = ''; probe.inert = true; probe.setAttribute('aria-hidden', 'true')
    probe.style.cssText = 'all:initial;position:fixed;top:0;left:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none;contain:strict;'
    document.body.append(probe)
  })
  await page.waitForFunction(({ width, height }) => {
    const r = document.querySelector('[data-qa-css-viewport]').getBoundingClientRect()
    return innerWidth === width && innerHeight === height && Math.abs(r.width - width) < 0.01 && Math.abs(r.height - height) < 0.01
  }, page.viewportSize(), { timeout: 5000 })
  await within(page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))), 'Foreground layout')
}
async function ready(page, kind) {
  await page.bringToFront(); await page.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await page.locator(groupsFor(kind).ending.selector + ' select').waitFor()
  // The real footer logo is lazy loaded. Let native viewport loading start it
  // before waiting for decode; waiting while it remains offscreen can deadlock.
  await page.locator(groupsFor(kind).ending.selector + ' footer img').scrollIntoViewIfNeeded()
  await within(page.evaluate(async () => {
    await Promise.all([document.fonts.load('450 40px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('600 15px Manrope'), document.fonts.load('650 15px Manrope'), document.fonts.load('700 15px Manrope')]); await document.fonts.ready
    if (!document.fonts.check('450 40px Newsreader') || !document.fonts.check('600 15px Manrope')) throw new Error('Required real fonts did not load')
    await Promise.all([...document.querySelectorAll('header img, footer img')].map(image => image.decode()))
    const ending = document.querySelector('.newsletter-footer-unit, .sl-newsletter-footer')
    const url = getComputedStyle(ending, '::before').backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1]
    if (!url) throw new Error('Shared ending photograph missing')
    const image = new Image(); image.src = url; await image.decode()
    if (!image.naturalWidth) throw new Error('Shared ending photograph failed')
  }), kind + ' fonts and shared images', 45000)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.mouse.move(0, 0); await settle(page)
}
async function snapshot(page, group) {
  await settle(page)
  return page.locator(group.selector).evaluate((root, options) => {
    const rect = root.getBoundingClientRect(), normal = value => (value || '').replace(/\s+/g, ' ').trim(), rounded = value => Math.round(value * 1000) / 1000
    const localHashes = new Set(['#top', '#main-content', '#books', '#resources', '#resources-activity', '#questions'])
    const destination = link => {
      const rawHref = link.getAttribute('href'), effectiveHref = link.href
      const url = new URL(options.kind === 'published' ? rawHref : effectiveHref, options.publicHome)
      const source = new URL(options.sourceUrl)
      const local = options.kind === 'source' && url.origin === source.origin && url.pathname === source.pathname && !url.search && localHashes.has(url.hash)
      return { rawHref, effectiveHref, destination: local ? new URL(url.hash, options.publicHome).href : url.href, local, localTargetCount: local ? document.querySelectorAll('[id="' + url.hash.slice(1) + '"]').length : null }
    }
    const nodes = {}
    for (const [name, selector, index = 0] of options.nodes) {
      const matches = selector === ':scope' ? [root] : [...root.querySelectorAll(selector)]
      const element = typeof index === 'string' ? matches.find(node => normal(node.textContent) === index) : matches[index]
      if (!element) { nodes[name] = null; continue }
      const r = element.getBoundingClientRect(), css = getComputedStyle(element), visible = element.checkVisibility()
      nodes[name] = {
        tag: element.tagName,
        text: element.matches('a, button, strong, span, p, h2, h3, summary') && !element.querySelector('select') ? normal(element.textContent) : null,
        visible, geometry: visible ? { x: rounded(r.x - rect.x), y: rounded(r.y - rect.y), width: rounded(r.width), height: rounded(r.height) } : null,
        styles: Object.fromEntries(options.styles.map(key => [key, css[key]])),
      }
    }
    const icon = svg => ({ viewBox: svg.getAttribute('viewBox'), shapes: [...svg.querySelectorAll('path,circle,ellipse,rect,line,polyline,polygon')].map(shape => ({ tag: shape.tagName, attributes: Object.fromEntries([...shape.attributes].filter(a => !['class', 'style'].includes(a.name)).sort((a, b) => a.name.localeCompare(b.name)).map(a => [a.name, a.value])) })), strokeWidth: getComputedStyle(svg).strokeWidth, linecap: getComputedStyle(svg).strokeLinecap, linejoin: getComputedStyle(svg).strokeLinejoin })
    return {
      nodes, position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      links: [...(root.matches('a') ? [root] : []), ...root.querySelectorAll('a')].map(link => ({ text: normal(link.textContent), ...destination(link), ariaCurrent: link.getAttribute('aria-current') })),
      images: [...root.querySelectorAll('img')].map(image => ({ src: image.currentSrc, alt: image.alt, loaded: image.complete && image.naturalWidth > 0, natural: [image.naturalWidth, image.naturalHeight] })),
      icons: [...root.querySelectorAll('svg')].filter(svg => svg.checkVisibility()).map(icon),
      disclosures: [...root.querySelectorAll('details')].map(element => ({ native: element instanceof HTMLDetailsElement, directSummary: element.firstElementChild?.tagName === 'SUMMARY', open: element.open, name: element.getAttribute('name'), summaryRole: element.querySelector('summary')?.getAttribute('role') })),
      select: [...root.querySelectorAll('select')].map(select => ({ label: select.getAttribute('aria-label'), value: select.value, options: [...select.options].map(option => ({ value: option.value, label: option.textContent })) })),
      input: [...root.querySelectorAll('input')].map(input => ({ type: input.type, label: input.getAttribute('aria-label'), placeholder: input.placeholder, autoComplete: input.autocomplete })),
      pseudo: options.ending ? Object.fromEntries(['::before', '::after'].map(pseudo => { const css = getComputedStyle(root, pseudo); return [pseudo, Object.fromEntries(['content', 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat', 'filter', 'zIndex'].map(key => [key, key === 'backgroundPosition' ? css[key].split(' ').map(value => value === '0%' ? '0px' : value).join(' ') : css[key]]))] })) : null,
      documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }
  }, { ...group, styles, publicHome, sourceUrl: urls.source, ending: group.selector === groupsFor(group.kind).ending.selector })
}
function compare(before, after, label, { allowQualityOverflow = false, position = false } = {}) {
  const differences = []
  for (const name of Object.keys(before.nodes)) {
    const b = before.nodes[name], a = after.nodes[name]
    if (!b || !a) { differences.push(name + ' missing'); continue }
    if (b.text !== a.text) differences.push(name + ' text differs')
    if (b.visible !== a.visible) differences.push(name + ' visibility differs')
    if (!b.visible && !a.visible) continue
    for (const key of styles) if (b.styles[key] !== a.styles[key]) {
      if (['IMG', 'svg'].includes(b.tag) && ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing'].includes(key)) continue
      if (key === 'fontFamily' && b.styles[key].split(',')[0] === a.styles[key].split(',')[0]) continue
      if (['transitionDuration', 'animationDuration'].includes(key) && b.styles[key].split(',').every(value => parseFloat(value) <= 0.00001) && a.styles[key].split(',').every(value => parseFloat(value) <= 0.00001)) continue
      if (/^border(Top|Right|Bottom|Left)Color$/.test(key) && b.styles[key.replace('Color', 'Width')] === '0px' && a.styles[key.replace('Color', 'Width')] === '0px') continue
      differences.push(name + ' ' + key + ' ' + b.styles[key] + ' -> ' + a.styles[key])
    }
    if (b.geometry && a.geometry) for (const key of Object.keys(b.geometry)) if (Math.abs(b.geometry[key] - a.geometry[key]) > 0.15) differences.push(name + ' ' + key + ' ' + b.geometry[key] + ' -> ' + a.geometry[key])
  }
  if (position) for (const key of Object.keys(before.position)) if (Math.abs(before.position[key] - after.position[key]) > 0.15) differences.push('viewport position ' + key + ' differs')
  for (const key of ['images', 'icons', 'disclosures', 'select', 'input', 'pseudo']) if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) differences.push(key + ' differs')
  const destinations = data => data.links.map(({ text, destination }) => ({ text, destination }))
  if (JSON.stringify(destinations(before)) !== JSON.stringify(destinations(after))) differences.push('canonical destination or link order differs')
  for (const link of after.links) {
    if (link.ariaCurrent !== null) differences.push('source incorrectly claims current page for ' + link.text)
    if (link.local && link.localTargetCount !== 1) differences.push('source local hash must target one existing ID for ' + link.text)
  }
  if (allowQualityOverflow) check(before.documentOverflow === after.documentOverflow, label + ' enlarged document overflow differs')
  else check(!before.documentOverflow && !after.documentOverflow, label + ' document overflow')
  check(!differences.length, label + ' differs ' + differences.slice(0, 16).join('; '))
  return differences
}

async function pixelComparison(left, right, filename) {
  await pixelPage.bringToFront()
  const result = await within(pixelPage.evaluate(async ({ left, right }) => {
    const load = data => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = 'data:image/png;base64,' + data })
    const [a, b] = await Promise.all([load(left), load(right)])
    const canvas = document.createElement('canvas'); canvas.width = a.width + b.width + 24; canvas.height = Math.max(a.height, b.height) + 38
    const pen = canvas.getContext('2d'); pen.fillStyle = '#fff'; pen.fillRect(0, 0, canvas.width, canvas.height); pen.fillStyle = '#253526'; pen.font = '16px sans-serif'
    pen.fillText('Published', 12, 25); pen.fillText('React', a.width + 36, 25); pen.drawImage(a, 0, 38); pen.drawImage(b, a.width + 24, 38)
    let changedPixels = null, changedRatio = null
    if (a.width === b.width && a.height === b.height) {
      const first = pen.getImageData(0, 38, a.width, a.height).data, second = pen.getImageData(a.width + 24, 38, b.width, b.height).data
      changedPixels = 0
      for (let i = 0; i < first.length; i += 4) if (Math.max(Math.abs(first[i] - second[i]), Math.abs(first[i + 1] - second[i + 1]), Math.abs(first[i + 2] - second[i + 2])) > 24) changedPixels++
      changedRatio = changedPixels / (a.width * a.height)
    }
    return { publishedSize: [a.width, a.height], sourceSize: [b.width, b.height], changedPixels, changedRatio, channelTolerance: 24, data: canvas.toDataURL('image/png').split(',')[1] }
  }, { left: left.toString('base64'), right: right.toString('base64') }), 'Pixel comparison ' + filename)
  await fs.writeFile(path.join(folder, filename), Buffer.from(result.data, 'base64')); delete result.data
  check(result.changedRatio !== null && result.changedRatio <= 0.01, filename + ' pixels differ ' + result.changedRatio)
  return result
}
async function capture(page, group, filename) {
  await settle(page)
  const viewport = page.viewportSize(), original = await page.locator(group.selector).boundingBox()
  let alignment = null
  const ending = group.selector === groupsFor(group.kind).ending.selector
  if (ending) {
    await page.setViewportSize({ width: viewport.width, height: Math.max(viewport.height, Math.ceil(original.height) + 300) }); await settle(page)
    alignment = await page.locator(group.selector).evaluate(element => {
      const r = element.getBoundingClientRect(), top = r.top + scrollY, delta = Math.ceil(top) - top, before = document.body.style.paddingTop, beforeBottom = document.body.style.paddingBottom
      const paddingTop = parseFloat(getComputedStyle(document.body).paddingTop) + delta, paddingBottom = parseFloat(getComputedStyle(document.body).paddingBottom) + 1
      document.body.style.paddingTop = paddingTop + 'px'
      document.body.style.paddingBottom = paddingBottom + 'px'
      const aligned = element.getBoundingClientRect()
      return { before, beforeBottom, paddingTop, paddingBottom, bottomDelta: 1, delta, documentTop: top, immediateDocumentTop: aligned.top + scrollY, geometryUnchanged: r.width === aligned.width && r.height === aligned.height }
    })
    await settle(page)
    await page.waitForFunction(({ paddingTop, paddingBottom }) => Math.abs(parseFloat(getComputedStyle(document.body).paddingTop) - paddingTop) < 0.001 && Math.abs(parseFloat(getComputedStyle(document.body).paddingBottom) - paddingBottom) < 0.001, alignment, { timeout: 5000 })
    alignment.alignedDocumentTop = await page.locator(group.selector).evaluate(element => element.getBoundingClientRect().top + scrollY)
    await page.locator(group.selector).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 115, behavior: 'instant' })); await settle(page)
  }
  try {
    const geometry = await page.locator(group.selector).evaluate(element => {
      const r = element.getBoundingClientRect(), header = document.querySelector('.site-header, .sl-header')?.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height, viewportHeight: innerHeight, viewportWidth: innerWidth, headerBottom: header?.bottom }
    })
    const dimensionsUnchanged = Math.abs(original.width - geometry.width) < 0.015 && Math.abs(original.height - geometry.height) < 0.015
    check(dimensionsUnchanged && (!alignment || (alignment.delta >= 0 && alignment.delta < 1 && alignment.geometryUnchanged)), filename + ' capture preparation changed target dimensions')
    check(geometry.top >= 0 && geometry.bottom <= geometry.viewportHeight + 0.1 && geometry.left >= 0 && geometry.right <= geometry.viewportWidth + 0.1, filename + ' complete visible target does not fit capture viewport')
    if (ending) check(geometry.top > geometry.headerBottom + 5, filename + ' ending capture obscured by header')
    report.captures.push({ filename, originalViewport: viewport, alignment, dimensionsUnchanged, geometry })
    return await page.locator(group.selector).screenshot({ path: path.join(folder, filename), animations: 'disabled', caret: 'hide' })
  } finally {
    if (alignment) { await page.evaluate(({ before, beforeBottom }) => { document.body.style.paddingTop = before; document.body.style.paddingBottom = beforeBottom }, alignment); await page.setViewportSize(viewport); await settle(page) }
  }
}
async function comparison(name, label, options = {}) {
  const before = await snapshot(pages.published, groupsFor('published')[name]), after = await snapshot(pages.source, groupsFor('source')[name])
  const differences = compare(before, after, name + ' ' + label, options)
  let pixels = null, filename = null
  if (options.screenshots !== false) {
    const left = await capture(pages.published, groupsFor('published')[name], name + '-published-' + label + '.png')
    const right = await capture(pages.source, groupsFor('source')[name], name + '-source-' + label + '.png')
    filename = name + '-comparison-' + label + '.png'; pixels = await pixelComparison(left, right, filename)
  }
  return { published: before, source: after, differences, pixels, filename }
}
const trigger = (page, kind, name) => page.locator(groupsFor(kind).header.selector).getByRole('button', { name: name === 'books' ? 'The books' : 'Resources', exact: true })
async function closeMenus(page, kind) {
  await page.mouse.move(0, 0); await page.keyboard.press('Escape')
  for (const name of ['books', 'resources']) if (await trigger(page, kind, name).getAttribute('aria-expanded') === 'true') await trigger(page, kind, name).click()
  await settle(page)
}
async function openMenu(page, kind, name, method = 'hover') {
  await page.bringToFront(); await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await settle(page)
  if (method === 'hover') await trigger(page, kind, name).hover()
  else { await trigger(page, kind, name).focus(); await page.keyboard.press('Enter') }
  await page.locator(groupsFor(kind)[name].selector).waitFor({ state: 'visible' })
  await page.waitForFunction(selector => getComputedStyle(document.querySelector(selector)).opacity === '1', groupsFor(kind)[name].selector)
  await settle(page)
}
async function openMobile(page, kind) {
  await page.bringToFront(); await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.locator(groupsFor(kind).mobile.selector).waitFor({ state: 'visible' }); await settle(page)
}
async function closeMobile(page, kind) {
  if (await page.locator(groupsFor(kind).mobile.selector).isVisible()) await page.locator(groupsFor(kind).mobile.selector).getByRole('button', { name: 'Close navigation' }).click()
  await page.locator(groupsFor(kind).mobile.selector).waitFor({ state: 'hidden' }); await settle(page)
}
async function disclosureState(page, kind, indexes) {
  await page.locator(groupsFor(kind).mobile.selector + ' details').evaluateAll((details, indexes) => { details.forEach((element, i) => { element.open = indexes.includes(i) }) }, indexes)
  await page.locator(groupsFor(kind).mobile.selector).evaluate(element => { element.scrollTop = 0 }); await settle(page)
}
async function focusState(page) {
  await settle(page)
  await within(page.evaluate(async () => { await Promise.all(document.activeElement.getAnimations().map(animation => animation.finished.catch(() => {}))) }), 'Focused control transitions', 5000)
  await settle(page)
  return page.evaluate(() => {
    const element = document.activeElement, css = getComputedStyle(element)
    return { tag: element.tagName, text: element.tagName === 'BODY' ? '' : element.textContent.replace(/\s+/g, ' ').trim(), label: element.getAttribute('aria-label'), visible: element.matches(':focus-visible'), outline: { width: css.outlineWidth, style: css.outlineStyle, color: css.outlineColor, offset: css.outlineOffset }, background: css.backgroundColor, color: css.color }
  })
}
function comparableFocus(value) {
  if (Array.isArray(value)) return value.map(comparableFocus)
  if (!value || typeof value !== 'object') return value
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, comparableFocus(item)]))
  if (result.outline?.style === 'none' || result.outline?.width === '0px') result.outline = { visible: false }
  if (result.outlineStyle === 'none' || result.outlineWidth === '0px') {
    result.outlineStyle = 'none'; result.outlineWidth = null; result.outlineColor = null; result.outlineOffset = null
  }
  return result
}
async function desktopKeyboard(page, kind) {
  const values = []
  await closeMenus(page, kind); await trigger(page, kind, 'books').focus()
  values.push({ action: 'focus closed Books', ...(await focusState(page)), expanded: await trigger(page, kind, 'books').getAttribute('aria-expanded') })
  for (const key of ['ArrowDown', 'ArrowRight', 'End', 'Home', 'Enter', 'Tab', 'Tab', 'Escape']) {
    await page.keyboard.press(key); values.push({ action: key, ...(await focusState(page)), expanded: await trigger(page, kind, 'books').getAttribute('aria-expanded') })
  }
  check(values[0].expanded === 'false' && values[1].text === 'See inside' && values[2].text === 'How it works' && values[3].text === 'Pricing' && values[4].text === 'The books', kind + ' closed desktop keyboard order')
  check(values[5].expanded === 'true' && values[6].text.startsWith('Life Story') && values[7].text.startsWith('Travel Memoir') && values[8].expanded === 'false' && values[8].text === 'The books', kind + ' desktop open Tab or Escape behaviour')
  await openMenu(page, kind, 'resources', 'keyboard'); await page.keyboard.press('ArrowDown'); values.push({ action: 'Resources open ArrowDown', ...(await focusState(page)) })
  check(values.at(-1).text === 'All resources', kind + ' ArrowDown did not enter open Resources')
  await page.keyboard.press('End'); values.push({ action: 'Resources End', ...(await focusState(page)) }); check(values.at(-1).text === 'Blog & guides', kind + ' End did not reach last Resources entry')
  await page.keyboard.press('Home'); values.push({ action: 'Resources Home', ...(await focusState(page)) }); check(values.at(-1).text === 'All resources', kind + ' Home did not reach first Resources entry')
  await page.keyboard.press('Escape'); values.push({ action: 'Resources Escape', ...(await focusState(page)) }); check(values.at(-1).text === 'Resources', kind + ' Resources Escape focus restoration')
  return values
}
async function pointerContract(page, kind) {
  await closeMenus(page, kind); await openMenu(page, kind, 'books')
  const r = await trigger(page, kind, 'books').boundingBox()
  await page.mouse.move(r.x + r.width / 2, r.y + r.height + 4); await page.waitForTimeout(250)
  const bridgeOpen = await trigger(page, kind, 'books').getAttribute('aria-expanded') === 'true'
  check(bridgeOpen, kind + ' desktop pointer bridge collapsed')
  await page.locator(groupsFor(kind).books.selector + ' a').first().hover(); await settle(page)
  const itemOpen = await trigger(page, kind, 'books').getAttribute('aria-expanded') === 'true'
  await page.mouse.move(40, 200); await page.waitForFunction(selector => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false', kind === 'published' ? '.header-nav-trigger' : '.sl-header-dropdown > button')
  const dismissed = await trigger(page, kind, 'books').getAttribute('aria-expanded') === 'false'
  await openMenu(page, kind, 'books'); await page.mouse.click(20, 250); await settle(page)
  const outsideDismissed = await trigger(page, kind, 'books').getAttribute('aria-expanded') === 'false'
  check(itemOpen && dismissed && outsideDismissed, kind + ' desktop pointer content or dismissal contract')
  return { bridgeOpen, itemOpen, dismissed, outsideDismissed }
}

async function mobileContract(page, kind) {
  await openMobile(page, kind)
  const root = page.locator(groupsFor(kind).mobile.selector), values = []
  values.push({ action: 'open', ...(await focusState(page)) })
  const modal = await root.evaluate(element => ({ role: element.getAttribute('role'), labelled: Boolean(document.getElementById(element.getAttribute('aria-labelledby'))), described: Boolean(document.getElementById(element.getAttribute('aria-describedby'))), scrollLocked: getComputedStyle(document.body).overflow === 'hidden', outsidePointerBlocked: getComputedStyle(document.body).pointerEvents === 'none' }))
  check(values[0].label === 'Close navigation' && modal.role === 'dialog' && modal.labelled && modal.described && modal.scrollLocked && modal.outsidePointerBlocked, kind + ' mobile dialog opening, description or modal isolation')
  await page.keyboard.press('Shift+Tab'); values.push({ action: 'reverse wrap', ...(await focusState(page)) })
  await page.keyboard.press('Tab'); values.push({ action: 'forward wrap', ...(await focusState(page)) })
  check(values[1].text === 'Log in to StoriLeaf' && values[2].label === 'Close navigation', kind + ' mobile focus trap wrap')
  const summaries = root.locator('summary')
  await summaries.nth(0).focus(); await page.keyboard.press('Enter')
  await summaries.nth(1).focus(); await page.keyboard.press('Space')
  const expanded = await root.locator('details').evaluateAll(elements => elements.map(element => ({ open: element.open, native: element instanceof HTMLDetailsElement, directSummary: element.firstElementChild?.tagName === 'SUMMARY', exclusiveName: element.getAttribute('name') })))
  check(expanded.length === 2 && expanded.every(element => element.open && element.native && element.directSummary && element.exclusiveName === null), kind + ' mobile disclosures must remain independent native details')
  await page.keyboard.press('Escape'); await root.waitFor({ state: 'hidden' }); values.push({ action: 'Escape', ...(await focusState(page)) })
  const released = await page.evaluate(() => ({ scroll: getComputedStyle(document.body).overflow !== 'hidden', pointer: getComputedStyle(document.body).pointerEvents !== 'none' }))
  check(values.at(-1).label === 'Open navigation' && released.scroll && released.pointer, kind + ' mobile Escape did not restore focus and page access')
  await openMobile(page, kind); const reopenedClosed = await root.locator('details').evaluateAll(elements => elements.every(element => !element.open)); check(reopenedClosed, kind + ' mobile reopening must reset disclosures')
  await page.mouse.click(3, Math.min(page.viewportSize().height - 20, 400)); await root.waitFor({ state: 'hidden' }); values.push({ action: 'backdrop', ...(await focusState(page)) })
  check(values.at(-1).label === 'Open navigation', kind + ' backdrop focus restoration')
  return { modal, values, expanded, released, reopenedClosed }
}
async function currencyContract(page, kind) {
  const result = [], select = page.locator(groupsFor(kind).ending.selector + ' select')
  for (const value of ['inr', 'usd', 'cad', 'gbp']) {
    await select.selectOption(value); await settle(page)
    const data = await page.evaluate(({ value, header, ending }) => ({
      selected: document.querySelector(ending + ' select').value,
      stored: localStorage.getItem('storileaf.preview.currency'),
      links: [...document.querySelectorAll(header + ' a, ' + ending + ' a')].filter(link => link.textContent.trim() === 'Pricing').map(link => ({ rawHref: link.getAttribute('href'), actualHref: link.href, pathname: new URL(link.href).pathname, search: new URL(link.href).search })),
    }), { value, header: groupsFor(kind).header.selector, ending: groupsFor(kind).ending.selector })
    check(data.selected === value && data.stored === value && data.links.length === 2 && data.links.every(link => link.pathname.endsWith('/pricing/' + value) && link.search === ''), kind + ' shared currency propagation ' + value)
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForFunction(({ selector, value }) => document.querySelector(selector)?.value === value, { selector: groupsFor(kind).ending.selector + ' select', value })
    data.afterReload = await select.inputValue(); check(data.afterReload === value, kind + ' persisted currency ' + value); result.push({ value, ...data })
  }
  await page.evaluate(() => localStorage.setItem('storileaf.preview.currency', 'invalid'))
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page)
  const invalidIgnored = await select.inputValue() === 'inr'; check(invalidIgnored, kind + ' invalid stored currency must fall back to INR')
  await select.selectOption('inr'); await settle(page)
  return { selections: result, invalidIgnored }
}
async function anchorPosition(page, id, { requireSettled = true } = {}) {
  await settle(page)
  let settled = true
  try { await page.waitForFunction(id => {
    const element = document.getElementById(id); if (!element) return false
    const r = element.getBoundingClientRect(), css = getComputedStyle(element), root = getComputedStyle(document.documentElement)
    const intended = r.top + scrollY - (parseFloat(css.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0)
    const expected = Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight))
    return Math.abs(scrollY - expected) <= 1.1
  }, id, { timeout: 5000 }) } catch { settled = false }
  const result = await page.evaluate(id => {
    const element = document.getElementById(id), r = element.getBoundingClientRect(), css = getComputedStyle(element), root = getComputedStyle(document.documentElement), header = document.querySelector('.site-header,.sl-header').getBoundingClientRect()
    const intended = r.top + scrollY - (parseFloat(css.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0)
    const expectedScroll = Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight))
    return { hash: location.hash, targetCount: document.querySelectorAll('[id="' + id + '"]').length, targetTop: r.top, targetBottom: r.bottom, headerBottom: header.bottom, scrollY, expectedScroll, scrollMarginTop: css.scrollMarginTop, rootScrollPaddingTop: root.scrollPaddingTop, targetVisible: r.bottom > header.bottom && r.top < innerHeight }
  }, id)
  if (requireSettled) check(settled, 'Anchor did not settle at its measured offset ' + page.url() + ' ' + JSON.stringify(result))
  return { settled, ...result }
}
async function anchorHistory(page, kind, viewport) {
  const values = []
  await page.setViewportSize(viewport); await ready(page, kind)
  for (const [text, id] of [['Resources', 'resources'], ['Common questions', 'questions']]) {
    const link = page.locator(groupsFor(kind).ending.selector).getByRole('link', { name: text, exact: true })
    await link.scrollIntoViewIfNeeded(); await settle(page)
    const before = page.url(), beforeScroll = await page.evaluate(() => scrollY); const actualHref = await link.evaluate(element => element.href)
    if (kind === 'source') check(new URL(actualHref).origin === new URL(urls.source).origin && new URL(actualHref).pathname === new URL(urls.source).pathname, 'Source local navigation was replaced by an outward link ' + text)
    await link.click(); await page.waitForFunction(id => location.hash === '#' + id, id); const position = await anchorPosition(page, id)
    check(position.targetCount === 1 && position.targetVisible && Math.abs(position.scrollY - position.expectedScroll) <= 1.1, kind + ' actual anchor placement ' + id)
    await page.goBack(); await page.waitForFunction(before => location.href === before, before)
    await page.waitForFunction(beforeScroll => Math.abs(scrollY - beforeScroll) <= 1.1, beforeScroll, { timeout: 5000 })
    const back = page.url(), backScroll = await page.evaluate(() => scrollY)
    await page.goForward(); await page.waitForFunction(id => location.hash === '#' + id, id); const forward = await anchorPosition(page, id)
    check(forward.targetVisible && back === before, kind + ' anchor history ' + id)
    values.push({ text, actualHref, before, beforeScroll, position, back, backScroll, forward })
  }
  const logo = page.locator(groupsFor(kind).ending.selector).getByRole('link', { name: 'StoriLeaf home', exact: true })
  await logo.click(); await page.waitForFunction(() => location.hash === '#top'); await settle(page)
  const top = await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#top').length })); check(top.count === 1 && top.y <= 1, kind + ' home logo top anchor')
  if (viewport.width <= 1130) {
    await openMobile(page, kind); await page.locator(groupsFor(kind).mobile.selector + ' details').nth(1).locator('summary').click()
    await page.locator(groupsFor(kind).mobile.selector).getByRole('link', { name: 'Activities and games', exact: true }).click()
    await page.locator(groupsFor(kind).mobile.selector).waitFor({ state: 'hidden' }); await page.waitForFunction(() => location.hash === '#resources-activity')
  } else { await openMenu(page, kind, 'resources'); await page.locator(groupsFor(kind).resources.selector).getByRole('link', { name: 'Activities and games', exact: true }).click(); await page.waitForFunction(() => location.hash === '#resources-activity') }
  const activity = await anchorPosition(page, 'resources-activity'); check(activity.targetCount === 1 && activity.targetVisible, kind + ' actual Activities header anchor')
  return { values, top, activity }
}
async function skipActivation(page, kind) {
  const focused = await focusState(page)
  check(focused.text === 'Skip to content' && focused.visible, kind + ' first native Tab must visibly focus Skip to content')
  await page.keyboard.press('Enter'); await page.waitForFunction(() => location.hash === '#main-content')
  const position = await anchorPosition(page, 'main-content')
  const afterActivation = await focusState(page)
  await page.keyboard.press('Tab'); const nextFocus = await focusState(page)
  const nextFocusInsideMain = await page.evaluate(() => document.querySelector('main')?.contains(document.activeElement))
  check(position.targetCount === 1 && position.targetVisible, kind + ' skip link must reach the actual main element')
  if (kind === 'source') check(nextFocusInsideMain, 'Source skip link must place the next keyboard focus inside main')
  return { focused, position, afterActivation, nextFocus, nextFocusInsideMain }
}
async function controlAppearance(page, selector, state) {
  const element = page.locator(selector)
  await page.bringToFront()
  if (state === 'hover') await element.hover(); else { await page.keyboard.press('Tab'); await element.focus() }
  await settle(page)
  await within(element.evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))) }), 'Control transition ' + selector, 5000)
  return element.evaluate(element => {
    const css = getComputedStyle(element), arrow = element.querySelector('svg')
    return { hovered: element.matches(':hover'), focused: element === document.activeElement, focusVisible: element.matches(':focus-visible'), color: css.color, background: css.backgroundColor, borderColor: css.borderColor, radius: css.borderRadius, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor, outlineStyle: css.outlineStyle, outlineOffset: css.outlineOffset, boxShadow: css.boxShadow, decoration: css.textDecorationLine, underlineOffset: css.textUnderlineOffset, arrowTransform: arrow ? getComputedStyle(arrow).transform : null }
  })
}
async function targetTextQuality(page, selectors) {
  return page.evaluate(selectors => {
    const result = { documentOverflow: document.documentElement.scrollWidth > innerWidth + 1, clippedText: [], textOutsideViewport: [] }
    for (const [group, selector] of Object.entries(selectors)) {
      const root = document.querySelector(selector); if (!root) continue
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (!node.textContent.trim() || node.parentElement.closest('svg,.sr-only,.sl-footer-currency-label') || !node.parentElement.checkVisibility()) continue
        const range = document.createRange(); range.selectNodeContents(node); const lines = [...range.getClientRects()], clips = []
        for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          const css = getComputedStyle(parent), box = parent.getBoundingClientRect()
          if (['hidden', 'clip', 'auto', 'scroll'].includes(css.overflowX)) clips.push({ left: box.left + parent.clientLeft, right: box.left + parent.clientLeft + parent.clientWidth })
        }
        const data = { group, text: node.textContent.replace(/\s+/g, ' ').trim() }
        const clippedLines = lines.filter(box => clips.some(clip => box.left < clip.left - 1 || box.right > clip.right + 1)).length
        const outsideLines = lines.filter(box => box.left < -1 || box.right > innerWidth + 1).length
        if (clippedLines) result.clippedText.push({ ...data, clippedLines })
        if (outsideLines) result.textOutsideViewport.push({ ...data, outsideLines })
      }
    }
    return result
  }, selectors)
}
async function enlarge(page, kind, mobile) {
  const selectors = { header: groupsFor(kind).header.selector, ending: groupsFor(kind).ending.selector, ...(mobile ? { mobile: groupsFor(kind).mobile.selector } : {}) }
  const targets = Object.values(selectors).flatMap(root => ['a', 'button', 'summary', 'h2', 'h3', 'p', 'input', 'select', 'strong', 'span:not(.sr-only)'].map(tag => root + ' ' + tag)).join(',')
  const expected = await page.locator(targets).evaluateAll(elements => {
    const selected = elements.filter(element => element.checkVisibility() && !element.querySelector('select') && !element.closest('svg,.sr-only,.sl-footer-currency-label') && (element.textContent.trim() || element.matches('input,select')))
    const inherited = selected.flatMap(element => element.matches('h2') ? [...element.querySelectorAll('em')] : []).filter(element => !selected.includes(element))
    const metrics = [...selected, ...inherited].map(element => ({ element, direct: selected.includes(element), size: parseFloat(getComputedStyle(element).fontSize) * 2, line: parseFloat(getComputedStyle(element).lineHeight) * 2 }))
    for (const [index, metric] of metrics.entries()) { metric.element.dataset.qaEnlarged = String(index); if (metric.direct) metric.element.style.fontSize = metric.size + 'px' }
    return metrics.map(({ size, line }) => ({ size, line: Number.isFinite(line) ? line : null }))
  })
  await page.waitForFunction(expected => [...document.querySelectorAll('[data-qa-enlarged]')].every(element => {
    const i = Number(element.dataset.qaEnlarged), css = getComputedStyle(element); return Math.abs(parseFloat(css.fontSize) - expected[i].size) < 0.01 && (expected[i].line === null || Math.abs(parseFloat(css.lineHeight) - expected[i].line) < 0.01)
  }), expected, { timeout: 5000 })
  await settle(page)
  const actual = await page.locator('[data-qa-enlarged]').evaluateAll(elements => elements.sort((a, b) => Number(a.dataset.qaEnlarged) - Number(b.dataset.qaEnlarged)).map(element => ({ size: parseFloat(getComputedStyle(element).fontSize), line: Number.isFinite(parseFloat(getComputedStyle(element).lineHeight)) ? parseFloat(getComputedStyle(element).lineHeight) : null })))
  check(expected.length > 20 && actual.length === expected.length, kind + ' targeted enlargement text coverage')
  return { expected, actual, quality: await targetTextQuality(page, selectors) }
}

try {
  for (const [kind, page] of Object.entries(pages)) await ready(page, kind)
  report.loadedSourceAssets = await pages.source.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map(element => element.src || element.href))
  for (const width of widths) {
    const row = { width, comparisons: [] }
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize({ width, height: 1000 }); await ready(page, kind)
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: 'instant' }) }); await page.mouse.move(0, 0); await settle(page)
    }
    row.comparisons.push({ group: 'header', state: 'initial', ...(await comparison('header', 'initial-' + width, { position: true })) })
    for (const page of Object.values(pages)) { await page.evaluate(() => scrollTo({ top: 250, behavior: 'instant' })); await settle(page) }
    row.comparisons.push({ group: 'header', state: 'sticky', ...(await comparison('header', 'sticky-' + width, { position: true })) })
    row.comparisons.push({ group: 'ending', state: 'normal', ...(await comparison('ending', 'normal-' + width)) })
    for (const page of Object.values(pages)) { await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await settle(page) }
    if (width > 1130) {
      for (const name of ['books', 'resources']) {
        for (const [kind, page] of Object.entries(pages)) await openMenu(page, kind, name)
        row.comparisons.push({ group: name, state: 'open', ...(await comparison(name, 'open-' + width, { position: true })) })
        for (const [kind, page] of Object.entries(pages)) await closeMenus(page, kind)
      }
    } else {
      for (const [kind, page] of Object.entries(pages)) await openMobile(page, kind)
      for (const [state, indexes] of [['closed', []], ['books', [0]], ['resources', [1]], ['both', [0, 1]]]) {
        for (const [kind, page] of Object.entries(pages)) await disclosureState(page, kind, indexes)
        row.comparisons.push({ group: 'mobile', state, ...(await comparison('mobile', state + '-' + width, { position: true, screenshots: [390, 820].includes(width) || ['closed', 'both'].includes(state) })) })
      }
      for (const [kind, page] of Object.entries(pages)) { await page.locator(groupsFor(kind).mobile.selector).evaluate(element => { element.scrollTop = element.scrollHeight }); await settle(page) }
      row.comparisons.push({ group: 'mobile', state: 'both bottom', ...(await comparison('mobile', 'both-bottom-' + width, { position: true })) })
      for (const [kind, page] of Object.entries(pages)) await closeMobile(page, kind)
    }
    if ([390, 1440].includes(width)) for (const [kind, page] of Object.entries(pages)) {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await settle(page)
      await page.screenshot({ path: path.join(folder, 'header-context-' + kind + '-' + width + '.png'), animations: 'disabled', caret: 'hide' })
      await page.locator(groupsFor(kind).ending.selector).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 115, behavior: 'instant' })); await settle(page)
      await page.screenshot({ path: path.join(folder, 'ending-context-' + kind + '-' + width + '.png'), animations: 'disabled', caret: 'hide' })
    }
    report.widths.push(row)
  }
  for (const viewport of [{ width: 390, height: 600 }, { width: 1440, height: 900 }]) {
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize(viewport); await ready(page, kind); await page.keyboard.press('Tab'); await settle(page)
    }
    const visual = await comparison('skip', 'focused-' + viewport.width, { position: true }), values = {}
    for (const [kind, page] of Object.entries(pages)) values[kind] = await skipActivation(page, kind)
    report.states.push({ state: 'native skip link appearance, destination and keyboard continuation', viewport, ...visual, activation: values })
  }
  for (const width of [1280, 1440]) {
    const keyboard = {}, pointer = {}
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize({ width, height: 1000 }); await ready(page, kind)
      keyboard[kind] = await desktopKeyboard(page, kind); pointer[kind] = await pointerContract(page, kind)
    }
    check(JSON.stringify(comparableFocus(keyboard.published)) === JSON.stringify(comparableFocus(keyboard.source)), 'Desktop keyboard and focus appearance differs at ' + width)
    check(JSON.stringify(pointer.published) === JSON.stringify(pointer.source), 'Desktop pointer behaviour differs at ' + width)
    report.states.push({ state: 'desktop keyboard and pointer', width, keyboard, pointer })
  }
  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 320 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) { await page.setViewportSize(viewport); await ready(page, kind); values[kind] = await mobileContract(page, kind) }
    check(JSON.stringify(comparableFocus(values.published)) === JSON.stringify(comparableFocus(values.source)), 'Mobile interaction or focus appearance differs at ' + viewport.width + 'x' + viewport.height)
    report.states.push({ state: 'mobile dialog keyboard and short screen', viewport, ...values })
  }
  for (const viewport of [{ width: 390, height: 600 }, { width: 600, height: 600 }, { width: 1440, height: 600 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) values[kind] = await anchorHistory(page, kind, viewport)
    report.states.push({ state: 'actual header/footer anchor navigation and Back/Forward', viewport, ...values })
  }
  for (const [kind, page] of Object.entries(pages)) {
    await page.setViewportSize({ width: 1440, height: 1000 }); await ready(page, kind)
    report.states.push({ state: 'currency selection persistence and invalid preference', kind, ...(await currencyContract(page, kind)) })
  }
  for (const motion of ['reduce', 'no-preference']) {
    for (const [kind, page] of Object.entries(pages)) { await page.emulateMedia({ reducedMotion: motion }); await ready(page, kind) }
    for (const name of ['books', 'resources']) {
      for (const [kind, page] of Object.entries(pages)) await openMenu(page, kind, name)
      report.states.push({ state: 'desktop panel motion preference', name, motion, ...(await comparison(name, 'motion-' + motion, { screenshots: false, position: true })) })
      for (const [kind, page] of Object.entries(pages)) await closeMenus(page, kind)
    }
    for (const [name, selector] of [
      ['header action', kind => groupsFor(kind).header.selector + (kind === 'published' ? ' .header-find-book' : ' .sl-header-primary')],
      ['newsletter action', kind => kind === 'published' ? '.newsletter-inline-preview a' : '.sl-newsletter-subscribe'],
      ['newsletter email', kind => groupsFor(kind).ending.selector + ' input'],
      ['currency', kind => groupsFor(kind).ending.selector + ' select'],
      ['footer contact', kind => groupsFor(kind).ending.selector + ' a[href="https://storileaf.com/contact/"]'],
    ]) for (const state of name === 'newsletter email' || name === 'currency' ? ['focus'] : ['hover', 'focus']) {
      const values = {}
      for (const [kind, page] of Object.entries(pages)) {
        const actualSelector = selector(kind) + (name === 'footer contact' ? ':last-child' : '')
        await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur())
        values[kind] = await controlAppearance(page, actualSelector, state)
      }
      check(JSON.stringify(comparableFocus(values.published)) === JSON.stringify(comparableFocus(values.source)), name + ' ' + state + ' appearance under ' + motion)
      report.states.push({ state: 'shared control ' + state, name, motion, ...values })
    }
    for (const [kind, page] of Object.entries(pages)) await closeMenus(page, kind)
  }
  for (const kind of ['published', 'source']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }), page = await context.newPage()
    try {
      await ready(page, kind)
      await page.evaluate(() => {
        window.__sharedNavigationEvents = []
        const record = event => {
          const target = document.getElementById('resources-activity')
          window.__sharedNavigationEvents.push({ event: event.type, time: performance.now(), hash: location.hash, scrollY, targetTop: target?.getBoundingClientRect().top, documentHeight: document.documentElement.scrollHeight, focusLabel: document.activeElement?.getAttribute('aria-label') })
        }
        for (const type of ['focusin', 'hashchange', 'scroll']) window.addEventListener(type, record, true)
      })
      await page.getByRole('button', { name: 'Open navigation' }).tap(); await page.locator(groupsFor(kind).mobile.selector).waitFor()
      const summaries = page.locator(groupsFor(kind).mobile.selector + ' summary'); await summaries.nth(0).tap(); await summaries.nth(1).tap()
      const bothOpen = await page.locator(groupsFor(kind).mobile.selector + ' details').evaluateAll(elements => elements.every(element => element.open))
      await page.locator(groupsFor(kind).mobile.selector).getByRole('link', { name: 'Activities and games', exact: true }).tap(); await page.waitForFunction(() => location.hash === '#resources-activity')
      const position = await anchorPosition(page, 'resources-activity', { requireSettled: kind === 'source' }), dismissed = !await page.locator(groupsFor(kind).mobile.selector).isVisible()
      const events = await page.evaluate(() => window.__sharedNavigationEvents)
      check(bothOpen && dismissed && position.targetVisible, kind + ' touch disclosures or local anchor activation')
      if (kind === 'published' && !position.settled) {
        const restored = events.find(event => event.event === 'focusin' && event.focusLabel === 'Open navigation' && event.hash === '#resources-activity')
        const knownFocusRestoration = restored && position.targetCount === 1 && position.targetVisible && Math.abs(restored.scrollY - position.scrollY) <= 1.1 && Math.abs(restored.targetTop - position.targetTop) <= 1.1
        check(knownFocusRestoration, 'Published touch anchor failure did not match the independently reproduced Dialog focus-restoration defect')
        if (knownFocusRestoration) report.inheritedNavigationFindings.push({ id: 'published-touch-dialog-anchor-focus', status: 'The protected published Dialog restores trigger focus after hash navigation and moves the target away from its intended offset in emulated touch. The source restores trigger focus with preventScroll and must retain the correct native hash position. The protected page is unchanged.', viewport: { width: 390, height: 700 }, position, events })
      }
      report.states.push({ state: 'emulated touch independent disclosures and actual anchor', kind, viewport: { width: 390, height: 700 }, bothOpen, dismissed, position, events })
    } finally { await context.close() }
  }
  for (const kind of ['published', 'source']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    await context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Read-only QA storage unavailable simulation', 'SecurityError') } }) })
    const page = await context.newPage(), runtimeErrors = []; page.on('pageerror', error => runtimeErrors.push(error.message))
    try {
      await ready(page, kind); const select = page.locator(groupsFor(kind).ending.selector + ' select'); const initial = await select.inputValue(); await select.selectOption('usd'); await settle(page)
      const changed = await select.inputValue(), pricing = await page.locator(groupsFor(kind).header.selector).getByRole('link', { name: 'Pricing', exact: true }).getAttribute('href')
      check(initial === 'inr' && changed === 'usd' && pricing.endsWith('/pricing/usd') && runtimeErrors.length === 0, kind + ' blocked storage must preserve in-memory currency selection')
      report.states.push({ state: 'storage unavailable simulation', kind, initial, changed, pricing, runtimeErrors })
    } finally { await context.close() }
  }
  for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) {
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize(viewport); await ready(page, kind)
      if (viewport.width <= 1130) { await openMobile(page, kind); await disclosureState(page, kind, [0, 1]) }
      else await openMenu(page, kind, 'books', 'keyboard')
      values[kind] = await enlarge(page, kind, viewport.width <= 1130)
    }
    check(JSON.stringify(values.published.quality) === JSON.stringify(values.source.quality), 'Targeted enlarged shared text clipping differs at ' + viewport.width)
    report.states.push({ state: 'targeted 200 percent shared text enlargement', viewport, ...values })
    if (values.published.quality.documentOverflow || values.published.quality.clippedText.length || values.published.quality.textOutsideViewport.length) report.qualityFindings.push({ id: 'shared-enlarged-text-' + viewport.width, status: 'Inherited published limitation retained for a separately approved visible refinement.', viewport, published: values.published.quality, source: values.source.quality })
    const name = viewport.width <= 1130 ? 'mobile' : 'books'
    report.states.push({ state: 'enlarged rendered panel', group: name, viewport, ...(await comparison(name, 'enlarged-' + viewport.width, { allowQualityOverflow: true, screenshots: false })) })
    for (const [kind, page] of Object.entries(pages)) {
      await page.screenshot({ path: path.join(folder, 'enlarged-context-' + kind + '-' + viewport.width + '.png'), animations: 'disabled', caret: 'hide' })
      if (viewport.width <= 1130) await closeMobile(page, kind); else await closeMenus(page, kind)
    }
    report.states.push({ state: 'enlarged rendered ending', group: 'ending', viewport, ...(await comparison('ending', 'enlarged-' + viewport.width, { allowQualityOverflow: true })) })
  }
} catch (error) { problems.push(String(error.stack || error)) }
finally {
  await browser.close(); report.completedAt = new Date().toISOString(); report.completeWidthSet = JSON.stringify(report.widths.map(row => row.width)) === JSON.stringify(requiredWidths)
  report.enlargementMeasurementsComplete = report.states.filter(state => state.state === 'targeted 200 percent shared text enlargement').length === 2
  await fs.writeFile(path.join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const comparisons = [...report.widths.flatMap(row => row.comparisons.map(item => ({ title: row.width + 'px ' + item.group + ' ' + item.state, filename: item.filename }))), ...report.states.filter(state => state.filename).map(state => ({ title: state.state + ' ' + state.viewport.width + 'px', filename: state.filename }))].filter(item => item.filename)
  const cards = comparisons.map(item => '<section><h2>' + item.title + '</h2><a href="' + item.filename + '"><img loading="lazy" src="' + item.filename + '" alt="Published and React comparison"></a></section>').join('')
  const status = '<p>' + report.widths.length + ' of ' + requiredWidths.length + ' widths completed. ' + comparisons.length + ' screenshot pairs. ' + report.states.length + ' state records. ' + problems.length + ' problems.</p><p>' + (problems.length ? 'This run failed or was interrupted. Read the report before using the evidence.' : report.completeWidthSet ? 'The complete width matrix finished with no recorded parity problems.' : 'Focused width run only. This does not establish the full matrix.') + '</p>'
  const quality = '<p>' + (!report.enlargementMeasurementsComplete ? 'Both enlargement scenarios did not complete. There is no complete enlargement conclusion.' : report.qualityFindings.length ? 'Inherited enlargement findings remain open. Matching the current page does not establish an enlargement quality pass.' : 'The two targeted enlargement scenarios completed without a clipping or document overflow finding.') + '</p>'
  const navigation = '<p>The native skip-link continuation and local anchor focus behaviour are recorded separately from visual parity. The source must correctly skip header keyboard navigation and preserve native hash placement. Observed inherited published touch focus findings: ' + report.inheritedNavigationFindings.length + '. The protected published page remains unchanged.</p>'
  await fs.writeFile(path.join(folder, 'review.html'), '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StoriLeaf shared component parity</title><style>body{max-width:1500px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;background:#f9f8f6;color:#253526}img{width:100%;height:auto;border:1px solid #ddd}section{margin-top:48px}h1,h2{line-height:1.2}</style><h1>StoriLeaf shared component comparisons</h1><p>Published components appear on the left and the isolated React source appears on the right. Open an image at its original resolution. This is migration evidence and does not publish the incomplete React homepage.</p>' + status + quality + navigation + '<p><a href="report.json">Open the complete report</a></p>' + cards + '</html>')
}
console.log(JSON.stringify({ browser: report.browser, completeWidthSet: report.completeWidthSet, widths: report.widths.map(row => row.width), states: report.states.length, captures: report.captures.length, qualityFindings: report.qualityFindings, inheritedNavigationFindings: report.inheritedNavigationFindings.length, problems }))
if (problems.length) process.exitCode = 1
