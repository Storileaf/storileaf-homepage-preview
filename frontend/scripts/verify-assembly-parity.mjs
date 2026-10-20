import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { settledSnapshot } from './browser-readiness.mjs'

// Assembly owns document positions and combined journeys. The retained section
// suites and the writing suite own exhaustive individual component states.
const requiredWidths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const focused = process.env.ASSEMBLY_FOCUSED === '1'
const widths = process.env.ASSEMBLY_WIDTHS?.split(',').map(Number) || (focused ? [320, 390, 820, 1440] : requiredWidths)
const out = process.env.ASSEMBLY_QA_OUT || 'qa/assembly'
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/'
}
const problems = [], qualityFindings = []
const check = (ok, message) => { if (!ok) problems.push(message) }
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const report = {
  checkpoint: 'Package 3 Group 8 complete homepage assembly', baseline,
  sourceCommit: process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(), focused, requiredWidths, widths: [], states: [], journeyAttempts: [], captures: [], preparation: [],
  thresholds: { geometry: .15, pixelChannel: 24, pixelRatio: .01, nativeAnchorScroll: 1.1 },
  sourceHashes: {}, harnessHashes: {}, protectedHashes: {}, problems, qualityFindings,
  retainedEquivalences: ['Gifting retains the Group 1 explicit warm paper underlay. Only the published transparent background versus the source rgb(250, 249, 247) is equivalent, provided the published nearest painted ancestor is that same opaque warm paper with no background image, the section gradients match and the native painted joins pass the unchanged pixel gate. Raw styles and ancestor paint remain recorded.'],
  historyMethod: 'As in the retained discovery gate, Back must restore the exact native click-time URL and scroll position within 1.1 CSS pixels. A passive capture-phase listener records that position without changing the event. The earlier pre-interaction viewport is preserved separately because native focus can move it before activation. Target arrival and Forward retain their exact hash, uniqueness, visibility and computed native scroll-offset assertions. Partial journeys preserve diagnostics if any assertion or wait fails.',
  captureMethod: 'Unaligned absolute document geometry. Every section join is scrolled into the native viewport using the same integer document position on both pages. Actual sticky-header context is retained. Reduced-motion comparisons keep the published static photograph, ticker and cover arrangement. No visibility mask, padding adjustment, raster translation, response substitution or target CSS is applied. Full-page evidence consists of recorded section joins and retained component captures, not an assumed fully painted browser fullPage crop.',
  limits: 'Chromium only. The combined journey uses native pointer and keyboard interaction. Separate narrow-screen touch uses Chromium emulation. This suite does not claim native browser zoom, physical devices, other browser engines, screen-reader results or accessibility certification. Inherited enlargement findings retain their separate owners. Package 4 and founder acceptance remain separate gates.'
}
const regions = kind => {
  const source = kind === 'source', choose = (a, b) => source ? b : a
  return [
    ['header', choose('.site-header', '.sl-header')], ['main', '#main-content'],
    ['hero', '.hero'], ['ticker', '.hero-marquee'], ['reassurance', choose('.trust-band', '.sl-home-reassurance')],
    ['books', '#books'], ['gallery', '#samples'], ['rail', '[data-testid="sample-rail"]'],
    ['physical', choose('.book-craft', '.sl-book-craft')], ['process', '#how-it-works'],
    ['writing', '#writing-space'], ['gifting', '#gifting'], ['resources', '#resources'], ['questions', '#questions'],
    ['invitation', choose('.final-invitation', '.sl-final-invitation')],
    ['ending', choose('.newsletter-footer-unit', '.sl-newsletter-footer')],
    ['newsletter', choose('.newsletter-strip', '.sl-newsletter')], ['footer', choose('.site-footer', '.sl-footer')]
  ]
}
const selector = (kind, key) => regions(kind).find(([name]) => name === key)[1]
const sectionOrder = ['hero', 'reassurance', 'books', 'gallery', 'process', 'writing', 'gifting', 'resources', 'questions']
const localIds = ['top', 'main-content', 'books', 'samples', 'how-it-works', 'writing-space', 'gifting', 'resources', 'resources-activity', 'questions']
const joinKeys = ['ticker', 'reassurance', 'books', 'gallery', 'physical', 'process', 'writing', 'gifting', 'resources', 'questions', 'ending', 'footer']
const measuredStyles = ['backgroundColor', 'backgroundImage', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'borderTopWidth', 'borderBottomWidth', 'display', 'position', 'overflowX', 'overflowY', 'scrollMarginTop']

