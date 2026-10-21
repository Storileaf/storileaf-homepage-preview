import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { chromium } from 'playwright-core'

const originalBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const footerProtectionBaseline = 'a9e6e6cf8ae078376837f91651a1ac9a3f1a9164'
const currencyBaseline = '27706615edc5859e535478c69247f1d8c096f554'
const currencyPaths = ['pricing/cad/index.html', 'pricing/gbp/index.html', 'pricing/inr/index.html', 'pricing/usd/index.html']
const reviewCheckpoint = '6434c11105abfd3122982cf65c227e9507dfb5ba'
const published = 'https://storileaf.github.io/storileaf-homepage-preview/'
const pricingPath = 'pricing/index.html'
const pricingUrl = published + 'pricing/'
const reviewManifestPath = 'react-review/BUILD_PROVENANCE.json'
const output = 'qa/pricing-footer-live'
const widths = [320, 390, 820, 1440]
const stale = 'Get in touch <span aria-hidden="true">↗</span>'
const corrected = 'Get in touch'
const protectedPaths = ['index.html', '404.html', 'assets/', 'covers/', 'gallery/', 'pricing/', 'favicon.svg', 'manifest.json', 'logo192.png', 'logo512.png', 'robots.txt', '.nojekyll']
const expectedSections = ['pricing-intro', 'pricing-explorer-section', 'pricing-comparison', 'pricing-book-outcome', 'pricing-faq', 'pricing-last-invitation']
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args)
const lines = bytes => bytes.toString('utf8').trim().split('\n').filter(Boolean)
const require = createRequire(import.meta.url)
const report = {
  scope: 'Live verification of the authorised P4 07 default saved pricing footer correction only',
  originalBaseline, footerProtectionBaseline, currencyBaseline, currencyPaths, reviewCheckpoint, published, pricingUrl,
  startedAt: new Date().toISOString(),
  run: { id: process.env.GITHUB_RUN_ID, attempt: process.env.GITHUB_RUN_ATTEMPT, job: process.env.GITHUB_JOB, workflow: process.env.GITHUB_WORKFLOW, repository: process.env.GITHUB_REPOSITORY, githubSha: process.env.GITHUB_SHA },
  deploymentPolling: { maximumMilliseconds: 120000, intervalMilliseconds: 5000, attempts: [] },
  repositoryProtectedFiles: [], servedProtectedFiles: [], reviewFiles: [], observations: [], screenshots: [], comparisons: [], problems: [],
  limits: 'Headless Chromium on the recorded Linux runner. Four CSS viewport widths, height 1000, DPR 1, normal text and reduced motion. Generic pricing direct entry and reload only. The four currency documents are checked only for repository and served byte identity here; currency behaviour has a separate gate. No selected book query repair, native zoom, other browser engines, physical devices, payment flow or spoken screen reader acceptance. The .nojekyll deployment marker is checked in Git, not treated as a public page. Only deployment byte readiness is polled. Behavioural checks are performed once without retries.'
}

await fs.mkdir(output, { recursive: true })
let browser

async function fetchBytes(url, timeoutMilliseconds = 30000) {
  const response = await fetch(url, {
    cache: 'no-store', redirect: 'follow',
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    signal: AbortSignal.timeout(timeoutMilliseconds)
  })
  const bytes = Buffer.from(await response.arrayBuffer())
  return { bytes, status: response.status, url: response.url, contentType: response.headers.get('content-type'), sha256: sha256(bytes) }
}

async function awaitDeployment(candidateHash, currencyDocuments) {
  const started = Date.now()
  const deadline = started + report.deploymentPolling.maximumMilliseconds
  while (Date.now() < deadline) {
    const observation = { at: new Date().toISOString() }
    try {
      const response = await fetchBytes(pricingUrl, Math.max(1, Math.min(20000, deadline - Date.now())))
      Object.assign(observation, { status: response.status, url: response.url, sha256: response.sha256, bytes: response.bytes.length })
      const outcomes = await Promise.allSettled(currencyDocuments.map(async item => {
        const currencyResponse = await fetchBytes(published + item.file, Math.max(1, Math.min(20000, deadline - Date.now())))
        return { file: item.file, status: currencyResponse.status, url: currencyResponse.url, sha256: currencyResponse.sha256, expectedSha256: item.sha256, bytes: currencyResponse.bytes.length, matches: currencyResponse.status === 200 && currencyResponse.sha256 === item.sha256 }
      }))
      observation.currencyDocuments = outcomes.map((outcome, index) => outcome.status === 'fulfilled' ? outcome.value : { file: currencyDocuments[index].file, expectedSha256: currencyDocuments[index].sha256, matches: false, error: outcome.reason?.message || String(outcome.reason) })
      observation.matchesCandidate = response.status === 200 && response.sha256 === candidateHash && observation.currencyDocuments.every(item => item.matches)
      report.deploymentPolling.attempts.push(observation)
      if (observation.matchesCandidate) {
        report.deploymentPolling.elapsedMilliseconds = Date.now() - started
        report.deploymentPolling.result = 'exact candidate and currency document responses available'
        return
      }
    } catch (error) {
      observation.error = error.message
      report.deploymentPolling.attempts.push(observation)
    }
    const remaining = deadline - Date.now()
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, Math.min(report.deploymentPolling.intervalMilliseconds, remaining)))
  }
  report.deploymentPolling.elapsedMilliseconds = Date.now() - started
  report.deploymentPolling.result = 'timed out'
  throw new Error('The exact authorised pricing responses did not become available within the deployment byte polling window')
}

