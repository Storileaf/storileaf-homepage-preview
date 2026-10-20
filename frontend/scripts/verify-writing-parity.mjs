import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { settledSnapshot } from './browser-readiness.mjs'
import { comparePixelCoordinates, compareAutoMargins } from './computed-style-parity.mjs'
import { comparePracticeReferences, verifyPracticeDescription } from './practice-description-contract.mjs'

// Development can narrow WRITING_WIDTHS and set WRITING_FOCUSED=1. A completed
// checkpoint requires the default matrix and the full interaction suite.
const out = process.env.WRITING_QA_OUT || 'qa/writing'
const focused = process.env.WRITING_FOCUSED === '1'
const widths = process.env.WRITING_WIDTHS ? process.env.WRITING_WIDTHS.split(',').map(Number) : focused ? [320, 390, 820, 1440] : [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const urls = { published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/', source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/' }
const question = 'What do you remember about the home you grew up in?'
const sample = 'The kitchen was the smallest room in our home. Somehow, it was where everyone ended up.'
const privacy = "This is a practice space. What you write here isn't saved."
const placeholder = 'A familiar room, a sound, a person who was always there…'
const typedAnswer = 'The kitchen smelt of cardamom.\nMy grandmother sang while she cooked.'
const problems = [], qualityFindings = []
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const check = (ok, message) => { if (!ok) problems.push(message) }
const animationNames = { 'sl-writing-arrive': 'arrive', 'sl-writing-device-enter': 'device-enter', 'sl-writing-phone-enter': 'phone-enter', 'sl-practice-overlay-in': 'overlay-in' }
const report = {
  checkpoint: 'Package 4 P4-05 description repair with retained Group 8 Writing and practice gates', baseline,
  sourceCommit: process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(), focused, requestedWidths: widths,
  thresholds: { geometry: .15, pixelChannel: 24, pixelRatio: .01 }, widths: [], states: [], captures: [], nativePaint: [], preparation: [], sourceHashes: {}, problems, qualityFindings,
  captureMethod: 'Native scrolled viewport crops cover the writing section in overlapping tiles if needed. No full-height offscreen raster is used. The unrelated fixed header and every descendant are hidden only during clean section captures, then restored; unchanged context captures keep it. Dialog crops use the actual fixed viewport geometry and its own native scrolling. Hover and focus captures assert their state immediately before and after. Native entrance animations may be paused at a common recorded phase without replacing their definitions. Reduced-motion default desktop compositions and the 901px diagnostic retain one full-section capture before device preparation, then one unconditional native device-band observation, followed by the fixed full-section paint samples at initial, 250ms and 750ms. Preparation images are diagnostic and retain their hashes and native/layer states; viewport, scroll, DPR, document bounds and writing geometry/styles must stay unchanged. Layer changes are observed without waiting for an expected arrangement. The predetermined last full-section sample is compared, and the last two must be byte stable. No sample is chosen by its agreement with the other page. Changed earlier samples, coordinates and font resource identities remain in the report and artifact.',
  computedStyleMethod: 'Raw computed styles and measured boxes remain in snapshots. Explicit scoped animation names map to their published names. Transform-origin coordinates use the unchanged geometry tolerance. Automatic horizontal margins are compared only for identified centred writing blocks with native Typed OM evidence, unchanged boxes and measured parent content gaps.',
  qualityMeasurement: 'The clipped field records text range extents outside their own element box or the viewport. It is an inspection signal rather than proof of visibly cut glyphs. The 320px enlarged heading can extend into dialog padding while remaining inside the dialog border; screenshots and container overflow observations distinguish this from actual clipping.',
  approvedSemanticChange: 'P4-05 only: the protected dialog description resolves to null; the repaired source must resolve to the unchanged privacy text. Raw references remain recorded. The title and textarea references remain exact. Every source dialog opening additionally requires DOM and Chromium accessibility-tree evidence.',
  animationNames,
  limits: 'Chromium only. Touch is emulated. Enlargement doubles targeted font size and line height, not native browser zoom. No physical device, other engine, screen reader or accessibility certification is claimed. Device sample answers are static in the protected runtime; this suite does not invent an automatic typing animation.'
}
await fs.mkdir(out, { recursive: true })
for (const dir of ['src', 'content']) {
  async function walk(folder) {
    for (const entry of (await fs.readdir(folder, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(folder, entry.name)
      if (entry.isDirectory()) await walk(file)
      else report.sourceHashes[file] = hash(await fs.readFile(file))
    }
  }
  await walk(dir)
}
report.harnessHashes = {}
for (const file of ['scripts/verify-writing-parity.mjs', 'scripts/browser-readiness.mjs', 'scripts/computed-style-parity.mjs', 'scripts/practice-description-contract.mjs']) report.harnessHashes[file] = hash(await fs.readFile(file))
report.protectedHashes = {}
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/routes-DrwDv2x2.js', 'assets/content-sections-CfrmOVRI.js']) {
  const bytes = await fs.readFile('../' + file)
  check(bytes.equals(execFileSync('git', ['show', baseline + ':' + file])), 'Protected baseline changed ' + file)
  report.protectedHashes[file] = hash(bytes)
}
const styleKeys = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'rowGap', 'columnGap', 'display', 'position', 'alignItems', 'justifyContent', 'flexDirection', 'flexShrink', 'opacity', 'boxShadow', 'overflow', 'overflowX', 'overflowY', 'zIndex', 'transform', 'transformOrigin', 'outlineWidth', 'outlineStyle', 'outlineColor', 'outlineOffset', 'animationName', 'animationDuration', 'animationDelay', 'animationTimingFunction', 'animationFillMode', 'transitionDuration', 'resize', 'containerType', 'objectFit', 'objectPosition', 'scrollMarginTop', 'tabSize', 'webkitTextSizeAdjust', 'webkitTapHighlightColor', 'fontSynthesis', 'fontFeatureSettings', 'fontVariationSettings', 'fontOpticalSizing', 'fontKerning', 'fontStretch', 'fontVariantLigatures', 'textRendering', 'webkitFontSmoothing']
const textKeys = ['title', 'emphasis', 'lead', 'avatar', 'sidebar-strong', 'sidebar-span', 'sidebar-bottom', 'breadcrumb', 'question', 'helper', 'answer', 'screen-bottom-span', 'mobile-question', 'mobile-helper', 'trigger', 'dialog-title', 'privacy', 'label', 'textarea', 'meta-count', 'clear', 'close-action']
const sectionQueries = [
  ['root', '#writing-space'], ['container', '#writing-space>div'], ['heading', '.editorial-device-heading'], ['title', '#devices-title'], ['emphasis', '#devices-title em'], ['lead', '.editorial-device-heading>p'],
  ['stage', '.device-stage'], ['floor', '.device-floor'], ['laptop', '.device-laptop'], ['display', '.laptop-display'], ['camera', '.device-camera'], ['base', '.laptop-base'], ['base-notch', '.laptop-base>span'], ['tablet', '.device-tablet'], ['phone', '.device-phone'], ['island', '.phone-island'], ['home-bar', '.phone-home-bar'],
  ['screen', '.editor-screen'], ['topbar', '.editor-topbar'], ['logo', '.editor-topbar img'], ['avatar', '.editor-avatar'], ['layout', '.editor-layout'], ['sidebar', '.editor-sidebar'], ['sidebar-strong', '.editor-sidebar>strong'], ['sidebar-span', '.editor-sidebar>span'], ['sidebar-bottom', '.screen-sidebar-bottom'], ['main', '.editor-main'], ['breadcrumb', '.screen-breadcrumb>span'], ['question', '.editor-main h3'], ['helper', '.screen-helper'], ['answer', '.screen-answer'], ['cursor', '.screen-cursor'], ['screen-bottom', '.screen-bottom'], ['screen-bottom-span', '.screen-bottom>span'],
  ['mobile', '.mobile-workspace-preview'], ['mobile-question', '.mobile-workspace-preview h3'], ['mobile-helper', '.mobile-workspace-preview p'], ['action', '.device-demo-action'], ['trigger', '[data-testid="try-question"]'], ['trigger-icon', '[data-testid="try-question"] svg']
]
const dialogQueries = [
  ['dialog', '[data-testid="question-dialog"]'], ['topline', '.question-dialog .dialog-topline'], ['close-icon', '.question-dialog [aria-label="Close writing example"]'], ['close-svg', '.question-dialog [aria-label="Close writing example"] svg'], ['dialog-title', '.question-dialog h2'], ['privacy', '#demo-privacy'], ['label', '.question-dialog label'], ['textarea', '#demo-answer'], ['meta', '.demo-answer-meta'], ['meta-count', '.demo-answer-meta>span'], ['clear', '.demo-answer-meta button'], ['close-action', '.question-dialog>.button'], ['close-action-svg', '.question-dialog>.button svg']
]
let browser
const fontEvidence = new WeakMap()
async function actualFonts(p, dialog = false) {
  const evidence = fontEvidence.get(p)
  const requests = await p.evaluate(({ queries, textKeys }) => {
    const unique = new Map()
    for (const [key, selector] of queries) {
      if (!textKeys.includes(key)) continue
      for (const e of document.querySelectorAll(selector)) {
        if (!e.getBoundingClientRect().width) continue
        const s = getComputedStyle(e), text = e.tagName === 'TEXTAREA' ? e.value || e.placeholder : e.textContent
        const font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
        unique.set(font + '\n' + text, { key, font, text, primaryFamily: s.fontFamily.split(',')[0].replaceAll('"', '').trim() })
      }
    }
    return [...unique.values()]
  }, { queries: dialog ? dialogQueries : sectionQueries, textKeys })
  const signature = JSON.stringify(requests)
  if (evidence.prepared.has(signature)) return
  const observed = await p.evaluate(async requests => {
    const emphasis = () => {
      const e = document.querySelector('#devices-title em'), r = e.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(e)
      return { rect: [r.x, r.y + scrollY, r.width, r.height], ranges: [...range.getClientRects()].map(r => [r.x, r.y + scrollY, r.width, r.height]) }
    }
    const before = emphasis()
    const loaded = await Promise.all(requests.map(async request => {
      const beforeCheck = document.fonts.check(request.font, request.text), faces = await document.fonts.load(request.font, request.text)
      return { ...request, beforeCheck, afterCheck: document.fonts.check(request.font, request.text), faces: faces.map(f => ({ family: f.family, style: f.style, weight: f.weight, stretch: f.stretch, status: f.status, unicodeRange: f.unicodeRange })) }
    }))
    await document.fonts.ready
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return { loaded, before, after: emphasis(), fontStatus: document.fonts.status, documentState: document.readyState, sheets: [...document.styleSheets].map(s => ({ href: s.href, disabled: s.disabled, loaded: Boolean(s.ownerNode?.sheet || !s.ownerNode) })), inventory: [...document.fonts].map(f => ({ family: f.family, style: f.style, weight: f.weight, stretch: f.stretch, status: f.status, unicodeRange: f.unicodeRange })) }
  }, requests)
  check(observed.documentState === 'complete' && observed.fontStatus === 'loaded' && observed.sheets.every(s => s.disabled || s.loaded), evidence.record.kind + ' native stylesheet and font readiness')
  check(observed.loaded.every(r => r.afterCheck && r.faces.some(f => f.family.replaceAll('"', '') === r.primaryFamily && f.status === 'loaded')), evidence.record.kind + ' actual computed text faces loaded')
  await Promise.all(evidence.pending)
  evidence.record.fontPasses.push({ dialog, ...observed })
  evidence.prepared.add(signature)
}
async function twoFrames(p) { await p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))) }
async function settleAnimations(p, selector = '#writing-space') {
  await p.bringToFront()
  await p.waitForFunction(selector => [...document.querySelector(selector).getAnimations({ subtree: true })].every(a => a.playState !== 'running'), selector)
  await twoFrames(p)
}
async function scrollSection(p, offset = 0) {
  await p.bringToFront()
  await p.locator('#writing-space').evaluate((e, offset) => scrollTo({ top: Math.floor(e.getBoundingClientRect().top + scrollY) + offset, behavior: 'instant' }), offset)
  await twoFrames(p)
}
async function newPage(kind, viewport, motion = 'reduce', touch = false, initialScroll = true) {
  const context = await browser.newContext({ viewport, reducedMotion: motion, hasTouch: touch, deviceScaleFactor: 1 })
  const p = await context.newPage()
  const evidence = { prepared: new Set(), pending: [], record: { kind, viewport, motion, touch, resources: [], fontPasses: [] } }
  fontEvidence.set(p, evidence); report.preparation.push(evidence.record)
  p.on('response', response => {
    if (!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(response.url())) return
    evidence.pending.push((async () => {
      try { const bytes = await response.body(); evidence.record.resources.push({ url: response.url(), status: response.status(), type: response.request().resourceType(), bytes: bytes.length, sha256: hash(bytes) }) }
      catch (error) { evidence.record.resources.push({ url: response.url(), error: String(error) }) }
    })())
  })
  p.on('pageerror', e => problems.push(kind + ' runtime ' + e.message))
  await p.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await p.locator('#writing-space').waitFor()
  await p.waitForLoadState('load')
  await p.evaluate(async () => {
    await Promise.all([document.fonts.load('450 59px Newsreader'), document.fonts.load('italic 420 59px Newsreader'), document.fonts.load('400 20px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('650 14px Manrope')])
    await document.fonts.ready
  })
  check(await p.evaluate(() => ['Newsreader', 'Manrope'].every(name => [...document.fonts].some(f => f.family.includes(name) && f.status === 'loaded'))), kind + ' real fonts required')
  if (initialScroll) {
    await scrollSection(p)
    await p.locator('#writing-space .editor-topbar img').evaluateAll(async images => { await Promise.all(images.filter(i => i.getBoundingClientRect().width > 0).map(i => i.decode())) })
    await settleAnimations(p)
  }
  return p
}
async function pages(viewport, motion = 'reduce', touch = false, initialScroll = true) { return { published: await newPage('published', viewport, motion, touch, initialScroll), source: await newPage('source', viewport, motion, touch, initialScroll) } }
async function close(ps) { for (const p of Object.values(ps)) await p.context().close() }

async function snapshot(p, dialog = false) {
  await actualFonts(p, dialog)
  return settledSnapshot(p, () => p.evaluate(({ queries, styleKeys, textKeys, dialog }) => {
    const root = document.querySelector(dialog ? '[data-testid="question-dialog"]' : '#writing-space'), origin = root.getBoundingClientRect()
    const refs = el => ['aria-labelledby', 'aria-describedby'].map(name => ({ attribute: name, texts: (el.getAttribute(name) || '').split(/\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent.trim() || null) }))
    const nodes = Object.fromEntries(queries.map(([key, selector]) => [key, [...document.querySelectorAll(selector)].map(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el), style = Object.fromEntries(styleKeys.map(k => [k, k === 'fontFamily' ? s[k].split(',')[0].replaceAll('"', '').trim() : s[k]]))
      if (!textKeys.includes(key)) for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'color']) delete style[k]
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (s['border' + side + 'Width'] === '0px') delete style['border' + side + 'Color']
      if (s.outlineWidth === '0px' || s.outlineStyle === 'none') for (const k of ['outlineWidth', 'outlineStyle', 'outlineColor', 'outlineOffset']) delete style[k]
      const result = { rect: [r.x - origin.x, r.y - origin.y, r.width, r.height], style, text: textKeys.includes(key) && key !== 'textarea' ? el.textContent.replace(/\s+/g, ' ').trim() : undefined, value: key === 'textarea' ? el.value : undefined, placeholder: key === 'textarea' ? el.placeholder : undefined, maxLength: key === 'textarea' ? el.maxLength : undefined, rows: key === 'textarea' ? el.rows : undefined, disabled: 'disabled' in el ? el.disabled : undefined, label: el.getAttribute('aria-label'), role: el.getAttribute('role'), hidden: el.getAttribute('aria-hidden'), expanded: el.getAttribute('aria-expanded'), state: el.getAttribute('data-state'), src: el.tagName === 'IMG' ? el.getAttribute('src') : undefined, alt: el.getAttribute('alt'), natural: el.tagName === 'IMG' && r.width > 0 ? [el.naturalWidth, el.naturalHeight] : undefined }
      // Native automatic-margin evidence is deliberately limited to the centred
      // wrapper, title, lead and stage. Transformed device internals never qualify.
      if (['container', 'title', 'lead', 'stage'].includes(key) && r.width > 0) {
        const parent = el.parentElement, pr = parent.getBoundingClientRect(), ps = getComputedStyle(parent), available = typeof el.computedStyleMap === 'function', typed = available ? el.computedStyleMap() : null
        const edges = { borderLeft: parseFloat(ps.borderLeftWidth), paddingLeft: parseFloat(ps.paddingLeft), borderRight: parseFloat(ps.borderRightWidth), paddingRight: parseFloat(ps.paddingRight) }
        if (s.transform === 'none' && ps.transform === 'none' && typed?.get('margin-left')?.toString() === 'auto' && typed?.get('margin-right')?.toString() === 'auto') result.autoMargins = { bounded: parent === root || root.contains(parent), available, typed: { marginLeft: 'auto', marginRight: 'auto' }, raw: { marginLeft: s.marginLeft, marginRight: s.marginRight }, rect: [r.x, r.y - origin.y, r.width, r.height], parentRect: [pr.x, pr.y - origin.y, pr.width, pr.height], parentEdges: edges, layout: { display: s.display, position: s.position, transform: s.transform, parentTransform: ps.transform }, measured: { marginLeft: r.left - pr.left - edges.borderLeft - edges.paddingLeft, marginRight: pr.right - edges.borderRight - edges.paddingRight - r.right } }
      }
      if (textKeys.includes(key)) { const selected = getComputedStyle(el, '::selection'); result.selectionColours = { color: selected.color, backgroundColor: selected.backgroundColor } }
      if (['title', 'emphasis'].includes(key)) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), glyphs = []; let node
        while ((node = walker.nextNode())) for (let i = 0; i < node.length; i++) { const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1); glyphs.push({ text: node.data[i], rects: [...range.getClientRects()].map(r => [r.x - origin.x, r.y - origin.y, r.width, r.height]) }) }
        result.glyphs = glyphs
      }
      if (key === 'textarea') { const prompt = getComputedStyle(el, '::placeholder'); result.placeholderStyle = { color: prompt.color, opacity: prompt.opacity } }
      if (key === 'dialog' || key === 'textarea') result.references = refs(el)
      return result
    })]))
    const overlay = dialog ? document.querySelector('.sl-practice-overlay,.dialog-overlay') : null
    return { nodes, origin: [origin.x, origin.y + (dialog ? 0 : scrollY)], overflow: document.documentElement.scrollWidth > innerWidth + 1, stageVisible: document.querySelector('.device-stage').classList.contains('is-visible'), ids: (dialog ? ['writing-space', 'devices-title', 'demo-answer', 'demo-privacy'] : ['writing-space', 'devices-title']).map(id => document.querySelectorAll('[id="' + id + '"]').length), overlay: overlay ? { rect: (() => { const r = overlay.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] })(), color: getComputedStyle(overlay).backgroundColor, backdropFilter: getComputedStyle(overlay).backdropFilter, position: getComputedStyle(overlay).position, zIndex: getComputedStyle(overlay).zIndex } : null }
  }, { queries: dialog ? dialogQueries : sectionQueries, styleKeys, textKeys, dialog }))
}
function compare(b, a, label, { enlarged = false } = {}) {
  const differences = [], computedStyleComparisons = [], approvedSemanticDifferences = []; let maximumGeometry = 0
  for (const [key, values] of Object.entries(b.nodes)) {
    if (values.length !== a.nodes[key]?.length) { differences.push(key + ' count'); continue }
    for (const [i, x] of values.entries()) {
      const y = a.nodes[key][i]
      const auto = x.autoMargins && y.autoMargins ? compareAutoMargins(x.autoMargins, y.autoMargins, { tolerance: .15 }) : null
      if (auto) { computedStyleComparisons.push({ node: key + '[' + i + ']', ...auto }); if (!auto.equal) differences.push(key + ' automatic margins ' + auto.differences.join(', ')) }
      for (let k = 0; k < 4; k++) { const d = Math.abs(x.rect[k] - y.rect[k]); maximumGeometry = Math.max(maximumGeometry, d); if (d > .15) differences.push(`${key}[${i}].rect[${k}] ${x.rect[k]} versus ${y.rect[k]}`) }
      for (const prop of new Set([...Object.keys(x.style), ...Object.keys(y.style)])) {
        if (x.style[prop] === y.style[prop]) continue
        if (prop === 'animationName' && x.style[prop] === y.style[prop].split(', ').map(n => animationNames[n] || n).join(', ')) continue
        if (prop === 'transformOrigin') { const c = comparePixelCoordinates(x.style[prop], y.style[prop], .15); computedStyleComparisons.push({ node: key + '[' + i + ']', property: prop, ...c }); if (c.equal) continue }
        if (auto?.equal && ['marginLeft', 'marginRight'].includes(prop)) continue
        differences.push(`${key}[${i}].style.${prop} ${x.style[prop]} versus ${y.style[prop]}`)
      }
      for (const prop of ['text', 'value', 'placeholder', 'maxLength', 'rows', 'disabled', 'label', 'role', 'hidden', 'expanded', 'state', 'src', 'alt', 'natural', 'selectionColours', 'placeholderStyle']) if (JSON.stringify(x[prop]) !== JSON.stringify(y[prop])) differences.push(`${key}[${i}].${prop}`)
      if ('references' in x || 'references' in y) {
        const referenceComparison = comparePracticeReferences(key, x.references, y.references)
        if (!referenceComparison.equal) differences.push(`${key}[${i}].references`)
        if (referenceComparison.approvedDifference) approvedSemanticDifferences.push({ node: `${key}[${i}]`, ...referenceComparison })
      }
    }
  }
  if (!b.ids.every(n => n === 1) || !a.ids.every(n => n === 1)) differences.push('unique IDs')
  if (JSON.stringify(b.overlay) !== JSON.stringify(a.overlay)) differences.push('overlay')
  if (b.overlay && a.overlay) for (let i = 0; i < 2; i++) { const d = Math.abs(b.origin[i] - a.origin[i]); maximumGeometry = Math.max(maximumGeometry, d); if (d > .15) differences.push('dialog viewport origin ' + i) }
  if (b.stageVisible !== a.stageVisible) differences.push('stage entrance state')
  check(!differences.length, label + ' ' + differences.join('; '))
  if (!enlarged) check(!b.overflow && !a.overflow, label + ' document overflow')
  return { maximumGeometry, differences, computedStyleComparisons, approvedSemanticDifferences }
}
async function pair(ps, label, dialog = false, options = {}) { const b = await snapshot(ps.published, dialog), a = await snapshot(ps.source, dialog); return { label, published: b, source: a, ...compare(b, a, label, options) } }

