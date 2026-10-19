import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

// The static server serves the protected root. The source server serves the
// isolated frontend/dist. Target content, styles and routes are never replaced.
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/',
}
const publishedOrigin = 'https://storileaf.github.io/storileaf-homepage-preview/'
const requiredWidths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const widths = process.env.STORILEAF_GROUP2_WIDTHS
  ? process.env.STORILEAF_GROUP2_WIDTHS.split(',').map(Number)
  : requiredWidths
const folder = 'qa/group2'
await fs.mkdir(folder, { recursive: true })
const problems = []
const check = (ok, message) => { if (!ok) problems.push(message) }
const hash = value => createHash('sha256').update(value).digest('hex')
const report = {
  protectedBaseline: 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b',
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  createdAt: new Date().toISOString(),
  completeWidthSet: JSON.stringify(widths) === JSON.stringify(requiredWidths),
  browser: '', urls, requestedWidths: widths, composition: {}, widths: [], states: [], captureAlignments: [], qualityFindings: [], problems,
  thresholds: { geometryCssPixels: 0.15, screenshotChannelDifference: 24, screenshotChangedRatio: 0.01 },
  equivalentRepresentations: [
    'Loaded primary font families must match; unused fallback family lists may differ.',
    'A zero width border may use solid or none. Visible borders remain compared.',
    'Static relative links resolve against the real published origin. Source destinations use each actual element.href, so a source regression to a local fragment or pricing route fails. Both must match. Raw hrefs remain recorded. No test route substitution occurs.',
    'The source final invitation omits the incorrect static aria-current=page attribute. This deliberate semantic correction has no visual effect; the protected static runtime is unchanged.',
  ],
  captureMethod: 'Real pages measured after actual font readiness. Group 2 contains inline SVG icons and no raster images. Relevant header and hero image assets are decoded before context captures. Clean crops temporarily extend viewport height to contain the complete section, hide the unrelated sticky header and apply a recorded body padding adjustment of less than one CSS pixel based on the section document origin. Unchanged section dimensions and complete painting bounds are checked. Context captures retain the requested viewport and header without capture adjustments. No target section styles, assets, content or routes are substituted.',
  viewportReadinessMethod: 'A hidden fixed 100vw by 100vh probe must match the requested viewport within 0.01 CSS pixels, and innerWidth/innerHeight must match exactly. This bounded check waits for responsive CSS after a resize, followed by two foreground animation frames. The probe does not participate in document layout.',
  expandedStateMethod: 'Native details.open is set only to establish deterministic screenshot states. Separate real keyboard and emulated touch checks exercise the native summary activation and independent disclosure behaviour. The source must contain six HTMLDetailsElement elements with direct native summaries and no exclusive group name.',
  positionScope: 'The protected published reassurance band remains immediately after the hero and before book discovery. The incomplete source stages it before the migrated later sections. Full rendered page position awaits hero and book migration. Section geometry is compared relative to each section origin. The final invitation must remain within #questions after the FAQ grid in all expanded layouts.',
  limits: 'Chromium automation, emulated touch and targeted section text enlargement. Not full native browser zoom, cross browser, physical device or accessibility certification. Shared navigation, history and hydration work remain separately scoped.',
}
report.publishedFiles = {
  htmlSha256: hash(await fs.readFile('../index.html')),
  cssSha256: hash(await fs.readFile('../assets/index-DhPZyX4z.css')),
}
const sourceFileNames = [
  'src/App.tsx', 'src/sections/ReassuranceBand.tsx', 'src/sections/FaqSection.tsx',
  'src/sections/FinalInvitation.tsx', 'src/sections/homepageQuestionsContent.ts',
  'src/styles/homepage-questions.css', 'content/ledger.json',
]
report.sourceFiles = {}
for (const file of sourceFileNames) report.sourceFiles[file] = hash(await fs.readFile(file))
report.harnessSha256 = hash(await fs.readFile('scripts/verify-group2-parity.mjs'))
const styles = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
  'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderTopStyle',
  'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth',
  'borderLeftColor', 'borderRadius', 'boxShadow', 'textAlign', 'textWrap', 'opacity',
  'display', 'gap', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'marginTop', 'marginBottom', 'transform', 'textDecorationLine', 'textUnderlineOffset',
]
function groupsFor(kind) {
  const source = kind === 'source'
  const css = name => '.' + (source ? 'sl-' : '') + name
  const faq = css('faq-item')
  return {
    reassurance: {
      kind, selector: source ? '.sl-home-reassurance' : '.trust-band',
      nodes: [
        ['section', ':scope'], ['container', ':scope > div'],
        ...Array.from({ length: 3 }, (_, i) => [
          ['item' + i, css('trust-band-item'), i],
          ['iconFrame' + i, css('trust-icon'), i],
          ['icon' + i, css('trust-icon') + ' svg', i],
          ['statement' + i, css('trust-band-item') + ' > span:last-child', i],
        ]).flat(),
      ],
    },
    questions: {
      kind, selector: '#questions',
      nodes: [
        ['section', ':scope'], ['container', ':scope > div'], ['grid', css('faq-grid')],
        ['intro', css('faq-intro')], ['heading', '#faq-title'], ['emphasis', '#faq-title em'],
        ['contact', css('faq-intro') + ' a'], ['contactArrow', css('faq-intro') + ' a svg'],
        ['list', css('faq-list')],
        ...Array.from({ length: 6 }, (_, i) => [
          ['item' + i, faq, i], ['summary' + i, faq + ' summary', i],
          ['question' + i, faq + ' summary > span', i], ['toggleIcon' + i, faq + ' summary > svg', i],
          ['answer' + i, faq + ' ' + css('faq-answer'), i],
          ['paragraph' + i, faq + ' ' + css('faq-answer') + ' p', i],
          ...([1, 2, 3, 5].includes(i) ? [
            ['answerLink' + i, '[data-testid="faq-' + i + '"] ' + css('faq-answer') + ' a'],
            ['answerArrow' + i, '[data-testid="faq-' + i + '"] ' + css('faq-answer') + ' a svg'],
          ] : []),
        ]).flat(),
        ['invitation', css('final-invitation')], ['invitationCopy', css('final-invitation') + ' > div'],
        ['invitationIntro', css('final-invitation-intro')], ['invitationHeading', css('final-invitation') + ' h2'],
        ['invitationAction', css('final-invitation') + ' > a'], ['invitationArrow', css('final-invitation') + ' > a svg'],
      ],
    },
  }
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
report.browser = browser.version()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
const pages = { published: await context.newPage(), source: await context.newPage() }
for (const [kind, page] of Object.entries(pages)) page.on('pageerror', error => problems.push(kind + ' runtime error ' + error.message))
const pixelPage = await context.newPage()
async function within(promise, stage, timeout = 15000) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(stage + ' timed out after ' + timeout + 'ms')), timeout) }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
async function settle(page) {
  // Chrome may throttle animation frames and pointer updates in a background tab.
  // Read the real foreground state, with a bounded failure rather than a fallback.
  await page.bringToFront()
  // Chrome 155 can update innerWidth before applying the new CSS viewport units
  // and responsive typography. Two frames or matchMedia alone did not establish
  // readiness in the reproduced 600 -> 1440 resize. Observe CSS layout itself.
  await page.evaluate(() => {
    if (document.querySelector('[data-qa-css-viewport]')) return
    const probe = document.createElement('div')
    probe.dataset.qaCssViewport = ''
    probe.setAttribute('aria-hidden', 'true')
    probe.inert = true
    probe.style.cssText = 'all:initial;position:fixed;top:0;left:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none;contain:strict;'
    document.body.append(probe)
  })
  await page.waitForFunction(({ width, height }) => {
    const box = document.querySelector('[data-qa-css-viewport]').getBoundingClientRect()
    return innerWidth === width && innerHeight === height
      && Math.abs(box.width - width) < 0.01 && Math.abs(box.height - height) < 0.01
  }, page.viewportSize(), { timeout: 5000 })
  await within(page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))), 'Foreground frame settling')
}