async function verifyServedFiles(items, destination) {
  // Independent read requests run in small batches. Every outcome is retained.
  for (let offset = 0; offset < items.length; offset += 6) {
    const batch = items.slice(offset, offset + 6)
    const outcomes = await Promise.allSettled(batch.map(async item => {
      const response = await fetchBytes(published + item.file)
      const record = { file: item.file, status: response.status, url: response.url, sha256: response.sha256, expectedSha256: item.sha256, bytes: response.bytes.length, contentType: response.contentType }
      record.matches = response.status === 200 && response.sha256 === item.sha256
      return record
    }))
    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') destination.push(outcome.value)
      else destination.push({ file: batch[index].file, expectedSha256: batch[index].sha256, matches: false, error: outcome.reason?.message || String(outcome.reason) })
    })
  }
  assert(destination.every(item => item.matches), 'Every requested live response must match its protected bytes')
}

async function settle(page) {
  await page.locator('[data-testid="pricing-page"]').waitFor()
  return page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([
      document.fonts.load('600 15px Manrope'),
      document.fonts.load('450 64px Newsreader'),
      document.fonts.load('italic 400 64px Newsreader')
    ])
    await document.fonts.ready
    for (const image of document.images) image.loading = 'eager'
    await Promise.all([...document.images].map(image => image.decode()))
    scrollTo({ top: 0, behavior: 'instant' })
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return ['Newsreader', 'Manrope'].map(name => ({ name, loaded: [...document.fonts].some(font => font.family.includes(name) && font.status === 'loaded') }))
  })
}

async function measure(page) {
  return page.evaluate(() => {
    const box = element => {
      const bounds = element.getBoundingClientRect()
      return { x: bounds.x, y: bounds.y + scrollY, width: bounds.width, height: bounds.height }
    }
    const footer = document.querySelector('.site-footer')
    const contacts = [...document.querySelectorAll('.site-footer .footer-bottom a')].filter(element => element.textContent.trim().startsWith('Get in touch'))
    const contact = contacts[0]
    return {
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
      pageWidth: document.documentElement.scrollWidth, pageHeight: document.documentElement.scrollHeight,
      sections: [...document.querySelectorAll('main>section')].map(element => ({ className: element.className, ...box(element) })),
      header: document.querySelector('.site-header') ? box(document.querySelector('.site-header')) : null,
      footer: footer ? box(footer) : null,
      contactCount: contacts.length,
      contact: contact ? { text: contact.textContent, href: contact.getAttribute('href'), spans: contact.querySelectorAll('span').length, ...box(contact) } : null,
      footerLinks: footer ? [...footer.querySelectorAll('a')].map(element => ({ text: element.textContent, href: element.getAttribute('href') })) : [],
      currencies: [...document.querySelectorAll('select')].map(element => ({ label: element.getAttribute('aria-label'), value: element.value })),
      pricingCurrency: document.querySelector('[data-testid="pricing-currency"]')?.value,
      books: [...document.querySelectorAll('.pricing-book-choice')].map(element => ({ id: element.getAttribute('data-testid'), selected: element.getAttribute('aria-pressed') })),
      packageCount: document.querySelectorAll('.pricing-plan-card').length,
      planGrid: document.querySelector('.pricing-plan-grid') ? box(document.querySelector('.pricing-plan-grid')) : null,
      images: [...document.images].map(image => ({ src: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }))
    }
  })
}

