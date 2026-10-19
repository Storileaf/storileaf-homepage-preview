import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import http from 'node:http'

// Read-only review. Never builds or writes into the published repository root.
const root = path.resolve('..')
const baseline = '1433a413917a63df47e05f5c2d39283689624f37'
const out = 'qa/shape-foundation'
const problems = []
const report = { baseline, scope: 'Public preview and isolated source only', staticReferences: [], browser: [], problems }
const check = (ok, message) => { if (!ok) problems.push(message) }
const vendorPattern = /macaly|qcx8qibycrjhsu3gv7vr1spg/i
await fs.mkdir(out, { recursive: true })

const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const runtimeFiles = files.filter(f => /^(index\.html|404\.html|assets\/|pricing\/|frontend\/src\/|frontend\/index\.html|frontend\/package(?:-lock)?\.json|frontend\/vite\.config\.ts)/.test(f) && /\.(html|css|js|mjs|ts|tsx|json)$/.test(f))
report.scannedFiles = runtimeFiles.length
for (const file of runtimeFiles) {
  const text = await fs.readFile(path.join(root, file), 'utf8')
  const at = text.search(vendorPattern)
  if (at >= 0) report.staticReferences.push({ file, excerpt: text.slice(Math.max(0, at - 100), at + 180) })
}

// Assert that the stylesheet edit contains only the reviewed radius substitutions.
const original = execFileSync('git', ['show', baseline + ':frontend/src/styles/components.css'], { cwd: root, encoding: 'utf8' })
const roleTokens = [
  ['.sl-action--gold', 'var(--sl-radius-newsletter-control)', 'var(--sl-radius-gold-action)'],
  ['.sl-resource-card', '17px', 'var(--sl-radius-card-compact)'],
  ['.sl-newsletter-controls input', '9px', 'var(--sl-radius-newsletter-control)'],
  ['.sl-newsletter-subscribe', '9px', 'var(--sl-radius-newsletter-control)'],
  ['.sl-footer-currency', '5px', 'var(--sl-radius-utility-control)'],
  ['.sl-header', '18px', 'var(--sl-radius-header)'],
  ['.sl-header', '13px', 'var(--sl-radius-header-compact)'],
  ['.sl-header-popup', '17px', 'var(--sl-radius-menu)'],
  ['.sl-header-popup a', '8px', 'var(--sl-radius-inset-control)'],
  ['.sl-header-actions .sl-header-primary', '8px', 'var(--sl-radius-header-action)'],
  ['.sl-header-mobile-trigger', '8px', 'var(--sl-radius-inset-control)'],
  ['.sl-mobile-nav-top button', '9px', 'var(--sl-radius-dialog-close)']
]
let expected = original
for (const [selector, oldValue, token] of roleTokens) {
  let replacements = 0
  expected = expected.split('\n').map(line => {
    if (line.trimStart().startsWith(selector + ' {') && line.includes('border-radius:' + oldValue + ';')) {
      replacements++
      return line.replace('border-radius:' + oldValue + ';', 'border-radius:' + token + ';')
    }
    return line
  }).join('\n')
  check(replacements === 1, 'Expected exactly one reviewed radius substitution for ' + selector + ' ' + oldValue)
}
check(expected === await fs.readFile('src/styles/components.css', 'utf8'), 'Unexpected non-radius stylesheet changes against the reviewed baseline')

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' }
const tracked = new Set(files)
const server = http.createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/storileaf-homepage-preview\/?/, '').replace(/^\/+/, '')
    if (!rel) rel = 'index.html'
    if (!tracked.has(rel) && tracked.has(rel.replace(/\/$/, '') + '/index.html')) rel = rel.replace(/\/$/, '') + '/index.html'
    if (!tracked.has(rel)) { res.writeHead(404); res.end('Not found'); return }
    res.writeHead(200, { 'Content-Type': mime[path.extname(rel)] || 'application/octet-stream' })
    res.end(await fs.readFile(path.join(root, rel)))
  } catch { res.writeHead(500); res.end('Read failed') }
})
await new Promise(resolve => server.listen(4181, '127.0.0.1', resolve))
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const widths = [320, 360, 390, 430, 768, 820, 1024, 1280, 1440]
const sourceSelectors = ['.sl-header', '.sl-header-primary', '.sl-newsletter-controls input', '.sl-newsletter-subscribe', '.sl-resource-card', '.sl-footer-currency']
const measure = async (page, selectors) => page.evaluate(list => Object.fromEntries(list.map(selector => {
  const el = document.querySelector(selector)
  if (!el) return [selector, null]
  const s = getComputedStyle(el), r = el.getBoundingClientRect()
  return [selector, { radius: s.borderTopLeftRadius, width: r.width, height: r.height, fontSize: s.fontSize, lineHeight: s.lineHeight, display: s.display, background: s.backgroundColor, colour: s.color }]
})), selectors)

