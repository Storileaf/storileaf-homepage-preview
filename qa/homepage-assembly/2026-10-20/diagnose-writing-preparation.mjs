import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright-core'
import { refreshClosedDisclosureLayout } from '../../../frontend/scripts/browser-readiness.mjs'

// Diagnostic only. Predetermined preparations and samples are retained in full.
// Nothing here changes the runtime or the dedicated Writing checkpoint gates.
const root = process.cwd()
const out = process.env.WRITING_PREPARATION_OUT || path.join(root, 'qa/writing-preparation-diagnostic')
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const frozenRuntime = '8674c0bfd13b4b40311fdf59f95591dcf5383994'
const expectedBrowser = '155.0.8059.84'
const urls = { published: 'http://127.0.0.1:4173/storileaf-homepage-preview/', source: 'http://127.0.0.1:4180/' }
const viewport = { width: 1280, height: 1200 }
const modes = ['default', 'disable-lcd-text']
const stages = ['initial', 'no-op', 'computed-fonts', 'faq-refresh', 'same-scroll', 'header-hidden', 'header-restored', 'width-600', 'width-returned']
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const report = {
  purpose: 'Controlled preparation diagnostic only. Collection success is not a parity pass.',
  baseline, frozenRuntime, expectedBrowser, diagnosticCommit: process.env.GITHUB_SHA || git('rev-parse', 'HEAD'),
  createdAt: new Date().toISOString(), viewport, modes, freshPairsPerMode: 2, stages,
  method: 'One job and exact Chrome executable run default mode then disable-lcd-text sequentially. Each of two predetermined fresh pairs keeps both pages alive before paired preparation and capture. Stages separate the initial five font requests and entrance, a fixed200ms no-op observation matching the existing helper quiet interval, actual computed-font requests, the existing synchronous global closed-FAQ refresh, a same-position native scroll, exact checkpoint header suppression and restoration, then a native width600/1280 round trip. Every stage captures original section and visible device PNGs before any snapshotCommandLog query. One actual document-content-layer command log is retained after every stage. Both implementations receive the same fixed sequence; no sample is selected for agreement.',
  limits: 'Emulated reduced-motion Chromium only. Initial captures already use the checkpoint caret-hide clipped preparation, so this probe cannot isolate caret hiding or clipping themselves from initial load. Sequential preparations are cumulative, so a later difference may depend on earlier steps. Foreground changes, screenshots and CDP observation may affect paint scheduling. Native section and device screenshots are separate captures and can observe separate paints. The disabled-LCD mode is a diagnostic variable, not a proposed checkpoint or runtime change. LayerTree may not expose the causal raster cache decision.',
  screenshotOptions: { caret: 'hide', clip: 'Native visible section box, then native full-width device band; no image editing or canvas capture.', animations: 'Default screenshot behaviour; no animation disabling or fast-forward option.' },
  thresholds: { pixelChannel: 24, pixelRatio: .01, geometry: .15 },
  sourceHashes: {}, protectedHashes: {}, harnessHashes: {}, buildHashes: {}, environments: [], pages: [], comparisons: [], withinPageComparisons: [], errors: []
}
await fs.mkdir(out, { recursive: true })
for (const folder of ['frontend/src', 'frontend/content']) {
  async function walk(dir) {
    for (const entry of (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) await walk(file)
      else {
        const bytes = await fs.readFile(file), expected = execFileSync('git', ['show', frozenRuntime + ':' + file], { cwd: root })
        if (!bytes.equals(expected)) throw new Error('Frozen source changed: ' + file)
        report.sourceHashes[file] = hash(bytes)
      }
    }
  }
  await walk(folder)
}
report.runtimeTree = git('rev-parse', 'HEAD:frontend')
report.frozenRuntimeTree = git('rev-parse', frozenRuntime + ':frontend')
if (report.runtimeTree !== report.frozenRuntimeTree) throw new Error('Frozen frontend including checkpoint harness changed')
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/routes-DrwDv2x2.js', 'assets/content-sections-CfrmOVRI.js']) {
  const bytes = await fs.readFile(file)
  if (!bytes.equals(execFileSync('git', ['show', baseline + ':' + file], { cwd: root }))) throw new Error('Protected baseline changed: ' + file)
  report.protectedHashes[file] = hash(bytes)
}
for (const file of ['qa/homepage-assembly/2026-10-20/diagnose-writing-preparation.mjs', '.github/workflows/diagnose-writing-preparation.yml', 'frontend/scripts/verify-writing-parity.mjs', 'frontend/scripts/browser-readiness.mjs']) report.harnessHashes[file] = hash(await fs.readFile(file))
for (const dir of ['frontend/dist', 'frontend/dist/assets']) for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
  if (entry.isFile() && /\.(css|js|html)$/.test(entry.name)) {
    const file = path.join(dir, entry.name); report.buildHashes[file] = hash(await fs.readFile(file))
  }
}
report.browserEnvironment = JSON.parse(await fs.readFile(path.join(out, 'browser-environment.json'), 'utf8'))
if (report.browserEnvironment.browser.actualVersion !== expectedBrowser) throw new Error('Recorded exact browser differs')

