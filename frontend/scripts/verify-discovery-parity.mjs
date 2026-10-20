import { tabMinimumEquivalent, cleanQuality, discoveryReflowDimension } from './reflow-contract.mjs'
import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

// The protected page and the separate React build are rendered as served.
// No target content, styles, assets, route responses or tab handlers are replaced.
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/',
}
const requiredWidths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const widths = process.env.STORILEAF_DISCOVERY_WIDTHS ? process.env.STORILEAF_DISCOVERY_WIDTHS.split(',').map(Number) : requiredWidths
const slugs = ['life-story', 'travel-memoir', 'relationship-memoir', 'founders-memoir', 'parent-to-child-letters', 'celebrating-occasions']
const labels = ['Life Story', 'Travel Memoir', 'Relationship Memoir', "Founder's Memoir", 'Parent to Child Letters', 'Celebrating Occasions']
const folder = 'qa/discovery', problems = []
const check = (ok, message) => { if (!ok) problems.push(message) }
const hash = value => createHash('sha256').update(value).digest('hex')
const report = {
  protectedBaseline: 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b',
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(), urls, requestedWidths: widths, browser: '',
  widths: [], states: [], captures: [], qualityFindings: [], inheritedNavigationFindings: [], problems,
  thresholds: { geometryCssPixels: 0.15, screenshotChannelDifference: 24, screenshotChangedRatio: 0.01 },
  scope: 'The six-book discovery section, its native Radix tabs and actual Books anchor integration. Exact inherited panel words, all eighteen bullets, destinations, photos and crops are compared with the protected page. The incomplete React homepage is not published by this workflow.',
  captureMethod: 'Each width starts from a fresh real page load. Actual Newsreader/Manrope fonts and each selected photograph are decoded. Full section crops temporarily extend viewport height and apply a recorded body padding-top adjustment below one CSS pixel to align the section document origin. Target dimensions and full visible bounds must remain unchanged. The sticky header is retained outside the section crop; context captures retain the requested viewport. No target CSS or image is substituted.',
  interactionMethod: 'The actual tab buttons are clicked, tapped or operated with keyboard keys. Selection and automatic active-tab reveal must settle before measurement. Radix-generated IDs are recorded and checked through their real tab-to-panel relationships rather than compared as literal strings. Initial Radix tablist entry and subsequent roving tab stops are distinguished.',
  destinationMethod: 'Every panel action must keep the exact original https://storileaf.com/{book-slug}/ destination. Equality of an href does not establish the availability or behaviour of that external product page. Source shared Books links must target the one actual local #books section, with native fragment, history and measured scroll checks; the protected router is left intact.',
  inheritedNavigationMethod: 'Main navigation runs use the untouched native controls. If the protected mobile Books link exhibits the known trigger-focus scroll drift, a separate fresh page records geometry immediately before and after the trigger focus method while delegating the original call with identical receiver and arguments. This diagnostic must first reach the intended anchor and then reproduce the untouched run position. It does not suppress focus or scroll, intercept links, or alter source behaviour.',
  equivalentRepresentations: [
    'The loaded first font family must match; unused fallback family lists may differ.',
    'Invisible zero-width borders and outlines with style none have no visible colour or offset. Raw values remain recorded.',
    'Zero-size, fully transparent Tailwind shadow layers have no visible effect. Any visible focus ring or other shadow remains compared.',
    'Effectively instantaneous 0s and 0.00001s reduced-motion durations are equivalent. Normal-motion durations and active indicator/photo behaviour remain compared.',
    'Font inheritance on pixel-sized SVGs and photographs has no rendered text. Geometry, SVG shape data, image metadata and visible colours remain compared.',
    'The mask directions to right and 90deg are mathematically identical. All gradient stops, colours and other mask properties remain compared.',
    'A sizes attribute cannot select another resource when both photographs have no srcset. Only that unused attribute is excluded in this exact case; raw values remain recorded, and src, actual currentSrc, alt, declared/natural dimensions, loading, decoding and crop must still match.',
  ],
  limits: 'Chromium automation, emulated touch and targeted discovery-text enlargement. This is not native browser zoom, cross-browser, physical-device or accessibility certification. Inherited enlargement findings remain distinct from migration parity. Pricing and external product behaviour are outside this bounded gate.',
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
report.packageFiles = {}
for (const file of ['package.json', 'package-lock.json']) report.packageFiles[file] = hash(await fs.readFile(file))
const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8')), packageLock = JSON.parse(await fs.readFile('package-lock.json', 'utf8')), installedTabs = JSON.parse(await fs.readFile('node_modules/@radix-ui/react-tabs/package.json', 'utf8'))
report.dependencies = { declaredReactTabs: packageJson.dependencies['@radix-ui/react-tabs'], lockedReactTabs: packageLock.packages['node_modules/@radix-ui/react-tabs'].version, installedReactTabs: installedTabs.version, installedTabsModuleSha256: hash(await fs.readFile('node_modules/@radix-ui/react-tabs/dist/index.mjs')) }
report.sourceBuildFiles = { 'index.html': hash(await fs.readFile('dist/index.html')) }
for (const entry of await fs.readdir('dist/assets')) if (/\.(css|js)$/.test(entry)) report.sourceBuildFiles['assets/' + entry] = hash(await fs.readFile('dist/assets/' + entry))
report.harnessSha256 = hash(await fs.readFile('scripts/verify-discovery-parity.mjs'))

const css = (kind, name) => '.' + (kind === 'source' ? 'sl-' : '') + name
const section = '#books', panel = '#books [role="tabpanel"][data-state="active"]'
const tab = (page, index) => page.locator('#books [role="tab"]').nth(index)
const styles = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopColor', 'borderBottomColor', 'borderRadius', 'boxShadow', 'outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset', 'textAlign', 'textWrap', 'whiteSpace', 'overflowWrap', 'display', 'position', 'order', 'flex', 'gridTemplateColumns', 'gap', 'minWidth', 'minHeight', 'maxWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'overflowX', 'overflowY', 'overscrollBehaviorInline', 'scrollPaddingLeft', 'scrollPaddingRight', 'maskImage', 'scrollbarWidth', 'scrollbarColor', 'objectFit', 'objectPosition', 'transform', 'opacity', 'textDecorationLine', 'transitionDuration', 'transitionTimingFunction', 'transitionProperty', 'animationDuration', 'animationTimingFunction', 'animationFillMode']
const pseudoStyles = ['content', 'display', 'position', 'left', 'right', 'top', 'bottom', 'width', 'height', 'borderRadius', 'backgroundColor', 'opacity', 'transform', 'transitionDuration', 'transitionTimingFunction', 'transitionProperty']
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
report.browser = browser.version()
const pages = {}, contexts = {}
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
  await within(page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))), 'Foreground viewport readiness')
}
async function ready(page, kind, hash = '') {
  await page.bringToFront(); await page.goto(urls[kind] + hash, { waitUntil: 'domcontentloaded' })
  await page.locator(section + ' [role="tablist"]').waitFor()
  await within(page.evaluate(async () => {
    await Promise.all([document.fonts.load('450 50px Newsreader'), document.fonts.load('italic 420 50px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('500 16px Manrope'), document.fonts.load('600 17px Manrope'), document.fonts.load('650 17px Manrope')]); await document.fonts.ready
    if (!document.fonts.check('450 50px Newsreader') || !document.fonts.check('650 17px Manrope')) throw new Error('Required real discovery fonts failed to load')
    await Promise.all([...document.querySelectorAll('header img')].map(image => image.decode()))
  }), kind + ' fonts and header image', 45000)
  if (!hash) {
    await page.locator(section).scrollIntoViewIfNeeded()
    await page.locator(panel + ' img').evaluate(image => image.decode())
    await page.evaluate(() => scrollTo({ top: scrollY + document.getElementById('books').getBoundingClientRect().top - 115, behavior: 'instant' }))
  }
  await page.mouse.move(0, 0); await settle(page)
}
async function selectedReady(page, index, { requireReveal = true } = {}) {
  await tab(page, index).waitFor({ state: 'visible' })
  await page.waitForFunction(index => document.querySelectorAll('#books [role="tab"]')[index]?.getAttribute('aria-selected') === 'true', index)
  await page.locator(panel + ' img').evaluate(image => image.decode())
  await within(page.locator(section).evaluate(async element => { await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))) }), 'Discovery state animation', 5000)
  if (requireReveal) await page.waitForFunction(index => {
    const active = document.querySelectorAll('#books [role="tab"]')[index], rail = document.querySelector('.book-tabs-scroll,.sl-book-tabs-scroll')
    const r = rail.getBoundingClientRect(), a = active.getBoundingClientRect()
    return a.left >= r.left - 1 && a.right <= r.right + 1
  }, index, { timeout: 5000 })
  await settle(page)
}
async function choose(page, index, method = 'click') {
  await page.bringToFront()
  if (method === 'tap') await tab(page, index).tap(); else await tab(page, index).click()
  await selectedReady(page, index)
}
async function snapshot(page, kind) {
  await settle(page)
  const names = [
    ['section', ':scope'], ['container', ':scope > div'], ['heading', css(kind, 'discovery-heading')],
    ['title', '#books-title'], ['emphasis', '#books-title em'], ['description', css(kind, 'discovery-description')],
    ['tabs', '[data-testid="books-grid"]'], ['rail', css(kind, 'book-tabs-scroll')], ['list', '[role="tablist"]'],
    ...slugs.map((_, i) => ['tab' + i, '[role="tab"]', i]),
    ['panel', '[role="tabpanel"][data-state="active"]'], ['copy', css(kind, 'book-detail-copy')],
    ['intro', css(kind, 'book-detail-intro')], ['points', css(kind, 'book-detail-points')],
    ...Array.from({ length: 3 }, (_, i) => ['point' + i, css(kind, 'book-detail-points') + ' li', i]),
    ['action', '[role="tabpanel"][data-state="active"] a'], ['arrow', '[role="tabpanel"][data-state="active"] a svg'],
    ['visual', css(kind, 'book-detail-visual')], ['photo', '[role="tabpanel"][data-state="active"] img'],
  ]
  return page.locator(section).evaluate((root, { names, styles, pseudoStyles }) => {
    const origin = root.getBoundingClientRect(), normal = value => (value || '').replace(/\s+/g, ' ').trim(), round = value => Math.round(value * 1000) / 1000
    const pickStyle = (element, pseudo) => { const computed = getComputedStyle(element, pseudo); return Object.fromEntries((pseudo ? pseudoStyles : styles).map(key => [key, computed[key]])) }
    const nodes = {}
    for (const [name, selector, index = 0] of names) {
      const element = selector === ':scope' ? root : root.querySelectorAll(selector)[index]
      if (!element) { nodes[name] = null; continue }
      const r = element.getBoundingClientRect()
      nodes[name] = { tag: element.tagName, text: element.matches('h2,p,em,li,a,button') ? normal(element.textContent) : null, visible: element.checkVisibility(), geometry: { x: round(r.x - origin.x), y: round(r.y - origin.y), width: round(r.width), height: round(r.height) }, styles: pickStyle(element), pseudo: name.startsWith('tab') && element.getAttribute('role') === 'tab' ? pickStyle(element, '::after') : /^point\d$/.test(name) ? pickStyle(element, '::before') : null }
    }
    const list = root.querySelector('[role="tablist"]'), rail = root.querySelector('.book-tabs-scroll,.sl-book-tabs-scroll'), tabs = [...root.querySelectorAll('[role="tab"]')], panels = [...root.querySelectorAll('[role="tabpanel"]')]
    const relationships = tabs.map((element, i) => {
      const target = document.getElementById(element.getAttribute('aria-controls'))
      return { label: normal(element.textContent), tag: element.tagName, type: element.type, selected: element.getAttribute('aria-selected'), state: element.dataset.state, tabIndex: element.tabIndex, disabled: element.disabled, id: element.id, controls: element.getAttribute('aria-controls'), uniqueId: document.querySelectorAll('[id="' + element.id + '"]').length === 1, panelIndex: panels.indexOf(target), paired: target === panels[i] && target?.getAttribute('aria-labelledby') === element.id }
    })
    const active = tabs.find(element => element.getAttribute('aria-selected') === 'true'), ar = active?.getBoundingClientRect(), rr = rail.getBoundingClientRect(), image = root.querySelector('[role="tabpanel"][data-state="active"] img'), action = root.querySelector('[role="tabpanel"][data-state="active"] a')
    return {
      nodes, section: { tag: root.tagName, id: root.id, labelledBy: root.getAttribute('aria-labelledby'), uniqueId: document.querySelectorAll('#books').length === 1, titleTag: document.getElementById(root.getAttribute('aria-labelledby'))?.tagName },
      tabs: relationships, list: { role: list.getAttribute('role'), orientation: list.getAttribute('aria-orientation'), tabIndex: list.tabIndex, railLabel: rail.getAttribute('aria-label') },
      panels: panels.map(element => ({ role: element.getAttribute('role'), id: element.id, labelledBy: element.getAttribute('aria-labelledby'), uniqueId: document.querySelectorAll('[id="' + element.id + '"]').length === 1, state: element.dataset.state, hidden: element.hidden, visible: element.checkVisibility(), tabIndex: element.tabIndex, childCount: element.children.length })),
      rail: { scrollLeft: rail.scrollLeft, clientWidth: rail.clientWidth, scrollWidth: rail.scrollWidth, activeFullyRevealed: ar.left >= rr.left - 1 && ar.right <= rr.right + 1 },
      content: { title: normal(root.querySelector('#books-title').textContent), description: normal(root.querySelector('.discovery-description,.sl-discovery-description').textContent), intro: normal(root.querySelector('.book-detail-intro,.sl-book-detail-intro').textContent), bullets: [...root.querySelectorAll('.book-detail-points li,.sl-book-detail-points li')].map(element => normal(element.textContent)), action: { text: normal(action.textContent), rawHref: action.getAttribute('href'), href: action.href, current: action.getAttribute('aria-current') } },
      image: { src: image.getAttribute('src'), currentSrc: image.currentSrc, srcset: image.getAttribute('srcset'), sizes: image.getAttribute('sizes'), alt: image.alt, width: image.getAttribute('width'), height: image.getAttribute('height'), loading: image.loading, decoding: image.decoding, loaded: image.complete && image.naturalWidth > 0, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
      icons: [...root.querySelectorAll('svg')].map(svg => ({ viewBox: svg.getAttribute('viewBox'), strokeWidth: getComputedStyle(svg).strokeWidth, shapes: [...svg.querySelectorAll('path,line,polyline,circle')].map(shape => ({ tag: shape.tagName, data: [...shape.attributes].filter(attr => !['class', 'style'].includes(attr.name)).map(attr => [attr.name, attr.value]).sort() })) })),
      photoAnimation: image.getAnimations().map(animation => ({ timing: animation.effect.getTiming(), keyframes: animation.effect.getKeyframes().map(({ offset, easing, opacity, transform }) => ({ offset, easing, opacity, transform })) })),
      documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    }
  }, { names, styles, pseudoStyles })
}
function normalStyle(key, value, all) {
  if (key === 'fontFamily') return value.split(',')[0]
  if (['transitionDuration', 'animationDuration'].includes(key) && value.split(',').every(item => parseFloat(item) <= 0.00001)) return 'instant'
  if (key.startsWith('outline') && (all.outlineStyle === 'none' || all.outlineWidth === '0px')) return 'invisible'
  if (/^border(Top|Bottom)Color$/.test(key) && all[key.replace('Color', 'Width')] === '0px') return 'invisible'
  if (key === 'boxShadow') return value.split(/,(?![^()]*\))/).map(item => item.trim()).filter(item => !/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px$/.test(item)).join(', ') || 'none'
  if (key === 'maskImage') return value.replace('linear-gradient(to right,', 'linear-gradient(90deg,')
  return value
}
function compare(before, after, label, { enlarged = false } = {}) {
  const differences = []
  const delta = after.nodes.list.geometry.height - before.nodes.list.geometry.height
  for (const name of Object.keys(before.nodes)) {
    const b = before.nodes[name], a = after.nodes[name]
    if (!b || !a) { differences.push(name + ' missing'); continue }
    if (b.text !== a.text || b.visible !== a.visible) differences.push(name + ' text or visibility differs')
    for (const property of Object.keys(b.geometry)) if (Math.abs(b.geometry[property] - a.geometry[property]) > 0.15 && !(enlarged && discoveryReflowDimension(name, property, b.geometry[property], a.geometry[property], delta))) differences.push(name + ' ' + property + ' ' + b.geometry[property] + ' -> ' + a.geometry[property])
    for (const key of styles) {
      if (key === 'minWidth' && tabMinimumEquivalent(name, b.styles[key], a.styles[key])) continue
      if (['IMG', 'svg'].includes(b.tag) && ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing'].includes(key)) continue
      if (normalStyle(key, b.styles[key], b.styles) !== normalStyle(key, a.styles[key], a.styles)) differences.push(name + ' ' + key + ' ' + b.styles[key] + ' -> ' + a.styles[key])
    }
    if (b.pseudo && a.pseudo) for (const key of pseudoStyles) if (normalStyle(key, b.pseudo[key], b.pseudo) !== normalStyle(key, a.pseudo[key], a.pseudo)) differences.push(name + ' pseudo ' + key + ' differs')
  }
  for (const key of ['section', 'list', 'content', 'icons', 'rail', 'photoAnimation']) {
    if (enlarged && key === 'rail') {
      if (before.rail.clientWidth !== after.rail.clientWidth || !after.rail.activeFullyRevealed || !Number.isFinite(after.rail.scrollWidth) || after.rail.scrollWidth < after.rail.clientWidth || after.rail.scrollLeft < -1 || after.rail.scrollLeft > after.rail.scrollWidth - after.rail.clientWidth + 1) differences.push('P4-03 accessible scroll rail contract')
    } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) differences.push(key + ' differs')
  }
  const comparableImage = image => { const { sizes, ...required } = image; return !before.image.srcset && !after.image.srcset ? required : image }
  if (JSON.stringify(comparableImage(before.image)) !== JSON.stringify(comparableImage(after.image))) differences.push('image differs')
  const semantic = data => ({ tabs: data.tabs.map(({ id, controls, ...rest }) => rest), panels: data.panels.map(({ id, labelledBy, ...rest }) => rest) })
  if (JSON.stringify(semantic(before)) !== JSON.stringify(semantic(after))) differences.push('tab/panel semantics differ')
  if (enlarged) check(!after.documentOverflow, label + ' repaired enlarged document must fit')
  else check(!before.documentOverflow && !after.documentOverflow, label + ' document overflow')
  check(!differences.length, label + ' differs: ' + differences.slice(0, 18).join('; '))
  return differences
}
function contract(data, kind, index) {
  check(data.section.tag === 'SECTION' && data.section.id === 'books' && data.section.uniqueId && data.section.titleTag === 'H2', kind + ' Books section semantics')
  check(data.tabs.length === 6 && data.panels.length === 6 && data.tabs.every((t, i) => t.label === labels[i] && t.tag === 'BUTTON' && t.type === 'button' && t.paired && t.uniqueId && !t.disabled && t.selected === String(i === index)), kind + ' six exact tabs and live relationships')
  check(data.panels.every((p, i) => p.uniqueId && p.role === 'tabpanel' && p.visible === (i === index) && p.hidden === (i !== index) && p.tabIndex === 0), kind + ' active/inactive panel semantics')
  check(data.tabs.filter(t => t.tabIndex === 0).length <= 1 && data.list.role === 'tablist' && data.list.orientation === 'horizontal' && data.list.tabIndex === 0, kind + ' Radix horizontal tab entry and roving tab stops')
  check(data.content.bullets.length === 3 && data.content.action.text === 'Explore this book' && data.content.action.href === 'https://storileaf.com/' + slugs[index] + '/' && data.content.action.current === null, kind + ' exact panel action and three bullets ' + slugs[index])
  check(data.image.loaded && data.image.loading === 'lazy' && data.image.decoding === 'async' && data.image.width === '850' && data.image.height === '660', kind + ' actual panel photograph and loading contract')
}
async function capture(page, filename) {
  const viewport = page.viewportSize(), original = await page.locator(section).boundingBox(), originalScroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }))
  await page.setViewportSize({ width: viewport.width, height: Math.max(viewport.height, Math.ceil(original.height) + 300) }); await settle(page)
  const adjustment = await page.locator(section).evaluate(element => {
    const r = element.getBoundingClientRect(), top = r.top + scrollY, delta = Math.ceil(top) - top, before = document.body.style.paddingTop, padding = parseFloat(getComputedStyle(document.body).paddingTop) + delta
    document.body.style.paddingTop = padding + 'px'
    return { before, padding, delta, originalDocumentTop: top }
  })
  try {
    await settle(page)
    await page.waitForFunction(padding => Math.abs(parseFloat(getComputedStyle(document.body).paddingTop) - padding) < 0.001, adjustment.padding)
    await page.locator(section).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 115, behavior: 'instant' })); await settle(page)
    const geometry = await page.locator(section).evaluate(element => { const r = element.getBoundingClientRect(), h = document.querySelector('.site-header,.sl-header').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, width: r.width, height: r.height, left: r.left, right: r.right, headerBottom: h.bottom, viewportWidth: innerWidth, viewportHeight: innerHeight, documentTop: r.top + scrollY } })
    const dimensionsUnchanged = Math.abs(original.width - geometry.width) < 0.015 && Math.abs(original.height - geometry.height) < 0.015
    check(dimensionsUnchanged && adjustment.delta >= 0 && adjustment.delta < 1, filename + ' capture preparation changed target dimensions')
    check(geometry.top > geometry.headerBottom + 5 && geometry.bottom <= geometry.viewportHeight + 0.1 && geometry.left >= 0 && geometry.right <= geometry.viewportWidth + 0.1, filename + ' full target does not fit visible capture bounds')
    report.captures.push({ filename, viewport, originalScroll, adjustment, dimensionsUnchanged, geometry })
    return await page.locator(section).screenshot({ path: path.join(folder, filename), animations: 'disabled', caret: 'hide' })
  } finally { await page.evaluate(before => { document.body.style.paddingTop = before }, adjustment.before); await page.setViewportSize(viewport); await settle(page); await page.evaluate(position => scrollTo({ left: position.x, top: position.y, behavior: 'instant' }), originalScroll); await settle(page) }
}
async function pixels(left, right, filename, equalityRequired = true) {
  await pixelPage.bringToFront()
  const result = await within(pixelPage.evaluate(async ({ left, right }) => {
    const load = data => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = 'data:image/png;base64,' + data })
    const [a, b] = await Promise.all([load(left), load(right)]), canvas = document.createElement('canvas'); canvas.width = a.width + b.width + 24; canvas.height = Math.max(a.height, b.height) + 38
    const pen = canvas.getContext('2d'); pen.fillStyle = '#fff'; pen.fillRect(0, 0, canvas.width, canvas.height); pen.fillStyle = '#253526'; pen.font = '16px sans-serif'; pen.fillText('Published', 12, 25); pen.fillText('React', a.width + 36, 25); pen.drawImage(a, 0, 38); pen.drawImage(b, a.width + 24, 38)
    let changedPixels = null, changedRatio = null
    if (a.width === b.width && a.height === b.height) { const x = pen.getImageData(0, 38, a.width, a.height).data, y = pen.getImageData(a.width + 24, 38, b.width, b.height).data; changedPixels = 0; for (let i = 0; i < x.length; i += 4) if (Math.max(Math.abs(x[i] - y[i]), Math.abs(x[i + 1] - y[i + 1]), Math.abs(x[i + 2] - y[i + 2])) > 24) changedPixels++; changedRatio = changedPixels / (a.width * a.height) }
    return { publishedSize: [a.width, a.height], sourceSize: [b.width, b.height], changedPixels, changedRatio, data: canvas.toDataURL('image/png').split(',')[1] }
  }, { left: left.toString('base64'), right: right.toString('base64') }), 'Discovery pixel comparison ' + filename)
  await fs.writeFile(path.join(folder, filename), Buffer.from(result.data, 'base64')); delete result.data
  result.equalityRequired = equalityRequired
  if (equalityRequired) check(result.changedRatio !== null && result.changedRatio <= 0.01, filename + ' pixels differ ' + result.changedRatio)
  return result
}
async function comparison(label, options = {}) {
  const published = await snapshot(pages.published, 'published'), source = await snapshot(pages.source, 'source'), differences = compare(published, source, label, options)
  let filename = null, pixelResult = null
  if (options.screenshots !== false) {
    const a = await capture(pages.published, 'published-' + label + '.png'), b = await capture(pages.source, 'source-' + label + '.png')
    filename = 'comparison-' + label + '.png'; pixelResult = await pixels(a, b, filename, !options.enlarged)
  }
  return { published, source, differences, pixels: pixelResult, filename, authorisedReflow: options.enlarged ? 'P4-03' : null }
}
async function focusState(page) {
  await settle(page)
  await within(page.evaluate(async () => { await Promise.all(document.activeElement.getAnimations().map(animation => animation.finished.catch(() => {}))) }), 'Focused discovery control', 5000)
  return page.evaluate(keys => {
    const element = document.activeElement, s = getComputedStyle(element)
    return { tag: element.tagName, role: element.getAttribute('role'), text: element.textContent.replace(/\s+/g, ' ').trim(), focusVisible: element.matches(':focus-visible'), href: element.getAttribute('href'), styles: Object.fromEntries(keys.map(key => [key, s[key]])) }
  }, ['color', 'backgroundColor', 'outlineWidth', 'outlineStyle', 'outlineColor', 'outlineOffset', 'boxShadow', 'borderRadius'])
}
function comparableFocus(value) {
  return { ...value, styles: Object.fromEntries(Object.entries(value.styles).map(([key, v]) => [key, normalStyle(key, v, value.styles)])) }
}
async function keyboardContract(page, kind) {
  await selectedReady(page, 0, { requireReveal: false })
  const results = [], initialUrl = page.url(), initial = await snapshot(page, kind)
  contract(initial, kind + ' initial native tabs', 0)
  check(initial.tabs.every(value => value.tabIndex === -1), kind + ' initial native entry uses the tablist before a trigger has received focus')
  // Start immediately before the actual tablist in native focus order. The
  // preceding control differs because the React hero is not yet migrated.
  const preceding = await page.evaluate(() => {
    const list = document.querySelector('#books [role="tablist"]')
    const controls = [...document.querySelectorAll('a[href],button,input,select,summary,[tabindex]')].filter(element => element.tabIndex >= 0 && element.checkVisibility() && !element.contains(list) && (element.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING))
    const previous = controls.at(-1); previous?.focus()
    return { found: Boolean(previous), tag: previous?.tagName, label: previous?.getAttribute('aria-label'), text: previous?.textContent.trim() }
  })
  check(preceding.found, kind + ' native tab entry predecessor exists')
  await page.keyboard.press('Tab'); await selectedReady(page, 0)
  const entry = await focusState(page); check(entry.role === 'tab' && entry.text === labels[0] && entry.focusVisible, kind + ' native Tab enters the active first book')
  results.push({ key: 'native Tab entry', index: 0, focus: entry, state: await snapshot(page, kind) })
  for (const [key, index] of [['ArrowRight', 1], ['ArrowRight', 2], ['End', 5], ['Home', 0], ['ArrowLeft', 5], ['ArrowRight', 0]]) {
    await page.keyboard.press(key); await selectedReady(page, index)
    const focus = await focusState(page), state = await snapshot(page, kind)
    check(focus.role === 'tab' && focus.text === labels[index] && focus.focusVisible && state.rail.activeFullyRevealed, kind + ' ' + key + ' focus, automatic selection and reveal')
    check(state.tabs.filter(t => t.tabIndex === 0).length === 1 && page.url() === initialUrl && !state.documentOverflow, kind + ' keyboard roving stop, URL or overflow')
    contract(state, kind, index); results.push({ key, index, focus, state })
  }
  const continuation = []
  for (const [key, role, text] of [['Tab', 'tabpanel', null], ['Tab', null, 'Explore this book'], ['Shift+Tab', 'tabpanel', null], ['Shift+Tab', 'tab', labels[0]]]) {
    await page.keyboard.press(key); const focus = await focusState(page)
    check(focus.role === role && (!text || focus.text === text), kind + ' keyboard panel/action continuation ' + key)
    continuation.push({ key, ...focus })
  }
  return { initial, preceding, results, continuation }
}
async function anchorPosition(page, id, { requireSettled = true } = {}) {
  await settle(page)
  let settled = true
  try { await page.waitForFunction(id => {
    const element = document.getElementById(id); if (!element) return false
    const r = element.getBoundingClientRect(), s = getComputedStyle(element), root = getComputedStyle(document.documentElement)
    const intended = r.top + scrollY - (parseFloat(s.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0)
    return Math.abs(scrollY - Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight))) <= 1.1
  }, id, { timeout: 5000 }) } catch { settled = false }
  const value = await page.evaluate(id => {
    const element = document.getElementById(id), r = element.getBoundingClientRect(), s = getComputedStyle(element), root = getComputedStyle(document.documentElement), h = document.querySelector('.site-header,.sl-header').getBoundingClientRect()
    const intended = r.top + scrollY - (parseFloat(s.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0)
    return { hash: location.hash, count: document.querySelectorAll('[id="' + id + '"]').length, targetTop: r.top, targetBottom: r.bottom, scrollY, expectedScroll: Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight)), scrollMarginTop: s.scrollMarginTop, rootScrollPaddingTop: root.scrollPaddingTop, visible: r.top < innerHeight && r.bottom > h.bottom }
  }, id)
  if (requireSettled) check(settled, page.url() + ' did not settle at its actual anchor offset ' + JSON.stringify(value))
  return { settled, ...value }
}
async function linkHistory(page, kind, link, label) {
  await link.scrollIntoViewIfNeeded(); await settle(page)
  const preInteraction = { url: page.url(), y: await page.evaluate(() => scrollY) }, href = await link.evaluate(element => element.href)
  if (kind === 'source') { const actual = new URL(href), source = new URL(urls.source); check(actual.origin === source.origin && actual.pathname === source.pathname && actual.hash === '#books' && !actual.search, 'Source ' + label + ' must use the real local Books anchor') }
  // Native pointer focus may scroll a sticky link before its click event. The
  // history entry saves that real click position, not the test's earlier one.
  await link.evaluate(element => { window.__discoveryHistoryBeforeClick = null; element.addEventListener('click', () => { window.__discoveryHistoryBeforeClick = { url: location.href, y: scrollY } }, { once: true, capture: true }) })
  await link.click(); const before = await page.evaluate(() => window.__discoveryHistoryBeforeClick)
  check(Boolean(before), kind + ' ' + label + ' native click history position was recorded')
  await page.waitForFunction(() => location.hash === '#books'); const position = await anchorPosition(page, 'books')
  check(position.count === 1 && position.visible, kind + ' ' + label + ' actual target')
  await page.goBack(); await page.waitForFunction(url => location.href === url, before.url)
  let restored = true
  try { await page.waitForFunction(y => Math.abs(scrollY - y) <= 1.1, before.y, { timeout: 5000 }) } catch { restored = false }
  const back = { restored, url: page.url(), y: await page.evaluate(() => scrollY) }
  check(restored, kind + ' ' + label + ' Back did not restore its native click position: ' + JSON.stringify({ before, back }))
  await page.goForward(); await page.waitForFunction(() => location.hash === '#books'); const forward = await anchorPosition(page, 'books')
  return { label, href, preInteraction, before, position, back, forward }
}
async function probePublishedBooksFocusRestoration(viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' }), page = await context.newPage()
  page.on('pageerror', error => problems.push('Published focus diagnostic runtime error ' + error.message))
  try {
    await ready(page, 'published'); await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await settle(page)
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
    const dialog = page.locator('.redesigned-mobile-menu'); await dialog.waitFor(); await dialog.locator('summary').first().click()
    // Radix correctly hides the background header from the accessibility tree
    // while its modal is open. Read the existing DOM trigger without exposing it.
    await page.locator('button[aria-label="Open navigation"]').evaluate(trigger => {
      window.__discoveryFocusProbe = []
      const original = trigger.focus
      const record = (phase, args) => {
        const element = document.getElementById('books'), r = element.getBoundingClientRect(), s = getComputedStyle(element), root = getComputedStyle(document.documentElement)
        window.__discoveryFocusProbe.push({ phase, args, hash: location.hash, scrollY, targetTop: r.top, expectedScroll: Math.max(0, Math.min(r.top + scrollY - (parseFloat(s.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0), document.documentElement.scrollHeight - innerHeight)) })
      }
      trigger.focus = function (...args) { record('before original focus', args); const result = Reflect.apply(original, this, args); record('after original focus', args); return result }
    })
    await dialog.getByRole('link', { name: 'Explore all books', exact: true }).click(); await dialog.waitFor({ state: 'hidden' })
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open navigation')
    return await page.evaluate(() => window.__discoveryFocusProbe)
  } catch (error) {
    check(false, 'Independent published Books focus-restoration probe failed: ' + String(error.message || error))
    return []
  } finally { await context.close() }
}
async function booksIntegration(page, kind, viewport) {
  await page.setViewportSize(viewport); await ready(page, kind)
  const results = [], header = kind === 'published' ? '.site-header' : '.sl-header'
  if (viewport.width > 360) results.push(await linkHistory(page, kind, page.locator(header).getByRole('link', { name: 'Start your story', exact: true }), 'header Start your story'))
  await ready(page, kind)
  const invitation = page.locator(kind === 'published' ? '.final-invitation > a' : '.sl-final-invitation > a')
  results.push(await linkHistory(page, kind, invitation, 'final invitation'))
  if (viewport.width <= 1130) {
    for (const label of ['Explore all books', 'Start your story']) {
      await ready(page, kind); await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await settle(page)
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      const dialog = page.locator(kind === 'published' ? '.redesigned-mobile-menu' : '.sl-mobile-nav-dialog')
      await dialog.waitFor({ state: 'visible' })
      if (label === 'Explore all books') await dialog.locator('summary').first().click()
      const link = dialog.getByRole('link', { name: label, exact: true }), href = await link.evaluate(element => element.href)
      if (kind === 'source') check(href === new URL('#books', urls.source).href, 'Source mobile ' + label + ' must use local #books')
      await page.evaluate(() => {
        window.__discoveryNavigationTrace = []
        const record = event => {
          const target = document.getElementById('books'), r = target.getBoundingClientRect(), s = getComputedStyle(target), root = getComputedStyle(document.documentElement), intended = r.top + scrollY - (parseFloat(s.scrollMarginTop) || 0) - (parseFloat(root.scrollPaddingTop) || 0)
          window.__discoveryNavigationTrace.push({ event: event.type, time: performance.now(), hash: location.hash, scrollY, targetTop: r.top, expectedScroll: Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight)), focusLabel: document.activeElement?.getAttribute('aria-label'), focusTag: document.activeElement?.tagName })
        }
        for (const type of ['scroll', 'focusin', 'hashchange', 'popstate']) addEventListener(type, record)
      })
      await link.click(); await dialog.waitFor({ state: 'hidden' }); await page.waitForFunction(() => location.hash === '#books')
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open navigation')
      const position = await anchorPosition(page, 'books', { requireSettled: false }), trace = await page.evaluate(() => window.__discoveryNavigationTrace)
      const suspectRestore = kind === 'published' && label === 'Explore all books' && !position.settled && position.count === 1 && position.visible && trace.some(entry => entry.event === 'focusin' && entry.hash === '#books' && entry.focusLabel === 'Open navigation' && Math.abs(entry.scrollY - position.scrollY) <= 1.1 && Math.abs(entry.targetTop - position.targetTop) <= 1.1)
      const focusProbe = suspectRestore ? await probePublishedBooksFocusRestoration(viewport) : [], beforeFocus = focusProbe.find(entry => entry.phase === 'before original focus' && entry.hash === '#books'), afterFocus = focusProbe.find(entry => entry.phase === 'after original focus' && entry.hash === '#books')
      const originalRestoreDrift = Boolean(suspectRestore && beforeFocus && afterFocus && Math.abs(beforeFocus.scrollY - beforeFocus.expectedScroll) <= 1.1 && Math.abs(afterFocus.scrollY - position.scrollY) <= 1.1 && Math.abs(afterFocus.targetTop - position.targetTop) <= 1.1)
      if (originalRestoreDrift) report.inheritedNavigationFindings.push({ id: 'published-books-menu-focus-restore-' + viewport.width, status: 'The protected mobile dialog initially reaches the Books anchor, then restoring trigger focus moves its scroll position. The source must retain its intended native anchor placement.', label, viewport, position, trace, focusProbe })
      else check(position.settled, kind + ' mobile ' + label + ' did not settle at its real Books anchor: ' + JSON.stringify({ position, trace }))
      check(position.count === 1 && position.visible, kind + ' mobile ' + label + ' target')
      results.push({ label: 'mobile ' + label, href, position, focus: await focusState(page), trace, focusProbe, originalRestoreDrift })
    }
  }
  await ready(page, kind, '#books'); const direct = await anchorPosition(page, 'books')
  check(direct.count === 1 && direct.visible, kind + ' direct Books fragment')
  return { results, direct }
}
async function enlargedQuality(page) {
  return page.locator(section).evaluate(root => {
    const normal = value => value.replace(/\s+/g, ' ').trim(), result = { documentOverflow: document.documentElement.scrollWidth > innerWidth + 1, clippedText: [], textOutsideViewport: [], clippedControls: [], activeTabTextOutsideButton: [] }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!node.textContent.trim() || !node.parentElement.checkVisibility() || node.parentElement.closest('svg,[role="tablist"]')) continue
      const range = document.createRange(); range.selectNodeContents(node); const lines = [...range.getClientRects()], clips = []
      for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) { const s = getComputedStyle(parent), r = parent.getBoundingClientRect(); if (['hidden', 'clip', 'auto', 'scroll'].includes(s.overflowX)) clips.push({ left: r.left + parent.clientLeft, right: r.left + parent.clientLeft + parent.clientWidth }) }
      const clipped = lines.filter(line => clips.some(c => line.left < c.left - 1 || line.right > c.right + 1)).length, outside = lines.filter(line => line.left < -1 || line.right > innerWidth + 1).length
      if (clipped) result.clippedText.push({ text: normal(node.textContent), lines: clipped })
      if (outside) result.textOutsideViewport.push({ text: normal(node.textContent), lines: outside })
    }
    for (const element of root.querySelectorAll('[role="tabpanel"][data-state="active"] a')) {
      const r = element.getBoundingClientRect(), parent = element.closest('[role="tabpanel"]').getBoundingClientRect()
      if (r.left < Math.max(0, parent.left) - 1 || r.right > Math.min(innerWidth, parent.right) + 1) result.clippedControls.push({ text: normal(element.textContent), left: Math.round(r.left * 1000) / 1000, right: Math.round(r.right * 1000) / 1000 })
    }
    const active = root.querySelector('[role="tab"][aria-selected="true"]'), box = active.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(active)
    const lines = [...range.getClientRects()].filter(r => r.left < box.left - 1 || r.right > box.right + 1)
    if (lines.length) result.activeTabTextOutsideButton.push({ text: normal(active.textContent), lines: lines.length })
    return result
  })
}
async function enlarge(page) {
  const metrics = await page.locator('#books h2,#books p,#books li,#books [role="tab"],#books [role="tabpanel"][data-state="active"] a').evaluateAll(elements => {
    const direct = elements.filter(element => element.checkVisibility()), inherited = direct.flatMap(element => element.matches('h2') ? [...element.querySelectorAll('em')] : [])
    const records = [...direct, ...inherited].map(element => ({ element, direct: direct.includes(element), size: parseFloat(getComputedStyle(element).fontSize) * 2, line: parseFloat(getComputedStyle(element).lineHeight) * 2 }))
    records.forEach((record, i) => { record.element.dataset.discoveryEnlarged = String(i); if (record.direct) record.element.style.fontSize = record.size + 'px' })
    return records.map(({ size, line }) => ({ size, line }))
  })
  await page.waitForFunction(metrics => [...document.querySelectorAll('[data-discovery-enlarged]')].every(element => { const record = metrics[Number(element.dataset.discoveryEnlarged)], s = getComputedStyle(element); return Math.abs(parseFloat(s.fontSize) - record.size) < 0.01 && Math.abs(parseFloat(s.lineHeight) - record.line) < 0.01 }), metrics, { timeout: 5000 })
  await settle(page)
  check(metrics.length === 14, 'Discovery enlargement must cover heading/emphasis, description, six tabs, intro, three bullets and action')
  return { metrics, quality: await enlargedQuality(page) }
}