async function hiddenHeader(p) {
  const style = await p.addStyleTag({ content: '.site-header,.site-header *,.sl-header,.sl-header *{visibility:hidden!important}' })
  await twoFrames(p)
  check(await p.locator('.site-header,.site-header *,.sl-header,.sl-header *').evaluateAll(es => es.length > 0 && es.every(e => getComputedStyle(e).visibility === 'hidden')), 'Complete temporary header suppression')
  return style
}
async function pixelCompare(files, label) {
  const data = await Promise.all(files.map(async file => 'data:image/png;base64,' + (await fs.readFile(path.join(out, file))).toString('base64')))
  const p = await browser.newPage()
  const pixels = await p.evaluate(async sources => {
    const images = await Promise.all(sources.map(async src => { const image = new Image(); image.src = src; await image.decode(); return image }))
    const [a, b] = images
    if (a.width !== b.width || a.height !== b.height) return { ratio: null, before: [a.width, a.height], after: [b.width, b.height] }
    const canvas = document.createElement('canvas'); canvas.width = a.width; canvas.height = a.height
    const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(a, 0, 0); const one = context.getImageData(0, 0, a.width, a.height).data
    context.clearRect(0, 0, a.width, a.height); context.drawImage(b, 0, 0); const two = context.getImageData(0, 0, a.width, a.height).data
    let changed = 0
    for (let i = 0; i < one.length; i += 4) if (Math.max(Math.abs(one[i] - two[i]), Math.abs(one[i + 1] - two[i + 1]), Math.abs(one[i + 2] - two[i + 2])) > 24) changed++
    return { ratio: changed / (a.width * a.height), changed, total: a.width * a.height, size: [a.width, a.height] }
  }, data)
  await p.close(); check(pixels.ratio !== null && pixels.ratio <= .01, label + ' pixels ' + JSON.stringify(pixels)); return pixels
}
async function prepareNativePaint(p, evidence, clip) {
  const preparation = { captures: [], states: [], layerEvents: [], droppedLayerEvents: 0, layerNodes: {} }, started = Date.now()
  evidence.preparation = preparation
  const client = await p.context().newCDPSession(p)
  let layers = [], phase = 'enable'
  const onLayers = event => {
    layers = event.layers || []
    if (preparation.layerEvents.length < 64) preparation.layerEvents.push({ phase, elapsedMilliseconds: Date.now() - started, layers })
    else preparation.droppedLayerEvents++
  }
  const read = async label => {
    const native = await p.evaluate(({ queries, styleKeys }) => {
      const rect = e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] }
      const dimensions = e => ({ rect: rect(e), client: [e.clientWidth, e.clientHeight], scroll: [e.scrollWidth, e.scrollHeight] })
      const root = document.querySelector('#writing-space'), visual = visualViewport
      return {
        viewport: [innerWidth, innerHeight], visualViewport: visual ? [visual.width, visual.height, visual.offsetLeft, visual.offsetTop, visual.pageLeft, visual.pageTop, visual.scale] : null,
        scroll: [scrollX, scrollY], dpr: devicePixelRatio, document: dimensions(document.documentElement), body: dimensions(document.body),
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, runningAnimations: root.getAnimations({ subtree: true }).filter(a => a.playState === 'running').map(a => a.animationName || a.transitionProperty),
        fontStatus: document.fonts.status, documentState: document.readyState,
        nodes: Object.fromEntries(queries.map(([key, selector]) => [key, [...document.querySelectorAll(selector)].map(e => {
          const s = getComputedStyle(e)
          return { rect: rect(e), style: Object.fromEntries(styleKeys.map(k => [k, s[k]])) }
        })]))
      }
    }, { queries: sectionQueries, styleKeys: [...styleKeys, 'filter', 'backdropFilter', 'willChange', 'visibility', 'contain', 'isolation'] })
    const state = { label, elapsedMilliseconds: Date.now() - started, native, layers }
    preparation.states.push(state)
    return state
  }
  client.on('LayerTree.layerTreeDidChange', onLayers)
  try {
    await client.send('LayerTree.enable'); await twoFrames(p)
    const before = await read('before')
    check(before.native.reducedMotion && !before.native.runningAnimations.length, evidence.label + ' ' + evidence.kind + ' native device preparation requires settled reduced motion')
    check(before.layers.length > 0, evidence.label + ' ' + evidence.kind + ' native device preparation layer provenance')
    const stage = before.native.nodes.stage[0].rect, y = Math.max(0, Math.floor(stage[1]))
    const deviceClip = { x: 0, y, width: before.native.viewport[0], height: Math.min(before.native.viewport[1], Math.ceil(stage[1] + stage[3])) - y }
    if (stage[2] <= 0 || deviceClip.height <= 0) throw new Error(evidence.label + ' native device preparation requires a visible device band')
    for (const [name, captureClip] of [['before-device-preparation', clip], ['device-observation', deviceClip]]) {
      phase = name
      const file = evidence.kind + '-' + evidence.label + '-tile-' + evidence.tile + '-' + name + '.png'
      const bytes = await p.screenshot({ path: path.join(out, file), clip: captureClip, caret: 'hide' })
      preparation.captures.push({ file, sha256: hash(bytes), clip: captureClip, caret: 'hide', elapsedMilliseconds: Date.now() - started })
      const after = await read('after-' + name), differences = Object.keys(before.native).filter(k => k !== 'nodes' && JSON.stringify(before.native[k]) !== JSON.stringify(after.native[k]))
      for (const key of Object.keys(before.native.nodes)) if (JSON.stringify(before.native.nodes[key]) !== JSON.stringify(after.native.nodes[key])) differences.push('nodes.' + key)
      after.differences = differences
      check(!differences.length, evidence.label + ' ' + evidence.kind + ' native device preparation changed ' + differences.join(', ') + ' after ' + name)
    }
    phase = 'describe-observed-layers'
    for (const backendNodeId of new Set(preparation.states.flatMap(s => s.layers).filter(l => l.backendNodeId).map(l => l.backendNodeId))) {
      const { node } = await client.send('DOM.describeNode', { backendNodeId, depth: 0 })
      preparation.layerNodes[backendNodeId] = { nodeType: node.nodeType, nodeName: node.nodeName, attributes: node.attributes || [] }
    }
  } catch (error) { preparation.error = String(error); throw error }
  finally {
    client.off('LayerTree.layerTreeDidChange', onLayers)
    try { await client.send('LayerTree.disable') } finally { await client.detach() }
  }
}
async function fixedNativePaint(p, { kind, label, tile, selector, clip, file }) {
  const evidence = { kind, label, tile, fixedTimes: [0, 250, 750], finalSampleIndex: 2, samples: [] }
  report.nativePaint.push(evidence)
  await prepareNativePaint(p, evidence, clip)
  const start = Date.now()
  let finalBytes
  for (const [index, plannedMilliseconds] of evidence.fixedTimes.entries()) {
    const remaining = plannedMilliseconds - (Date.now() - start)
    if (remaining > 0) await p.waitForTimeout(remaining)
    await twoFrames(p)
    const native = await p.evaluate(selector => {
      const rect = e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] }
      return { scroll: [scrollX, scrollY], root: rect(document.querySelector(selector)), device: [...document.querySelectorAll('.device-stage,.device-laptop,.device-tablet,.device-phone')].map(e => ({ class: e.className, rect: rect(e), transform: getComputedStyle(e).transform, filter: getComputedStyle(e).filter, opacity: getComputedStyle(e).opacity })), fontStatus: document.fonts.status, documentState: document.readyState }
    }, selector)
    const sampleFile = kind + '-' + label + '-tile-' + tile + '-native-paint-' + index + '.png'
    finalBytes = await p.screenshot({ path: path.join(out, sampleFile), clip, caret: 'hide' })
    evidence.samples.push({ index, plannedMilliseconds, elapsedMilliseconds: Date.now() - start, file: sampleFile, sha256: hash(finalBytes), native })
  }
  evidence.finalTwoStable = evidence.samples[1].sha256 === evidence.samples[2].sha256
  check(evidence.finalTwoStable, label + ' ' + kind + ' fixed native paint samples 1 and 2 are not stable')
  await fs.writeFile(path.join(out, file), finalBytes)
}
async function capture(ps, label, { dialog = false, context = false, assertState } = {}) {
  const first = ps.published, viewport = first.viewportSize(), selector = dialog ? '[data-testid="question-dialog"]' : '#writing-space'
  const height = await first.locator(selector).evaluate(e => e.getBoundingClientRect().height)
  const offsets = dialog || context ? [0] : [...new Set(Array.from({ length: Math.max(1, Math.ceil(height / (viewport.height - 64))) }, (_, i) => Math.min(i * (viewport.height - 64), Math.max(0, Math.ceil(height - viewport.height + 2)))))]
  const pairs = []
  for (const [tile, offset] of offsets.entries()) {
    const files = []
    for (const [kind, p] of Object.entries(ps)) {
      await p.bringToFront()
      if (!dialog && !context) await scrollSection(p, offset)
      const header = !dialog && !context ? await hiddenHeader(p) : null
      if (assertState) check(await assertState(p), label + ' ' + kind + ' state immediately before capture')
      const box = await p.locator(selector).boundingBox()
      const clip = context ? undefined : { x: Math.max(0, Math.floor(box.x)), y: Math.max(0, Math.floor(box.y)), width: Math.min(viewport.width, Math.ceil(box.x + box.width)) - Math.max(0, Math.floor(box.x)), height: Math.min(viewport.height, Math.ceil(box.y + box.height)) - Math.max(0, Math.floor(box.y)) }
      check(!clip || clip.width > 0 && clip.height > 0, label + ' visible crop')
      const file = kind + '-' + label + '-tile-' + tile + '.png'
      if (!dialog && !context && ((/^section-\d+$/.test(label) && viewport.width > 720) || label === 'boundary-901')) await fixedNativePaint(p, { kind, label, tile, selector, clip, file })
      else await p.screenshot({ path: path.join(out, file), clip, caret: 'hide' })
      if (assertState) check(await assertState(p), label + ' ' + kind + ' state immediately after capture')
      report.captures.push({ kind, file, viewport, clip, offset, context, dialog, sha256: hash(await fs.readFile(path.join(out, file))) }); files.push(file)
      if (header) await header.evaluate(e => e.remove())
    }
    pairs.push({ offset, files, pixels: await pixelCompare(files, label + ' tile ' + tile) })
  }
  return pairs
}
async function openDialog(p, method = 'click') {
  await p.bringToFront()
  if (method === 'tap') await p.getByTestId('try-question').tap()
  else if (method === 'keyboard') { await p.getByTestId('try-question').focus(); await p.keyboard.press('Enter') }
  else await p.getByTestId('try-question').click()
  await p.getByTestId('question-dialog').waitFor({ state: 'visible' })
  await settleAnimations(p, '[data-testid="question-dialog"]')
  await p.waitForFunction(() => [...document.querySelectorAll('.dialog-overlay,.sl-practice-overlay')].every(e => e.getAnimations().every(a => a.playState !== 'running')))
  const state = await p.getByTestId('question-dialog').evaluate(e => ({ name: e.querySelector('h2').textContent, privacy: e.querySelector('#demo-privacy').textContent, firstFocus: document.activeElement?.getAttribute('aria-label'), bodyOverflow: getComputedStyle(document.body).overflow, value: e.querySelector('textarea').value, maxLength: e.querySelector('textarea').maxLength, rows: e.querySelector('textarea').rows, placeholder: e.querySelector('textarea').placeholder, count: e.querySelector('.demo-answer-meta>span').textContent, clearDisabled: e.querySelector('.demo-answer-meta button').disabled, scroll: [e.scrollTop, e.scrollHeight, e.clientHeight] }))
  check(state.name === question && state.privacy === privacy && state.value === '' && state.maxLength === 2000 && state.rows === 6 && state.placeholder === placeholder && state.count === '0 words' && state.clearDisabled, 'Exact initial practice contract')
  check(state.firstFocus === 'Close writing example' && state.bodyOverflow === 'hidden', 'Native dialog first focus and scroll lock')
  if (fontEvidence.get(p).record.kind === 'source') state.accessibility = await verifyPracticeDescription(p)
  return state
}
async function closeDialog(p, method = 'escape') {
  if (method === 'escape') await p.keyboard.press('Escape')
  else if (method === 'icon') await p.getByRole('button', { name: 'Close writing example', exact: true }).click()
  else if (method === 'action') await p.getByRole('button', { name: 'Close', exact: true }).click()
  else if (method === 'outside') await p.mouse.click(2, 2)
  await p.getByTestId('question-dialog').waitFor({ state: 'hidden' })
  await p.waitForFunction(() => document.activeElement?.getAttribute('data-testid') === 'try-question' && getComputedStyle(document.body).overflow !== 'hidden')
  return p.getByTestId('try-question').evaluate(e => ({ focus: document.activeElement === e, expanded: e.getAttribute('aria-expanded'), scrollY, top: e.getBoundingClientRect().top, bodyOverflow: getComputedStyle(document.body).overflow }))
}
async function closeTouchDialog(p) {
  const result = { method: 'single-native-tap', afterHidden: null, trace: null, errors: [] }
  try {
    await p.evaluate(() => {
      const dialog = document.querySelector('[data-testid="question-dialog"]'), trigger = document.querySelector('[data-testid="try-question"]')
      const started = performance.now(), events = []
      let stopped = false, previousOverflow = getComputedStyle(document.body).overflow, firstFrame, secondFrame
      const describe = e => e instanceof Element ? { tag: e.tagName, id: e.id || null, testId: e.getAttribute('data-testid'), label: e.getAttribute('aria-label'), text: e.tagName === 'BUTTON' ? e.textContent.trim() : null } : e ? { node: e.nodeName || 'window' } : null
      const trace = { unmountObserved: false, afterAutofocusFrames: false }
      const record = (phase, event) => {
        const state = { phase, elapsedMilliseconds: performance.now() - started, focus: describe(document.activeElement), triggerFocused: document.activeElement === trigger, expanded: trigger.getAttribute('aria-expanded'), dialogConnected: dialog.isConnected, bodyOverflow: getComputedStyle(document.body).overflow, scroll: [scrollX, scrollY], eventTarget: describe(event?.target) }
        if (!stopped) events.push(state)
        return state
      }
      const onFocus = event => record(event.type, event)
      const onScroll = event => record('scroll', event)
      // Radix dispatches this non-bubbling event on the detached dialog inside
      // its deferred unmount callback. Observe it directly without cancelling it.
      const onUnmount = event => {
        trace.unmountObserved = true; record('unmount-autofocus', event)
        queueMicrotask(() => record('unmount-autofocus-microtask'))
        firstFrame = requestAnimationFrame(() => {
          record('unmount-autofocus-frame-1')
          secondFrame = requestAnimationFrame(() => { record('unmount-autofocus-frame-2'); trace.afterAutofocusFrames = true })
        })
      }
      const observer = new MutationObserver(() => {
        const overflow = getComputedStyle(document.body).overflow
        if (overflow !== previousOverflow) { record('body-overflow-change'); previousOverflow = overflow }
      })
      dialog.addEventListener('focusScope.autoFocusOnUnmount', onUnmount, { once: true })
      document.addEventListener('focusin', onFocus, { passive: true })
      document.addEventListener('focusout', onFocus, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class', 'data-scroll-locked'], childList: true })
      observer.observe(document.head, { childList: true })
      trace.record = record
      trace.stop = () => {
        const final = record('final'); stopped = true
        dialog.removeEventListener('focusScope.autoFocusOnUnmount', onUnmount)
        document.removeEventListener('focusin', onFocus); document.removeEventListener('focusout', onFocus)
        window.removeEventListener('scroll', onScroll); observer.disconnect()
        cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame)
        delete window.__slTouchCloseTrace
        return { unmountObserved: trace.unmountObserved, afterAutofocusFrames: trace.afterAutofocusFrames, events, final }
      }
      window.__slTouchCloseTrace = trace; record('before-tap')
    })
    await p.getByRole('button', { name: 'Close', exact: true }).tap()
    await p.getByTestId('question-dialog').waitFor({ state: 'hidden' })
    result.afterHidden = await p.evaluate(() => window.__slTouchCloseTrace.record('after-hidden'))
    await p.waitForFunction(() => window.__slTouchCloseTrace.unmountObserved && window.__slTouchCloseTrace.afterAutofocusFrames)
    // Use the same settled close contract as the other dismissal paths above.
    await p.waitForFunction(() => document.activeElement?.getAttribute('data-testid') === 'try-question' && getComputedStyle(document.body).overflow !== 'hidden')
  } catch (error) { result.errors.push(String(error)) }
  finally {
    try { result.trace = await p.evaluate(() => window.__slTouchCloseTrace?.stop() || null) }
    catch (error) { result.errors.push('Trace collection: ' + String(error)) }
  }
  return result
}
async function typing(p, text) {
  await p.getByTestId('demo-answer').fill(text)
  const expected = text.trim() ? text.trim().split(/\s+/).length : 0
  await p.waitForFunction(expected => document.querySelector('.demo-answer-meta>span').textContent === expected + (expected === 1 ? ' word' : ' words'), expected)
  const state = await p.getByTestId('question-dialog').evaluate(e => ({ value: e.querySelector('textarea').value, count: e.querySelector('.demo-answer-meta>span').textContent, clearDisabled: e.querySelector('.demo-answer-meta button').disabled, focus: document.activeElement?.id }))
  check(state.value === text && state.clearDisabled === !text && state.focus === 'demo-answer', 'Typing preserves text, count and native focus')
  return state
}
async function quality(p, selector) {
  return p.locator(selector).evaluate(root => {
    const clipped = [], rootBox = root.getBoundingClientRect()
    for (const el of root.querySelectorAll('h2,h3,p,label,button,.demo-answer-meta>span')) {
      if (!el.getBoundingClientRect().width || el.closest('[aria-hidden="true"]')) continue
      const range = document.createRange(); range.selectNodeContents(el); const box = el.getBoundingClientRect()
      for (const r of range.getClientRects()) if (r.width > 0 && (r.left < box.left - 1 || r.right > box.right + 1 || r.left < 0 || r.right > innerWidth + 1)) clipped.push({ text: el.textContent.trim(), left: r.left, right: r.right, boxLeft: box.left, boxRight: box.right })
    }
    return { clipped, rootBounds: { left: rootBox.left, right: rootBox.right, top: rootBox.top, bottom: rootBox.bottom }, documentOverflow: document.documentElement.scrollWidth > innerWidth + 1, ownHorizontalOverflow: root.scrollWidth > root.clientWidth + 1, scrollHeight: root.scrollHeight, clientHeight: root.clientHeight, ariaReferences: ['aria-labelledby', 'aria-describedby'].map(attribute => ({ attribute, ids: (root.getAttribute(attribute) || '').split(/\s+/).filter(Boolean).map(id => ({ id, exists: Boolean(document.getElementById(id)) })) })) }
  })
}

