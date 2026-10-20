import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { settledSnapshot } from './browser-readiness.mjs'
import { compareAutoMargins, comparePixelCoordinates } from './computed-style-parity.mjs'

// Run from frontend. HERO_WIDTHS narrows development work only. A checkpoint
// requires the default matrix and every functional scenario below.
const out = process.env.HERO_QA_OUT || 'qa/hero'
const widths = process.env.HERO_WIDTHS?.split(',').map(Number) || [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const focused = process.env.HERO_FOCUSED === '1'
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/'
}
const problems = [], qualityFindings = []
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const check = (ok, message) => { if (!ok) problems.push(message) }
const report = {
  checkpoint: 'Package 3 Group 7 Hero and motion', baseline,
  sourceCommit: process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(), focused,
  thresholds: { geometry: .15, pixelChannel: 24, pixelRatio: .01, measuredAutoplayMilliseconds: [7300, 8500] },
  widths: [], states: [], captures: [], preparation: [], sourceHashes: {}, problems, qualityFindings,
  captureMethod: 'Real served pages, fonts and decoded photographs. Reduced motion comparisons include every photograph. Motion-enabled comparison captures pause existing native hero animations at a recorded common phase through the Web Animations API, then restore their original state. No animation definition, content, layout rule or baseline is replaced. Isolated hero captures temporarily hide only the sticky header; separate unchanged viewport captures retain it. Hover captures use the native scrolled viewport and re-hover the target, with before/after state assertions. Focus captures assert activeElement and focus-visible before/after. Geometry and section joins are measured without origin alignment.',
  computedStyleMethod: 'Raw styles remain in every snapshot. Pixel-valued transform-origin coordinates use the unchanged 0.15px geometry gate. Only the identified centred .hero-window can compare differing raw horizontal margins through native typed auto values and independently measured box-to-parent content gaps; both boxes, parent boxes, centring and raw values are checked. Missing typed evidence fails. The observed Chromium zero-versus-used-pixel serialization is recorded, not discarded.',
  limits: 'Chromium only. Touch uses browser input emulation. Text enlargement doubles targeted text properties and is not native browser zoom, a physical device test, a screen reader test or accessibility certification. Browser visibility is reported only if the headless browser actually exposes a hidden document.'
}

// Independent expectations transcribed from the immutable homepage bundle.
// They are intentionally not imported from the new React implementation.
const imageRoot = 'https://storileaf.com/images/brand/'
const scenes = [
  { src: imageRoot + 'craft/storileaf-square-hardcover-binding-detail-wide-1200.webp', alt: 'Close view of a finished StoriLeaf book, its binding and page edges', position: '50% 54%', label: 'A finished printed book' },
  { src: imageRoot + 'craft/storileaf-life-story-text-photo-spread-wide-1200.webp', alt: 'An open StoriLeaf story book with writing and a photograph across the spread', position: '50% 50%', label: 'Inside the book' },
  { src: imageRoot + 'brand/storileaf-family-reading-open-memoir-hero-1440.webp', alt: 'A family reading an open personal story book together at home', position: '50% 62%', label: 'A book in real life' }
]
const phrases = ['The kitchen everyone ended up in', 'The trip that went completely off plan', 'How you met', 'The first difficult year', 'The advice you want them to have', 'The day everyone came together']
const angles = [0, 60, 120, 180, 240, 300, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
const coverIndices = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 6, 3, 4, 5]
const styleKeys = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textWrap', 'color', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'maskImage', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'rowGap', 'columnGap', 'objectFit', 'objectPosition', 'display', 'position', 'alignItems', 'justifyContent', 'flexDirection', 'flexWrap', 'flexShrink', 'opacity', 'boxShadow', 'overflow', 'zIndex', 'transform', 'transformOrigin', 'pointerEvents', 'touchAction', 'outlineWidth', 'outlineStyle', 'outlineColor', 'outlineOffset', 'animationName', 'animationDuration', 'animationTimingFunction', 'animationIterationCount', 'animationDirection', 'animationFillMode', 'animationPlayState']
const textKeys = new Set(['title', 'emphasis', 'progression', 'progression-number', 'progression-arrow', 'description', 'action', 'phrase', 'ornament'])

await fs.mkdir(out, { recursive: true })
for (const folder of ['src', 'content']) {
  async function walk(dir) {
    for (const entry of (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) await walk(file)
      else report.sourceHashes[file] = hash(await fs.readFile(file))
    }
  }
  await walk(folder)
}
report.harnessHashes = {}
for (const file of ['scripts/verify-hero-parity.mjs', 'scripts/browser-readiness.mjs', 'scripts/computed-style-parity.mjs']) report.harnessHashes[file] = hash(await fs.readFile(file))
report.protectedHashes = {}
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/content-sections-CfrmOVRI.js', ...Array.from({ length: 7 }, (_, i) => 'covers/cover-0' + (i + 1) + '.jpg')]) {
  const bytes = await fs.readFile('../' + file)
  check(bytes.equals(execFileSync('git', ['show', baseline + ':' + file])), 'Protected baseline changed ' + file)
  report.protectedHashes[file] = hash(bytes)
}

function queries(kind) {
  return [
    ['root', '.hero'], ['intro', '.hero-intro'], ['title', '#hero-title'], ['emphasis', '#hero-title em'],
    ['progression-container', '.hero-progression'], ['progression', '.hero-progression>span'], ['progression-number', '.hero-progression b'], ['progression-arrow', '.hero-progression i'],
    ['window', '.hero-window'], ['frame', '.hero-image-frame'], ['photo', '[data-testid="hero-image"]'], ['controls', '.hero-image-controls'],
    ['dots', '.hero-image-dots'], ['dot', '.hero-dot'], ['dot-mark', '.hero-dot span'], ['buttons', '.hero-image-buttons'], ['button', '.hero-image-buttons button'], ['control-icon', '.hero-image-buttons svg'],
    ['outro', '.hero-outro'], ['description', '.hero-description'], ['actions', '.hero-actions'], ['action', '.hero-actions a'], ['action-icon', '.hero-actions svg'],
    ['ticker', '.hero-marquee'], ['ticker-viewport', '.hero-marquee-viewport'], ['track', '.hero-marquee-track'], ['group', '.hero-marquee-group'], ['phrase', '.hero-marquee-group>span'], ['ornament', '.hero-marquee-group i'],
    ['orbit-layer', '.hero-orbit-layer'], ['orbit-stage', '.hero-orbit-stage'], ['ring', '.hero-orbit-ring'], ['tile-position', '.hero-orbit-position'], ['tile-face', '.hero-orbit-face'], ['tile-image', '.hero-orbit-square'], ['fade', '.hero-orbit-fade'],
    ['header', kind === 'source' ? '.sl-header' : '.site-header'], ['band', kind === 'source' ? '.sl-home-reassurance' : '.trust-band'], ['books', '#books']
  ]
}