await fs.mkdir(out, { recursive: true })
async function recordFiles(dir) {
  for (const entry of (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) await recordFiles(file)
    else report.sourceHashes[file] = hash(await fs.readFile(file))
  }
}
await recordFiles('src'); await recordFiles('content')
for (const file of ['index.html', 'package.json', 'package-lock.json', 'vite.config.ts']) report.sourceHashes[file] = hash(await fs.readFile(file))
for (const file of ['scripts/verify-assembly-parity.mjs', 'scripts/browser-readiness.mjs']) report.harnessHashes[file] = hash(await fs.readFile(file))
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/index-DO3Vh6An.js', 'assets/content-sections-CfrmOVRI.js', 'assets/routes-DrwDv2x2.js']) {
  const bytes = await fs.readFile('../' + file)
  check(bytes.equals(execFileSync('git', ['show', baseline + ':' + file])), 'Protected baseline changed ' + file)
  report.protectedHashes[file] = hash(bytes)
}
let browser, pixelPage
async function frames(page) {
  await page.bringToFront()
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}
async function fonts(page) {
  await page.evaluate(async () => {
    await Promise.all([document.fonts.load('450 59px Newsreader'), document.fonts.load('italic 430 50px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('650 17px Manrope')])
    await document.fonts.ready
  })
  check(await page.evaluate(() => ['Newsreader', 'Manrope'].every(name => [...document.fonts].some(f => f.family.includes(name) && f.status === 'loaded'))), 'Real Newsreader and Manrope fonts are loaded')
}
async function visibleImages(page) {
  return page.evaluate(async () => {
    const visible = [...document.images].filter(img => { const r = img.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width && r.height && getComputedStyle(img).visibility !== 'hidden' })
    await Promise.all(visible.map(img => img.decode()))
    return visible.map(img => ({ src: img.currentSrc, alt: img.alt, loaded: img.complete && img.naturalWidth > 0, natural: [img.naturalWidth, img.naturalHeight] }))
  })
}
async function newPage(kind, viewport, { motion = 'reduce', touch = false } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: motion, hasTouch: touch })
  const page = await context.newPage()
  page.on('pageerror', error => problems.push(kind + ' runtime error ' + error.message))
  await page.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await page.getByTestId('try-question').waitFor(); await fonts(page)
  // Native scrolling activates real lazy loading and entrance observers. It
  // does not change image loading attributes or inject replacement assets.
  for (const key of ['hero', 'books', 'gallery', 'physical', 'process', 'writing', 'gifting', 'resources', 'ending']) {
    await page.locator(selector(kind, key)).evaluate(el => scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY - 90), behavior: 'instant' }))
    await frames(page); await visibleImages(page)
  }
  await page.evaluate(async () => {
    const urls = new Set([...document.querySelectorAll('section,footer,section *,footer *, .newsletter-footer-unit,.sl-newsletter-footer')].flatMap(el => [...getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m => m[1])))
    await Promise.all([...urls].map(async src => { const image = new Image(); image.src = src; await image.decode() }))
    document.activeElement?.blur(); scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.mouse.move(0, 0); await frames(page)
  return page
}
async function pair(viewport, options) {
  return { published: await newPage('published', viewport, options), source: await newPage('source', viewport, options) }
}
async function closePair(pages) { for (const page of Object.values(pages)) await page.context().close() }
async function snapshot(page, kind) {
  return settledSnapshot(page, () => page.evaluate(({ regions, measuredStyles, sectionOrder, localIds }) => {
    const rect = el => { const r = el.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height] }
    const nodes = Object.fromEntries(regions.map(([name, query]) => {
      const elements = [...document.querySelectorAll(query)]
      return [name, elements.map(el => {
        const css = getComputedStyle(el)
        const ancestorPaint = []
        if (name === 'gifting') for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent)
          ancestorPaint.push({ tag: parent.tagName, id: parent.id, backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage, opacity: style.opacity })
        }
        return { rect: rect(el), style: Object.fromEntries(measuredStyles.map(key => [key, css[key]])), id: el.id, heading: el.querySelector('h1,h2,h3')?.textContent.replace(/\s+/g, ' ').trim(), ...(name === 'gifting' ? { ancestorPaint } : {}) }
      })]
    }))
    const sectionNames = new Map(sectionOrder.map(name => [document.querySelector(regions.find(([key]) => key === name)[1]), name]))
    const mainChildren = [...document.querySelector('main').children].map(el => sectionNames.get(el) || { tag: el.tagName, id: el.id, className: el.className })
    const hashLinks = [...document.querySelectorAll('a[href]')].map(el => ({ text: el.textContent.replace(/\s+/g, ' ').trim(), raw: el.getAttribute('href'), url: new URL(el.href), current: el.getAttribute('aria-current') })).filter(a => a.url.hash).map(a => ({ text: a.text, raw: a.raw, href: a.url.href, origin: a.url.origin, pathname: a.url.pathname, hash: a.url.hash, count: document.querySelectorAll('[id="' + a.url.hash.slice(1) + '"]').length, current: a.current }))
    return {
      nodes, mainChildren, hashLinks, ids: Object.fromEntries(localIds.map(id => [id, document.querySelectorAll('[id="' + id + '"]').length])),
      title: document.title, language: document.documentElement.lang, robots: document.querySelector('meta[name="robots"]')?.content,
      h1: [...document.querySelectorAll('h1')].map(el => el.textContent.replace(/\s+/g, ' ').trim()),
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, body: rect(document.body), main: rect(document.querySelector('main')), viewport: [innerWidth, innerHeight], scrollY, overflow: document.documentElement.scrollWidth > innerWidth + 1 },
      nesting: { physicalInGallery: document.querySelector('#samples').contains(document.querySelector(regions.find(([key]) => key === 'physical')[1])), invitationInQuestions: document.querySelector('#questions').contains(document.querySelector(regions.find(([key]) => key === 'invitation')[1])), endingOutsideMain: !document.querySelector('main').contains(document.querySelector(regions.find(([key]) => key === 'ending')[1])) },
      activeDialogCount: [...document.querySelectorAll('[role="dialog"]')].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height }).length
    }
  }, { regions: regions(kind), measuredStyles, sectionOrder, localIds }))
}
function compare(before, after, label) {
  const differences = [], equivalences = []; let maximumGeometry = 0
  for (const [name, values] of Object.entries(before.nodes)) {
    const next = after.nodes[name]
    if (values.length !== 1 || next?.length !== 1) { differences.push(name + ' must render exactly once'); continue }
    const a = values[0], b = next[0]
    for (let index = 0; index < 4; index++) {
      const delta = Math.abs(a.rect[index] - b.rect[index]); maximumGeometry = Math.max(maximumGeometry, delta)
      if (delta > .15) differences.push(name + '.rect[' + index + '] ' + a.rect[index] + ' versus ' + b.rect[index])
    }
    for (const property of measuredStyles) {
      if (a.style[property] === b.style[property]) continue
      const paintedAncestorIndex = a.ancestorPaint?.findIndex(parent => parent.backgroundColor !== 'rgba(0, 0, 0, 0)' || parent.backgroundImage !== 'none') ?? -1
      const paintedAncestor = a.ancestorPaint?.[paintedAncestorIndex]
      if (name === 'gifting' && property === 'backgroundColor'
        && a.style.backgroundColor === 'rgba(0, 0, 0, 0)' && b.style.backgroundColor === 'rgb(250, 249, 247)'
        && a.style.backgroundImage === b.style.backgroundImage && a.style.backgroundImage !== 'none'
        && paintedAncestor?.backgroundColor === b.style.backgroundColor && paintedAncestor.backgroundImage === 'none'
        && a.ancestorPaint.slice(0, paintedAncestorIndex + 1).every(parent => parent.opacity === '1')) {
        equivalences.push({ region: name, property, published: a.style[property], source: b.style[property], paintedAncestor, reason: 'Retained Group 1 warm paper underlay equivalence; same gradient and native painted join comparison remain required.' })
        continue
      }
      differences.push(name + '.style.' + property + ' ' + a.style[property] + ' versus ' + b.style[property])
    }
    for (const key of ['heading', 'id']) if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) differences.push(name + '.' + key)
  }
  for (const kind of ['published', 'source']) {
    const value = kind === 'published' ? before : after
    check(JSON.stringify(value.mainChildren) === JSON.stringify(sectionOrder), label + ' ' + kind + ' exact main section order')
    check(Object.values(value.ids).every(n => n === 1), label + ' ' + kind + ' unique local targets')
    check(Object.values(value.nesting).every(Boolean), label + ' ' + kind + ' approved nested section relationships')
    check(!value.document.overflow && value.activeDialogCount === 0, label + ' ' + kind + ' default page overflow or leaked dialog')
  }
  for (const key of ['width', 'height']) {
    const delta = Math.abs(before.document[key] - after.document[key]); maximumGeometry = Math.max(maximumGeometry, delta)
    if (delta > .15) differences.push('document.' + key + ' ' + before.document[key] + ' versus ' + after.document[key])
  }
  if (JSON.stringify(before.h1) !== JSON.stringify(after.h1) || after.h1.length !== 1) differences.push('single preserved h1')
  check(before.title === 'StoriLeaf | Your stories, made into a book' && after.title === before.title, label + ' exact approved page title')
  check(after.language === 'en-GB' && after.robots === 'noindex,nofollow', label + ' source language and unpublished indexing safeguard')
  const sourceOrigin = new URL(urls.source).origin, sourcePath = new URL(urls.source).pathname
  for (const link of after.hashLinks.filter(link => localIds.includes(link.hash.slice(1)))) check(link.origin === sourceOrigin && link.pathname === sourcePath && link.count === 1 && link.current !== 'page', label + ' source local fragment semantics ' + JSON.stringify(link))
  // The existing newsletter invitation deliberately leaves the preview for
  // storileaf.com/#newsletter-heading. A fragment alone does not imply locality.
  const externalFragments = value => value.hashLinks.filter(link => !localIds.includes(link.hash.slice(1))).map(({ text, href }) => ({ text, href }))
  check(JSON.stringify(externalFragments(before)) === JSON.stringify(externalFragments(after)), label + ' approved outward fragment destinations remain unchanged')
  check(!differences.length, label + ' absolute assembly ' + differences.join('; '))
  return { maximumGeometry, differences, equivalences }
}
async function measure(pages, label) {
  const published = await snapshot(pages.published, 'published'), source = await snapshot(pages.source, 'source')
  return { label, published, source, ...compare(published, source, label) }
}
async function pixelComparison(files) {
  const inputs = await Promise.all(files.map(async file => 'data:image/png;base64,' + (await fs.readFile(path.join(out, file))).toString('base64')))
  return pixelPage.evaluate(async ([first, second]) => {
    const load = async src => { const image = new Image(); image.src = src; await image.decode(); return image }
    const [a, b] = await Promise.all([load(first), load(second)])
    if (a.width !== b.width || a.height !== b.height) return { ratio: null, before: [a.width, a.height], after: [b.width, b.height] }
    const canvas = document.createElement('canvas'); canvas.width = a.width; canvas.height = a.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(a, 0, 0)
    const one = ctx.getImageData(0, 0, a.width, a.height).data
    ctx.clearRect(0, 0, a.width, a.height); ctx.drawImage(b, 0, 0)
    const two = ctx.getImageData(0, 0, a.width, a.height).data
    let changed = 0
    for (let i = 0; i < one.length; i += 4) if (Math.max(Math.abs(one[i] - two[i]), Math.abs(one[i + 1] - two[i + 1]), Math.abs(one[i + 2] - two[i + 2])) > 24) changed++
    return { ratio: changed / (a.width * a.height), changed, total: a.width * a.height, size: [a.width, a.height] }
  }, inputs)
}
async function captureViewport(pages, label, { key, top = 0, height = 540 } = {}) {
  const viewport = pages.source.viewportSize()
  const absolute = key ? await pages.published.locator(selector('published', key)).evaluate(el => el.getBoundingClientRect().top + scrollY) : top
  const requested = key ? Math.max(0, Math.floor(absolute - 270)) : top
  const files = [], readings = {}
  for (const [kind, page] of Object.entries(pages)) {
    await page.bringToFront(); await page.mouse.move(0, 0)
    await page.evaluate(y => { document.activeElement?.blur(); scrollTo({ top: y, behavior: 'instant' }) }, requested)
    await frames(page); const images = await visibleImages(page)
    const read = () => page.evaluate(query => {
      const el = query ? document.querySelector(query) : null, r = el?.getBoundingClientRect()
      return { scrollY, documentHeight: document.documentElement.scrollHeight, viewport: [innerWidth, innerHeight], target: r ? [r.x, r.y, r.width, r.height] : null, header: (() => { const r = document.querySelector('.site-header,.sl-header').getBoundingClientRect(); return [r.x, r.y, r.width, r.height] })() }
    }, key ? selector(kind, key) : null)
    const before = await settledSnapshot(page, read)
    check(Math.abs(before.scrollY - Math.min(requested, before.documentHeight - viewport.height)) <= 1, kind + ' ' + label + ' native scroll target')
    if (key) check(before.target[1] >= 0 && before.target[1] < height, kind + ' ' + label + ' join actually inside native capture')
    check(images.every(image => image.loaded), kind + ' ' + label + ' visible images decoded')
    const file = kind + '-' + label + '.png'
    await page.screenshot({ path: path.join(out, file), clip: { x: 0, y: 0, width: viewport.width, height }, animations: 'allow', caret: 'hide' })
    const after = await read()
    check(JSON.stringify(before) === JSON.stringify(after), kind + ' ' + label + ' geometry remained stable through capture')
    readings[kind] = { before, after, images }; files.push(file)
    report.captures.push({ kind, file, label, key, requestedScroll: requested, viewport, clip: { x: 0, y: 0, width: viewport.width, height }, ...readings[kind], sha256: hash(await fs.readFile(path.join(out, file))) })
  }
  const pixels = await pixelComparison(files)
  check(pixels.ratio !== null && pixels.ratio <= .01, label + ' native viewport pixels ' + JSON.stringify(pixels))
  return { label, key, absolute, requested, files, readings, pixels }
}
async function pageAccess(page) {
  return page.evaluate(() => ({ dialogs: [...document.querySelectorAll('[role="dialog"]')].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height }).length, overflow: getComputedStyle(document.body).overflow, pointerEvents: getComputedStyle(document.body).pointerEvents, scrollY, focus: { tag: document.activeElement?.tagName, testid: document.activeElement?.getAttribute('data-testid'), label: document.activeElement?.getAttribute('aria-label'), text: document.activeElement?.textContent?.replace(/\s+/g, ' ').trim() } }))
}
async function released(page, label) {
  await page.waitForFunction(() => getComputedStyle(document.body).overflow !== 'hidden' && getComputedStyle(document.body).pointerEvents !== 'none')
  const state = await settledSnapshot(page, () => pageAccess(page))
  check(state.dialogs === 0 && state.overflow !== 'hidden' && state.pointerEvents !== 'none', label + ' modal releases page access')
  return state
}
async function modal(page, label) {
  const state = await settledSnapshot(page, () => pageAccess(page))
  check(state.dialogs === 1 && state.overflow === 'hidden' && state.pointerEvents === 'none', label + ' exactly one modal isolates the assembled page')
  return state
}
async function anchor(page, id, label) {
  await page.waitForFunction(id => location.hash === '#' + id, id)
  await page.waitForFunction(id => {
    const el = document.getElementById(id), r = el.getBoundingClientRect()
    const intended = r.top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
    return Math.abs(scrollY - Math.max(0, Math.min(intended, document.documentElement.scrollHeight - innerHeight))) <= 1.1
  }, id)
  const result = await page.evaluate(id => { const r = document.getElementById(id).getBoundingClientRect(), h = document.querySelector('.site-header,.sl-header').getBoundingClientRect(); return { id, hash: location.hash, scrollY, top: r.top, bottom: r.bottom, headerBottom: h.bottom, visible: r.bottom > h.bottom && r.top < innerHeight, count: document.querySelectorAll('[id="' + id + '"]').length } }, id)
  check(result.count === 1 && result.visible, label + ' target visible and unique ' + id)
  return result
}
async function navigationState(page, ids = []) {
  const read = () => page.evaluate(ids => {
    const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { viewport: [r.x, r.y, r.width, r.height], document: [r.x + scrollX, r.y + scrollY, r.width, r.height] } }
    const active = document.activeElement
    const targets = Object.fromEntries([...new Set([...ids, location.hash.slice(1)])].filter(Boolean).map(id => {
      const elements = [...document.querySelectorAll('[id="' + CSS.escape(id) + '"]')], el = elements[0]
      return [id, { count: elements.length, rect: rect(el), scrollMarginTop: el ? getComputedStyle(el).scrollMarginTop : null }]
    }))
    return {
      url: location.href, hash: location.hash, scroll: [scrollX, scrollY], historyLength: history.length, scrollRestoration: history.scrollRestoration,
      viewport: [innerWidth, innerHeight], document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
      rootScrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
      header: rect(document.querySelector('.site-header,.sl-header')), targets,
      focus: { tag: active?.tagName, id: active?.id, testid: active?.getAttribute('data-testid'), label: active?.getAttribute('aria-label'), text: active?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 160), rect: rect(active) },
      faqs: [...document.querySelectorAll('#questions details')].map(el => el.open)
    }
  }, ids)
  return { ...(await settledSnapshot(page, read)), capturedAt: new Date().toISOString() }
}
async function journey(page, kind, viewport, { touch = false, motion = 'reduce' } = {}) {
  const attempt = { kind, viewport, touch, motion, status: 'running', startedAt: new Date().toISOString(), events: [] }
  report.journeyAttempts.push(attempt)
  const events = attempt.events, activate = async locator => touch ? locator.tap() : locator.click()
  try {
  const header = page.locator(selector(kind, 'header'))
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await frames(page)
  if (viewport.width <= 1130) {
    const trigger = page.getByRole('button', { name: 'Open navigation', exact: true })
    await activate(trigger)
    const dialog = page.locator(kind === 'source' ? '.sl-mobile-nav-dialog' : '.redesigned-mobile-menu')
    await dialog.waitFor({ state: 'visible' }); events.push({ step: 'mobile navigation opens', state: await modal(page, kind + ' mobile navigation') })
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' })
    const state = await released(page, kind + ' mobile to gallery sequence')
    check(state.focus.label === 'Open navigation', kind + ' mobile restores trigger focus'); events.push({ step: 'mobile navigation released', state })
  } else {
    const trigger = header.getByRole('button', { name: 'The books', exact: true })
    await activate(trigger); await page.waitForFunction(() => document.querySelector('.header-nav-trigger,.sl-header-dropdown>button')?.getAttribute('aria-expanded') === 'true')
    await page.keyboard.press('Escape'); await page.mouse.move(0, 0)
    await page.waitForFunction(() => document.querySelector('.header-nav-trigger,.sl-header-dropdown>button')?.getAttribute('aria-expanded') === 'false')
    check(await trigger.getAttribute('aria-expanded') === 'false', kind + ' Books menu closes before gallery'); events.push({ step: 'desktop Books menu released', state: await released(page, kind + ' desktop menu') })
  }
  const heroSamples = page.locator('.hero-actions a').filter({ hasText: 'See inside' })
  await activate(heroSamples); events.push({ step: 'hero samples anchor', state: await anchor(page, 'samples', kind) })
  const gallery = page.locator('#samples'), opener = gallery.locator('button[data-testid^="sample-"]').filter({ has: page.locator('img') }).first()
  await activate(opener); await page.locator('.sample-lightbox,.sl-sample-lightbox').waitFor({ state: 'visible' })
  await page.getByRole('button', { name: 'Next book', exact: true }).click(); await frames(page)
  events.push({ step: 'gallery next image', state: await modal(page, kind + ' gallery'), title: await page.locator('.sample-lightbox,.sl-sample-lightbox').locator('h2').textContent() })
  await page.keyboard.press('Escape'); await page.locator('.sample-lightbox,.sl-sample-lightbox').waitFor({ state: 'hidden' })
  const galleryClosed = await released(page, kind + ' gallery to craft sequence')
  check(await opener.evaluate(el => document.activeElement === el), kind + ' gallery restores original opener'); events.push({ step: 'gallery released', state: galleryClosed })
  await activate(page.getByTestId('book-craft-slide-3')); await page.waitForFunction(() => document.querySelector('[data-testid="book-craft-slide-3"]').getAttribute('aria-pressed') === 'true')
  events.push({ step: 'craft slide selection', active: await page.locator('.book-craft-slideshow,.sl-book-craft-slideshow').getAttribute('data-active-slide') })
  await activate(page.getByTestId('process-step-4')); await page.waitForFunction(() => document.querySelector('[data-testid="process-step-4"]').getAttribute('aria-pressed') === 'true')
  events.push({ step: 'process stage selection', active: await page.getByTestId('process-step-4').getAttribute('aria-pressed') })
  const practice = page.getByTestId('try-question')
  await activate(practice); await page.getByTestId('question-dialog').waitFor({ state: 'visible' })
  const answer = page.getByTestId('demo-answer'), words = 'A quiet Sunday in the garden.'
  await answer.fill(words); check(await answer.inputValue() === words, kind + ' practice accepts unsaved text')
  events.push({ step: 'practice after media and process', state: await modal(page, kind + ' practice after gallery'), answer: await answer.inputValue() })
  await page.keyboard.press('Escape'); await page.getByTestId('question-dialog').waitFor({ state: 'hidden' })
  const closed = await released(page, kind + ' practice to FAQ sequence')
  check(await practice.evaluate(el => document.activeElement === el), kind + ' practice restores opener'); events.push({ step: 'practice released', state: closed })
  await activate(practice); await page.getByTestId('question-dialog').waitFor({ state: 'visible' })
  check(await answer.inputValue() === '', kind + ' practice remains unsaved after reopening')
  await page.keyboard.press('Escape'); await page.getByTestId('question-dialog').waitFor({ state: 'hidden' }); await released(page, kind + ' reopened practice')
  const firstFaq = page.locator('#questions details').first(), secondFaq = page.locator('#questions details').nth(1)
  await activate(firstFaq.locator('summary')); await activate(secondFaq.locator('summary'))
  const faqState = await page.locator('#questions details').evaluateAll(els => els.map(el => el.open))
  check(faqState[0] && faqState[1], kind + ' independent FAQ expansion after dialogs'); events.push({ step: 'independent FAQs', open: faqState })
  const ending = page.locator(selector(kind, 'ending')), select = ending.getByRole('combobox', { name: 'Pricing currency' })
  const currencies = []
  for (const currency of ['usd', 'cad', 'gbp', 'inr']) {
    await select.selectOption(currency)
    await page.waitForFunction(currency => localStorage.getItem('storileaf.preview.currency') === currency, currency)
    const links = await page.locator(selector(kind, 'header') + ' a,' + selector(kind, 'ending') + ' a').evaluateAll(links => links.filter(el => el.textContent.trim() === 'Pricing').map(el => el.href))
    check(links.length === 2 && links.every(href => new URL(href).pathname.endsWith('/pricing/' + currency)), kind + ' assembled currency reaches header and footer ' + currency)
    currencies.push({ currency, links })
  }
  events.push({ step: 'currency after dialogs and FAQs', currencies })
  // Give the first history check a different current fragment. Activating the
  // already-current #samples fragment need not create a new history entry.
  await activate(ending.getByRole('link', { name: 'StoriLeaf home', exact: true }))
  await page.waitForFunction(() => location.hash === '#top' && scrollY <= 1)
  const anchors = []
  events.push({ step: 'assembled footer anchors and history', anchors })
  for (const [text, id] of [['See inside', 'samples'], ['How it works', 'how-it-works'], ['Resources', 'resources'], ['Common questions', 'questions']]) {
    const link = ending.getByRole('link', { name: text, exact: true })
    await link.scrollIntoViewIfNeeded(); await frames(page)
    const preInteraction = await navigationState(page, [id])
    const entry = { text, id, phase: 'before activation', preInteraction }
    anchors.push(entry)
    // The retained discovery gate already distinguishes the pre-interaction
    // viewport from native pointer focus at click time. Observe without changing
    // the event, focus, scroll or browser history behaviour.
    await link.evaluate((element, id) => {
      window.__assemblyHistoryClick = null
      element.addEventListener('click', () => {
        const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] }
        window.__assemblyHistoryClick = {
          url: location.href, scroll: [scrollX, scrollY], historyLength: history.length, scrollRestoration: history.scrollRestoration,
          document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], viewport: [innerWidth, innerHeight],
          link: { href: element.href, rect: rect(element) }, target: { id, rect: rect(document.getElementById(id)) },
          focus: { tag: document.activeElement?.tagName, id: document.activeElement?.id, rect: rect(document.activeElement) }
        }
      }, { once: true, capture: true, passive: true })
    }, id)
    await activate(link); const before = entry.before = await page.evaluate(() => window.__assemblyHistoryClick)
    check(Boolean(before) && before.url === preInteraction.url, kind + ' native footer anchor click observed ' + id)
    if (!before) throw new Error(kind + ' native footer anchor click was not recorded ' + id)
    entry.phase = 'reaching target'; entry.reached = await anchor(page, id, kind)
    entry.reachedNavigation = await navigationState(page, [id, new URL(before.url).hash.slice(1)])
    entry.phase = 'browser Back'
    await page.goBack(); await page.waitForFunction(url => location.href === url, before.url)
    entry.backSettled = await navigationState(page, [id, new URL(before.url).hash.slice(1)])
    entry.expectedBackScroll = before.scroll[1]
    entry.backScrollDifference = entry.backSettled.scroll[1] - before.scroll[1]
    await page.waitForFunction(y => Math.abs(scrollY - y) <= 1.1, before.scroll[1])
    entry.back = await navigationState(page, [id, new URL(before.url).hash.slice(1)])
    entry.phase = 'browser Forward'
    await page.goForward(); entry.forward = await anchor(page, id, kind)
    entry.forwardNavigation = await navigationState(page, [id, new URL(before.url).hash.slice(1)])
    entry.phase = 'complete'
  }
  await activate(firstFaq.locator('summary')); await activate(secondFaq.locator('summary'))
  await activate(ending.getByRole('link', { name: 'StoriLeaf home', exact: true })); await page.waitForFunction(() => location.hash === '#top' && scrollY <= 1)
  events.push({ step: 'return home', state: await released(page, kind + ' final complete journey') })
  attempt.status = 'complete'
  return events
  } catch (error) {
    attempt.status = 'failed'; attempt.failure = error.stack || String(error)
    attempt.finalNavigation = await navigationState(page, ['top', 'samples', 'how-it-works', 'resources', 'questions']).catch(diagnosticError => ({ error: String(diagnosticError) }))
    throw error
  } finally {
    attempt.completedAt = new Date().toISOString()
    attempt.file = 'journey-' + viewport.width + 'x' + viewport.height + '-' + motion + '-' + (touch ? 'touch' : 'pointer') + '-' + kind + '.json'
    await fs.writeFile(path.join(out, attempt.file), JSON.stringify(attempt, null, 2) + '\n')
  }
}
async function pinnedAssembly(pages, width) {
  const sequence = [], captures = []
  // Sample 6px inside the inherited 112px intervals, rather than letting
  // integer native scrolling round a fractional document boundary ambiguously.
  for (const progress of [6, 118, 230, 342, 422, 656, 342, 230, 118, 6]) {
    const state = { progress }
    const requested = await pages.published.locator('#how-it-works').evaluate((el, progress) => el.getBoundingClientRect().top + scrollY - 20 + progress, progress)
    for (const [kind, page] of Object.entries(pages)) {
      await page.bringToFront(); await page.mouse.move(0, 0)
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), requested)
      await page.waitForFunction(() => [...document.querySelector('#how-it-works').getAnimations({ subtree: true })].every(animation => animation.playState !== 'running'))
      state[kind] = await settledSnapshot(page, () => page.locator('#how-it-works').evaluate(el => {
        const r = el.getBoundingClientRect(), grid = el.querySelector('.process-grid,.sl-process-grid').getBoundingClientRect()
        return { documentTop: r.top + scrollY, top: r.top, height: r.height, gridTop: grid.top, scrollY, active: [...el.querySelectorAll('button[aria-pressed]')].findIndex(button => button.getAttribute('aria-pressed') === 'true') }
      }))
      check(Math.abs(state[kind].scrollY - requested) <= 1 && state[kind].active === Math.min(3, Math.floor(progress / 112)), kind + ' complete-page pinned stage at ' + progress)
    }
    for (const key of ['documentTop', 'top', 'height', 'gridTop', 'scrollY']) check(Math.abs(state.published[key] - state.source[key]) <= .15, width + ' complete-page pinned absolute ' + key + ' at ' + progress)
    sequence.push(state)
    if ([342, 422, 656].includes(progress) && sequence.length <= 6) captures.push(await captureViewport(pages, width + '-assembled-process-' + progress, { top: Math.round(requested), height: 900 }))
  }
  for (const kind of ['published', 'source']) {
    const fourth = sequence[3][kind], held = sequence[4][kind], released = sequence[5][kind]
    check(fourth.active === 3 && held.active === 3 && Math.abs(fourth.gridTop - held.gridTop) <= .15, kind + ' complete-page fourth-stage hold')
    check(released.active === 3 && released.gridTop < held.gridTop - 20, kind + ' complete-page sticky release')
  }
  return { state: 'pinned progression at assembled absolute positions', width, sequence, captures }
}
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] })
  report.browser = browser.version(); pixelPage = await browser.newPage()
  for (const width of widths) {
    const pages = await pair({ width, height: 900 }), row = { width, comparisons: [], joins: [] }
    try {
      row.comparisons.push(await measure(pages, width + ' reduced complete page'))
      row.joins.push(await captureViewport(pages, width + '-top', { height: 900 }))
      for (const key of joinKeys) row.joins.push(await captureViewport(pages, width + '-join-' + key, { key }))
      const endTop = await pages.published.evaluate(() => document.documentElement.scrollHeight - innerHeight)
      row.joins.push(await captureViewport(pages, width + '-ending', { top: endTop, height: 900 }))
      for (const page of Object.values(pages)) { await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await frames(page) }
      row.comparisons.push(await measure(pages, width + ' motion enabled complete page'))
      report.widths.push(row)
    } finally { await closePair(pages) }
  }
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    for (const motion of ['reduce', 'no-preference']) {
      const pages = await pair(viewport, { motion }), entries = {}
      try {
        for (const [kind, page] of Object.entries(pages)) entries[kind] = await journey(page, kind, viewport, { motion })
        report.states.push({ state: 'combined page journey', viewport, motion, ...entries })
        report.states.push(await measure(pages, viewport.width + '-' + motion + '-after-journey'))
      } finally { await closePair(pages) }
    }
  }
  for (const width of focused ? [1440] : [1024, 1440]) {
    const pages = await pair({ width, height: 900 }, { motion: 'no-preference' })
    try { report.states.push(await pinnedAssembly(pages, width)) }
    finally { await closePair(pages) }
  }
  if (!focused) {
    for (const viewport of [{ width: 320, height: 568 }, { width: 820, height: 500 }, { width: 1440, height: 500 }]) {
      const pages = await pair(viewport, { motion: 'no-preference' })
      try { report.states.push({ state: 'short screen assembled geometry', viewport, ...(await measure(pages, 'short-' + viewport.width)) }) }
      finally { await closePair(pages) }
    }
    const viewport = { width: 390, height: 700 }, pages = await pair(viewport, { touch: true })
    try {
      const entries = {}
      for (const [kind, page] of Object.entries(pages)) entries[kind] = await journey(page, kind, viewport, { touch: true })
      report.states.push({ state: 'emulated touch combined page journey', viewport, ...entries })
    } finally { await closePair(pages) }
  }
} catch (error) { problems.push(error.stack || String(error)) }
finally {
  if (browser) await browser.close()
  report.completedAt = new Date().toISOString()
  report.completeWidthSet = !focused && JSON.stringify(report.widths.map(row => row.width)) === JSON.stringify(requiredWidths)
  report.stateCoverage = {
    completedJourneyAttempts: report.journeyAttempts.filter(attempt => attempt.status === 'complete').length,
    requiredJourneyAttempts: focused ? 8 : 10,
    pinnedWidths: report.states.filter(state => state.state === 'pinned progression at assembled absolute positions').map(state => state.width),
    shortScreens: report.states.filter(state => state.state === 'short screen assembled geometry').map(state => state.viewport)
  }
  report.completeCheckpoint = report.completeWidthSet && report.stateCoverage.completedJourneyAttempts === 10
    && JSON.stringify(report.stateCoverage.pinnedWidths) === JSON.stringify([1024, 1440]) && report.stateCoverage.shortScreens.length === 3 && !problems.length
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const html = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const cards = report.widths.flatMap(row => row.joins).map(join => '<section><h2>' + html(join.label) + '</h2><p>Native document scroll ' + join.requested + '. Changed pixel ratio ' + join.pixels.ratio + '.</p><div class="pair">' + join.files.map((file, index) => '<figure><figcaption>' + (index ? 'React' : 'Published') + '</figcaption><a href="' + file + '"><img loading="lazy" src="' + file + '"></a></figure>').join('') + '</div></section>').join('')
  await fs.writeFile(path.join(out, 'review.html'), '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StoriLeaf complete homepage assembly</title><style>body{max-width:1600px;margin:32px auto;padding:0 20px;font:16px/1.6 system-ui;background:#f9f8f6;color:#253526}.pair{display:flex;gap:20px}.pair figure{flex:1;min-width:0;margin:0}img{width:100%;height:auto}section{margin:50px 0}h1,h2{line-height:1.2}</style><h1>Complete homepage assembly comparison</h1><p>' + report.widths.length + ' widths, ' + report.captures.length + ' native viewport captures, ' + report.states.length + ' interaction and short-screen records, ' + problems.length + ' problems.</p><p>' + (report.completeWidthSet ? 'Full required width matrix recorded.' : 'Focused or incomplete run. This does not establish the complete checkpoint.') + '</p><p>Actual section joins and absolute document measurements. Component interiors retain their dedicated comparisons. This is not founder acceptance, Package 4 or publication approval.</p><p><a href="report.json">Complete measurements and findings</a></p>' + cards + '</html>')
}
console.log(JSON.stringify({ browser: report.browser, completeWidthSet: report.completeWidthSet, widths: report.widths.map(row => row.width), states: report.states.length, captures: report.captures.length, problems }))
if (problems.length) process.exitCode = 1