try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] })
  report.browser = browser.version(); report.node = process.version; report.platform = process.platform; report.playwright = JSON.parse(await fs.readFile('../node_modules/playwright-core/package.json', 'utf8')).version
  for (const width of widths) {
    const ps = await pages({ width, height: 1200 }), record = { width }
    record.section = await pair(ps, 'section-' + width)
    for (const [kind, p] of Object.entries(ps)) {
      const exact = await p.locator('#writing-space').evaluate(e => ({ title: e.querySelector('h2').textContent, samples: [...e.querySelectorAll('.screen-answer')].map(n => n.textContent), stageHidden: e.querySelector('.device-stage').getAttribute('aria-hidden'), stageDisplay: getComputedStyle(e.querySelector('.device-stage')).display, mobileDisplay: getComputedStyle(e.querySelector('.mobile-workspace-preview')).display, focusableMockCount: e.querySelectorAll('.device-stage button,.device-stage input,.device-stage textarea,.device-stage a[href]').length }))
      check(exact.title === 'Write a little. Come back when you are ready.' && exact.samples.length === 3 && exact.samples.every(t => t === sample) && exact.stageHidden === 'true' && exact.focusableMockCount === 0, kind + ' exact illustrative device contract ' + width)
      check(width <= 720 ? exact.stageDisplay === 'none' && exact.mobileDisplay === 'block' : exact.stageDisplay !== 'none' && exact.mobileDisplay === 'none', kind + ' retained mobile replacement ' + width)
      record[kind + 'Contract'] = exact
    }
    record.section.rendered = await capture(ps, 'section-' + width)
    record.open = {}; for (const [kind, p] of Object.entries(ps)) record.open[kind] = await openDialog(p)
    record.dialog = await pair(ps, 'dialog-empty-' + width, true); record.dialog.rendered = await capture(ps, 'dialog-empty-' + width, { dialog: true, assertState: p => p.getByRole('button', { name: 'Close writing example', exact: true }).evaluate(e => document.activeElement === e) })
    if ([390, 820, 1440].includes(width)) record.dialog.context = await capture(ps, 'dialog-context-' + width, { dialog: true, context: true })
    record.typed = {}; for (const [kind, p] of Object.entries(ps)) record.typed[kind] = await typing(p, typedAnswer)
    record.filled = await pair(ps, 'dialog-typed-' + width, true); record.filled.rendered = await capture(ps, 'dialog-typed-' + width, { dialog: true, assertState: p => p.getByTestId('demo-answer').evaluate(e => document.activeElement === e && e.value.length > 0) })
    for (const [kind, p] of Object.entries(ps)) {
      const q = await quality(p, '[data-testid="question-dialog"]'); record[kind + 'DialogQuality'] = q
      if (q.clipped.length || q.documentOverflow || q.ownHorizontalOverflow || q.ariaReferences.some(r => r.ids.some(i => !i.exists))) qualityFindings.push({ label: 'dialog-typed-' + width, kind, ...q })
      await closeDialog(p)
    }
    report.widths.push(record); await close(ps)
  }

  // These functional tests stay in focused mode because they catch behavioural
  // mistakes while the representative rendering matrix is being developed.
  for (const width of [390, 1440]) {
    const ps = await pages({ width, height: 900 }), state = { label: 'practice-interactions-' + width }
    for (const p of Object.values(ps)) await openDialog(p, 'keyboard')
    state.keyboardEntry = await pair(ps, 'dialog-keyboard-entry-' + width, true)
    state.keyboardEntry.rendered = await capture(ps, 'dialog-keyboard-entry-' + width, { dialog: true, assertState: p => p.getByRole('button', { name: 'Close writing example', exact: true }).evaluate(e => document.activeElement === e && e.matches(':focus-visible')) })
    for (const p of Object.values(ps)) { await typing(p, '\tA familiar room.\n\tA memory of home.'); await p.getByTestId('demo-answer').press('Control+A') }
    state.selectedText = await pair(ps, 'dialog-tabbed-selection-' + width, true)
    state.selectedText.rendered = await capture(ps, 'dialog-tabbed-selection-' + width, { dialog: true, assertState: p => p.getByTestId('demo-answer').evaluate(e => document.activeElement === e && e.selectionStart === 0 && e.selectionEnd === e.value.length) })
    for (const [kind, p] of Object.entries(ps)) {
      const observations = []
      for (const text of ['A', '  one\n\t two   three  ', '   \n\t']) observations.push(await typing(p, text))
      await p.getByRole('button', { name: 'Clear text', exact: true }).click()
      check(await p.getByTestId('demo-answer').inputValue() === '' && await p.getByRole('button', { name: 'Clear text', exact: true }).isDisabled(), kind + ' clear text resets immediately')
      await typing(p, 'Four words before closing')
      const focusCycle = []
      await p.getByRole('button', { name: 'Close writing example', exact: true }).focus()
      for (let i = 0; i < 6; i++) { focusCycle.push(await p.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id || null, label: document.activeElement.getAttribute('aria-label'), text: document.activeElement.textContent?.trim() }))); await p.keyboard.press('Tab') }
      check(focusCycle[0].label === 'Close writing example' && focusCycle[1].id === 'demo-answer' && focusCycle[2].text === 'Clear text' && focusCycle[3].text === 'Close' && focusCycle[4].label === 'Close writing example' && focusCycle[5].id === 'demo-answer', kind + ' native forward focus trap')
      await p.getByRole('button', { name: 'Close writing example', exact: true }).focus(); await p.keyboard.press('Shift+Tab')
      check(await p.getByRole('button', { name: 'Close', exact: true }).evaluate(e => document.activeElement === e), kind + ' native reverse focus trap')
      const scrollBefore = await p.evaluate(() => scrollY)
      await p.mouse.move(2, 2); await p.mouse.wheel(0, 550); await twoFrames(p)
      check(Math.abs(await p.evaluate(() => scrollY) - scrollBefore) < 1, kind + ' background stays locked during wheel')
      const closeStates = []
      for (const method of ['escape', 'icon', 'action', 'outside']) {
        closeStates.push({ method, ...(await closeDialog(p, method)) }); await openDialog(p)
        check(await p.getByTestId('demo-answer').inputValue() === '', kind + ' answer resets after ' + method)
        await typing(p, 'Reset check')
      }
      await p.getByTestId('demo-answer').fill('x'.repeat(2000)); await p.getByTestId('demo-answer').press('End'); await p.keyboard.type('y')
      check((await p.getByTestId('demo-answer').inputValue()).length === 2000, kind + ' native maximum length blocks extra typing')
      await closeDialog(p); await p.reload({ waitUntil: 'domcontentloaded' }); await p.locator('#writing-space').waitFor(); await openDialog(p)
      check(await p.getByTestId('demo-answer').inputValue() === '', kind + ' no answer restored after reload')
      const storage = await p.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) }))
      check(!JSON.stringify(storage).includes('Reset check') && !JSON.stringify(storage).includes('Four words before closing'), kind + ' no practice text in browser storage')
      state[kind] = { observations, focusCycle, closeStates, scrollBefore, storageKeys: { local: Object.keys(storage.local), session: Object.keys(storage.session) } }; await closeDialog(p)
    }
    report.states.push(state); await close(ps)
  }

  if (!focused) {
    for (const viewport of [{ width: 720, height: 1000 }, { width: 721, height: 1000 }, { width: 900, height: 1000 }, { width: 901, height: 1000 }, { width: 600, height: 1000 }, { width: 601, height: 1000 }]) {
      const ps = await pages(viewport), entry = await pair(ps, 'boundary-' + viewport.width); entry.viewport = viewport
      if (viewport.width === 901) entry.rendered = await capture(ps, entry.label)
      report.states.push(entry); await close(ps)
    }
    for (const viewport of [{ width: 320, height: 568 }, { width: 820, height: 500 }, { width: 1440, height: 500 }]) {
      const ps = await pages(viewport), entry = { label: 'short-' + viewport.width + 'x' + viewport.height, viewport, open: {} }
      for (const [kind, p] of Object.entries(ps)) entry.open[kind] = await openDialog(p)
      entry.top = await pair(ps, entry.label + '-dialog-top', true); entry.top.rendered = await capture(ps, entry.label + '-dialog-top', { dialog: true })
      for (const p of Object.values(ps)) { await typing(p, Array(18).fill('A familiar room and a memory.').join('\n')); await p.getByTestId('question-dialog').evaluate(e => { e.scrollTop = e.scrollHeight }); await twoFrames(p) }
      entry.bottom = await pair(ps, entry.label + '-dialog-bottom', true); entry.bottom.rendered = await capture(ps, entry.label + '-dialog-bottom', { dialog: true })
      for (const [kind, p] of Object.entries(ps)) { const q = await quality(p, '[data-testid="question-dialog"]'); entry[kind + 'Quality'] = q; check(!q.documentOverflow && !q.ownHorizontalOverflow, kind + ' short dialog horizontal fit'); await closeDialog(p, 'action') }
      report.states.push(entry); await close(ps)
    }
    for (const width of [320, 1440]) {
      const ps = await pages({ width, height: 900 }), entry = { label: 'text-200-' + width }
      for (const p of Object.values(ps)) await p.locator('#writing-space').evaluate(root => {
        const items = [...root.querySelectorAll('h2,h2 em,.editorial-device-heading>p,.mobile-workspace-preview h3,.mobile-workspace-preview p,[data-testid="try-question"]')].map(el => ({ el, size: parseFloat(getComputedStyle(el).fontSize), line: parseFloat(getComputedStyle(el).lineHeight) }))
        for (const { el, size, line } of items) { el.style.fontSize = size * 2 + 'px'; if (Number.isFinite(line)) el.style.lineHeight = line * 2 + 'px' }
      })
      entry.section = await pair(ps, entry.label + '-section', false, { enlarged: true }); entry.section.rendered = await capture(ps, entry.label + '-section')
      for (const [kind, p] of Object.entries(ps)) { const q = await quality(p, '#writing-space'); if (q.clipped.length || q.documentOverflow) qualityFindings.push({ label: entry.label + '-section', kind, ...q }); await openDialog(p) }
      for (const p of Object.values(ps)) await p.getByTestId('question-dialog').evaluate(root => {
        const items = [...root.querySelectorAll('h2,p,label,textarea,.demo-answer-meta>span,button')].map(el => ({ el, size: parseFloat(getComputedStyle(el).fontSize), line: parseFloat(getComputedStyle(el).lineHeight) }))
        for (const { el, size, line } of items) { el.style.fontSize = size * 2 + 'px'; if (Number.isFinite(line)) el.style.lineHeight = line * 2 + 'px' }
      })
      entry.dialog = await pair(ps, entry.label + '-dialog', true, { enlarged: true }); entry.dialog.rendered = await capture(ps, entry.label + '-dialog', { dialog: true })
      entry.quality = {}
      for (const [kind, p] of Object.entries(ps)) { const q = await quality(p, '[data-testid="question-dialog"]'); entry.quality[kind] = q; if (q.clipped.length || q.documentOverflow || q.ownHorizontalOverflow) qualityFindings.push({ label: entry.label + '-dialog', kind, ...q }); await p.getByTestId('question-dialog').evaluate(e => { e.scrollTop = e.scrollHeight }); await twoFrames(p) }
      entry.bottom = await capture(ps, entry.label + '-dialog-bottom', { dialog: true }); report.states.push(entry); await close(ps)
    }
    {
      const ps = await pages({ width: 390, height: 844 }, 'reduce', true), entry = { label: 'emulated-touch-practice' }
      for (const [kind, p] of Object.entries(ps)) {
        await openDialog(p, 'tap'); entry[kind] = await typing(p, 'A room full of stories')
        await p.getByRole('button', { name: 'Clear text', exact: true }).tap()
        check(await p.getByTestId('demo-answer').inputValue() === '', kind + ' touch clear')
        const closed = await closeTouchDialog(p); entry[kind].close = closed
        check(!closed.errors.length && closed.trace?.unmountObserved && closed.trace?.afterAutofocusFrames, kind + ' touch unmount autofocus lifecycle completes')
        check(closed.trace?.final.triggerFocused === true, kind + ' touch close returns focus')
        check(closed.trace?.final.dialogConnected === false && closed.trace?.final.bodyOverflow !== 'hidden', kind + ' touch close dismisses and releases scroll lock')
      }
      report.states.push(entry); await close(ps)
    }
    for (const width of [390, 1440]) {
      const ps = await pages({ width, height: 1200 }), entry = { label: 'native-trigger-hover-' + width }
      for (const p of Object.values(ps)) { await p.getByTestId('try-question').hover(); await twoFrames(p) }
      entry.comparison = await pair(ps, entry.label)
      entry.rendered = await capture(ps, entry.label, { context: true, assertState: p => p.getByTestId('try-question').evaluate(e => e.matches(':hover')) })
      for (const p of Object.values(ps)) { await p.mouse.move(0, 0); await p.getByTestId('try-question').focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab'); await twoFrames(p) }
      const focusEntry = await pair(ps, 'native-trigger-focus-' + width)
      focusEntry.rendered = await capture(ps, focusEntry.label, { context: true, assertState: p => p.getByTestId('try-question').evaluate(e => document.activeElement === e && e.matches(':focus-visible')) })
      report.states.push(entry, focusEntry); await close(ps)
    }
    {
      const ps = await pages({ width: 1440, height: 1200 }, 'no-preference', false, false), entry = { label: 'native-device-entrance', before: {}, animations: {}, phases: [] }
      for (const [kind, p] of Object.entries(ps)) {
        entry.before[kind] = await p.locator('.device-stage').evaluate(e => ({ visible: e.classList.contains('is-visible'), boxes: [...e.querySelectorAll('.device-laptop,.device-tablet,.device-phone')].map(n => ({ opacity: getComputedStyle(n).opacity, transform: getComputedStyle(n).transform })) }))
        check(!entry.before[kind].visible, kind + ' stage waits for intersection')
        await scrollSection(p); await p.waitForFunction(() => document.querySelector('.device-stage').classList.contains('is-visible'))
        entry.animations[kind] = await p.locator('.device-stage').evaluate(e => e.getAnimations({ subtree: true }).map(a => { a.pause(); const timing = a.effect.getTiming(); return { name: a.animationName || a.transitionProperty, target: a.effect.target.className, timing: { duration: timing.duration, delay: timing.delay, easing: timing.easing, fill: timing.fill }, frames: a.effect.getKeyframes() } }))
        check(entry.animations[kind].some(a => (a.name || '').endsWith('arrive')) && entry.animations[kind].filter(a => (a.name || '').includes('device-enter')).length === 2 && entry.animations[kind].some(a => (a.name || '').includes('phone-enter')), kind + ' native entrance animation set')
      }
      const signature = list => list.filter(a => ['arrive', 'device-enter', 'phone-enter'].includes(animationNames[a.name] || a.name)).map(a => ({ ...a, name: animationNames[a.name] || a.name })).sort((a, b) => a.target.localeCompare(b.target))
      check(JSON.stringify(signature(entry.animations.published)) === JSON.stringify(signature(entry.animations.source)), 'Native entrance timings and keyframes match')
      for (const phase of [100, 450, 1100]) {
        for (const p of Object.values(ps)) { await p.locator('.device-stage').evaluate((e, phase) => e.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = phase }), phase); await twoFrames(p) }
        const state = await pair(ps, 'entrance-phase-' + phase); state.phaseMilliseconds = phase; state.rendered = await capture(ps, 'entrance-phase-' + phase, { assertState: p => p.locator('.device-stage').evaluate((e, phase) => { const animations = e.getAnimations({ subtree: true }); return animations.length > 0 && animations.every(a => a.playState === 'paused' && Math.abs(a.currentTime - phase) < .01) }, phase) }); entry.phases.push(state)
      }
      for (const [kind, p] of Object.entries(ps)) { await p.emulateMedia({ reducedMotion: 'reduce' }); await settleAnimations(p); await scrollSection(p, -1800); await scrollSection(p); check(await p.locator('.device-stage').evaluate(e => e.classList.contains('is-visible')), kind + ' once-only entrance remains visible'); await p.emulateMedia({ reducedMotion: 'no-preference' }); await settleAnimations(p) }
      entry.restored = await pair(ps, 'live-motion-restoration'); report.states.push(entry); await close(ps)
    }
  }
} catch (error) { problems.push(error.stack || String(error)) }
finally {
  report.finishedAt = new Date().toISOString()
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  await browser?.close()
}
console.log(JSON.stringify({ widths: report.widths.length, states: report.states.length, captures: report.captures.length, problems: problems.length, qualityFindings: qualityFindings.length, report: path.join(out, 'report.json') }, null, 2))
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1 }