const twoFrames = p => p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
const fontSelector = '#devices-title,#devices-title em,.editorial-device-heading>p,.editor-avatar,.editor-sidebar>strong,.editor-sidebar>span,.screen-sidebar-bottom,.screen-breadcrumb>span,.editor-main h3,.screen-helper,.screen-answer,.screen-bottom>span,.mobile-workspace-preview h3,.mobile-workspace-preview p,[data-testid="try-question"]'
async function actualFonts(p) {
  return p.evaluate(async selector => {
    const requests = new Map()
    for (const e of document.querySelectorAll(selector)) {
      if (!e.getBoundingClientRect().width) continue
      const s = getComputedStyle(e), text = e.textContent, font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
      requests.set(font + '\n' + text, { font, text, primaryFamily: s.fontFamily.split(',')[0].replaceAll('"', '').trim() })
    }
    const loaded = await Promise.all([...requests.values()].map(async request => {
      const beforeCheck = document.fonts.check(request.font, request.text), faces = await document.fonts.load(request.font, request.text)
      return { ...request, beforeCheck, afterCheck: document.fonts.check(request.font, request.text), faces: faces.map(f => ({ family: f.family, style: f.style, weight: f.weight, stretch: f.stretch, status: f.status, unicodeRange: f.unicodeRange })) }
    }))
    await document.fonts.ready
    return { loaded, status: document.fonts.status, inventory: [...document.fonts].map(f => ({ family: f.family, style: f.style, weight: f.weight, stretch: f.stretch, status: f.status, unicodeRange: f.unicodeRange })), sheets: [...document.styleSheets].map(s => ({ href: s.href, disabled: s.disabled, loaded: Boolean(s.ownerNode?.sheet || !s.ownerNode) })) }
  }, fontSelector)
}
async function nativeState(p) {
  return p.evaluate(() => {
    const name = e => e.localName + (e.id ? '#' + e.id : '') + (e.classList?.length ? '.' + [...e.classList].join('.') : '')
    const selectors = ['.site-header,.sl-header', '#writing-space', '#writing-space>div', '#devices-title', '#devices-title em', '.device-stage', '.device-floor', '.device-laptop', '.laptop-display', '.device-tablet', '.device-phone', '.editor-screen', '.editor-topbar', '.editor-topbar img', '.editor-main', '.editor-main h3', '.screen-answer']
    const properties = ['display', 'visibility', 'position', 'width', 'height', 'overflow', 'overflowX', 'overflowY', 'opacity', 'transform', 'transformOrigin', 'translate', 'rotate', 'scale', 'filter', 'backdropFilter', 'willChange', 'contain', 'contentVisibility', 'isolation', 'perspective', 'perspectiveOrigin', 'transformStyle', 'backfaceVisibility', 'imageRendering', 'zoom', 'zIndex', 'mixBlendMode', 'boxSizing', 'borderRadius', 'boxShadow', 'animationName', 'animationDuration', 'animationDelay', 'animationFillMode', 'animationTimingFunction', 'transitionProperty', 'transitionDuration', 'transitionDelay', 'transitionTimingFunction', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontSynthesis', 'fontFeatureSettings', 'fontVariationSettings', 'fontOpticalSizing', 'fontKerning', 'fontStretch', 'fontVariantLigatures', 'lineHeight', 'letterSpacing', 'textRendering', 'webkitFontSmoothing']
    const nodes = [], seen = new Map()
    function read(e, requestedBy) {
      if (seen.has(e)) { nodes[seen.get(e)].requestedBy.push(requestedBy); return seen.get(e) }
      const r = e.getBoundingClientRect(), s = getComputedStyle(e), index = nodes.length
      seen.set(e, index)
      nodes.push({ index, name: name(e), requestedBy: [requestedBy], rect: [r.x, r.y, r.width, r.height], documentRect: [r.x + scrollX, r.y + scrollY, r.width, r.height], style: Object.fromEntries(properties.map(k => [k, s[k]])), client: [e.clientWidth, e.clientHeight], offset: [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight], ancestors: [] })
      for (let a = e.parentElement; a; a = a.parentElement) nodes[index].ancestors.push(read(a, 'ancestor-of:' + name(e)))
      return index
    }
    for (const selector of selectors) for (const e of document.querySelectorAll(selector)) read(e, selector)
    const stage = document.querySelector('.device-stage').getBoundingClientRect()
    return {
      time: performance.now(), viewport: [innerWidth, innerHeight], devicePixelRatio, scroll: [scrollX, scrollY], documentSize: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], readyState: document.readyState, fontStatus: document.fonts.status, fontFaces: [...document.fonts].map(f => ({ family: f.family, style: f.style, weight: f.weight, status: f.status })), closedDetails: document.querySelectorAll('details:not([open])').length, openDetails: document.querySelectorAll('details[open]').length,
      deviceRegion: stage.bottom > 0 && stage.top < innerHeight ? { x: 0, y: Math.max(0, Math.floor(stage.top)), width: innerWidth, height: Math.min(innerHeight, Math.ceil(stage.bottom)) - Math.max(0, Math.floor(stage.top)) } : null,
      activeElement: document.activeElement ? name(document.activeElement) : null,
      nodes, animations: document.querySelector('#writing-space').getAnimations({ subtree: true }).map(a => ({ target: a.effect?.target ? name(a.effect.target) : null, playState: a.playState, currentTime: a.currentTime, timing: a.effect?.getTiming(), computedTiming: a.effect?.getComputedTiming(), keyframes: a.effect?.getKeyframes() }))
    }
  })
}