async function pixelComparison(before, after, filename) {
  await pixelPage.bringToFront()
  const result = await within(pixelPage.evaluate(async ({ left, right }) => {
    const load = data => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject
      image.src = 'data:image/png;base64,' + data
    })
    const [a, b] = await Promise.all([load(left), load(right)])
    const canvas = document.createElement('canvas')
    canvas.width = a.width + b.width + 24; canvas.height = Math.max(a.height, b.height) + 38
    const pen = canvas.getContext('2d')
    pen.fillStyle = '#ffffff'; pen.fillRect(0, 0, canvas.width, canvas.height)
    pen.fillStyle = '#253526'; pen.font = '16px sans-serif'
    pen.fillText('Published', 12, 25); pen.fillText('React', a.width + 36, 25)
    pen.drawImage(a, 0, 38); pen.drawImage(b, a.width + 24, 38)
    let changed = null, ratio = null
    if (a.width === b.width && a.height === b.height) {
      const first = pen.getImageData(0, 38, a.width, a.height).data
      const second = pen.getImageData(a.width + 24, 38, b.width, b.height).data
      changed = 0
      for (let i = 0; i < first.length; i += 4) {
        if (Math.max(Math.abs(first[i] - second[i]), Math.abs(first[i + 1] - second[i + 1]), Math.abs(first[i + 2] - second[i + 2])) > 24) changed++
      }
      ratio = changed / (a.width * a.height)
    }
    return {
      publishedSize: [a.width, a.height], sourceSize: [b.width, b.height],
      changedPixels: changed, changedRatio: ratio, channelTolerance: 24,
      comparison: canvas.toDataURL('image/png').split(',')[1],
    }
  }, { left: before.toString('base64'), right: after.toString('base64') }), 'Pixel comparison ' + filename)
  await fs.writeFile(path.join(folder, filename), Buffer.from(result.comparison, 'base64'))
  delete result.comparison
  return result
}
async function capture(page, group, filename) {
  await settle(page)
  const viewport = page.viewportSize()
  const original = await page.locator(group.selector).boundingBox()
  const captureHeight = Math.max(viewport.height, Math.ceil(original.height) + 400)
  await page.setViewportSize({ ...viewport, height: captureHeight })
  await settle(page)
  const alignment = await page.locator(group.selector).evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const top = bounds.top + scrollY
    const delta = Math.ceil(top) - top
    const before = document.body.style.paddingTop
    document.body.style.paddingTop = (parseFloat(getComputedStyle(document.body).paddingTop) + delta) + 'px'
    const aligned = element.getBoundingClientRect()
    return {
      before, delta, documentTop: top, alignedTop: aligned.top + scrollY,
      geometryUnchanged: bounds.width === aligned.width && bounds.height === aligned.height,
    }
  })
  const current = await page.locator(group.selector).boundingBox()
  const viewportGeometryUnchanged = Math.abs(original.width - current.width) <= 0.015 && Math.abs(original.height - current.height) <= 0.015
  check(alignment.delta >= 0 && alignment.delta < 1 && alignment.geometryUnchanged && viewportGeometryUnchanged, 'Capture alignment changed section geometry ' + filename)
  report.captureAlignments.push({
    filename, ...alignment, originalViewport: viewport, captureHeight, viewportGeometryUnchanged,
    originalDimensions: { width: original.width, height: original.height },
    captureDimensions: { width: current.width, height: current.height },
    dimensionChanges: { width: current.width - original.width, height: current.height - original.height },
  })
  try {
    await page.locator(group.selector).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 10, behavior: 'instant' }))
    await settle(page)
    const visible = await page.locator(group.selector).evaluate(element => {
      const box = element.getBoundingClientRect()
      return box.top >= 0 && box.bottom <= innerHeight
    })
    check(visible, 'Clean capture does not contain the complete section ' + filename)
    return await page.locator(group.selector).screenshot({
      path: path.join(folder, filename), animations: 'disabled', caret: 'hide',
      style: '.site-header, .sl-header { visibility: hidden !important; }',
    })
  } finally {
    await page.evaluate(before => { document.body.style.paddingTop = before }, alignment.before)
    await page.setViewportSize(viewport)
    await settle(page)
  }
}