try {
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
    const targets = kind === 'source' ? sourceSelectors : ['.site-header', '.header-find-book', '.hero .button', '.newsletter-inline-preview input', '.newsletter-inline-preview button']
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      const measured = await measure(page, targets)
      result.widths.push({ width, controls: measured })
      if (kind === 'source') {
        check(measured['.sl-header-primary']?.radius === '9px', 'Source header radius differs from 9px at ' + width)
        check(measured['.sl-newsletter-controls input']?.radius === '9px', 'Newsletter input radius differs from 9px at ' + width)
        check(measured['.sl-newsletter-subscribe']?.radius === '9px', 'Newsletter action radius differs from 9px at ' + width)
        check(measured['.sl-resource-card']?.radius === (width <= 480 ? '17px' : '20px'), 'Resource card radius changed at ' + width)
      } else {
        check(measured['.header-find-book']?.radius === '9px', 'Published header baseline is no longer 9px at ' + width)
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
      check(!overflow, kind + ' overflows at ' + width)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    if (kind === 'source') {
      const after = await measure(page, sourceSelectors)
      const priorStyle = await page.addStyleTag({ content: original })
      const before = await measure(page, sourceSelectors)
      result.sourceCorrection = { before: before['.sl-header-primary'], after: after['.sl-header-primary'] }
      for (const selector of sourceSelectors) {
        const b = { ...before[selector] }, a = { ...after[selector] }
        if (selector === '.sl-header-primary') { delete b.radius; delete a.radius }
        check(JSON.stringify(b) === JSON.stringify(a), 'Unexpected geometry or style change in ' + selector)
      }
      await priorStyle.evaluate(el => el.remove())
      const probeRadii = await page.evaluate(() => {
        const wrapper = document.createElement('div')
        wrapper.style.cssText = 'position:fixed;left:-10000px;top:0;'
        wrapper.setAttribute('aria-hidden', 'true')
        document.body.append(wrapper)
        const values = Object.fromEntries(['primary', 'outline', 'gold'].map(variant => {
          const a = document.createElement('a'); a.className = 'sl-action sl-action--' + variant; wrapper.append(a)
          return [variant, getComputedStyle(a).borderTopLeftRadius]
        }))
        wrapper.remove(); return values
      })
      result.actionRadii = probeRadii
      check(probeRadii.primary === '6px' && probeRadii.outline === '6px' && probeRadii.gold === '9px', 'Action variant radii changed')
    }
    const tabs = page.getByRole('tab')
    result.tabCount = await tabs.count()
    for (let i = 0; i < result.tabCount; i++) {
      if (await tabs.nth(i).isVisible()) { await tabs.nth(i).click(); await page.waitForTimeout(120) }
    }
    // Load lazy photography without following external links or submitting forms.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 650) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(60) }
    await page.waitForTimeout(1000)
    result.missingImages = await page.evaluate(() => [...document.images].filter(img => img.currentSrc && (!img.complete || !img.naturalWidth)).map(img => img.currentSrc))
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({ path: path.join(out, kind + '-desktop-1440.png'), fullPage: true, animations: 'disabled' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: path.join(out, kind + '-mobile-390.png'), fullPage: true, animations: 'disabled' })
    if (kind === 'source') {
      const mobileImage = await page.locator('.sl-header-primary').screenshot({ type: 'jpeg', quality: 35, animations: 'disabled' })
      console.log('SOURCE_HEADER_MOBILE_JPEG_BASE64 ' + mobileImage.toString('base64'))
      await page.setViewportSize({ width: 1440, height: 900 })
      const desktopImage = await page.locator('.sl-header-primary').screenshot({ type: 'jpeg', quality: 35, animations: 'disabled' })
      console.log('SOURCE_HEADER_DESKTOP_JPEG_BASE64 ' + desktopImage.toString('base64'))
    }
    result.requestHosts = [...hosts].sort()
    report.browser.push(result)
    check(result.runtimeErrors.length === 0, kind + ' runtime errors while vendor requests are blocked')
    await context.close()
  }
} catch (error) { problems.push('Shape/dependency audit interrupted: ' + error.message) }
finally { await browser.close(); await new Promise(resolve => server.close(resolve)) }
report.deletionAssessment = 'Evidence for public preview/source only. Not approval to delete a project, account, external domain, original files or data.'
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
console.log('SHAPE_FOUNDATION_REPORT ' + JSON.stringify(report))
if (problems.length) process.exitCode = 1