try {
  for (const width of widths) {
    const row = { width, panels: [] }
    for (const [kind, page] of Object.entries(pages)) { await page.setViewportSize({ width, height: 1000 }); await ready(page, kind) }
    for (const [index, slug] of slugs.entries()) {
      for (const page of Object.values(pages)) { await choose(page, index); await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur()); await settle(page) }
      const result = await comparison(width + '-' + slug)
      contract(result.published, 'Published ' + width, index); contract(result.source, 'Source ' + width, index)
      row.panels.push({ index, slug, ...result })
    }
    if ([390, 1440].includes(width)) for (const [kind, page] of Object.entries(pages)) {
      await choose(page, 0); await page.locator(section).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 115, behavior: 'instant' })); await settle(page)
      await page.screenshot({ path: path.join(folder, 'context-' + kind + '-' + width + '.png'), animations: 'disabled', caret: 'hide' })
    }
    report.widths.push(row)
    console.log('Discovery six-panel width complete: ' + width + 'px')
  }
  report.loadedSourceAssets = await pages.source.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map(element => element.src || element.href))
  report.sourceAssembly = await pages.source.evaluate(() => {
    const main = document.getElementById('main-content'), band = document.querySelector('.sl-home-reassurance'), books = document.getElementById('books'), gifting = document.getElementById('gifting')
    return { oneBooksTarget: document.querySelectorAll('#books').length === 1, allWithinMain: [band, books, gifting].every(element => element && main?.contains(element)), bandPrecedesBooks: Boolean(band && books && band.compareDocumentPosition(books) & Node.DOCUMENT_POSITION_FOLLOWING), booksPrecedeGifting: Boolean(books && gifting && books.compareDocumentPosition(gifting) & Node.DOCUMENT_POSITION_FOLLOWING) }
  })
  check(Object.values(report.sourceAssembly).every(Boolean), 'The actual source Books section must remain inside main, after reassurance and before Gifting')
  for (const motion of ['reduce', 'no-preference']) for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }, { width: 390, height: 320 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) { await page.emulateMedia({ reducedMotion: motion }); await page.setViewportSize(viewport); await ready(page, kind); values[kind] = await keyboardContract(page, kind) }
    compare(values.published.initial, values.source.initial, 'Initial native tabs ' + motion + ' ' + viewport.width + 'x' + viewport.height)
    for (let i = 0; i < values.published.results.length; i++) {
      const a = values.published.results[i], b = values.source.results[i]
      check(JSON.stringify(comparableFocus(a.focus)) === JSON.stringify(comparableFocus(b.focus)), 'Keyboard focus treatment ' + motion + ' ' + viewport.width + 'x' + viewport.height + ' ' + a.key)
      compare(a.state, b.state, 'Keyboard ' + motion + ' ' + viewport.width + 'x' + viewport.height + ' ' + a.key)
    }
    check(JSON.stringify(values.published.continuation.map(comparableFocus)) === JSON.stringify(values.source.continuation.map(comparableFocus)), 'Panel/action keyboard continuation treatment ' + motion + ' ' + viewport.width + 'x' + viewport.height)
    const focusCapture = await comparison('keyboard-focus-' + motion + '-' + viewport.width + 'x' + viewport.height)
    report.states.push({ state: 'native keyboard, automatic activation, reveal and focus', motion, viewport, keyboard: values, ...focusCapture })
    if (viewport.height === 320) for (const [kind, page] of Object.entries(pages)) await page.screenshot({ path: path.join(folder, 'short-screen-keyboard-' + kind + '-' + motion + '.png'), animations: 'disabled', caret: 'hide' })
    console.log('Discovery keyboard complete: ' + motion + ' ' + viewport.width + 'x' + viewport.height)
  }
  for (const motion of ['reduce', 'no-preference']) {
    for (const [kind, page] of Object.entries(pages)) { await page.emulateMedia({ reducedMotion: motion }); await page.setViewportSize({ width: 1440, height: 900 }); await ready(page, kind) }
    for (const state of ['inactive tab hover', 'action hover', 'action focus']) {
      for (const page of Object.values(pages)) {
        await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur())
        const control = state === 'inactive tab hover' ? tab(page, 1) : page.locator(panel + ' a')
        if (state.endsWith('hover')) await control.hover(); else { await page.keyboard.press('Tab'); await control.focus() }
        await within(control.evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))) }), 'Pointer/focus transition', 5000)
      }
      report.states.push({ state, motion, viewport: { width: 1440, height: 900 }, ...(await comparison('control-' + state.replaceAll(' ', '-') + '-' + motion)) })
    }
  }
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 600 }, { width: 820, height: 600 }, { width: 1440, height: 600 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) { await page.emulateMedia({ reducedMotion: 'reduce' }); values[kind] = await booksIntegration(page, kind, viewport) }
    report.states.push({ state: 'actual shared and invitation Books anchors, direct hash and history', viewport, ...values })
    console.log('Discovery native Books anchors complete: ' + viewport.width + 'px')
  }
  const touchResults = {}
  for (const kind of ['published', 'source']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }), page = await context.newPage()
    page.on('pageerror', error => problems.push(kind + ' touch runtime error ' + error.message))
    try {
      await ready(page, kind)
      const rail = page.locator(css(kind, 'book-tabs-scroll')); await rail.scrollIntoViewIfNeeded(); await settle(page)
      const box = await rail.boundingBox(), before = await rail.evaluate(element => ({ x: element.scrollLeft, y: scrollY }))
      const session = await context.newCDPSession(page)
      const start = { x: Math.round(box.x + box.width * .8), y: Math.round(box.y + 30) }
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] })
      for (let step = 1; step <= 10; step++) { await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - 24 * step, y: start.y }] }); await within(page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve))), 'Native touch movement frame') }
      const stationaryHold = await within(page.evaluate(() => new Promise(resolve => { const start = performance.now(); let frames = 0; const step = () => { if (++frames === 12) resolve({ frames, milliseconds: performance.now() - start }); else requestAnimationFrame(step) }; requestAnimationFrame(step) })), 'Stationary native touch hold')
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await settle(page)
      await page.waitForFunction(selector => document.querySelector(selector).scrollLeft > 0, css(kind, 'book-tabs-scroll'), { timeout: 5000 })
      const quiescence = await within(rail.evaluate(element => new Promise(resolve => { const readings = []; let previous = element.scrollLeft, stable = 0; const step = () => { const current = element.scrollLeft; readings.push(current); stable = Math.abs(current - previous) < .01 ? stable + 1 : 0; previous = current; if (stable >= 6) resolve({ stableFrames: stable, readings }); else requestAnimationFrame(step) }; requestAnimationFrame(step) })), 'Native touch rail quiescence', 5000)
      const after = await rail.evaluate(element => ({ x: element.scrollLeft, y: scrollY }))
      check(after.x > before.x && Math.abs(after.y - before.y) <= 1.1, kind + ' emulated horizontal touch pan must remain in the tab rail')
      // Return through the actual first tab before comparing subsequent taps;
      // native gesture velocity is not a deterministic selected-tab origin.
      await choose(page, 0, 'tap')
      const selections = []
      for (const index of [2, 5, 0]) { await choose(page, index, 'tap'); const state = await snapshot(page, kind); contract(state, kind + ' touch', index); check(state.rail.activeFullyRevealed && !state.documentOverflow, kind + ' touched active tab reveal'); selections.push({ index, state }) }
      touchResults[kind] = selections
      report.states.push({ state: 'emulated touch horizontal pan and tab selection', kind, gesture: { start, steps: 10, horizontalStep: -24, verticalStep: 0, stationaryHold, quiescence, input: 'Native touchStart, touchMove and touchEnd through Chromium Input.dispatchTouchEvent, including a stationary finger hold and six quiescent frames; no scroll property is assigned. The actual Life Story tab is then tapped before comparing later selections.' }, before, after, selections })
    } finally { await context.close() }
  }
  for (let i = 0; i < 3; i++) compare(touchResults.published[i].state, touchResults.source[i].state, 'Emulated touch ' + slugs[touchResults.published[i].index])
  for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) for (const [index, slug] of slugs.entries()) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize(viewport); await ready(page, kind); for (let selected = 0; selected <= index; selected++) await choose(page, selected); await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur()); values[kind] = await enlarge(page) }
    check(JSON.stringify(values.published.quality) === JSON.stringify(values.source.quality), 'Enlarged discovery quality differs ' + viewport.width + ' ' + slug)
    check(cleanQuality(values.source.quality, ['clippedText','textOutsideViewport','clippedControls','activeTabTextOutsideButton']), 'P4-03 enlarged source labels and controls must fit ' + viewport.width + ' ' + slug)
    const quality = values.published.quality
    if (quality.documentOverflow || quality.clippedText.length || quality.textOutsideViewport.length || quality.clippedControls.length || quality.activeTabTextOutsideButton.length) report.qualityFindings.push({ id: 'discovery-enlarged-' + viewport.width + '-' + slug, status: 'P4-03 authorised intrinsic tab sizing; source must eliminate the inherited clipping.', viewport, slug, published: quality, source: values.source.quality })
    report.states.push({ state: 'targeted 200 percent discovery text', viewport, index, slug, enlargement: values, ...(await comparison('enlarged-' + viewport.width + '-' + slug, { enlarged: true })) })
    console.log('Discovery enlargement complete: ' + viewport.width + 'px ' + slug)
  }
} catch (error) { problems.push(String(error.stack || error)) }
finally {
  await browser.close(); report.completedAt = new Date().toISOString()
  report.completeWidthSet = JSON.stringify(report.widths.map(row => row.width)) === JSON.stringify(requiredWidths) && report.widths.every(row => row.panels.length === 6)
  report.enlargementMeasurementsComplete = report.states.filter(state => state.state === 'targeted 200 percent discovery text').length === 12
  await fs.writeFile(path.join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const captures = [...report.widths.flatMap(row => row.panels.map(p => ({ title: row.width + 'px — ' + labels[p.index], filename: p.filename }))), ...report.states.filter(s => s.filename).map(s => ({ title: s.state + (s.viewport ? ' ' + s.viewport.width + '×' + s.viewport.height + 'px' : '') + (s.motion ? ' — ' + s.motion : '') + (s.slug ? ' — ' + labels[s.index] : ''), filename: s.filename }))].filter(item => item.filename)
  const status = '<p>' + report.widths.length + ' of 10 widths; ' + report.states.length + ' state records; ' + captures.length + ' screenshot pairs; ' + problems.length + ' problems.</p><p>' + (problems.length ? 'This run failed or was interrupted. Read the report before using its evidence.' : report.completeWidthSet ? 'The complete six-panel width matrix passed.' : 'Focused width run only; the full matrix is not established.') + '</p>'
  const quality = '<p>' + (!report.enlargementMeasurementsComplete ? 'Both full six-panel enlargement scenarios did not complete.' : report.qualityFindings.length ? 'Inherited enlargement findings remain open. Matching the current page does not establish enlargement quality.' : 'The targeted enlargement scenarios completed without a measured clipping or overflow finding.') + '</p>'
  const inheritedNavigation = report.inheritedNavigationFindings.length ? '<p>The report also records ' + report.inheritedNavigationFindings.length + ' reproduced protected-page mobile Books focus-restoration findings. Source links must still reach their intended native fragment positions. The protected page remains unchanged.</p>' : ''
  const cards = captures.map(item => '<section><h2>' + item.title + '</h2><a href="' + item.filename + '"><img loading="lazy" src="' + item.filename + '" alt="Published and React discovery comparison"></a></section>').join('')
  await fs.writeFile(path.join(folder, 'review.html'), '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StoriLeaf discovery parity</title><style>body{max-width:1600px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;color:#253526;background:#f9f8f6}h1,h2{line-height:1.2}section{margin-top:48px}img{max-width:100%;height:auto;border:1px solid #ddd}</style><h1>Six-book discovery comparisons</h1><p>The protected published section appears on the left; the isolated React section appears on the right. Open each image at full resolution. This evidence does not publish the incomplete React homepage.</p>' + status + quality + inheritedNavigation + '<p>Keyboard, touch, local fragment and history records are in the <a href="report.json">complete report</a>. Panel href equality does not verify the availability or behaviour of external product pages.</p>' + cards + '</html>')
}
console.log(JSON.stringify({ browser: report.browser, completeWidthSet: report.completeWidthSet, widths: report.widths.map(row => row.width), panelComparisons: report.widths.reduce((n, row) => n + row.panels.length, 0), states: report.states.length, captures: report.captures.length, qualityFindings: report.qualityFindings.length, problems }))
if (problems.length) process.exitCode = 1