async function ready(page, kind) {
  await page.bringToFront()
  await page.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await page.locator('#questions details').last().waitFor()
  const fontResult = await within(page.evaluate(async () => {
    await Promise.all([document.fonts.load('450 40px Newsreader'), document.fonts.load('430 40px Newsreader'), document.fonts.load('400 15px Manrope'), document.fonts.load('600 15px Manrope'), document.fonts.load('700 17px Manrope')])
    await document.fonts.ready
    return [...document.fonts].filter(face => face.status === 'loaded').map(face => face.family)
  }), kind + ' actual font readiness', 45000)
  check(fontResult.some(font => font.includes('Newsreader')) && fontResult.some(font => font.includes('Manrope')), kind + ' actual fonts did not load')
  await within(page.locator('.site-header img, .sl-header img, .hero img').evaluateAll(async images => {
    await Promise.all(images.map(image => image.decode()))
    if (images.some(image => !image.complete || !image.naturalWidth)) throw new Error('Missing context image')
  }), kind + ' context image decoding', 45000)
  await page.mouse.move(0, 0)
  await settle(page)
}
async function setOpen(page, indexes) {
  await page.locator('#questions details').evaluateAll((items, indexes) => {
    items.forEach((item, index) => { item.open = indexes.includes(index) })
  }, indexes)
  await settle(page)
}
async function snapshot(page, group) {
  return page.locator(group.selector).evaluate((root, options) => {
    const box = root.getBoundingClientRect()
    const number = value => Math.round(value * 1000) / 1000
    const normal = value => value.replace(/\s+/g, ' ').trim()
    const destination = element => options.kind === 'source' ? element.href : new URL(element.getAttribute('href'), options.publishedOrigin).href
    const nodes = {}
    for (const [name, selector, index = 0] of options.nodes) {
      const element = selector === ':scope' ? root : root.querySelectorAll(selector)[index]
      if (!element) { nodes[name] = null; continue }
      const bounds = element.getBoundingClientRect(), css = getComputedStyle(element)
      const visible = element.checkVisibility()
      const attributes = {}
      for (const attribute of ['href', 'viewBox', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin']) {
        if (element.hasAttribute(attribute)) attributes[attribute] = attribute === 'href' ? destination(element) : element.getAttribute(attribute)
      }
      const text = element.matches('h2, p, span, a, summary') ? normal(element.textContent || '') : null
      nodes[name] = {
        text, visible,
        geometry: visible ? { x: number(bounds.x - box.x), y: number(bounds.y - box.y), width: number(bounds.width), height: number(bounds.height) } : null,
        style: Object.fromEntries(options.styles.map(property => [property, css[property]])), attributes,
      }
    }
    const details = [...root.querySelectorAll('details')].map(item => ({
      native: item instanceof HTMLDetailsElement,
      directSummary: item.firstElementChild?.tagName === 'SUMMARY',
      testId: item.getAttribute('data-testid'), name: item.getAttribute('name'),
      open: item.open, answerVisible: item.querySelector('summary + div')?.checkVisibility() || false,
      summaryRole: item.querySelector('summary')?.getAttribute('role'),
      summaryTabIndex: item.querySelector('summary')?.getAttribute('tabindex'),
    }))
    const invitation = root.querySelector('.final-invitation, .sl-final-invitation')
    const grid = root.querySelector('.faq-grid, .sl-faq-grid')
    return {
      nodes, details, documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      invitationAfterGrid: invitation && grid ? invitation.getBoundingClientRect().top >= grid.getBoundingClientRect().bottom - 0.15 && grid.nextElementSibling === invitation : null,
      ariaLabel: root.getAttribute('aria-label'), labelledBy: root.getAttribute('aria-labelledby'),
      images: [...root.querySelectorAll('img')].map(image => ({ src: image.currentSrc, loaded: image.complete && image.naturalWidth > 0 })),
      icons: [...root.querySelectorAll('svg')].map(icon => {
        const css = getComputedStyle(icon)
        return {
          viewBox: icon.getAttribute('viewBox'),
          shapes: [...icon.querySelectorAll('path, circle, rect, line, ellipse, polygon, polyline')].map(shape => ({
            tag: shape.tagName,
            attributes: Object.fromEntries([...shape.attributes].filter(attribute => !['class', 'style'].includes(attribute.name)).sort((a, b) => a.name.localeCompare(b.name)).map(attribute => [attribute.name, attribute.value])),
          })),
          strokeWidth: css.strokeWidth, linecap: css.strokeLinecap, linejoin: css.strokeLinejoin,
          width: css.width, height: css.height, fill: css.fill, stroke: css.stroke,
        }
      }),
      links: [...root.querySelectorAll('a')].map(link => ({ text: normal(link.textContent), rawHref: link.getAttribute('href'), destination: destination(link), ariaCurrent: link.getAttribute('aria-current') })),
    }
  }, { nodes: group.nodes, styles, publishedOrigin, kind: group.kind })
}
function compareSnapshots(before, after, label, { allowQualityOverflow = false } = {}) {
  const differences = []
  for (const name of Object.keys(before.nodes)) {
    const b = before.nodes[name], a = after.nodes[name]
    if (!b || !a) { differences.push(name + ' missing'); continue }
    for (const key of ['text', 'visible', 'attributes', 'style']) {
      if (key === 'style') {
        for (const property of styles) if (b.style[property] !== a.style[property]) {
          if (property === 'fontFamily' && b.style[property].split(',')[0] === a.style[property].split(',')[0]) continue
          if (property === 'borderTopStyle' && b.style.borderTopWidth === '0px' && a.style.borderTopWidth === '0px') continue
          differences.push(name + ' ' + property + ' ' + b.style[property] + ' -> ' + a.style[property])
        }
      } else if (JSON.stringify(b[key]) !== JSON.stringify(a[key])) differences.push(name + ' ' + key + ' differs')
    }
    if (b.geometry && a.geometry) for (const property of Object.keys(b.geometry)) {
      if (Math.abs(b.geometry[property] - a.geometry[property]) > 0.15) differences.push(name + ' ' + property + ' ' + b.geometry[property] + ' -> ' + a.geometry[property])
    }
  }
  const links = value => value.links.map(({ text, destination }) => ({ text, destination }))
  if (JSON.stringify(links(before)) !== JSON.stringify(links(after))) differences.push('Resolved published destinations differ')
  for (const key of ['details', 'images', 'icons', 'ariaLabel', 'labelledBy', 'invitationAfterGrid']) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) differences.push(key + ' differs')
  }
  if (before.invitationAfterGrid !== null) check(before.invitationAfterGrid && after.invitationAfterGrid, label + ' invitation must follow the FAQ grid')
  if (allowQualityOverflow) check(before.documentOverflow === after.documentOverflow, label + ' enlargement document overflow differs')
  else check(!before.documentOverflow && !after.documentOverflow, label + ' document overflow')
  check(differences.length === 0, label + ' rendered measurements differ ' + differences.slice(0, 14).join('; '))
  return differences
}
async function comparison(name, label, { screenshots = true, allowQualityOverflow = false } = {}) {
  const published = await snapshot(pages.published, groupsFor('published')[name])
  const source = await snapshot(pages.source, groupsFor('source')[name])
  const differences = compareSnapshots(published, source, name + ' ' + label, { allowQualityOverflow })
  let pixels = null
  if (screenshots) {
    const left = await capture(pages.published, groupsFor('published')[name], name + '-published-' + label + '.png')
    const right = await capture(pages.source, groupsFor('source')[name], name + '-react-' + label + '.png')
    pixels = await pixelComparison(left, right, name + '-comparison-' + label + '.png')
    check(pixels.changedRatio !== null && pixels.changedRatio <= 0.01, name + ' ' + label + ' screenshot difference ' + pixels.changedRatio)
  }
  return { published, source, differences, pixels }
}
async function focusState(page, selector) {
  return page.locator(selector).evaluate(element => {
    const css = getComputedStyle(element), arrow = element.querySelector('svg')
    return {
      focused: element === document.activeElement, focusVisible: element.matches(':focus-visible'), hovered: element.matches(':hover'),
      color: css.color, background: css.backgroundColor, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor, outlineStyle: css.outlineStyle,
      outlineOffset: css.outlineOffset, borderRadius: css.borderRadius, boxShadow: css.boxShadow,
      decoration: css.textDecorationLine, underlineOffset: css.textUnderlineOffset,
      arrowTransform: arrow ? getComputedStyle(arrow).transform : null,
    }
  })
}
async function contextCapture(page, group, filename) {
  await page.locator(group.selector).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 125, behavior: 'instant' }))
  await settle(page)
  await page.screenshot({ path: path.join(folder, filename), animations: 'disabled', caret: 'hide' })
}

