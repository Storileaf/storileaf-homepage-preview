import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

// Compare real rendered sections. The static server serves the protected root;
// the source server serves frontend/dist. Neither implementation is substituted.
const urls = {
  published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/',
  source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/',
}
const requiredWidths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const widths = process.env.STORILEAF_GROUP1_WIDTHS
  ? process.env.STORILEAF_GROUP1_WIDTHS.split(',').map(Number)
  : requiredWidths
const folder = 'qa/group1'
await fs.mkdir(folder, { recursive: true })
const problems = []
const report = {
  protectedBaseline: 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b',
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  completeWidthSet: JSON.stringify(widths) === JSON.stringify(requiredWidths),
  browser: '', urls, widths: [], states: [], captureAlignments: [], qualityFindings: [], problems,
  thresholds: { geometryCssPixels: 0.15, screenshotChannelDifference: 24, screenshotChangedRatio: 0.01 },
  equivalentRepresentations: [
    'Loaded primary font families must match; unused fallback family lists may differ.',
    'A zero width border may use solid or none. Visible borders remain compared.',
    'Gifting uses the same warm paper underlay explicitly in React and inherited from the page in static HTML. Pixel comparisons verify the composite.',
  ],
  captureMethod: 'Real pages measured after fonts and images load. Clean crops temporarily extend viewport height to contain the complete section, hide the unrelated sticky header and add less than one CSS pixel to body padding to align the section document origin to a whole pixel. Both capture adjustments assert unchanged section geometry. This avoids clipped browser painting and raster differences caused by different preceding content in the incomplete React page. Context captures retain the original viewport, page position and header. No target section styles, assets or responses are substituted.',
  limits: 'Chromium automation, emulated touch and targeted text enlargement. Not native browser zoom, physical device or cross browser certification.',
}
const check = (ok, message) => { if (!ok) problems.push(message) }
const hash = value => createHash('sha256').update(value).digest('hex')
report.publishedFiles = {
  htmlSha256: hash(await fs.readFile('../index.html')),
  cssSha256: hash(await fs.readFile('../assets/index-DhPZyX4z.css')),
}
report.sourceFiles = Object.fromEntries(await Promise.all([
  'src/App.tsx', 'src/sections/GiftingSection.tsx', 'src/sections/ResourcesSection.tsx',
  'src/sections/homepageEditorialContent.ts', 'src/styles/homepage-editorial.css',
  'src/components/ResourceCategoryCard.tsx', 'content/ledger.json', 'content/images.json',
].map(async file => [file, hash(await fs.readFile(file))])))
const styles = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
  'color', 'backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderTopStyle',
  'borderTopColor', 'borderRadius', 'boxShadow', 'textAlign', 'textWrap',
  'objectFit', 'objectPosition', 'transform', 'opacity',
]
const groups = {
  gifting: {
    selector: '#gifting',
    nodes: [
      ['section', ':scope'], ['container', ':scope > div'],
      ['panel', ':scope > div > div'], ['copy', 'h2', 0, true],
      ['heading', 'h2'], ['emphasis', 'h2 em'], ['paragraph', 'p'],
      ['action', 'a'], ['arrow', 'a svg'], ['image', 'img'],
      ['imageFrame', 'img', 0, true],
    ],
  },
  resources: {
    selector: '#resources',
    nodes: [
      ['section', ':scope'], ['container', ':scope > div'],
      ['headingGroup', 'h2', 0, true], ['heading', 'h2'],
      ['emphasis', 'h2 em'], ['introduction', 'p', 0],
      ['firstCard', 'article', 0], ['secondCard', 'article', 1],
      ['firstImage', 'article img', 0], ['secondImage', 'article img', 1],
      ['firstImageFrame', 'article img', 0, true], ['secondImageFrame', 'article img', 1, true],
      ['firstTitle', 'article h3', 0], ['secondTitle', 'article h3', 1],
      ['firstParagraph', 'article p', 0], ['secondParagraph', 'article p', 1],
      ['firstAction', 'article span', 0], ['secondAction', 'article span', 1],
      ['blogLink', 'article a'], ['overview', ':scope > div > div:last-child'],
    ],
  },
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
report.browser = browser.version()
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce',
})
const pages = { published: await context.newPage(), source: await context.newPage() }
for (const [kind, page] of Object.entries(pages)) {
  page.on('pageerror', error => problems.push(kind + ' runtime error ' + error.message))
}
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
  await within(page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))), 'Foreground frame settling')
}
async function ready(page, kind) {
  await page.bringToFront()
  await page.goto(urls[kind], { waitUntil: 'domcontentloaded' })
  await page.locator('#resources article').last().waitFor()
  const fontResult = await within(page.evaluate(async () => {
    await Promise.all([document.fonts.load('450 40px Newsreader'), document.fonts.load('400 15px Manrope')])
    await document.fonts.ready
    return [...document.fonts].filter(face => face.status === 'loaded').map(face => face.family)
  }), kind + ' actual font readiness', 45000)
  if (!fontResult.some(font => font.includes('Newsreader')) || !fontResult.some(font => font.includes('Manrope'))) {
    throw new Error(kind + ' did not load the actual Newsreader and Manrope fonts')
  }
  for (const name of Object.keys(groups)) {
    const photos = page.locator(groups[name].selector + ' img')
    for (let i = 0; i < await photos.count(); i++) await photos.nth(i).scrollIntoViewIfNeeded()
    await within(photos.evaluateAll(async images => {
      await Promise.all(images.map(image => image.decode()))
      if (images.some(image => !image.complete || !image.naturalWidth)) throw new Error('Missing section image')
    }), kind + ' ' + name + ' image decoding', 45000)
  }
  await page.mouse.move(0, 0)
  await settle(page)
}
async function snapshot(page, group) {
  return page.locator(group.selector).evaluate((root, options) => {
    const box = root.getBoundingClientRect()
    const number = value => Math.round(value * 1000) / 1000
    const normal = value => value.replace(/\s+/g, ' ').trim()
    const nodes = {}
    for (const [name, selector, index = 0, parent = false] of options.nodes) {
      let element = selector === ':scope' ? root : root.querySelectorAll(selector)[index]
      if (parent) element = element?.parentElement
      if (!element) { nodes[name] = null; continue }
      const bounds = element.getBoundingClientRect(), css = getComputedStyle(element)
      const attributes = {}
      const attributeNames = element.tagName === 'IMG'
        ? ['src', 'alt', 'width', 'height', 'loading', 'decoding']
        : ['href', 'viewBox', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin']
      for (const attribute of attributeNames) {
        if (element.hasAttribute(attribute)) attributes[attribute] = element.getAttribute(attribute)
      }
      // Block wrappers can concatenate text nodes differently without changing
      // copy. Compare the complete rendered leaf wording and link wording.
      const text = element.matches('h2, h3, p, span, svg')
        ? normal(element.textContent || '') : null
      nodes[name] = {
        text,
        geometry: { x: number(bounds.x - box.x), y: number(bounds.y - box.y), width: number(bounds.width), height: number(bounds.height) },
        style: Object.fromEntries(options.styles.map(property => [property, css[property]])),
        attributes,
      }
    }
    return {
      nodes, documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      images: [...root.querySelectorAll('img')].map(image => ({
        src: image.currentSrc, loaded: image.complete && image.naturalWidth > 0,
        naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
      })),
      icons: [...root.querySelectorAll('svg')].map(icon => {
        const css = getComputedStyle(icon)
        return {
          viewBox: icon.getAttribute('viewBox'),
          paths: [...icon.querySelectorAll('path')].map(segment => segment.getAttribute('d')),
          strokeWidth: css.strokeWidth, linecap: css.strokeLinecap, linejoin: css.strokeLinejoin,
          width: css.width, height: css.height, fill: css.fill, stroke: css.stroke,
        }
      }),
      links: [...root.querySelectorAll('a')].map(link => ({ text: normal(link.textContent), href: link.getAttribute('href') })),
    }
  }, { nodes: group.nodes, styles })
}
function compareSnapshots(before, after, label) {
  const differences = []
  for (const name of Object.keys(before.nodes)) {
    const b = before.nodes[name], a = after.nodes[name]
    if (!b || !a) { differences.push(name + ' missing'); continue }
    for (const key of ['text', 'attributes', 'style']) {
      if (key === 'style') {
        for (const property of styles) if (b.style[property] !== a.style[property]) {
          // Canonical source fallback fonts do not affect loaded Manrope.
          if (property === 'fontFamily' && b.style[property].split(',')[0] === a.style[property].split(',')[0]) continue
          // Tailwind's zero-width solid reset and a zero-width absent border
          // render identically. A visible border remains fully compared.
          if (property === 'borderTopStyle' && b.style.borderTopWidth === '0px' && a.style.borderTopWidth === '0px') continue
          // The static gradient composites over the warm paper page. The
          // isolated React section declares that same underlay explicitly.
          if (label.startsWith('gifting ') && name === 'section' && property === 'backgroundColor'
            && b.style[property] === 'rgba(0, 0, 0, 0)' && a.style[property] === 'rgb(250, 249, 247)') continue
          differences.push(name + ' ' + property + ' ' + b.style[property] + ' -> ' + a.style[property])
        }
      } else if (JSON.stringify(b[key]) !== JSON.stringify(a[key])) differences.push(name + ' ' + key + ' differs')
    }
    for (const property of Object.keys(b.geometry)) if (Math.abs(b.geometry[property] - a.geometry[property]) > 0.15) {
      differences.push(name + ' ' + property + ' ' + b.geometry[property] + ' -> ' + a.geometry[property])
    }
  }
  if (JSON.stringify(before.links) !== JSON.stringify(after.links)) differences.push('Navigation links differ')
  if (JSON.stringify(before.images) !== JSON.stringify(after.images)) differences.push('Loaded images differ')
  if (JSON.stringify(before.icons) !== JSON.stringify(after.icons)) differences.push('Arrow paths or rendered icon styles differ')
  check(!before.documentOverflow && !after.documentOverflow, label + ' document overflow')
  check(differences.length === 0, label + ' rendered measurements differ: ' + differences.slice(0, 12).join('; '))
  return differences
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
async function stateMeasurement(page, group, selector) {
  return page.locator(group.selector + ' ' + selector).first().evaluate((element, section) => {
    const css = getComputedStyle(element)
    const image = section === '#gifting' ? element.closest(section).querySelector('img') : element.querySelector('img')
    const arrow = element.querySelector('svg')
    return {
      background: css.backgroundColor, color: css.color, radius: css.borderRadius,
      outline: css.outlineWidth, outlineOffset: css.outlineOffset, outlineColor: css.outlineColor,
      focused: element.matches(':focus-visible'), hovered: element.matches(':hover'),
      imageTransform: image ? getComputedStyle(image).transform : null,
      arrowTransform: arrow ? getComputedStyle(arrow).transform : null,
    }
  }, group.selector)
}

try {
  await ready(pages.published, 'published')
  await ready(pages.source, 'source')
  for (const width of widths) {
    const row = { width, sections: {} }
    for (const page of Object.values(pages)) {
      await page.setViewportSize({ width, height: 1000 })
      await page.mouse.move(0, 0)
      await page.evaluate(() => document.activeElement?.blur())
      await settle(page)
    }
    for (const [name, group] of Object.entries(groups)) {
      const b = await snapshot(pages.published, group), a = await snapshot(pages.source, group)
      const differences = compareSnapshots(b, a, name + ' ' + width)
      const left = await capture(pages.published, group, name + '-published-' + width + '.png')
      const right = await capture(pages.source, group, name + '-react-' + width + '.png')
      const pixels = await pixelComparison(left, right, name + '-comparison-' + width + '.png')
      // Measurements catch layout drift. Pixel comparison additionally catches
      // image, colour and decorative differences, allowing a small antialias fringe.
      check(pixels.changedRatio !== null && pixels.changedRatio <= 0.01, name + ' ' + width + ' screenshot difference ' + pixels.changedRatio)
      row.sections[name] = { published: b, source: a, differences, pixels }
      if ([390, 1440].includes(width)) {
        for (const [kind, page] of Object.entries(pages)) {
          await page.locator(group.selector).evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 125, behavior: 'instant' }))
          await settle(page)
          await page.screenshot({ path: path.join(folder, name + '-context-' + kind + '-' + width + '.png'), animations: 'disabled' })
        }
      }
    }
    report.widths.push(row)
    console.log(JSON.stringify({ width, sections: Object.fromEntries(Object.entries(row.sections).map(([name, value]) => [name, { differences: value.differences, pixels: value.pixels.changedRatio }])) }))
  }

  // Pointer and focus comparison uses real controls and both motion preferences.
  for (const motion of ['reduce', 'no-preference']) {
    for (const page of Object.values(pages)) {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page.emulateMedia({ reducedMotion: motion })
      await settle(page)
    }
    for (const [name, selector] of [['gifting', 'a'], ['resources', 'article a']]) {
      const values = {}
      for (const [kind, page] of Object.entries(pages)) {
        await settle(page)
        const target = page.locator(groups[name].selector + ' ' + selector).first()
        await target.hover()
        await page.waitForTimeout(1400)
        values[kind] = await stateMeasurement(page, groups[name], selector)
        check(values[kind].hovered, kind + ' ' + name + ' hover did not activate with ' + motion)
      }
      check(JSON.stringify(values.published) === JSON.stringify(values.source), name + ' hover differs with ' + motion)
      report.states.push({ state: 'hover', group: name, motion, ...values })
    }
  }
  for (const width of [390, 1440]) {
    const values = {}
    for (const [kind, page] of Object.entries(pages)) {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.mouse.move(0, 0)
      await settle(page)
      await page.keyboard.press('Tab')
      await page.locator('#gifting a').focus()
      await settle(page)
      const gift = await stateMeasurement(page, groups.gifting, 'a')
      await page.keyboard.press('Tab')
      await settle(page)
      const nextIsBlog = await page.locator('#resources article a').evaluate(element => document.activeElement === element)
      const blog = await stateMeasurement(page, groups.resources, 'article a')
      const inert = await page.locator('#resources').evaluate(root =>
        root.querySelectorAll('article:first-child a, article:first-child button, article:first-child [tabindex], :scope > div > div:last-child a, :scope > div > div:last-child button, :scope > div > div:last-child [tabindex]').length === 0)
      check(gift.focused && blog.focused && nextIsBlog && inert, kind + ' keyboard order or inert labels at ' + width)
      await capture(page, groups.resources, 'resources-focus-' + kind + '-' + width + '.png')
      const activations = []
      for (const selector of ['#gifting a', '#resources article a']) {
        const target = page.locator(selector)
        await target.evaluate(element => {
          element.addEventListener('click', event => {
            event.preventDefault()
            element.dataset.qaKeyboardActivation = String(event.detail)
          }, { once: true })
        })
        await target.focus()
        await page.keyboard.press('Enter')
        const activation = await target.evaluate(element => ({ href: element.getAttribute('href'), keyboardClick: element.dataset.qaKeyboardActivation === '0' }))
        check(activation.keyboardClick, kind + ' keyboard activation failed ' + selector)
        activations.push(activation)
      }
      values[kind] = { gift, blog, nextIsBlog, inert, activations }
    }
    check(JSON.stringify(values.published) === JSON.stringify(values.source), 'Keyboard focus differs at ' + width)
    report.states.push({ state: 'keyboard', width, ...values })
  }

  // Check actual anchor offsets without changing the existing shared header routes.
  for (const width of [390, 600, 1440]) {
    for (const id of ['resources', 'resources-activity', 'gifting']) {
      const values = {}
      for (const [kind, page] of Object.entries(pages)) {
        await page.setViewportSize({ width, height: 600 })
        await settle(page)
        await page.evaluate(id => { location.hash = ''; location.hash = id }, id)
        await page.waitForFunction(id => {
          const element = document.getElementById(id), bounds = element.getBoundingClientRect()
          const documentTop = bounds.top + scrollY
          const offset = parseFloat(getComputedStyle(element).scrollMarginTop) + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
          const maximumScroll = document.documentElement.scrollHeight - innerHeight
          const expectedTop = documentTop - Math.max(0, Math.min(documentTop - offset, maximumScroll))
          return Math.abs(bounds.top - expectedTop) <= 1
        }, id, { timeout: 5000 })
        await settle(page)
        values[kind] = await page.locator('#' + id).evaluate(element => ({
          offset: getComputedStyle(element).scrollMarginTop,
          rootPadding: getComputedStyle(document.documentElement).scrollPaddingTop,
          top: Math.round(element.getBoundingClientRect().top),
          visible: element.getBoundingClientRect().top >= 0 && element.getBoundingClientRect().top < innerHeight,
        }))
        check(values[kind].visible, kind + ' anchor not visible ' + id + ' at ' + width)
      }
      check(values.published.offset === values.source.offset, 'Anchor offset differs ' + id + ' at ' + width)
      check(values.published.rootPadding === values.source.rootPadding, 'Root anchor padding differs ' + id + ' at ' + width)
      report.states.push({ state: 'anchor', id, width, ...values })
    }
  }

  const touch = await browser.newContext({ viewport: { width: 390, height: 700 }, hasTouch: true, reducedMotion: 'reduce' })
  for (const kind of ['published', 'source']) {
    const page = await touch.newPage()
    page.on('pageerror', error => problems.push(kind + ' touch runtime error ' + error.message))
    await ready(page, kind)
    const values = []
    for (const selector of ['#gifting a', '#resources article a']) {
      const target = page.locator(selector)
      await target.evaluate(element => {
        element.addEventListener('click', event => {
          event.preventDefault()
          element.dataset.qaActivation = event.pointerType || 'click'
        }, { once: true })
      })
      await target.tap()
      const value = await target.evaluate(element => ({ href: element.getAttribute('href'), activation: element.dataset.qaActivation }))
      check(value.activation === 'touch', kind + ' touch activation failed ' + selector)
      values.push(value)
    }
    report.states.push({ state: 'emulated touch activation with navigation prevented', kind, values })
    await page.close()
  }
  await touch.close()

  // Targeted enlargement is explicitly not native browser zoom. Document width
  // alone does not establish readability inside an overflow-hidden panel.
  const enlargement = {}
  for (const [kind, page] of Object.entries(pages)) {
    await page.setViewportSize({ width: 320, height: 568 })
    await ready(page, kind)
    await page.evaluate(() => {
      document.activeElement?.blur()
      const elements = [...document.querySelectorAll('#gifting h2, #gifting p, #gifting a, #resources h2, #resources h3, #resources p, #resources article span, #resources > div > div:last-child span')]
      const sizes = elements.map(element => [element, parseFloat(getComputedStyle(element).fontSize) * 2])
      for (const [element, size] of sizes) element.style.fontSize = size + 'px'
    })
    await settle(page)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    check(!overflow, kind + ' targeted 200 percent text overflow')
    const clippedText = await page.evaluate(() => {
      const clipped = []
      for (const id of ['gifting', 'resources']) {
        const root = document.getElementById(id)
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          const node = walker.currentNode
          if (!node.textContent.trim() || node.parentElement.closest('svg')) continue
          const range = document.createRange(); range.selectNodeContents(node)
          const clips = []
          for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            const css = getComputedStyle(parent), box = parent.getBoundingClientRect()
            if (['hidden', 'clip'].includes(css.overflowX)) clips.push({ left: box.left + parent.clientLeft, right: box.left + parent.clientLeft + parent.clientWidth })
          }
          const lines = [...range.getClientRects()].filter(box => clips.some(clip => box.left < clip.left - 1 || box.right > clip.right + 1)).length
          if (lines) clipped.push({ group: id, tag: node.parentElement.tagName, text: node.textContent.replace(/\s+/g, ' ').trim(), clippedLines: lines })
        }
      }
      return clipped
    })
    enlargement[kind] = clippedText
    for (const [name, group] of Object.entries(groups)) {
      await capture(page, group, name + '-text-enlargement-' + kind + '-320.png')
    }
    report.states.push({ state: 'targeted 200 percent section text enlargement', kind, width: 320, height: 568, documentOverflow: overflow, clippedText })
  }
  check(JSON.stringify(enlargement.published) === JSON.stringify(enlargement.source), 'Text enlargement clipping differs from the published baseline')
  if (enlargement.published?.length) report.qualityFindings.push({
    id: 'gifting-enlarged-text-320',
    status: 'Inherited baseline limitation. Remains open for Package 4 and a proposed visible refinement.',
    detail: 'At 320px and targeted 200 percent section text, the Gifting grid expands within its clipped panel. Matching document overflow is not an enlargement quality pass.',
    ...enlargement,
  })
} catch (error) {
  problems.push(String(error.stack || error))
} finally {
  await browser.close()
  await fs.writeFile(path.join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  const cards = report.widths.map(row => '<section><h2>' + row.width + 'px</h2>' + Object.keys(groups).map(name =>
    '<h3>' + name + '</h3><a href="' + name + '-comparison-' + row.width + '.png"><img src="' + name + '-comparison-' + row.width + '.png" alt="Published and React ' + name + ' comparison at ' + row.width + ' pixels"></a>').join('') + '</section>').join('')
  const quality = report.qualityFindings.length
    ? '<h2>Open quality finding</h2><p>At 320px with targeted doubled text, both published and React Gifting clip text inside the panel. This remains open for Package 4 and an approved visible refinement. Matching behaviour does not establish enlargement quality.</p>' : ''
  await fs.writeFile(path.join(folder, 'review.html'), '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StoriLeaf Group 1 comparisons</title><style>body{max-width:1500px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;background:#f9f8f6;color:#253526}img{width:100%;height:auto;border:1px solid #ddd}section{margin-top:56px}h1,h2,h3{line-height:1.2}</style><h1>StoriLeaf Group 1 rendered comparisons</h1><p>Published sections on the left. React sections on the right. Open each image for its original resolution. The JSON report records measured differences, screenshots and the precise test scope.</p><p>Source migration evidence only. The React homepage remains incomplete and unpublished.</p>' + quality + '<p><a href="report.json">Open the test report</a></p>' + cards + '</html>')
}
console.log(JSON.stringify({ completeWidthSet: report.completeWidthSet, browser: report.browser, testedWidths: report.widths.map(row => row.width), states: report.states.length, problems }))
if (problems.length) process.exitCode = 1