async function snapshot(p, kind) {
  return settledSnapshot(p, () => p.evaluate(({ queries, styleKeys, textKeys }) => {
    const root = document.querySelector('.hero'), origin = root.getBoundingClientRect()
    const style = (el, key, pseudo) => {
      const s = getComputedStyle(el, pseudo), result = Object.fromEntries(styleKeys.map(k => [k, k === 'fontFamily' ? s[k].split(',')[0].replaceAll('"', '').trim() : s[k]]))
      if (!textKeys.includes(key)) for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'color', 'textAlign', 'textWrap']) delete result[k]
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (s['border' + side + 'Width'] === '0px') delete result['border' + side + 'Color']
      if (s.outlineStyle === 'none' || s.outlineWidth === '0px') for (const k of ['outlineWidth', 'outlineStyle', 'outlineColor', 'outlineOffset']) delete result[k]
      return result
    }
    const nodes = Object.fromEntries(queries.map(([key, selector]) => [key, [...document.querySelectorAll(selector)].map(el => {
      const r = el.getBoundingClientRect(), href = el.getAttribute('href')
      const src = el.tagName === 'IMG' ? el.currentSrc.replace(/^https?:\/\/[^/]+(?:\/storileaf-homepage-preview)?\/covers\//, 'covers/') : undefined
      const result = {
        rect: [r.x - origin.x, r.y - origin.y, r.width, r.height], style: style(el, key),
        text: textKeys.includes(key) ? el.textContent.replace(/\s+/g, ' ').trim() : undefined,
        href: href && (new URL(href, location.href).origin === location.origin && new URL(href, location.href).hash ? new URL(href, location.href).hash : href),
        alt: el.getAttribute('alt'), src, label: el.getAttribute('aria-label'), role: el.getAttribute('role'),
        pressed: el.getAttribute('aria-pressed'), current: key === 'dot' ? el.getAttribute('aria-current') : undefined,
        hidden: el.getAttribute('aria-hidden'), tabindex: el.getAttribute('tabindex')
      }
      if (key === 'window') {
        const parent = el.parentElement, parentRect = parent.getBoundingClientRect(), parentStyle = getComputedStyle(parent)
        const available = typeof el.computedStyleMap === 'function', typed = available ? el.computedStyleMap() : null
        const parentEdges = { borderLeft: parseFloat(parentStyle.borderLeftWidth), paddingLeft: parseFloat(parentStyle.paddingLeft), borderRight: parseFloat(parentStyle.borderRightWidth), paddingRight: parseFloat(parentStyle.paddingRight) }
        result.autoMargins = {
          bounded: el.matches('.hero-window') && parent === root && result.style.display === 'block' && result.style.position === 'relative' && result.style.transform === 'none' && parentStyle.transform === 'none' && parentStyle.writingMode === 'horizontal-tb',
          available,
          typed: { marginLeft: typed?.get('margin-left')?.toString(), marginRight: typed?.get('margin-right')?.toString() },
          raw: { marginLeft: result.style.marginLeft, marginRight: result.style.marginRight },
          rect: [r.x + scrollX, r.y + scrollY, r.width, r.height], parentRect: [parentRect.x + scrollX, parentRect.y + scrollY, parentRect.width, parentRect.height], parentEdges,
          layout: { display: result.style.display, position: result.style.position, transform: result.style.transform, parentTransform: parentStyle.transform },
          measured: { marginLeft: r.left - parentRect.left - parentEdges.borderLeft - parentEdges.paddingLeft, marginRight: parentRect.right - parentEdges.borderRight - parentEdges.paddingRight - r.right }
        }
      }
      // Header, reassurance and Books keep their own previously verified
      // content/style contracts. Here only their actual absolute joins matter.
      if (['header', 'band', 'books'].includes(key)) return { rect: result.rect }
      return result
    })]))
    const band = root.nextElementSibling, books = band?.nextElementSibling
    return {
      nodes,
      pseudo: { grid: style(root, 'grid', '::before'), veil: style(root.querySelector('.hero-image-frame'), 'veil', '::after') },
      origin: [origin.x, origin.y + scrollY], active: Number(root.querySelector('[data-testid="hero-image"]').dataset.slide),
      playing: root.dataset.playing, tickerPlaying: root.dataset.marqueePlaying, orbitPaused: root.dataset.orbitPaused,
      previousCount: root.querySelectorAll('.hero-photo-previous').length,
      coverAngles: [...root.querySelectorAll('.hero-orbit-position')].map(e => e.style.getPropertyValue('--tile-angle')),
      orbitRadii: [...root.querySelectorAll('.hero-orbit-ring')].map(e => getComputedStyle(e).getPropertyValue('--orbit-radius').trim()),
      sectionOrder: { first: document.querySelector('main')?.firstElementChild === root, band: band?.getAttribute('aria-label'), books: books?.id },
      ids: ['hero-title', 'books', 'samples'].map(id => document.querySelectorAll('[id="' + id + '"]').length),
      live: root.querySelector('[aria-live]')?.getAttribute('aria-live'),
      overflow: document.documentElement.scrollWidth > innerWidth + 1
    }
  }, { queries: queries(kind), styleKeys, textKeys: [...textKeys] }))
}

function compare(b, a, label, { enlarged = false } = {}) {
  const differences = [], computedStyleComparisons = []; let maximumGeometry = 0
  for (const [key, values] of Object.entries(b.nodes)) {
    if (values.length !== a.nodes[key]?.length) { differences.push(key + ' count'); continue }
    for (const [i, x] of values.entries()) {
      const y = a.nodes[key][i]
      const autoMargins = key === 'window' ? compareAutoMargins(x.autoMargins, y.autoMargins, { tolerance: .15 }) : null
      if (autoMargins) {
        computedStyleComparisons.push({ node: `${key}[${i}]`, property: 'auto horizontal margins', ...autoMargins, published: x.autoMargins, source: y.autoMargins })
        maximumGeometry = Math.max(maximumGeometry, autoMargins.maximumGeometry)
        if (!autoMargins.equal) differences.push(`${key}[${i}] auto margins ${autoMargins.differences.join(', ')}`)
      }
      for (let j = 0; j < 4; j++) {
        const delta = Math.abs(x.rect[j] - y.rect[j]); maximumGeometry = Math.max(maximumGeometry, delta)
        if (delta > .15) differences.push(`${key}[${i}].rect[${j}] ${x.rect[j]} versus ${y.rect[j]}`)
      }
      for (const k of ['style', 'text', 'href', 'alt', 'src', 'label', 'role', 'pressed', 'current', 'hidden', 'tabindex']) if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) {
        if (k === 'style') {
          for (const prop of new Set([...Object.keys(x.style || {}), ...Object.keys(y.style || {})])) {
            if (x.style?.[prop] === y.style?.[prop]) continue
            if (prop === 'transformOrigin') {
              const coordinates = comparePixelCoordinates(x.style[prop], y.style[prop], .15)
              computedStyleComparisons.push({ node: `${key}[${i}]`, property: prop, published: x.style[prop], source: y.style[prop], ...coordinates })
              if (coordinates.maximumGeometry !== null) maximumGeometry = Math.max(maximumGeometry, coordinates.maximumGeometry)
              if (coordinates.equal) continue
            }
            if (autoMargins?.equal && ['marginLeft', 'marginRight'].includes(prop)) continue
            differences.push(`${key}[${i}].style.${prop} ${x.style?.[prop]} versus ${y.style?.[prop]}`)
          }
        } else differences.push(`${key}[${i}].${k}`)
      }
    }
  }
  for (const key of ['pseudo', 'active', 'playing', 'tickerPlaying', 'orbitPaused', 'previousCount', 'coverAngles', 'orbitRadii', 'sectionOrder', 'live']) if (JSON.stringify(b[key]) !== JSON.stringify(a[key])) differences.push(key)
  if (b.origin.some((v, i) => Math.abs(v - a.origin[i]) > .15)) differences.push('absolute hero origin')
  if (!b.ids.every(n => n === 1) || !a.ids.every(n => n === 1)) differences.push('unique IDs')
  check(!differences.length, label + ' ' + differences.join('; '))
  if (!enlarged) check(!b.overflow && !a.overflow, label + ' document overflow')
  return { maximumGeometry, differences, computedStyleComparisons }
}