function validate(metrics, fonts, events, width) {
  assert.equal(metrics.url, pricingUrl, 'Generic pricing address remains unchanged')
  assert.deepEqual(metrics.viewport, { width, height: 1000, dpr: 1, reducedMotion: true })
  assert.equal(metrics.pageWidth, width, 'No horizontal document overflow')
  assert.deepEqual(metrics.sections.map(section => section.className), expectedSections, 'All six pricing sections remain in order')
  assert(metrics.sections.every(section => section.width > 0 && section.height > 0))
  assert(metrics.header?.height > 0 && metrics.footer?.height > 0 && metrics.planGrid?.height > 0)
  assert.equal(metrics.contactCount, 1)
  assert.equal(metrics.contact.text, corrected)
  assert.equal(metrics.contact.href, 'https://storileaf.com/contact/')
  assert.equal(metrics.contact.spans, 0)
  assert.equal(metrics.pricingCurrency, 'inr')
  assert(metrics.currencies.length >= 2 && metrics.currencies.every(item => item.value === 'inr'))
  assert.equal(metrics.books.length, 6)
  assert.deepEqual(metrics.books.filter(book => book.selected === 'true').map(book => book.id), ['pricing-book-life-story'])
  assert.equal(metrics.packageCount, 3)
  assert(fonts.every(font => font.loaded), 'Both approved font families loaded')
  assert(metrics.images.length > 0 && metrics.images.every(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0), 'All displayed image resources decoded')
  assert.deepEqual(events.pageErrors, [], 'No page runtime errors')
  assert.deepEqual(events.consoleErrors, [], 'No browser console errors')
  assert.deepEqual(events.failedRequests, [], 'No failed network requests')
  assert.deepEqual(events.httpErrors, [], 'No HTTP error responses')
}

