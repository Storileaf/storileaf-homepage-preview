import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'

// One bounded investigation of the retained Writing failures. This script does
// not replace the checkpoint, select a favourable image, or change page styles.
const root = process.cwd()
const out = process.env.WRITING_RASTER_OUT || path.join(root, 'qa/writing-raster-diagnostic')
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const frozenRuntime = 'a2d1ee14a793581a08a0e11dd64002e9360eaf66'
const rasterMode = process.env.WRITING_RASTER_MODE || 'default'
if (!['default', 'disable-lcd-text'].includes(rasterMode)) throw new Error('Unknown diagnostic raster mode: ' + rasterMode)
const browserLaunchArgs = ['--no-sandbox', ...(rasterMode === 'disable-lcd-text' ? ['--disable-lcd-text'] : [])]
const urls = { published: 'http://127.0.0.1:4173/storileaf-homepage-preview/', source: 'http://127.0.0.1:4180/' }
const viewports = [{ width: 901, height: 1000 }, { width: 1440, height: 1200 }]
const stages = ['initial', 'scroll-out', 'scroll-back', 'height-altered', 'height-back']
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const report = {
  purpose: 'Diagnostic evidence only: investigate stable native device raster differences. Completion is not a parity pass.',
  baseline, frozenRuntime, rasterMode, browserLaunchArgs, diagnosticCommit: process.env.GITHUB_SHA || git('rev-parse', 'HEAD'),
  createdAt: new Date().toISOString(), viewports, stages,
  protocolReferences: ['https://chromedevtools.github.io/devtools-protocol/tot/LayerTree/', 'https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-describeNode', 'https://playwright.dev/docs/api/class-cdpsession', 'https://chromium.googlesource.com/chromium/src/+/HEAD/content/public/common/content_switches.cc'],
  rasterProbe: 'The workflow retains both default Chromium and the explicit --disable-lcd-text environment. The second environment tests the LCD-versus-grayscale text antialiasing hypothesis; neither environment replaces the checkpoint or is selected by its agreement with the other page.',
  method: 'Each fresh reduced-motion page uses the checkpoint font/image readiness, then one native full-viewport screenshot at each fixed stage. The page first scrolls to the writing section, then to document top and back to the recorded position. The viewport height then decreases by exactly 120px and returns, followed by restoration of the same original scroll position. Width and device scale remain fixed. No CSS, animation, DOM content, header visibility or pixel threshold is changed. Layer trees, paint events, DOM mappings and ancestor computed values are read before and after every screenshot. Read-only layer command logs are attempted only for device-associated content layers after initial, scroll-back and height-back captures, with a deterministic cap of 12 and every excluded layer recorded.',
  limits: 'One Chromium pair per width, emulated viewports and reduced motion only. CDP observation and screenshots may themselves affect paint scheduling; before/after layer evidence records that possibility. LayerTree does not directly expose every compositor raster scale or cache decision. Unavailable CDP features are retained as diagnostic limits. Original checkpoint failures remain unresolved until assessed separately.',
  thresholds: { pixelChannel: 24, pixelRatio: .01, geometry: .15 },
  sourceHashes: {}, protectedHashes: {}, harnessHashes: {}, buildHashes: {}, pages: [], comparisons: [], errors: []
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
if (report.runtimeTree !== report.frozenRuntimeTree) throw new Error('Frozen source tree changed')
for (const file of ['index.html', 'assets/index-DhPZyX4z.css', 'assets/routes-DrwDv2x2.js', 'assets/content-sections-CfrmOVRI.js']) {
  const bytes = await fs.readFile(file)
  if (!bytes.equals(execFileSync('git', ['show', baseline + ':' + file], { cwd: root }))) throw new Error('Protected baseline changed: ' + file)
  report.protectedHashes[file] = hash(bytes)
}
for (const file of ['qa/homepage-assembly/2026-10-20/diagnose-writing-raster.mjs', '.github/workflows/diagnose-writing-raster.yml', 'frontend/scripts/verify-writing-parity.mjs']) report.harnessHashes[file] = hash(await fs.readFile(file))
for (const dir of ['frontend/dist', 'frontend/dist/assets']) for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
  if (entry.isFile() && /\.(css|js|html)$/.test(entry.name)) {
    const file = path.join(dir, entry.name); report.buildHashes[file] = hash(await fs.readFile(file))
  }
}

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
    const selectors = ['#writing-space', '#writing-space>div', '#devices-title', '#devices-title em', '.device-stage', '.device-floor', '.device-laptop', '.laptop-display', '.device-tablet', '.device-phone', '.editor-screen', '.editor-topbar', '.editor-topbar img', '.editor-main', '.editor-main h3', '.screen-answer']
    const properties = ['display', 'position', 'width', 'height', 'overflow', 'overflowX', 'overflowY', 'opacity', 'transform', 'transformOrigin', 'translate', 'rotate', 'scale', 'filter', 'backdropFilter', 'willChange', 'contain', 'contentVisibility', 'isolation', 'perspective', 'perspectiveOrigin', 'transformStyle', 'backfaceVisibility', 'imageRendering', 'zoom', 'zIndex', 'mixBlendMode', 'boxSizing', 'borderRadius', 'boxShadow', 'animationName', 'animationDuration', 'animationDelay', 'animationFillMode', 'animationTimingFunction', 'transitionProperty', 'transitionDuration', 'transitionDelay', 'transitionTimingFunction', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontSynthesis', 'fontFeatureSettings', 'fontVariationSettings', 'fontOpticalSizing', 'fontKerning', 'fontStretch', 'fontVariantLigatures', 'lineHeight', 'letterSpacing', 'textRendering', 'webkitFontSmoothing']
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
      time: performance.now(), viewport: [innerWidth, innerHeight], devicePixelRatio, scroll: [scrollX, scrollY], documentSize: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], readyState: document.readyState, fontStatus: document.fonts.status,
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
  const candidates = layers.filter(l => l.drawsContent && l.node?.relationship?.device)
  const result = { limit: 12, candidates: candidates.map(l => l.layerId), excluded: candidates.slice(12).map(l => l.layerId), layers: [] }
  for (const layer of candidates.slice(0, 12)) {
    const evidence = { layerId: layer.layerId, backendNodeId: layer.backendNodeId, node: layer.node, paintCount: layer.paintCount }
    let snapshotId
    try {
      snapshotId = (await observer.client.send('LayerTree.makeSnapshot', { layerId: layer.layerId })).snapshotId
      const log = await observer.client.send('LayerTree.snapshotCommandLog', { snapshotId })
      const file = `${record.kind}-${record.viewport.width}-${label}-layer-${layer.layerId}-commands.json`
      const bytes = Buffer.from(JSON.stringify(log, null, 2) + '\n'); await fs.writeFile(path.join(out, file), bytes)
      evidence.file = file; evidence.sha256 = hash(bytes); evidence.commandCount = log.commandLog?.length
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
async function capture(p, observer, record, label) {
  record.phase = label
  await p.bringToFront(); await twoFrames(p)
  const state = { label, nativeBefore: await nativeState(p), layersBefore: await layerState(observer, record) }
  state.file = `${record.kind}-${record.viewport.width}-${label}.png`
  const bytes = await p.screenshot({ path: path.join(out, state.file), caret: 'initial' })
  state.sha256 = hash(bytes)
  state.layersAfter = await layerState(observer, record)
  state.nativeAfter = await nativeState(p)
  if (['initial', 'scroll-back', 'height-back'].includes(label)) {
    state.commandLogs = await commandLogs(observer, record, label, state.layersAfter.layers)
    state.sequenceAfterCommandLogs = observer.sequence
  }
  record.captures.push(state)
  return state
}
let browser
async function investigate(kind, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const p = await context.newPage(), record = { kind, viewport, phase: 'navigation', resources: [], cdpLimits: [], runtimeErrors: [], captures: [] }, pending = []
  report.pages.push(record)
  p.on('pageerror', error => record.runtimeErrors.push(String(error)))
  p.on('response', response => {
    if (!/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(response.url())) return
    pending.push((async () => {
      try { const bytes = await response.body(); record.resources.push({ url: response.url(), status: response.status(), bytes: bytes.length, sha256: hash(bytes) }) }
      catch (error) { record.resources.push({ url: response.url(), error: String(error) }) }
    })())
  })
  const observer = await observeLayers(p, record)
  try {
    await p.goto(urls[kind], { waitUntil: 'domcontentloaded' }); await p.locator('#writing-space').waitFor(); await p.waitForLoadState('load')
    // These five requests and the later actual-descriptor pass match the frozen checkpoint.
    await p.evaluate(async () => { await Promise.all([document.fonts.load('450 59px Newsreader'), document.fonts.load('italic 420 59px Newsreader'), document.fonts.load('400 20px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('650 14px Manrope')]); await document.fonts.ready })
    record.phase = 'before-entry'; record.beforeEntry = { native: await nativeState(p), layers: await layerState(observer, record) }
    await p.locator('#writing-space').evaluate(e => scrollTo({ top: Math.floor(e.getBoundingClientRect().top + scrollY), behavior: 'instant' }))
    await twoFrames(p)
    await p.locator('#writing-space .editor-topbar img').evaluateAll(async images => { await Promise.all(images.filter(i => i.getBoundingClientRect().width > 0).map(i => i.decode())) })
    await p.waitForFunction(() => [...document.querySelector('#writing-space').getAnimations({ subtree: true })].every(a => a.playState !== 'running'))
    record.fonts = await actualFonts(p); await twoFrames(p)
    if (record.fonts.status !== 'loaded' || !record.fonts.sheets.every(s => s.disabled || s.loaded) || !record.fonts.loaded.every(r => r.afterCheck && r.faces.some(f => f.family.replaceAll('"', '') === r.primaryFamily && f.status === 'loaded'))) throw new Error(kind + ' actual text font readiness failed')
    record.originalScroll = await p.evaluate(() => [scrollX, scrollY])
    await capture(p, observer, record, 'initial')
    record.phase = 'scroll-out-transition'; await p.evaluate(() => scrollTo({ left: 0, top: 0, behavior: 'instant' })); await capture(p, observer, record, 'scroll-out')
    record.phase = 'scroll-back-transition'; await p.evaluate(([left, top]) => scrollTo({ left, top, behavior: 'instant' }), record.originalScroll); await capture(p, observer, record, 'scroll-back')
    record.phase = 'height-altered-transition'; await p.setViewportSize({ width: viewport.width, height: viewport.height - 120 }); await capture(p, observer, record, 'height-altered')
    record.phase = 'height-back-transition'; await p.setViewportSize(viewport)
    await p.waitForFunction(({ width, height }) => innerWidth === width && innerHeight === height, viewport)
    await p.evaluate(([left, top]) => scrollTo({ left, top, behavior: 'instant' }), record.originalScroll); await capture(p, observer, record, 'height-back')
  } catch (error) { record.error = String(error); report.errors.push(kind + ' ' + viewport.width + ' ' + error) }
  finally {
    await Promise.all(pending)
    record.layerEvents = observer.events; record.nodeMapping = [...observer.nodeCache.values()]
    record.completedAt = new Date().toISOString()
    await observer.client.detach().catch(error => record.cdpLimits.push({ method: 'detach', error: String(error) })); await context.close()
  }
  return record
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
      for (let i = 0; i < arrays[0].length; i += 4) if (Math.max(...[0, 1, 2].map(k => Math.abs(arrays[0][i + k] - arrays[1][i + k]))) > 24) {
        changed++; const x = i / 4 % r.width, y = Math.floor(i / 4 / r.width); left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y)
      }
      const ratio = changed / (r.width * r.height)
      return { sameSize: true, region: r, changed, total: r.width * r.height, ratio, exceedsCheckpointPixelThreshold: ratio > .01, changedBounds: changed ? [left + r.x, top + r.y, right + r.x, bottom + r.y] : null }
    }, { sources, region })
  } finally { await p.close() }
}
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: browserLaunchArgs })
  report.browser = browser.version(); report.node = process.version; report.platform = process.platform; report.playwright = JSON.parse(await fs.readFile('node_modules/playwright-core/package.json', 'utf8')).version
  for (const viewport of viewports) {
    const published = await investigate('published', viewport), source = await investigate('source', viewport)
    for (const label of stages) {
      const a = published.captures.find(s => s.label === label), b = source.captures.find(s => s.label === label)
      if (!a || !b) continue
      const result = { viewport, label, files: [a.file, b.file], fullViewport: await compareImages(a.file, b.file), deviceRegions: [a.nativeAfter.deviceRegion, b.nativeAfter.deviceRegion] }
      if (a.nativeAfter.deviceRegion) result.deviceRegion = await compareImages(a.file, b.file, a.nativeAfter.deviceRegion)
      report.comparisons.push(result)
    }
    for (const record of [published, source]) {
      const initial = record.captures.find(s => s.label === 'initial'); if (!initial) continue
      for (const label of ['scroll-back', 'height-back']) {
        const next = record.captures.find(s => s.label === label); if (!next) continue
        record['initialTo' + label] = { files: [initial.file, next.file], fullViewport: await compareImages(initial.file, next.file) }
        if (initial.nativeAfter.deviceRegion) record['initialTo' + label].deviceRegion = await compareImages(initial.file, next.file, initial.nativeAfter.deviceRegion)
      }
    }
  }
} catch (error) { report.errors.push(String(error)) }
finally {
  if (browser) await browser.close()
  report.finishedAt = new Date().toISOString(); await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
}
console.log(JSON.stringify({ diagnosticOnly: true, rasterMode, browserLaunchArgs, pages: report.pages.length, captures: report.pages.reduce((n, p) => n + p.captures.length, 0), comparisons: report.comparisons.map(c => ({ width: c.viewport.width, label: c.label, fullViewport: c.fullViewport.ratio, deviceRegion: c.deviceRegion?.ratio })), errors: report.errors }))
if (report.errors.length) process.exitCode = 1