let browser
async function newPage(kind, viewport, motion = 'reduce', touch = false) {
  const context = await browser.newContext({ viewport, reducedMotion: motion, hasTouch: touch, deviceScaleFactor: 1 })
  const p = await context.newPage()
  p.on('pageerror', e => problems.push(kind + ' runtime ' + e.message))
  await p.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await p.locator('.hero [data-testid="hero-image"]').waitFor()
  await p.evaluate(async () => {
    await Promise.all([document.fonts.load('450 70px Newsreader'), document.fonts.load('italic 420 70px Newsreader'), document.fonts.load('italic 400 17px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('650 15px Manrope')])
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll('.hero img')].map(i => i.decode()))
    scrollTo({ top: 0, behavior: 'instant' })
  })
  check(await p.evaluate(() => ['Newsreader', 'Manrope'].every(name => [...document.fonts].some(f => f.family.includes(name) && f.status === 'loaded'))), kind + ' real fonts required')
  await p.waitForFunction(reduced => document.querySelector('.hero').dataset.playing === String(!reduced), motion === 'reduce')
  await p.waitForFunction(() => !document.querySelector('.hero-photo-previous'))
  return p
}
async function pages(viewport, motion = 'reduce', touch = false) { return { published: await newPage('published', viewport, motion, touch), source: await newPage('source', viewport, motion, touch) } }
async function close(ps) { for (const p of Object.values(ps)) await p.context().close() }
async function active(p) { return Number(await p.getByTestId('hero-image').getAttribute('data-slide')) }
async function settlePhoto(p) {
  await p.waitForFunction(() => !document.querySelector('.hero-photo-previous'))
  await p.getByTestId('hero-image').evaluate(i => i.decode())
  await p.waitForFunction(() => [...document.querySelector('.hero').getAnimations({ subtree: true })].every(a => a.effect.getTiming().iterations === Infinity || a.playState !== 'running'))
}
async function select(p, index) {
  if (await active(p) !== index) {
    const dot = p.getByRole('button', { name: 'Show photograph ' + (index + 1), exact: true })
    if (await dot.isVisible()) await dot.click()
    else for (let remaining = 0; remaining < 3 && await active(p) !== index; remaining++) await p.getByTestId('hero-next').click()
  }
  await settlePhoto(p)
  await p.mouse.move(0, 0)
  await p.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: 'instant' }) })
}
async function photoContract(p, kind, index) {
  const value = await p.getByTestId('hero-image').evaluate(i => ({ src: i.currentSrc, alt: i.alt, position: getComputedStyle(i).objectPosition, width: i.getAttribute('width'), height: i.getAttribute('height'), priority: i.getAttribute('fetchpriority'), natural: [i.naturalWidth, i.naturalHeight], label: i.parentElement.querySelector('[aria-live]')?.textContent, dot: [...i.closest('.hero').querySelectorAll('.hero-dot')].map(e => e.getAttribute('aria-current')) }))
  const expected = scenes[index]
  check(value.src === expected.src && value.alt === expected.alt && value.position === expected.position && value.label === expected.label, kind + ' original photograph ' + index)
  check(value.width === '1400' && value.height === '650' && value.natural.every(v => v > 0), kind + ' photograph dimensions and decoding ' + index)
  check(value.priority === (index === 0 ? 'high' : 'auto'), kind + ' original photo priority ' + index)
  check(value.dot.filter(v => v === 'true').length === 1 && value.dot[index] === 'true', kind + ' dot selection ' + index)
  return value
}
async function pair(ps, label, options = {}) {
  const b = await snapshot(ps.published, 'published'), a = await snapshot(ps.source, 'source')
  return { label, published: b, source: a, ...compare(b, a, label, options) }
}