try {
  for (const [kind, page] of Object.entries(pages)) {
    await ready(page, kind)
    report.composition[kind] = await page.evaluate(kind => {
      const roots = [...document.querySelectorAll('main > section')]
      const band = document.querySelector('.trust-band, .sl-home-reassurance')
      const faq = document.getElementById('questions')
      const label = element => element ? (element.id || (element.matches('.hero') ? 'hero' : element.matches('.trust-band, .sl-home-reassurance') ? 'reassurance' : element.className)) : null
      const invitation = faq?.querySelector('.final-invitation, .sl-final-invitation')
      const link = invitation?.querySelector('a')
      return {
        sections: roots.map(label), bandPrevious: label(band?.previousElementSibling), bandNext: label(band?.nextElementSibling),
        questionsPrevious: label(faq?.previousElementSibling), questionsLastInMain: faq === roots.at(-1),
        invitationLastInQuestions: invitation === faq?.firstElementChild?.lastElementChild,
        invitationCurrentPage: link?.getAttribute('aria-current'),
        bandText: [...band.querySelectorAll('.trust-band-item > span:last-child, .sl-trust-band-item > span:last-child')].map(span => span.textContent.trim()),
      }
    }, kind)
    const manifest = report.composition[kind]
    check(manifest.questionsPrevious === 'resources' && manifest.questionsLastInMain && manifest.invitationLastInQuestions, kind + ' questions or final invitation source order changed')
    if (kind === 'published') check(manifest.bandPrevious === 'hero' && manifest.bandNext === 'books', 'Published reassurance position changed')
    else check(manifest.invitationCurrentPage === null, 'Source invitation current-page semantics incorrect')
    const details = (await snapshot(page, groupsFor(kind).questions)).details
    check(details.length === 6 && details.every((item, index) => item.native && item.directSummary && item.name === null && item.summaryRole === null && item.summaryTabIndex === null && item.testId === 'faq-' + index && !item.open), kind + ' FAQs are not six closed independent native disclosures')
  }
  const sourceOrder = report.composition.source.sections.map(section => report.composition.published.sections.indexOf(section))
  check(sourceOrder.every((position, index) => position >= 0 && (index === 0 || position > sourceOrder[index - 1])), 'Source section order must follow the published order while the homepage is incomplete')
  check(JSON.stringify(report.composition.published.bandText) === JSON.stringify(report.composition.source.bandText), 'Reassurance wording differs')

  for (const width of widths) {
    const row = { width, sections: {}, individualExpanded: [], allOpen: null }
    for (const page of Object.values(pages)) {
      await page.setViewportSize({ width, height: 1000 })
      await page.mouse.move(0, 0)
      await page.evaluate(() => document.activeElement?.blur())
      await setOpen(page, [])
    }
    for (const name of ['reassurance', 'questions']) {
      row.sections[name] = await comparison(name, 'closed-' + width)
      if ([390, 1440].includes(width)) for (const [kind, page] of Object.entries(pages)) {
        await contextCapture(page, groupsFor(kind)[name], name + '-context-' + kind + '-closed-' + width + '.png')
      }
    }
    for (let index = 0; index < 6; index++) {
      for (const page of Object.values(pages)) await setOpen(page, [index])
      const result = await comparison('questions', 'open-' + index + '-' + width, { screenshots: [390, 1440].includes(width) })
      for (const kind of ['published', 'source']) check(result[kind].details.every((item, itemIndex) => item.open === (itemIndex === index) && item.answerVisible === item.open), kind + ' individual disclosure visibility ' + index + ' at ' + width)
      row.individualExpanded.push({ index, ...result })
    }
    for (const page of Object.values(pages)) await setOpen(page, [0, 1, 2, 3, 4, 5])
    row.allOpen = await comparison('questions', 'all-open-' + width)
    for (const kind of ['published', 'source']) check(row.allOpen[kind].details.every(item => item.open && item.answerVisible), kind + ' multiple disclosure visibility at ' + width)
    if ([390, 1440].includes(width)) for (const [kind, page] of Object.entries(pages)) {
      await contextCapture(page, groupsFor(kind).questions, 'questions-context-' + kind + '-all-open-' + width + '.png')
    }
    report.widths.push(row)
    console.log(JSON.stringify({ width, normalDifferences: Object.fromEntries(Object.entries(row.sections).map(([name, result]) => [name, result.differences])), individualDifferences: row.individualExpanded.map(result => result.differences), allOpenDifferences: row.allOpen.differences }))
  }

  const qSelector = (kind, name) => '#questions ' + groupsFor(kind).questions.nodes.find(node => node[0] === name)[1]
  const summary = index => '#questions [data-testid="faq-' + index + '"] summary'
  const openIndexes = page => page.locator('#questions details').evaluateAll(items => items.flatMap((item, index) => item.open ? [index] : []))
  for (const width of [390, 1440]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize({ width, height: 1000 })
      await setOpen(page, [])
      await page.keyboard.press('Tab')
      await page.locator(qSelector(kind, 'contact')).focus()
      await page.keyboard.press('Tab')
      const firstFocused = await page.locator(summary(0)).evaluate(element => document.activeElement === element)
      await page.keyboard.press('Space')
      const afterSpace = await openIndexes(page)
      await page.keyboard.press('Tab')
      const secondFocused = await page.locator(summary(1)).evaluate(element => document.activeElement === element)
      await page.keyboard.press('Enter')
      const afterEnter = await openIndexes(page)
      await page.keyboard.press('Tab')
      const answerLinkFocused = await page.locator(qSelector(kind, 'answerLink1')).evaluate(element => document.activeElement === element)
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Space')
      const afterClose = await openIndexes(page)
      await settle(page)
      const focus = await focusState(page, summary(1))
      await capture(page, groupsFor(kind).questions, 'questions-keyboard-focus-' + kind + '-' + width + '.png')
      check(firstFocused && secondFocused && answerLinkFocused && focus.focusVisible && JSON.stringify(afterSpace) === '[0]' && JSON.stringify(afterEnter) === '[0,1]' && JSON.stringify(afterClose) === '[0]', kind + ' native keyboard behaviour or independent disclosures at ' + width)
      const otherSummaries = []
      for (let index = 2; index < 6; index++) {
        await page.locator(summary(index)).focus()
        await page.keyboard.press('Enter')
        const opened = await openIndexes(page)
        await page.keyboard.press('Space')
        const closed = await openIndexes(page)
        check(JSON.stringify(opened) === JSON.stringify([0, index]) && JSON.stringify(closed) === '[0]', kind + ' native summary toggle ' + index + ' at ' + width)
        otherSummaries.push({ index, opened, closed })
      }
      await setOpen(page, [0, 1, 2, 3, 4, 5])
      const activations = []
      for (const name of ['contact', 'answerLink1', 'answerLink2', 'answerLink3', 'answerLink5', 'invitationAction']) {
        const target = page.locator(qSelector(kind, name))
        await target.evaluate(element => element.addEventListener('click', event => {
          event.preventDefault()
          element.dataset.qaKeyboardActivation = JSON.stringify({ detail: event.detail, trusted: event.isTrusted })
        }, { once: true }))
        await target.focus()
        await page.keyboard.press('Enter')
        const value = await target.evaluate((element, { origin, kind }) => ({
          rawHref: element.getAttribute('href'),
          destination: kind === 'source' ? element.href : new URL(element.getAttribute('href'), origin).href,
          activation: JSON.parse(element.dataset.qaKeyboardActivation || 'null'),
        }), { origin: publishedOrigin, kind })
        check(value.activation?.detail === 0 && value.activation?.trusted === true, kind + ' keyboard link activation ' + name)
        activations.push({ name, ...value })
      }
      values[kind] = { firstFocused, secondFocused, answerLinkFocused, afterSpace, afterEnter, afterClose, focus, otherSummaries, activations }
    }
    const activationParity = value => ({ ...value, activations: value.activations.map(({ rawHref, ...activation }) => activation) })
    check(JSON.stringify(activationParity(values.published)) === JSON.stringify(activationParity(values.source)), 'Keyboard state parity at ' + width)
    report.states.push({ state: 'native keyboard disclosure and link activation with navigation prevented', width, ...values })
  }

  for (const motion of ['reduce', 'no-preference']) {
    for (const page of Object.values(pages)) {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page.emulateMedia({ reducedMotion: motion })
      await setOpen(page, [0, 1, 2, 3, 4, 5])
    }
    for (const name of ['contact', 'answerLink1', 'invitationAction']) {
      const values = {}
      for (const [kind, page] of Object.entries(pages)) {
        await settle(page)
        const selector = qSelector(kind, name)
        await page.locator(selector).hover()
        await page.waitForFunction(({ selector, button }) => {
          const element = document.querySelector(selector), css = getComputedStyle(element)
          if (!element.matches(':hover')) return false
          if (button) return css.backgroundColor === 'rgb(11, 88, 72)' && css.boxShadow === 'rgba(37, 53, 38, 0.08) 0px 4px 12px 0px'
          const arrow = element.querySelector('svg')
          return css.textDecorationLine.includes('underline') && Math.abs(new DOMMatrixReadOnly(getComputedStyle(arrow).transform).m41 - 3) < 0.001
        }, { selector, button: name === 'invitationAction' }, { timeout: 5000 })
        // Focus is independently checked above. Remove stale focus by blurring
        // before measuring the actual pointer state on both implementations.
        await page.evaluate(() => document.activeElement?.blur())
        await settle(page)
        values[kind] = await focusState(page, selector)
        check(values[kind].hovered, kind + ' hover did not activate ' + name + ' ' + motion)
      }
      check(JSON.stringify(values.published) === JSON.stringify(values.source), 'Hover differs ' + name + ' ' + motion)
      report.states.push({ state: 'hover', name, motion, ...values })
    }
    const disclosureMotion = {}
    for (const [kind, page] of Object.entries(pages)) {
      await setOpen(page, [])
      await page.locator(summary(0)).click()
      await page.waitForTimeout(250)
      disclosureMotion[kind] = await page.locator(summary(0) + ' svg').evaluate(icon => ({
        transform: getComputedStyle(icon).transform,
        transitionDuration: getComputedStyle(icon).transitionDuration,
        open: icon.closest('details').open,
      }))
      check(disclosureMotion[kind].open && disclosureMotion[kind].transform.startsWith('matrix(0.707107'), kind + ' native open indicator ' + motion)
      if (motion === 'reduce') check(parseFloat(disclosureMotion[kind].transitionDuration) <= 0.00001, kind + ' FAQ indicator reduced motion')
    }
    check(disclosureMotion.published.transform === disclosureMotion.source.transform, 'Disclosure open indicator differs ' + motion)
    report.states.push({ state: 'native disclosure indicator and motion preference', motion, ...disclosureMotion })
  }

  const touch = await browser.newContext({ viewport: { width: 390, height: 568 }, deviceScaleFactor: 1, hasTouch: true, reducedMotion: 'reduce' })
  for (const kind of ['published', 'source']) {
    const page = await touch.newPage()
    page.on('pageerror', error => problems.push(kind + ' touch runtime error ' + error.message))
    await ready(page, kind)
    await page.locator(summary(0)).tap()
    await page.locator(summary(1)).tap()
    const twoOpen = await openIndexes(page)
    await page.locator(summary(0)).tap()
    const oneOpen = await openIndexes(page)
    check(JSON.stringify(twoOpen) === '[0,1]' && JSON.stringify(oneOpen) === '[1]', kind + ' native independent touch disclosures')
    const activations = []
    for (const name of ['answerLink1', 'invitationAction']) {
      const target = page.locator(qSelector(kind, name))
      await target.evaluate(element => element.addEventListener('click', event => {
        event.preventDefault()
        element.dataset.qaTouchActivation = JSON.stringify({ pointer: event.pointerType, trusted: event.isTrusted })
      }, { once: true }))
      await target.tap()
      const value = await target.evaluate((element, { origin, kind }) => ({
        rawHref: element.getAttribute('href'),
        destination: kind === 'source' ? element.href : new URL(element.getAttribute('href'), origin).href,
        activation: JSON.parse(element.dataset.qaTouchActivation || 'null'),
      }), { origin: publishedOrigin, kind })
      check(value.activation?.pointer === 'touch' && value.activation?.trusted === true, kind + ' emulated touch link activation ' + name)
      activations.push({ name, ...value })
    }
    report.states.push({ state: 'emulated native touch and links with navigation prevented', kind, width: 390, height: 568, twoOpen, oneOpen, activations })
    await page.close()
  }
  await touch.close()

  for (const viewport of [{ width: 390, height: 320 }, { width: 1440, height: 400 }]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize(viewport)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await setOpen(page, [0, 1, 2, 3, 4, 5])
      const access = []
      for (const selector of [summary(0), summary(5), qSelector(kind, 'answerLink5'), qSelector(kind, 'invitationAction')]) {
        await page.locator(selector).evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
        await settle(page)
        const value = await page.locator(selector).evaluate(element => {
          const box = element.getBoundingClientRect(), header = document.querySelector('.site-header, .sl-header')?.getBoundingClientRect()
          return { top: box.top, bottom: box.bottom, headerBottom: header?.bottom ?? 0, centreAccessible: (box.top + box.bottom) / 2 > (header?.bottom ?? 0) && (box.top + box.bottom) / 2 < innerHeight }
        })
        check(value.centreAccessible, kind + ' short screen target is inaccessible ' + selector)
        access.push({ selector, ...value })
      }
      await page.screenshot({ path: path.join(folder, 'questions-short-screen-' + kind + '-' + viewport.width + 'x' + viewport.height + '.png'), animations: 'disabled' })
      values[kind] = { access, measurement: await snapshot(page, groupsFor(kind).questions) }
    }
    const differences = compareSnapshots(values.published.measurement, values.source.measurement, 'questions short screen ' + viewport.width)
    report.states.push({ state: 'short screen expanded layout and scroll reachability', ...viewport, ...values, differences })
  }

  const enlargement = {}
  for (const [kind, page] of Object.entries(pages)) {
    await page.setViewportSize({ width: 320, height: 568 })
    await ready(page, kind)
    await setOpen(page, [0, 1, 2, 3, 4, 5])
    const band = groupsFor(kind).reassurance.selector
    const targets = band + ' > div > div > span:last-child, #questions h2, #questions p, #questions a, #questions summary'
    const readinessTargets = targets + ', #questions h2 em, #questions summary > span'
    const expectedTextMetrics = await page.evaluate(({ targets, readinessTargets }) => {
      document.activeElement?.blur()
      const expected = [...document.querySelectorAll(readinessTargets)].map(element => {
        const css = getComputedStyle(element)
        return { tag: element.tagName, fontSize: parseFloat(css.fontSize) * 2, lineHeight: Number.isFinite(parseFloat(css.lineHeight)) ? parseFloat(css.lineHeight) * 2 : null }
      })
      const sizes = [...document.querySelectorAll(targets)].map(element => [element, parseFloat(getComputedStyle(element).fontSize) * 2])
      for (const [element, size] of sizes) element.style.fontSize = size + 'px'
      return expected
    }, { targets, readinessTargets })
    await page.waitForFunction(({ selector, expected }) => {
      const elements = [...document.querySelectorAll(selector)]
      return elements.length === expected.length && elements.every((element, index) => {
        const css = getComputedStyle(element), target = expected[index]
        return Math.abs(parseFloat(css.fontSize) - target.fontSize) < 0.01 && (target.lineHeight === null || Math.abs(parseFloat(css.lineHeight) - target.lineHeight) < 0.01)
      })
    }, { selector: readinessTargets, expected: expectedTextMetrics }, { timeout: 5000 })
    await settle(page)
    const actualTextMetrics = await page.locator(readinessTargets).evaluateAll(elements => elements.map(element => {
      const css = getComputedStyle(element)
      return { tag: element.tagName, fontSize: parseFloat(css.fontSize), lineHeight: Number.isFinite(parseFloat(css.lineHeight)) ? parseFloat(css.lineHeight) : null }
    }))
    const quality = await page.evaluate(band => {
      const result = { documentOverflow: document.documentElement.scrollWidth > innerWidth + 1, clippedText: [], textOutsideViewport: [] }
      for (const selector of [band, '#questions']) {
        const root = document.querySelector(selector), walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          const node = walker.currentNode
          if (!node.textContent.trim() || node.parentElement.closest('svg') || !node.parentElement.checkVisibility()) continue
          const range = document.createRange(); range.selectNodeContents(node)
          const lines = [...range.getClientRects()], clips = []
          for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            const css = getComputedStyle(parent), box = parent.getBoundingClientRect()
            if (['hidden', 'clip'].includes(css.overflowX)) clips.push({ left: box.left + parent.clientLeft, right: box.left + parent.clientLeft + parent.clientWidth })
          }
          const data = { group: selector === '#questions' ? 'questions' : 'reassurance', tag: node.parentElement.tagName, text: node.textContent.replace(/\s+/g, ' ').trim() }
          const clippedLines = lines.filter(box => clips.some(clip => box.left < clip.left - 1 || box.right > clip.right + 1)).length
          const outsideLines = lines.filter(box => box.left < -1 || box.right > innerWidth + 1).length
          if (clippedLines) result.clippedText.push({ ...data, clippedLines })
          if (outsideLines) result.textOutsideViewport.push({ ...data, outsideLines })
        }
      }
      return result
    }, band)
    enlargement[kind] = quality
    report.states.push({ state: 'targeted 200 percent section text enlargement', kind, width: 320, height: 568, expectedTextMetrics, actualTextMetrics, ...quality })
  }
  check(JSON.stringify(enlargement.published) === JSON.stringify(enlargement.source), 'Enlargement clipping or viewport overflow differs from baseline')
  for (const name of ['reassurance', 'questions']) {
    const result = await comparison(name, 'text-enlargement-320', { allowQualityOverflow: true })
    report.states.push({ state: 'targeted enlargement rendered comparison', group: name, ...result })
  }
  if (enlargement.published.documentOverflow || enlargement.published.clippedText.length || enlargement.published.textOutsideViewport.length) report.qualityFindings.push({
    id: 'group2-enlarged-text-320',
    status: 'Inherited baseline limitation. Remains open for Package 4 and a proposed visible refinement.',
    detail: 'Targeted doubled section text at 320px must be assessed for readability, not document width alone. Matching the baseline is not an enlargement quality pass.',
    ...enlargement,
  })
} catch (error) {
  problems.push(String(error.stack || error))
} finally {
  await browser.close()
  report.completedAt = new Date().toISOString()
  report.completeWidthSet = JSON.stringify(report.widths.map(row => row.width)) === JSON.stringify(requiredWidths)
  report.enlargementMeasurementsComplete = report.states.filter(state => state.state === 'targeted 200 percent section text enlargement').length === 2
  await fs.writeFile(path.join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const cards = report.widths.map(row => '<section><h2>' + row.width + 'px</h2>' + [
    ['Reassurance band', 'reassurance-comparison-closed-' + row.width + '.png'],
    ['Closed FAQs and final invitation', 'questions-comparison-closed-' + row.width + '.png'],
    ['All six answers expanded with final invitation', 'questions-comparison-all-open-' + row.width + '.png'],
    ...([390, 1440].includes(row.width) ? Array.from({ length: 6 }, (_, index) => ['Answer ' + (index + 1) + ' expanded', 'questions-comparison-open-' + index + '-' + row.width + '.png']) : []),
  ].map(([title, filename]) => '<h3>' + title + '</h3><a href="' + filename + '"><img loading="lazy" src="' + filename + '" alt="Published and React ' + title + ' at ' + row.width + ' pixels"></a>').join('') + '</section>').join('')
  const status = '<h2>Recorded result</h2><p>' + report.widths.length + ' of ' + requiredWidths.length + ' widths completed. ' + report.widths.reduce((total, row) => total + row.individualExpanded.length, 0) + ' individual expanded comparisons. ' + report.states.length + ' state records. ' + problems.length + ' problems.</p><p>' + (problems.length ? 'This run failed or was interrupted. Read the report before using the captured evidence.' : report.completeWidthSet ? 'The complete width matrix finished with no recorded parity problems.' : 'This is a focused or incomplete width run. It does not establish the complete matrix.') + '</p>'
  const quality = !report.enlargementMeasurementsComplete ? '<p>The two enlargement measurements did not both complete. No enlargement conclusion is available from this run.</p>' : report.qualityFindings.length ? '<h2>Open quality findings</h2><p>Targeted enlarged text retains a baseline limitation. Read the JSON record and inspect the enlargement images before treating parity as quality acceptance.</p>' : '<p>Both targeted enlargement measurements completed without a clipping or document overflow finding in this run.</p>'
  const enlargedCaptures = report.states.filter(state => state.state === 'targeted enlargement rendered comparison').map(state => state.group)
  const extras = enlargedCaptures.length ? '<section><h2>Targeted enlarged text</h2>' + enlargedCaptures.map(name => '<h3>' + name + '</h3><a href="' + name + '-comparison-text-enlargement-320.png"><img loading="lazy" src="' + name + '-comparison-text-enlargement-320.png" alt="Targeted doubled text at 320 pixels"></a>').join('') + '</section>' : ''
  await fs.writeFile(path.join(folder, 'review.html'), '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StoriLeaf Group 2 comparisons</title><style>body{max-width:1500px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;background:#f9f8f6;color:#253526}img{width:100%;height:auto;border:1px solid #ddd}section{margin-top:56px}h1,h2,h3{line-height:1.2}</style><h1>StoriLeaf Group 2 rendered comparisons</h1><p>Published sections on the left. React sections on the right. Open each image for its original resolution. The JSON report records measured differences, screenshots and the exact test scope.</p><p>Source migration evidence only. The React homepage remains incomplete and unpublished. The reassurance band is staged before the migrated sections until the hero and books are available.</p>' + status + quality + '<p><a href="report.json">Open the test report</a></p>' + cards + extras + '</html>')
}
console.log(JSON.stringify({ completeWidthSet: report.completeWidthSet, browser: report.browser, testedWidths: report.widths.map(row => row.width), individualExpandedComparisons: report.widths.reduce((total, row) => total + row.individualExpanded.length, 0), states: report.states.length, qualityFindings: report.qualityFindings.length, problems }))
if (problems.length) process.exitCode = 1