async function observeLayers(p, record) {
  const client = await p.context().newCDPSession(p)
  const observer = { client, layers: [], sequence: 0, events: [], nodeCache: new Map(), started: Date.now() }
  const append = (type, data) => {
    const event = { sequence: ++observer.sequence, elapsedMilliseconds: Date.now() - observer.started, phase: record.phase, type, ...data }
    observer.events.push(event)
    if (type === 'layerTreeDidChange') observer.layers = data.layers || []
  }
  client.on('LayerTree.layerTreeDidChange', e => append('layerTreeDidChange', e))
  client.on('LayerTree.layerPainted', e => append('layerPainted', e))
  for (const method of ['DOM.enable', 'LayerTree.enable']) {
    try { await client.send(method) }
    catch (error) { record.cdpLimits.push({ method, error: String(error) }) }
  }
  return observer
}
async function layerState(observer, record) {
  const { client } = observer, sequenceAtStart = observer.sequence, layers = structuredClone(observer.layers)
  const mapped = []
  for (const layer of layers) {
    let node = null
    if (layer.backendNodeId) {
      if (!observer.nodeCache.has(layer.backendNodeId)) {
        try {
          const described = await client.send('DOM.describeNode', { backendNodeId: layer.backendNodeId, depth: 0 })
          const { nodeId, backendNodeId, nodeType, nodeName, localName, attributes, pseudoType } = described.node
          const mappedNode = { nodeId, backendNodeId, nodeType, nodeName, localName, attributes, pseudoType, firstObservedPhase: record.phase, mappingMethod: 'Backend-node identity cached; current element classes and computed values are recorded separately in nativeBefore/nativeAfter.' }
          let objectId
          try {
            const resolved = await client.send('DOM.resolveNode', { backendNodeId }); objectId = resolved.object.objectId
            if (objectId) {
              const result = await client.send('Runtime.callFunctionOn', { objectId, returnByValue: true, functionDeclaration: 'function () { const e = this.nodeType === 1 ? this : this.parentElement; const path = []; for (let a = e; a; a = a.parentElement) path.push(a.localName + (a.id ? "#" + a.id : "") + (a.classList && a.classList.length ? "." + Array.from(a.classList).join(".") : "")); return { writing: !!(e && e.closest("#writing-space")), device: !!(e && e.closest(".device-stage")), path }; }' })
              mappedNode.relationship = result.result.value
              if (result.exceptionDetails) mappedNode.relationshipError = result.exceptionDetails
            }
          } catch (error) { mappedNode.relationshipError = String(error) }
          finally { if (objectId) await client.send('Runtime.releaseObject', { objectId }).catch(error => record.cdpLimits.push({ method: 'Runtime.releaseObject', error: String(error) })) }
          observer.nodeCache.set(layer.backendNodeId, mappedNode)
        } catch (error) { observer.nodeCache.set(layer.backendNodeId, { backendNodeId: layer.backendNodeId, error: String(error) }) }
      }
      node = observer.nodeCache.get(layer.backendNodeId)
    }
    let reasons
    try { reasons = await client.send('LayerTree.compositingReasons', { layerId: layer.layerId }) }
    catch (error) { reasons = { error: String(error) } }
    mapped.push({ ...layer, node, reasons })
  }
  return { sequenceAtStart, sequenceAtEnd: observer.sequence, observedAt: new Date().toISOString(), layers: mapped }
}
async function commandLogs(observer, record, label, layers) {
  // Earlier device-only filtering omitted the document layer that paints them.
  const candidates = layers.filter(l => l.drawsContent && l.node?.nodeType === 9)
  const selected = [...candidates].sort((a, b) => b.width * b.height - a.width * a.height || a.layerId.localeCompare(b.layerId)).slice(0, 1)
  const result = { selection: 'Largest drawsContent layer mapped to the actual Document node; deterministic limit1.', candidates: candidates.map(l => ({ layerId: l.layerId, width: l.width, height: l.height })), excluded: candidates.filter(l => !selected.includes(l)).map(l => l.layerId), layers: [] }
  if (!selected.length) result.limit = 'No observed document-content layer was available.'
  for (const layer of selected) {
    const evidence = { layerId: layer.layerId, backendNodeId: layer.backendNodeId, node: layer.node, paintCount: layer.paintCount, width: layer.width, height: layer.height }
    let snapshotId
    try {
      snapshotId = (await observer.client.send('LayerTree.makeSnapshot', { layerId: layer.layerId })).snapshotId
      const log = await observer.client.send('LayerTree.snapshotCommandLog', { snapshotId })
      const file = `${record.id}-${label}-document-commands.json.gz`
      const bytes = Buffer.from(JSON.stringify(log) + '\n'), compressed = gzipSync(bytes)
      await fs.writeFile(path.join(out, file), compressed)
      const commands = log.commandLog || []
      evidence.file = file; evidence.sha256 = hash(compressed); evidence.uncompressedSha256 = hash(bytes); evidence.uncompressedBytes = bytes.length; evidence.commandCount = commands.length
      evidence.methodCounts = commands.reduce((counts, c) => { const method = c.method || c.command || c.name || 'unknown'; counts[method] = (counts[method] || 0) + 1; return counts }, {})
    } catch (error) { evidence.error = String(error) }
    finally {
      if (snapshotId) {
        try { await observer.client.send('LayerTree.releaseSnapshot', { snapshotId }); evidence.released = true }
        catch (error) { evidence.releaseError = String(error) }
      }
    }
    result.layers.push(evidence)
  }
  return result
}
async function capture(item, label) {
  const { p, observer, record } = item
  record.phase = label
  await p.bringToFront(); await twoFrames(p)
  const state = { label, nativeBefore: await nativeState(p), layersBefore: await layerState(observer, record), images: {} }
  const box = await p.locator('#writing-space').boundingBox(), size = p.viewportSize()
  const sectionClip = { x: Math.max(0, Math.floor(box.x)), y: Math.max(0, Math.floor(box.y)), width: Math.min(size.width, Math.ceil(box.x + box.width)) - Math.max(0, Math.floor(box.x)), height: Math.min(size.height, Math.ceil(box.y + box.height)) - Math.max(0, Math.floor(box.y)) }
  for (const [region, clip] of [['section', sectionClip], ['devices', state.nativeBefore.deviceRegion]]) {
    if (!clip || clip.width <= 0 || clip.height <= 0) { state.images[region] = { visible: false }; continue }
    const file = `${record.id}-${label}-${region}.png`
    const bytes = await p.screenshot({ path: path.join(out, file), clip, caret: 'hide' })
    state.images[region] = { visible: true, file, clip, sha256: hash(bytes) }
    if (region === 'section') state.nativeBetweenCaptures = await nativeState(p)
  }
  state.layersAfter = await layerState(observer, record)
  state.nativeAfter = await nativeState(p)
  record.captures.push(state)
  return state
}
let browser
async function preparePage(kind, mode, pair, items) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const p = await context.newPage(), record = { id: `${mode}-pair${pair}-${kind}`, kind, mode, pair, viewport, phase: 'navigation', resources: [], cdpLimits: [], runtimeErrors: [], preparations: [], captures: [] }, pending = []
  report.pages.push(record)
  const item = { context, p, record, pending, observer: null, header: null }
  items.push(item)
  p.on('pageerror', error => record.runtimeErrors.push(String(error)))
  p.on('response', response => {
    if (!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(response.url())) return
    pending.push((async () => {
      try { const bytes = await response.body(); record.resources.push({ url: response.url(), status: response.status(), bytes: bytes.length, sha256: hash(bytes) }) }
      catch (error) { record.resources.push({ url: response.url(), error: String(error) }) }
    })())
  })
  item.observer = await observeLayers(p, record)
  await p.goto(urls[kind], { waitUntil: 'domcontentloaded' }); await p.locator('#writing-space').waitFor(); await p.waitForLoadState('load')
  await p.evaluate(async () => { await Promise.all([document.fonts.load('450 59px Newsreader'), document.fonts.load('italic 420 59px Newsreader'), document.fonts.load('400 20px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('650 14px Manrope')]); await document.fonts.ready })
  await p.locator('#writing-space').evaluate(e => scrollTo({ top: Math.floor(e.getBoundingClientRect().top + scrollY), behavior: 'instant' }))
  await twoFrames(p)
  await p.locator('#writing-space .editor-topbar img').evaluateAll(async images => { await Promise.all(images.filter(i => i.getBoundingClientRect().width > 0).map(i => i.decode())) })
  await p.waitForFunction(() => document.querySelector('.device-stage').classList.contains('is-visible') && [...document.querySelector('#writing-space').getAnimations({ subtree: true })].every(a => a.playState !== 'running'))
  await twoFrames(p)
  record.originalScroll = await p.evaluate(() => [scrollX, scrollY])
  return item
}
async function applyStage(item, label) {
  const { p, record } = item
  await p.bringToFront()
  const preparation = { label, before: await nativeState(p) }
  record.phase = label + '-preparation'
  if (label === 'no-op') { await p.waitForTimeout(200); await twoFrames(p); preparation.fixedNoOpMilliseconds = 200 }
  if (label === 'computed-fonts') {
    preparation.fonts = await actualFonts(p)
    if (preparation.fonts.status !== 'loaded' || !preparation.fonts.sheets.every(s => s.disabled || s.loaded) || !preparation.fonts.loaded.every(r => r.afterCheck && r.faces.some(f => f.family.replaceAll('"', '') === r.primaryFamily && f.status === 'loaded'))) throw new Error(record.id + ' actual text font readiness failed')
  }
  if (label === 'faq-refresh') preparation.refreshedClosedDetails = await p.evaluate(refreshClosedDisclosureLayout)
  if (label === 'same-scroll') await p.locator('#writing-space').evaluate(e => scrollTo({ top: Math.floor(e.getBoundingClientRect().top + scrollY), behavior: 'instant' }))
  if (label === 'header-hidden') {
    item.header = await p.addStyleTag({ content: '.site-header,.site-header *,.sl-header,.sl-header *{visibility:hidden!important}' })
    await twoFrames(p)
    preparation.allHeaderNodesHidden = await p.locator('.site-header,.site-header *,.sl-header,.sl-header *').evaluateAll(es => es.length > 0 && es.every(e => getComputedStyle(e).visibility === 'hidden'))
    if (!preparation.allHeaderNodesHidden) throw new Error('Header suppression incomplete')
  }
  if (label === 'header-restored') { await item.header.evaluate(e => e.remove()); item.header = null; await twoFrames(p) }
  if (label === 'width-600') { await p.setViewportSize({ width: 600, height: 1200 }); await twoFrames(p); await p.locator('#writing-space').evaluate(e => scrollTo({ top: Math.floor(e.getBoundingClientRect().top + scrollY), behavior: 'instant' })) }
  if (label === 'width-returned') { await p.setViewportSize(viewport); await twoFrames(p); await p.evaluate(([left, top]) => scrollTo({ left, top, behavior: 'instant' }), record.originalScroll) }
  await twoFrames(p)
  preparation.after = await nativeState(p)
  record.preparations.push(preparation)
}
async function investigatePair(mode, pair) {
  const items = []
  try {
    // Both contexts remain alive throughout all paired preparation and captures.
    await preparePage('published', mode, pair, items)
    await preparePage('source', mode, pair, items)
    for (const label of stages) {
      for (const item of items) await applyStage(item, label)
      const captured = []
      for (const item of items) captured.push(await capture(item, label))
      // Neither initial screenshot is preceded by either page's command query.
      for (const [i, item] of items.entries()) {
        captured[i].commandLogs = await commandLogs(item.observer, item.record, label, captured[i].layersAfter.layers)
        captured[i].sequenceAfterCommandLogs = item.observer.sequence
      }
    }
  } catch (error) { report.errors.push({ mode, pair, error: String(error) }) }
  finally {
    for (const item of items) {
      if (item.header) await item.header.evaluate(e => e.remove()).catch(() => {})
      await Promise.all(item.pending)
      item.record.layerEvents = item.observer?.events || []; item.record.nodeMapping = item.observer ? [...item.observer.nodeCache.values()] : []; item.record.completedAt = new Date().toISOString()
      if (item.observer) await item.observer.client.detach().catch(error => item.record.cdpLimits.push({ method: 'detach', error: String(error) }))
      await item.context.close()
    }
  }
  return items.map(i => i.record)
}
async function compareImages(a, b, region = null) {
  const sources = await Promise.all([a, b].map(async file => 'data:image/png;base64,' + (await fs.readFile(path.join(out, file))).toString('base64')))
  const p = await browser.newPage()
  try {
    return await p.evaluate(async ({ sources, region }) => {
      const images = await Promise.all(sources.map(async src => { const i = new Image(); i.src = src; await i.decode(); return i }))
      if (images[0].width !== images[1].width || images[0].height !== images[1].height) return { sameSize: false, sizes: images.map(i => [i.width, i.height]) }
      const r = region || { x: 0, y: 0, width: images[0].width, height: images[0].height }
      const canvas = document.createElement('canvas'); canvas.width = images[0].width; canvas.height = images[0].height
      const c = canvas.getContext('2d', { willReadFrequently: true }), arrays = images.map(i => { c.clearRect(0, 0, canvas.width, canvas.height); c.drawImage(i, 0, 0); return c.getImageData(r.x, r.y, r.width, r.height).data })
      let changed = 0, left = r.width, top = r.height, right = -1, bottom = -1
      for (let i = 0; i < arrays[0].length; i += 4) if (Math.max(Math.abs(arrays[0][i] - arrays[1][i]), Math.abs(arrays[0][i + 1] - arrays[1][i + 1]), Math.abs(arrays[0][i + 2] - arrays[1][i + 2])) > 24) {
        changed++; const x = i / 4 % r.width, y = Math.floor(i / 4 / r.width); left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y)
      }
      const ratio = changed / (r.width * r.height)
      return { sameSize: true, region: r, changed, total: r.width * r.height, ratio, exceedsCheckpointPixelThreshold: ratio > .01, changedBounds: changed ? [left + r.x, top + r.y, right + r.x, bottom + r.y] : null }
    }, { sources, region })
  } finally { await p.close() }
}
try {
  for (const mode of modes) {
    const browserLaunchArgs = ['--no-sandbox', ...(mode === 'disable-lcd-text' ? ['--disable-lcd-text'] : [])]
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: browserLaunchArgs })
    const environment = { mode, browser: browser.version(), args: browserLaunchArgs, executable: process.env.CHROME_PATH, node: process.version, playwright: JSON.parse(await fs.readFile('node_modules/playwright-core/package.json', 'utf8')).version }
    report.environments.push(environment)
    if (environment.browser !== expectedBrowser) throw new Error('Launched browser version differs from exact pin')
    for (const pair of [1, 2]) {
      const records = await investigatePair(mode, pair)
      if (records.length !== 2) continue
      for (const label of stages) {
        const captures = records.map(r => r.captures.find(c => c.label === label))
        if (captures.some(c => !c)) continue
        for (const region of ['section', 'devices']) {
          const images = captures.map(c => c.images[region])
          const comparison = { mode, pair, label, region, visible: images.map(i => i.visible), files: images.map(i => i.file || null) }
          if (images.every(i => i.visible)) comparison.pixels = await compareImages(...comparison.files)
          report.comparisons.push(comparison)
        }
      }
      for (const record of records) for (let i = 1; i < record.captures.length; i++) {
        const current = record.captures[i], previous = record.captures[i - 1], initial = record.captures[0]
        for (const [reference, before] of [['previous', previous], ['initial', initial]]) {
          const images = [before, current].map(c => c.images.devices)
          if (images.every(image => image.visible)) report.withinPageComparisons.push({ id: record.id, reference, from: before.label, to: current.label, files: images.map(image => image.file), pixels: await compareImages(...images.map(image => image.file)) })
        }
      }
    }
    await browser.close(); browser = null
  }
} catch (error) { report.errors.push({ error: String(error) }) }
finally {
  if (browser) await browser.close()
  report.finishedAt = new Date().toISOString(); await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
}
console.log(JSON.stringify({ diagnosticOnly: true, environments: report.environments, pages: report.pages.length, captures: report.pages.reduce((n, p) => n + p.captures.reduce((m, c) => m + Object.values(c.images).filter(i => i.visible).length, 0), 0), deviceComparisons: report.comparisons.filter(c => c.region === 'devices').map(c => ({ mode: c.mode, pair: c.pair, label: c.label, ratio: c.pixels?.ratio })), errors: report.errors }))
if (report.errors.length) process.exitCode = 1