// Freeze only the progress of native animations. CSS names, keyframes, timing,
// transforms, dimensions and animation controls remain measurable unchanged.
async function pinAnimations(p, phase) {
  const record = await p.evaluateHandle(phase => {
    const entries = document.querySelector('.hero').getAnimations({ subtree: true }).map(animation => ({ animation, time: animation.currentTime, state: animation.playState }))
    for (const { animation } of entries) { animation.pause(); animation.currentTime = phase }
    return entries
  }, phase)
  await p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  return async () => {
    await record.evaluate(entries => { for (const { animation, time, state } of entries) { animation.currentTime = time; if (state === 'running') animation.play(); else if (state === 'paused') animation.pause() } })
    await record.dispose()
  }
}
async function pixels(files) {
  const p = await browser.newPage()
  const inputs = await Promise.all(files.map(async file => 'data:image/png;base64,' + (await fs.readFile(path.join(out, file))).toString('base64')))
  try {
    return await p.evaluate(async ([first, second]) => {
      const load = async src => { const img = new Image(); img.src = src; await img.decode(); return img }
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
  } finally { await p.close() }
}
async function suppressHeader(p, label) {
  const selector = '.site-header,.site-header *,.sl-header,.sl-header *'
  const stylesheet = await p.addStyleTag({ content: selector + '{visibility:hidden!important}' })
  await p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const evidence = await p.locator(selector).evaluateAll(elements => ({
    count: elements.length,
    visible: elements.filter(el => getComputedStyle(el).visibility !== 'hidden').map(el => ({ tag: el.tagName, className: typeof el.className === 'string' ? el.className : el.getAttribute('class'), visibility: getComputedStyle(el).visibility }))
  }))
  check(evidence.count > 0 && evidence.visible.length === 0, label + ' scoped header and descendant suppression ' + JSON.stringify(evidence))
  report.preparation.push({ method: 'Temporary visibility:hidden on the identified header and all descendants, followed by two native animation frames and computed-visibility checks. The stylesheet is removed after this clean capture. Header context captures remain unchanged.', label, selector, ...evidence })
  return stylesheet
}
async function captures(ps, label, context = false, focusSelector) {
  const files = []
  for (const [kind, p] of Object.entries(ps)) {
    await p.bringToFront(); await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    let hiddenHeader
    try {
      if (!context) hiddenHeader = await suppressHeader(p, kind + ' ' + label)
      const file = `${kind}-${label}${context ? '-context' : ''}.png`
      const focusState = async () => p.locator(focusSelector).evaluate(el => ({ active: document.activeElement === el, visible: el.matches(':focus-visible') }))
      const focusBefore = focusSelector ? await focusState() : undefined
      if (focusSelector) check(focusBefore.active && focusBefore.visible, kind + ' ' + label + ' focus immediately before capture')
      if (context) await p.screenshot({ path: path.join(out, file), animations: 'allow', caret: 'hide' })
      else await p.locator('.hero').screenshot({ path: path.join(out, file), animations: 'allow', caret: 'hide' })
      const focusAfter = focusSelector ? await focusState() : undefined
      if (focusSelector) check(focusAfter.active && focusAfter.visible, kind + ' ' + label + ' focus immediately after capture')
      files.push(file); report.captures.push({ kind, file, context, viewport: p.viewportSize(), focus: focusSelector ? { selector: focusSelector, before: focusBefore, after: focusAfter } : undefined, sha256: hash(await fs.readFile(path.join(out, file))) })
    } finally { if (hiddenHeader) await hiddenHeader.evaluate(e => e.remove()) }
  }
  const result = await pixels(files)
  check(result.ratio !== null && result.ratio <= .01, label + (context ? ' context' : '') + ' pixels ' + JSON.stringify(result))
  return { files, pixels: result }
}
// Returning to the page top after hover moves the target away from the real
// pointer. Capture the native viewport with the target in view, then prove the
// pointer and resolved hover appearance survived the actual screenshot.
async function hoverCaptures(ps, label, selector) {
  const viewport = ps.source.viewportSize(), files = [], states = {}
  const target = await ps.published.locator(selector).evaluate((el, height) => {
    const r = el.getBoundingClientRect()
    return Math.max(0, Math.floor(r.top + scrollY - (height - r.height) / 2))
  }, viewport.height)
  for (const [kind, p] of Object.entries(ps)) {
    await p.bringToFront()
    await p.evaluate(top => { document.activeElement?.blur(); scrollTo({ top, behavior: 'instant' }) }, target)
    const hiddenHeader = await suppressHeader(p, kind + ' ' + label)
    const readState = () => p.locator(selector).evaluate(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el)
      return { hovered: el.matches(':hover'), scrollY, rect: [r.x, r.y, r.width, r.height], background: s.backgroundColor, color: s.color, border: s.borderColor, boxShadow: s.boxShadow }
    })
    try {
      await p.locator(selector).hover()
      const before = await settledSnapshot(p, readState)
      check(before.hovered && before.scrollY === target && before.rect[1] >= 0 && before.rect[1] + before.rect[3] <= viewport.height, kind + ' ' + label + ' native hover before capture')
      const file = `${kind}-${label}-native.png`
      await p.screenshot({ path: path.join(out, file), clip: { x: 0, y: 0, ...viewport }, animations: 'allow', caret: 'hide' })
      const after = await readState()
      check(after.hovered && JSON.stringify(before) === JSON.stringify(after), kind + ' ' + label + ' native hover retained through capture')
      states[kind] = { before, after }; files.push(file)
      report.captures.push({ kind, file, context: 'native scrolled hover', viewport, selector, scrollY: target, hover: states[kind], sha256: hash(await fs.readFile(path.join(out, file))) })
    } finally {
      await hiddenHeader.evaluate(e => e.remove())
      await p.mouse.move(0, 0)
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    }
  }
  const maximumGeometry = Math.max(...states.published.before.rect.map((value, index) => Math.abs(value - states.source.before.rect[index])))
  check(maximumGeometry <= .15, label + ' native hover geometry ' + maximumGeometry)
  const result = await pixels(files)
  check(result.ratio !== null && result.ratio <= .01, label + ' native hover pixels ' + JSON.stringify(result))
  report.preparation.push({ method: 'Identical native document scroll centres the target. The real pointer hovers after scrolling; settled computed appearance and :hover are asserted immediately before and after a viewport screenshot. No subsequent capture scroll changes the pointer relationship.', selector, target, viewport })
  return { files, pixels: result, states, maximumGeometry }
}
// A whole-hero locator screenshot can include compositor tiles below the
// current viewport. Native scrolling makes the lower join visibly painted.
// Both pages receive the same document scroll target; no origins are aligned.
async function joinCaptures(ps, label) {
  const target = await ps.published.locator('.hero-outro').evaluate(el => Math.max(0, Math.floor(el.getBoundingClientRect().top + scrollY) - 24))
  const measurements = {}, files = []
  for (const [kind, p] of Object.entries(ps)) {
    await p.bringToFront()
    await p.evaluate(top => { document.activeElement?.blur(); scrollTo({ top, behavior: 'instant' }) }, target)
    measurements[kind] = await settledSnapshot(p, () => p.evaluate(bandSelector => {
      const selectors = { outro: '.hero-outro', ticker: '.hero-marquee', band: bandSelector, books: '#books' }
      const regions = Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
        const el = document.querySelector(selector), rect = el.getBoundingClientRect()
        return [key, { rect: [rect.x, rect.y, rect.width, rect.height], background: getComputedStyle(el).backgroundColor }]
      }))
      return { scrollY, regions }
    }, kind === 'source' ? '.sl-home-reassurance' : '.trust-band'))
  }
  const viewport = ps.source.viewportSize()
  const clip = { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, Math.ceil(Math.max(...Object.values(measurements).map(m => m.regions.books.rect[1])) + 180)) }
  const geometry = []
  for (const [kind, measurement] of Object.entries(measurements)) {
    check(measurement.scrollY === target, kind + ' join uses requested native document scroll')
    for (const key of ['outro', 'ticker', 'band']) {
      const r = measurement.regions[key].rect
      check(r[1] >= 0 && r[1] + r[3] <= clip.height, kind + ' ' + key + ' fully inside native join capture')
    }
    check(measurement.regions.books.rect[1] < clip.height, kind + ' Books begins inside native join capture')
  }
  for (const key of ['outro', 'ticker', 'band', 'books']) {
    const before = measurements.published.regions[key].rect, after = measurements.source.regions[key].rect
    const maximumGeometry = Math.max(...before.map((value, index) => Math.abs(value - after[index])))
    geometry.push({ region: key, maximumGeometry })
    check(maximumGeometry <= .15, label + ' native join geometry ' + key + ' ' + maximumGeometry)
  }
  for (const [kind, p] of Object.entries(ps)) {
    await p.bringToFront()
    const hiddenHeader = await suppressHeader(p, kind + ' ' + label + ' join')
    try {
      const file = `${kind}-${label}-join.png`
      await p.screenshot({ path: path.join(out, file), clip, animations: 'allow', caret: 'hide' })
      files.push(file)
      report.captures.push({ kind, file, context: 'native scrolled join', viewport, clip, scrollY: measurements[kind].scrollY, sha256: hash(await fs.readFile(path.join(out, file))) })
    } finally {
      await hiddenHeader.evaluate(e => e.remove())
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    }
  }
  const result = await pixels(files)
  check(result.ratio !== null && result.ratio <= .01, label + ' native join pixels ' + JSON.stringify(result))
  const painted = {}, probe = await browser.newPage()
  try {
    for (const [index, kind] of ['published', 'source'].entries()) {
      const image = 'data:image/png;base64,' + (await fs.readFile(path.join(out, files[index]))).toString('base64')
      painted[kind] = await probe.evaluate(async ({ image, regions }) => {
        const img = new Image(); img.src = image; await img.decode()
        const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0)
        const sample = document.createElement('canvas'); sample.width = sample.height = 1
        const colour = sample.getContext('2d', { willReadFrequently: true })
        return ['ticker', 'band'].map(key => {
          colour.clearRect(0, 0, 1, 1); colour.fillStyle = regions[key].background; colour.fillRect(0, 0, 1, 1)
          const expected = [...colour.getImageData(0, 0, 1, 1).data]
          const y = Math.ceil(regions[key].rect[1]) + 3
          const samples = [.1, .5, .9].map(fraction => {
            const x = Math.floor(img.width * fraction), actual = [...ctx.getImageData(x, y, 1, 1).data]
            return { x, y, actual, maximumChannelDifference: Math.max(...expected.map((value, index) => Math.abs(value - actual[index]))) }
          })
          return { region: key, background: regions[key].background, expected, samples }
        })
      }, { image, regions: measurements[kind].regions })
      check(painted[kind].every(region => region.expected[3] === 255 && region.samples.every(sample => sample.maximumChannelDifference <= 2)), kind + ' ticker and band painted in native viewport ' + JSON.stringify(painted[kind]))
    }
  } finally { await probe.close() }
  report.preparation.push({ method: 'Native document scroll to the published outro minus 24px, applied identically to both pages. Bounded viewport capture includes the complete outro, ticker and reassurance band plus the start of Books. Only sticky-header visibility is temporarily hidden. Three background pixels in both ticker and band verify actual painting within 2 channel levels.', target, viewport, clip })
  return { files, pixels: result, measurements, geometry, painted }
}
async function withPinnedPair(ps, phase, action) {
  const restore = []
  try {
    for (const p of Object.values(ps)) {
      await holdCarousel(p)
      await settlePhoto(p)
      restore.push(await pinAnimations(p, phase))
    }
    report.preparation.push({ method: 'Native pointer hover inside the photograph frame pauses its unmodified autoplay timer. Existing animations are then pinned to a common progress value.', phaseMilliseconds: phase, viewport: ps.source.viewportSize() })
    return await action()
  } finally { for (const fn of restore.reverse()) await fn() }
}
async function holdCarousel(p) {
  await p.bringToFront()
  await p.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: 'instant' }) })
  const box = await p.locator('.hero-image-frame').boundingBox()
  check(box.y + 20 < p.viewportSize().height, 'Native frame hover preparation must be inside the viewport')
  await p.mouse.move(box.x + 20, box.y + 20)
}
async function nativeState(p) {
  return p.locator('.hero').evaluate(root => ({
    active: Number(root.querySelector('[data-testid="hero-image"]').dataset.slide), playing: root.dataset.playing,
    orbitPaused: root.dataset.orbitPaused, tickerPlaying: root.dataset.marqueePlaying,
    tickerHeld: root.querySelector('.hero-marquee').getAttribute('aria-pressed'), tickerLabel: root.querySelector('.hero-marquee').getAttribute('aria-label'),
    hidden: document.hidden, visibilityState: document.visibilityState,
    animations: root.getAnimations({ subtree: true }).map(a => ({ name: a.animationName, playState: a.playState, time: a.currentTime, duration: a.effect.getTiming().duration, iterations: a.effect.getTiming().iterations === Infinity ? 'infinite' : a.effect.getTiming().iterations }))
  }))
}
async function waitActive(p, index, timeout = 10000) { await p.waitForFunction(index => Number(document.querySelector('[data-testid="hero-image"]').dataset.slide) === index, index, { timeout }) }
async function heldInterval(p, label) {
  const before = await active(p), started = Date.now()
  await p.waitForTimeout(8000)
  const after = await active(p)
  check(before === after, label + ' changed during an entire paused interval')
  return { before, after, elapsedMilliseconds: Date.now() - started }
}
async function scenario(label, run) {
  try { await run() } catch (error) { problems.push(label + ' ' + (error.stack || String(error))) }
}