try {
  report.sourceCommit = git('rev-parse', 'HEAD').toString().trim()
  report.environment = {
    node: process.version, playwright: require('playwright-core/package.json').version,
    platform: os.platform(), architecture: os.arch(), kernel: os.release(),
    osRelease: await fs.readFile('/etc/os-release', 'utf8'),
    runnerImage: process.env.ImageOS, runnerImageVersion: process.env.ImageVersion,
    browserExecutable: '/usr/bin/google-chrome', headless: true,
    viewportHeight: 1000, dpr: 1, reducedMotion: 'reduce', widths
  }
  assert.equal(report.environment.playwright, '1.56.1', 'Use the pinned Playwright version')
  const original = git('show', originalBaseline + ':' + pricingPath)
  const originalText = original.toString('utf8')
  assert.equal(originalText.split(stale).length - 1, 1, 'Exactly one approved footer target')
  const candidate = Buffer.from(originalText.replace(stale, corrected))
  assert((await fs.readFile(pricingPath)).equals(candidate), 'Live verification is allowed only after the exact candidate is committed')
  assert.deepEqual(lines(git('diff', '--name-status', footerProtectionBaseline, currencyBaseline, '--', ...protectedPaths)), currencyPaths.map(file => 'A\t' + file), 'The currency baseline adds exactly four documents without changing any existing protected file')
  assert.deepEqual(lines(git('diff', '--name-only', originalBaseline, 'HEAD', '--', ...protectedPaths)), [pricingPath, ...currencyPaths].sort(), 'Only the exact footer correction and four currency documents differ from the original')
  assert.deepEqual(lines(git('diff', '--name-only', currencyBaseline, 'HEAD', '--', ...protectedPaths)), [], 'Protected files match the immutable currency baseline')
  assert.deepEqual(lines(git('diff', '--name-only', 'HEAD', '--', ...protectedPaths)), [], 'Protected working files match the checked out commit')
  assert.deepEqual(lines(git('diff', '--name-only', reviewCheckpoint, 'HEAD', '--', 'react-review/')), [], 'The separate review snapshot is unchanged')
  report.input = { originalSha256: sha256(original), candidateSha256: sha256(candidate), originalBytes: original.length, candidateBytes: candidate.length, removedBytes: original.length - candidate.length, exactSingleReplacement: true, trailingNewline: candidate.toString('utf8').endsWith('\n') }

  const protectedFiles = lines(git('ls-tree', '-r', '--name-only', currencyBaseline, '--', ...protectedPaths))
  for (const file of protectedFiles) {
    const authorisedCurrencyDocument = currencyPaths.includes(file)
    const expected = file === pricingPath ? candidate : git('show', (authorisedCurrencyDocument ? currencyBaseline : originalBaseline) + ':' + file)
    assert(expected.equals(git('show', currencyBaseline + ':' + file)), file + ' retains its expected baseline bytes')
    const bytes = await fs.readFile(file)
    assert(bytes.equals(expected), file + ' retains its expected protected bytes')
    report.repositoryProtectedFiles.push({ file, sha256: sha256(bytes), bytes: bytes.length, matches: true, authorisedCorrection: file === pricingPath, authorisedCurrencyDocument })
  }
  const manifestBytes = await fs.readFile(reviewManifestPath)
  assert(manifestBytes.equals(git('show', reviewCheckpoint + ':' + reviewManifestPath)), 'Review provenance itself is unchanged')
  const provenance = JSON.parse(manifestBytes.toString('utf8'))
  const reviewEntries = Object.entries(provenance.sha256)
  assert.equal(reviewEntries.length, 16, 'Verify every one of the 16 recorded review files')
  for (const [file, hash] of reviewEntries) {
    assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Review manifest uses bounded relative paths')
    assert.equal(sha256(await fs.readFile('react-review/' + file)), hash, 'Repository review file matches provenance ' + file)
  }
  report.reviewProvenance = { path: reviewManifestPath, sha256: sha256(manifestBytes), sourceCommit: provenance.sourceCommit, runtimeCommit: provenance.runtimeCommit, fileCount: reviewEntries.length }

  await awaitDeployment(report.input.candidateSha256, report.repositoryProtectedFiles.filter(item => item.authorisedCurrencyDocument))
  await verifyServedFiles(report.repositoryProtectedFiles.filter(item => item.file !== '.nojekyll'), report.servedProtectedFiles)
  await verifyServedFiles([
    { file: reviewManifestPath, sha256: sha256(manifestBytes) },
    ...reviewEntries.map(([file, hash]) => ({ file: 'react-review/' + file, sha256: hash }))
  ], report.reviewFiles)

  browser = await chromium.launch({ executablePath: report.environment.browserExecutable, headless: true, args: ['--no-sandbox'] })
  report.environment.browser = browser.version()
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
    try {
      const page = await context.newPage()
      let events
      page.on('pageerror', error => events?.pageErrors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') events?.consoleErrors.push(message.text()) })
      page.on('requestfailed', request => events?.failedRequests.push({ url: request.url(), resourceType: request.resourceType(), error: request.failure()?.errorText }))
      page.on('response', response => { if (response.status() >= 400) events?.httpErrors.push({ url: response.url(), status: response.status() }) })
      const records = []
      for (const action of ['direct', 'reload']) {
        events = { pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [] }
        const observation = { width, action, startedAt: new Date().toISOString(), events }
        report.observations.push(observation)
        const response = action === 'direct'
          ? await page.goto(pricingUrl, { waitUntil: 'networkidle', timeout: 60000 })
          : await page.reload({ waitUntil: 'networkidle', timeout: 60000 })
        assert(response, 'A navigation document response exists')
        observation.response = { status: response.status(), url: response.url(), sha256: sha256(await response.body()) }
        assert.equal(observation.response.status, 200)
        assert.equal(observation.response.sha256, report.input.candidateSha256, 'The browser receives the exact candidate document')
        observation.fonts = await settle(page)
        observation.metrics = await measure(page)
        const bytes = await page.locator('.site-footer').screenshot({ animations: 'disabled' })
        assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'Capture a real PNG screenshot')
        const file = `live-footer-${width}-${action}.png`
        await fs.writeFile(output + '/' + file, bytes)
        const screenshot = { file, sha256: sha256(bytes), bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
        assert(screenshot.width > 0 && screenshot.height > 0)
        report.screenshots.push(screenshot)
        observation.screenshot = file
        validate(observation.metrics, observation.fonts, events, width)
        observation.result = 'passed'
        observation.finishedAt = new Date().toISOString()
        records.push(observation.metrics)
      }
      const [direct, reload] = records
      for (const key of ['pageWidth', 'pageHeight', 'sections', 'header', 'footer', 'footerLinks', 'currencies', 'books', 'packageCount', 'planGrid']) assert.deepEqual(reload[key], direct[key], `Direct entry and reload retain ${key} at ${width}`)
      report.comparisons.push({ width, directVersusReloadGeometry: 'identical' })
    } finally {
      await context.close()
    }
  }
  report.result = 'passed'
} catch (error) {
  report.result = 'failed'
  report.problems.push(error.stack || String(error))
  process.exitCode = 1
} finally {
  if (browser) {
    try { await browser.close() } catch (error) { report.result = 'failed'; report.problems.push('Browser close failed ' + error.message); process.exitCode = 1 }
  }
  report.finishedAt = new Date().toISOString()
  await fs.writeFile(output + '/report.json', JSON.stringify(report, null, 2) + '\n')
  console.log('PRICING_FOOTER_LIVE_RESULT ' + JSON.stringify({ result: report.result, sourceCommit: report.sourceCommit, input: report.input, deploymentAttempts: report.deploymentPolling.attempts.length, protectedResponses: report.servedProtectedFiles.length, reviewResponses: report.reviewFiles.length, observations: report.observations.length, screenshots: report.screenshots.length, environment: report.environment, problems: report.problems }))
}