try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] })
  report.browser = browser.version()
  for (const width of widths) await scenario('width ' + width, async () => {
    const ps = await pages({ width, height: 900 })
    try {
      const photographs = []
      for (let index = 0; index < 3; index++) {
        const images = {}
        for (const [kind, p] of Object.entries(ps)) { await select(p, index); images[kind] = await photoContract(p, kind, index) }
        const entry = await pair(ps, `reduced-${width}-photo-${index + 1}`)
        entry.images = images; entry.rendered = await captures(ps, entry.label)
        if (index === 0) {
          entry.context = await captures(ps, entry.label, true)
          entry.join = await joinCaptures(ps, entry.label)
        }
        check(entry.source.sectionOrder.first && entry.source.sectionOrder.band === 'What to expect from StoriLeaf' && entry.source.sectionOrder.books === 'books', width + ' full header hero ticker reassurance discovery relationship')
        check(entry.source.previousCount === 0 && entry.source.playing === 'false' && entry.source.live === 'polite', width + ' initial reduced motion')
        photographs.push(entry)
      }
      report.widths.push({ width, photographs })
    } finally { await close(ps) }
  })

  for (const width of focused ? [390, 820, 1440].filter(w => widths.includes(w)) : [390, 600, 820, 1440]) await scenario('native motion ' + width, async () => {
    const ps = await pages({ width, height: 900 }, 'no-preference')
    try {
      for (const [kind, p] of Object.entries(ps)) {
        await select(p, 0)
        await holdCarousel(p)
        const contract = await p.locator('.hero').evaluate(root => ({
          covers: [...root.querySelectorAll('.hero-orbit-square')].map(i => ({ file: i.currentSrc.split('/').at(-1), alt: i.alt, width: i.getAttribute('width'), height: i.getAttribute('height'), loading: i.loading, decoding: i.decoding, priority: i.fetchPriority, natural: [i.naturalWidth, i.naturalHeight] })),
          angles: [...root.querySelectorAll('.hero-orbit-position')].map(e => Number.parseFloat(e.style.getPropertyValue('--tile-angle'))),
          phrases: [...root.querySelectorAll('.hero-marquee-group')].map(group => [...group.children].map(e => e.firstChild.textContent)),
          rings: [...root.querySelectorAll('.hero-orbit-ring')].map(e => ({ radius: getComputedStyle(e).getPropertyValue('--orbit-radius').trim(), name: getComputedStyle(e).animationName, duration: getComputedStyle(e).animationDuration, easing: getComputedStyle(e).animationTimingFunction })),
          faces: [...root.querySelectorAll('.hero-orbit-face')].map(e => ({ name: getComputedStyle(e).animationName, duration: getComputedStyle(e).animationDuration })),
          ticker: { name: getComputedStyle(root.querySelector('.hero-marquee-track')).animationName, duration: getComputedStyle(root.querySelector('.hero-marquee-track')).animationDuration },
          coverHidden: root.querySelector('.hero-orbit-layer').getAttribute('aria-hidden'), tickerHidden: root.querySelector('.hero-marquee-viewport').getAttribute('aria-hidden'),
          controls: [...root.querySelectorAll('button,[role="button"]')].map(e => e.getAttribute('aria-label'))
        }))
        check(contract.covers.length === 14 && contract.covers.every((c, i) => c.file === 'cover-0' + (coverIndices[i] + 1) + '.jpg' && c.alt === '' && c.width === '240' && c.height === '240' && c.loading === 'eager' && c.decoding === 'async' && c.priority === 'low' && c.natural.every(n => n > 0)), kind + ' fourteen original cover identities and loading')
        check(JSON.stringify(contract.angles) === JSON.stringify(angles), kind + ' original tile angles')
        check(contract.phrases.length === 2 && contract.phrases.every(v => JSON.stringify(v) === JSON.stringify(phrases)), kind + ' two original six-phrase groups')
        check(contract.coverHidden === 'true' && contract.tickerHidden === 'true' && !contract.controls.includes('Pause movement'), kind + ' decorative covers and unchanged control set')
        const radius = width <= 720 ? ['230px', '412.5px'] : width <= 900 ? ['285px', '511.5px'] : ['345px', '665.5px']
        check(JSON.stringify(contract.rings.map(r => r.radius)) === JSON.stringify(radius), kind + ' responsive orbit radii ' + width)
        if (width > 720) {
          check(contract.rings[0].name === 'orbit-clockwise' && contract.rings[0].duration === '160s' && contract.rings[1].name === 'orbit-anticlockwise' && contract.rings[1].duration === '220s' && contract.rings.every(r => r.easing === 'linear'), kind + ' original ring timing and directions')
          check(contract.faces.slice(0, 6).every(f => f.name === 'orbit-anticlockwise' && f.duration === '160s') && contract.faces.slice(6).every(f => f.name === 'orbit-clockwise' && f.duration === '220s'), kind + ' counter-rotation keeps covers upright')
        } else check(contract.rings.every(r => r.name === 'none') && contract.faces.every(f => f.name === 'none'), kind + ' narrow orbit is static')
        check(contract.ticker.name === 'marquee-flow' && contract.ticker.duration === '34s', kind + ' ticker timing')
        report.states.push({ label: 'native motion contract ' + width, kind, contract })
      }
      for (const phase of [0, 17000]) await withPinnedPair(ps, phase, async () => {
        const entry = await pair(ps, `motion-${width}-phase-${phase}`)
        entry.rendered = await captures(ps, entry.label)
        if (phase === 0) entry.context = await captures(ps, entry.label, true)
        report.states.push(entry)
      })
    } finally { await close(ps) }
  })

  if (!focused) {
    for (const viewport of [{ width: 360, height: 900 }, { width: 361, height: 900 }, { width: 480, height: 900 }, { width: 481, height: 900 }, { width: 600, height: 900 }, { width: 601, height: 900 }, { width: 720, height: 900 }, { width: 721, height: 900 }, { width: 900, height: 900 }, { width: 901, height: 900 }, { width: 320, height: 568 }, { width: 820, height: 500 }, { width: 1440, height: 500 }]) await scenario('boundary ' + JSON.stringify(viewport), async () => {
      const ps = await pages(viewport)
      try { report.states.push(await pair(ps, `boundary-${viewport.width}x${viewport.height}`)) } finally { await close(ps) }
    })

    for (const kind of ['published', 'source']) await scenario(kind + ' native carousel and visibility', async () => {
      const p = await newPage(kind, { width: 1440, height: 900 }, 'no-preference')
      const record = { label: 'native carousel and visibility', kind }
      try {
        // Start a fresh native timer by entering and leaving the frame. The
        // timer itself is neither accelerated nor replaced.
        await p.locator('.hero-window').hover(); await p.mouse.move(0, 0)
        await p.evaluate(() => document.activeElement?.blur())
        const first = await active(p), started = Date.now()
        await waitActive(p, (first + 1) % 3)
        record.autoplay = { before: first, after: await active(p), elapsedMilliseconds: Date.now() - started }
        check(record.autoplay.elapsedMilliseconds >= 7300 && record.autoplay.elapsedMilliseconds <= 8500, kind + ' native 7600ms autoplay ' + JSON.stringify(record.autoplay))
        await settlePhoto(p)
        await p.locator('.hero-window').hover(); record.hover = await heldInterval(p, kind + ' frame hover')
        // The published implementation shares one hover/focus boolean. Move
        // outside first, then focus. Otherwise mouseleave clears that boolean
        // while focus remains inside, which would test a different behaviour.
        await p.mouse.move(0, 0); await p.getByTestId('hero-next').focus()
        record.focus = await heldInterval(p, kind + ' contained keyboard focus')
        const beforeKeyboard = await active(p)
        await p.keyboard.press('Enter'); await waitActive(p, (beforeKeyboard + 1) % 3)
        record.transition = await p.locator('.hero-image-frame').evaluate(frame => ({ direction: frame.style.getPropertyValue('--slide-direction'), images: [...frame.querySelectorAll('img')].map(i => ({ previous: i.classList.contains('hero-photo-previous'), name: getComputedStyle(i).animationName, duration: getComputedStyle(i).animationDuration, easing: getComputedStyle(i).animationTimingFunction, hidden: i.getAttribute('aria-hidden'), alt: i.alt })) }))
        check(record.transition.direction === '1' && record.transition.images.length === 2 && record.transition.images.every(i => i.easing === 'cubic-bezier(0.22, 0.61, 0.36, 1)') && record.transition.images.some(i => i.previous && i.hidden === 'true' && i.alt === '' && i.name === 'image-out' && i.duration === '0.7s') && record.transition.images.some(i => !i.previous && i.name === 'image-in' && i.duration === '0.7s'), kind + ' original image transition')
        await settlePhoto(p)
        await p.getByTestId('hero-previous').focus(); await p.keyboard.press('Space'); await waitActive(p, beforeKeyboard); await settlePhoto(p)
        check(await p.getByTestId('hero-previous').evaluate(e => document.activeElement === e), kind + ' native Space retains button focus')
        record.keyboard = { enter: true, space: true, focus: true }
        await p.getByRole('button', { name: 'Show photograph 3', exact: true }).click(); await waitActive(p, 2); await settlePhoto(p)
        await p.getByTestId('hero-next').click(); await waitActive(p, 0); await settlePhoto(p)
        await p.getByTestId('hero-previous').click(); await waitActive(p, 2); await settlePhoto(p)
        record.manual = { dots: true, nextWrap: true, previousWrap: true }
        await p.evaluate(() => document.activeElement?.blur()); await p.mouse.move(0, 0)
        await p.locator('#resources').scrollIntoViewIfNeeded()
        await p.waitForFunction(() => document.querySelector('.hero').dataset.orbitPaused === 'true')
        record.offscreen = { state: await nativeState(p), interval: await heldInterval(p, kind + ' offscreen') }
        check(record.offscreen.state.playing === 'false' && record.offscreen.state.tickerPlaying === 'false', kind + ' offscreen pauses all hero activity')
        await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
        await p.waitForFunction(() => document.querySelector('.hero').dataset.playing === 'true')
        record.returned = await nativeState(p)
        const extra = await p.context().newPage(); await extra.goto('about:blank'); await extra.bringToFront()
        record.backgroundDocument = await nativeState(p)
        if (record.backgroundDocument.hidden) {
          await p.waitForFunction(() => document.querySelector('.hero').dataset.playing === 'false')
          record.backgroundInterval = await heldInterval(p, kind + ' hidden document')
        } else record.backgroundDocument.limit = 'This headless browser keeps the original document visible. Native hidden-tab pausing is not verified by this scenario.'
        await extra.close(); await p.bringToFront()
        report.states.push(record)
      } finally { await p.context().close() }
    })

    for (const kind of ['published', 'source']) await scenario(kind + ' ticker and live preference', async () => {
      const p = await newPage(kind, { width: 1440, height: 900 }, 'no-preference'), record = { label: 'ticker and live reduced motion', kind, states: [] }
      try {
        const ticker = p.locator('.hero-marquee')
        await ticker.hover(); await p.waitForFunction(() => document.querySelector('.hero').dataset.marqueePlaying === 'false')
        let state = await nativeState(p); check(state.orbitPaused === 'false' && state.tickerHeld === 'false', kind + ' ticker hover is independent'); record.states.push({ interaction: 'hover', ...state })
        await p.mouse.move(0, 0); await p.waitForFunction(() => document.querySelector('.hero').dataset.marqueePlaying === 'true')
        await ticker.focus(); await p.waitForFunction(() => document.querySelector('.hero').dataset.marqueePlaying === 'false')
        await p.keyboard.press('Space'); state = await nativeState(p)
        check(state.tickerHeld === 'true' && state.tickerLabel === 'Resume moving phrases', kind + ' ticker Space holds'); record.states.push({ interaction: 'Space hold', ...state })
        await p.getByTestId('hero-next').focus(); state = await nativeState(p)
        check(state.tickerPlaying === 'false' && state.tickerHeld === 'true', kind + ' ticker hold survives blur'); record.states.push({ interaction: 'blur while held', ...state })
        await ticker.focus(); await p.keyboard.press('Enter'); state = await nativeState(p)
        check(state.tickerHeld === 'false' && state.tickerLabel === 'Pause moving phrases' && state.tickerPlaying === 'false', kind + ' Enter releases hold while focus pauses'); record.states.push({ interaction: 'Enter release', ...state })
        await p.evaluate(() => document.activeElement?.blur()); await p.mouse.move(0, 0)
        await p.waitForFunction(() => document.querySelector('.hero').dataset.marqueePlaying === 'true')
        await ticker.click(); await p.mouse.move(0, 0); await p.evaluate(() => document.activeElement?.blur()); state = await nativeState(p)
        check(state.tickerHeld === 'true' && state.tickerPlaying === 'false', kind + ' pointer click holds ticker'); record.states.push({ interaction: 'pointer hold', ...state })
        await ticker.click(); await p.mouse.move(0, 0); await p.evaluate(() => document.activeElement?.blur())
        await p.waitForFunction(() => document.querySelector('.hero').dataset.marqueePlaying === 'true')
        await p.emulateMedia({ reducedMotion: 'reduce' }); await p.waitForFunction(() => document.querySelector('.hero').dataset.playing === 'false'); await settlePhoto(p)
        state = await nativeState(p); check(state.tickerPlaying === 'false' && state.orbitPaused === 'true' && state.animations.length === 0, kind + ' live reduced motion removes native hero animation'); record.states.push({ interaction: 'live reduced motion', ...state })
        const current = await active(p); await p.getByTestId('hero-next').click(); await waitActive(p, (current + 1) % 3); await settlePhoto(p)
        record.reducedInterval = await heldInterval(p, kind + ' live reduced motion')
        await p.mouse.move(0, 0); await p.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: 'instant' }) })
        await p.emulateMedia({ reducedMotion: 'no-preference' }); await p.waitForFunction(() => document.querySelector('.hero').dataset.playing === 'true')
        const restored = await active(p); await waitActive(p, (restored + 1) % 3)
        record.restored = await nativeState(p); report.states.push(record)
      } finally { await p.context().close() }
    })

    await scenario('keyboard and hover captures', async () => {
      const ps = await pages({ width: 1440, height: 900 })
      try {
        for (const p of Object.values(ps)) { await p.getByTestId('hero-next').focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab') }
        let entry = await pair(ps, 'carousel-keyboard-focus'); entry.rendered = await captures(ps, entry.label, false, '[data-testid="hero-next"]'); report.states.push(entry)
        for (const p of Object.values(ps)) { await p.evaluate(() => document.activeElement?.blur()); await p.getByTestId('hero-next').hover() }
        entry = await pair(ps, 'carousel-pointer-hover'); entry.rendered = await hoverCaptures(ps, entry.label, '[data-testid="hero-next"]'); report.states.push(entry)
        for (const p of Object.values(ps)) { await p.mouse.move(0, 0); await p.locator('.hero-marquee').focus(); await p.keyboard.press('Space') }
        entry = await pair(ps, 'ticker-keyboard-focus-held'); entry.rendered = await captures(ps, entry.label, false, '.hero-marquee'); report.states.push(entry)
        for (const p of Object.values(ps)) { await p.evaluate(() => document.activeElement?.blur()); await p.locator('.hero-actions a').first().hover() }
        entry = await pair(ps, 'primary-action-hover'); entry.rendered = await hoverCaptures(ps, entry.label, '.hero-actions a:first-child'); report.states.push(entry)
      } finally { await close(ps) }
    })

    for (const kind of ['published', 'source']) await scenario(kind + ' touch input', async () => {
      const p = await newPage(kind, { width: 390, height: 844 }, 'reduce', true), record = { label: 'emulated touch', kind, states: [] }
      const cdp = await p.context().newCDPSession(p)
      async function swipe(dx, dy, cancel = false) {
        await p.locator('.hero-image-frame').scrollIntoViewIfNeeded()
        const box = await p.locator('.hero-image-frame').boundingBox(), x = box.x + box.width / 2, y = box.y + box.height / 2
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
        for (let step = 1; step <= 4; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 4, y: y + dy * step / 4 }] })
        await cdp.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] })
        await settlePhoto(p)
      }
      try {
        await p.getByTestId('hero-next').tap(); await waitActive(p, 1); record.states.push({ interaction: 'tap next', active: await active(p) })
        await swipe(-100, 0); await waitActive(p, 2); record.states.push({ interaction: 'swipe left', active: await active(p) })
        await swipe(100, 0); await waitActive(p, 1); record.states.push({ interaction: 'swipe right', active: await active(p) })
        for (const [dx, dy, cancel] of [[-40, 0, false], [-80, 70, false], [0, 100, false], [-100, 0, true]]) {
          const before = await active(p); await swipe(dx, dy, cancel); const after = await active(p)
          check(before === after, kind + ' ignores short, vertical, diagonal or cancelled gesture ' + [dx, dy, cancel]); record.states.push({ interaction: 'ignored gesture', dx, dy, cancel, before, after })
        }
        report.states.push(record)
      } finally { await cdp.detach(); await p.context().close() }
    })

    for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) await scenario('text enlargement ' + viewport.width, async () => {
      const ps = await pages(viewport)
      try {
        for (const p of Object.values(ps)) await p.locator('.hero').evaluate(root => {
          const records = [...root.querySelectorAll('h1,h1 em,.hero-progression,.hero-progression b,.hero-progression i,.hero-description,.hero-actions a,.hero-marquee-group>span,.hero-marquee-group i')].map(el => ({ el, size: parseFloat(getComputedStyle(el).fontSize), line: parseFloat(getComputedStyle(el).lineHeight) }))
          for (const { el, size, line } of records) { el.style.fontSize = size * 2 + 'px'; if (Number.isFinite(line)) el.style.lineHeight = line * 2 + 'px' }
        })
        const entry = await pair(ps, 'text-200-' + viewport.width, { enlarged: true }); entry.rendered = await captures(ps, entry.label); entry.quality = {}
        for (const [kind, p] of Object.entries(ps)) {
          entry.quality[kind] = await p.locator('.hero').evaluate(root => {
            const clipped = []
            for (const el of root.querySelectorAll('h1,.hero-progression>span,.hero-description,.hero-actions a')) {
              const range = document.createRange(); range.selectNodeContents(el); const box = el.getBoundingClientRect()
              for (const r of range.getClientRects()) if (r.width > 0 && (r.left < box.left - 1 || r.right > box.right + 1 || r.left < 0 || r.right > innerWidth + 1)) clipped.push({ text: el.textContent.trim(), left: r.left, right: r.right, boxLeft: box.left, boxRight: box.right })
            }
            return { clipped, overflow: document.documentElement.scrollWidth > innerWidth + 1, tickerExcluded: 'The ticker intentionally clips its continuous track. Its typography is still compared.' }
          })
          if (entry.quality[kind].clipped.length || entry.quality[kind].overflow) qualityFindings.push({ label: entry.label, kind, ...entry.quality[kind] })
        }
        report.states.push(entry)
      } finally { await close(ps) }
    })

    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) await scenario('source anchors ' + viewport.width, async () => {
      const p = await newPage('source', viewport), record = { label: 'source hero navigation and history', viewport, landings: [] }
      try {
        for (const target of ['books', 'samples']) {
          await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
          const link = p.locator('.hero-actions a[href="#' + target + '"]')
          check(await link.count() === 1 && await link.getAttribute('aria-current') !== 'page', 'Hero ' + target + ' local destination and current semantics')
          await link.click(); await p.waitForFunction(target => location.hash === '#' + target, target)
          await p.waitForFunction(target => {
            const el = document.getElementById(target), top = el.getBoundingClientRect().top
            const expected = parseFloat(getComputedStyle(el).scrollMarginTop) + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
            return Math.abs(top - expected) < 1.1
          }, target, { timeout: 5000 })
          record.landings.push(await p.locator('#' + target).evaluate(el => ({ id: el.id, top: el.getBoundingClientRect().top, expected: parseFloat(getComputedStyle(el).scrollMarginTop) + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop), unique: document.querySelectorAll('[id="' + el.id + '"]').length })))
        }
        await p.goBack(); await p.waitForFunction(() => location.hash === '#books'); await p.goForward(); await p.waitForFunction(() => location.hash === '#samples')
        record.history = true
        const topLink = p.locator('header a[href="#top"]').first(); await topLink.click(); await p.waitForFunction(() => location.hash === '#top'); await p.waitForFunction(() => scrollY < 1)
        record.homeReturn = await p.getByRole('heading', { level: 1 }).isVisible(); report.states.push(record)
      } finally { await p.context().close() }
    })
  }
} catch (error) { problems.push(error.stack || String(error)) }
finally {
  report.completedAt = new Date().toISOString()
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const captures = report.captures.filter(c => c.kind === 'published').map(c => `<section><h2>${c.file.replace('published-', '')}</h2><div><img src="${c.file}" alt="Protected published hero"><img src="${c.file.replace('published-', 'source-')}" alt="Reconstructed React hero"></div></section>`).join('\n')
  await fs.writeFile(path.join(out, 'index.html'), `<!doctype html><html lang="en-GB"><meta charset="utf-8"><title>Hero and motion comparisons</title><style>body{font:16px system-ui;margin:24px}section{margin:32px 0}section div{display:flex;gap:16px;align-items:start}img{width:calc(50% - 8px);height:auto}</style><h1>Published and React hero</h1><p>Protected baseline on the left. React source on the right. Read report.json for motion preparation, functional evidence, limitations and unresolved quality findings.</p>${captures}</html>`)
  if (browser) await browser.close()
  console.log(JSON.stringify({ focused, widths: report.widths.length, states: report.states.length, captures: report.captures.length, problems, qualityFindings }, null, 2))
  if (problems.length) process.exitCode = 1
}
