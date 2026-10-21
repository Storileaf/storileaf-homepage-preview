import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { chromium } from 'playwright-core'

// This gate runs from a full repository checkout after the authorised four
// documents and deliberate protection-baseline transition have been published.
// It never writes to GitHub and never changes the protected runtime.
const previousBaseline = 'a9e6e6cf8ae078376837f91651a1ac9a3f1a9164'
const originalHomepageBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const reviewCheckpoint = '6434c11105abfd3122982cf65c227e9507dfb5ba'
const currencyBaseline = process.env.CURRENCY_BASELINE_COMMIT
const published = 'https://storileaf.github.io/storileaf-homepage-preview/'
const reviewManifestPath = 'react-review/BUILD_PROVENANCE.json'
const output = 'qa/pricing-currency-live'
const currencies = ['inr', 'usd', 'cad', 'gbp']
const widths = [320, 390, 820, 1440]
const queryWidth = 390
const extraQuery = ['currency-check', 'retained']
const documentPaths = currencies.map(currency => `pricing/${currency}/index.html`)
const protectedPaths = ['index.html', '404.html', 'assets/', 'covers/', 'gallery/', 'pricing/', 'favicon.svg', 'manifest.json', 'logo192.png', 'logo512.png', 'robots.txt', '.nojekyll']
const expectedSections = ['pricing-intro', 'pricing-explorer-section', 'pricing-comparison', 'pricing-book-outcome', 'pricing-faq', 'pricing-last-invitation']
const prefixes = { inr: '₹', usd: 'US$', cad: 'C$', gbp: '£' }
// Preservation expectations transcribed from the unchanged public pricing
// module, whose exact protected bytes are checked below. These are not new terms.
const books = [
  { slug: 'life-story', name: 'Life Story', plans: [
    { slug: 'memories-treasure', name: 'Memories Treasure', amounts: [8700, 99, 139, 79] },
    { slug: 'legacy', name: 'Legacy', amounts: [11400, 129, 179, 99] },
    { slug: 'family-heritage', name: 'Family Heritage', amounts: [16800, 189, 259, 139] }
  ] },
  { slug: 'travel-memoir', name: 'Travel Memoir', plans: [
    { slug: 'one-trip', name: 'Single Trip', amounts: [6000, 75, 99, 59] },
    { slug: 'up-to-three-trips', name: 'Multiple Trips', amounts: [12300, 139, 189, 105] }
  ] },
  { slug: 'relationship-memoir', name: 'Relationship Memoir', plans: [
    { slug: 'story-of-us', name: 'Story of Us', amounts: [9600, 109, 149, 85] },
    { slug: 'together', name: 'Together', amounts: [14700, 165, 225, 125] },
    { slug: 'anniversary', name: 'Anniversary', amounts: [18600, 205, 279, 155] }
  ] },
  { slug: 'founders-memoir', name: 'Founder’s Memoir', plans: [
    { slug: 'founder-story', name: 'Founder Story', amounts: [12300, 139, 189, 105] },
    { slug: 'founder-interview', name: 'Founder Interview', amounts: [16800, 189, 259, 139] }
  ] },
  { slug: 'parent-to-child-letters', name: 'Parent to Child Letters', plans: [
    { slug: 'story-of-letters', name: 'Story of Letters', amounts: [8700, 119, 159, 95] }
  ] },
  { slug: 'celebrating-occasions', name: 'Celebrating Occasions', plans: [
    { slug: 'celebration-memoir', name: 'Celebration Memoir', amounts: [9600, 129, 179, 99] }
  ] }
]
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args)
const lines = bytes => bytes.toString('utf8').trim().split('\n').filter(Boolean)
const require = createRequire(import.meta.url)
const report = {
  scope: 'Live verification of the authorised P4 07 four missing currency documents only',
  previousBaseline, originalHomepageBaseline, reviewCheckpoint, currencyBaseline, published,
  startedAt: new Date().toISOString(),
  run: { id: process.env.GITHUB_RUN_ID, attempt: process.env.GITHUB_RUN_ATTEMPT, job: process.env.GITHUB_JOB, workflow: process.env.GITHUB_WORKFLOW, repository: process.env.GITHUB_REPOSITORY, githubSha: process.env.GITHUB_SHA },
  deploymentPolling: { maximumMilliseconds: 120000, intervalMilliseconds: 5000, attempts: [] },
  repositoryProtectedFiles: [], servedProtectedFiles: [], reviewFiles: [], documents: {},
  httpChains: [], defaultObservations: [], selectedBookObservations: [], screenshots: [], comparisons: [], problems: [],
  expectedCounts: { currencyDocuments: 4, httpChains: 56, defaultBrowserObservations: 32, selectedBookBrowserObservations: 48, screenshots: 8 },
  knownLimitations: [
    'A static currency document initially contains the default Life Story view. The five non-default keepsake queries still receive that saved book view before the client selects the requested book. This separate selected-book initial-render mismatch is retained, not repaired or accepted as passed.',
    'Observed React 418 hydration errors are recorded individually and tolerated only for a non-default selected-book query with independently confirmed saved-versus-requested book mismatch. Every other runtime, console, network and HTTP error fails this gate.'
  ],
  limits: 'Recorded Linux headless Chromium, real default TLS, normal text, reduced motion, DPR 1 and height 1000. Default currency direct entry/reload at 320, 390, 820 and 1440 CSS pixels; selected-book direct entry/reload at 390 pixels. HTTP checks include both slash forms and all six keepsake queries with a benign extra query. No native zoom, other browser engines, physical devices, payments, complete page accessibility acceptance or spoken screen reader testing. Only exact four-document deployment readiness is polled; behavioural observations have no retries. The .nojekyll marker is checked in Git only.'
}

await fs.mkdir(output, { recursive: true })
let browser
const candidateBytes = new Map()

function expectedPrice(plan, currency) {
  return prefixes[currency] + new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-GB', { maximumFractionDigits: 0 }).format(plan.amounts[currencies.indexOf(currency)])
}

function pricingUrl(currency, slash = true, book = null) {
  const url = new URL(`pricing/${currency}${slash ? '/' : ''}`, published)
  if (book) {
    url.searchParams.set('keepsake', book.slug)
    url.searchParams.set(...extraQuery)
  }
  return url.href
}

async function fetchBytes(url, { redirect = 'manual', timeoutMilliseconds = 30000 } = {}) {
  const response = await fetch(url, {
    cache: 'no-store', redirect,
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    signal: AbortSignal.timeout(timeoutMilliseconds)
  })
  const bytes = Buffer.from(await response.arrayBuffer())
  return { bytes, status: response.status, url: response.url, location: response.headers.get('location'), contentType: response.headers.get('content-type'), sha256: sha256(bytes) }
}

async function awaitDeployment() {
  const started = Date.now()
  const deadline = started + report.deploymentPolling.maximumMilliseconds
  while (Date.now() < deadline) {
    const attempt = { at: new Date().toISOString(), documents: [] }
    const outcomes = await Promise.allSettled(currencies.map(async currency => {
      const response = await fetchBytes(pricingUrl(currency), { timeoutMilliseconds: Math.max(1, Math.min(20000, deadline - Date.now())) })
      return { currency, status: response.status, url: response.url, sha256: response.sha256, bytes: response.bytes.length, matchesCandidate: response.status === 200 && response.sha256 === report.documents[currency].sha256 }
    }))
    outcomes.forEach((outcome, index) => attempt.documents.push(outcome.status === 'fulfilled' ? outcome.value : { currency: currencies[index], matchesCandidate: false, error: outcome.reason?.message || String(outcome.reason) }))
    report.deploymentPolling.attempts.push(attempt)
    if (attempt.documents.every(item => item.matchesCandidate)) {
      report.deploymentPolling.elapsedMilliseconds = Date.now() - started
      report.deploymentPolling.result = 'all four exact candidate responses available'
      return
    }
    const remaining = deadline - Date.now()
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, Math.min(report.deploymentPolling.intervalMilliseconds, remaining)))
  }
  report.deploymentPolling.elapsedMilliseconds = Date.now() - started
  report.deploymentPolling.result = 'timed out'
  throw new Error('The four exact authorised documents did not become available within the deployment byte polling window')
}

async function verifyServedFiles(items, destination) {
  // All independent responses are retained, including a failed request.
  for (let offset = 0; offset < items.length; offset += 6) {
    const batch = items.slice(offset, offset + 6)
    const outcomes = await Promise.allSettled(batch.map(async item => {
      // Direct file aliases may be canonicalised by the host. Currency-address
      // redirect chains are inspected separately, hop by hop, in the 56 cases.
      const response = await fetchBytes(published + item.file, { redirect: 'follow' })
      return { file: item.file, status: response.status, url: response.url, location: response.location, sha256: response.sha256, expectedSha256: item.sha256, bytes: response.bytes.length, contentType: response.contentType, matches: response.status === 200 && response.sha256 === item.sha256 }
    }))
    outcomes.forEach((outcome, index) => destination.push(outcome.status === 'fulfilled' ? outcome.value : { file: batch[index].file, expectedSha256: batch[index].sha256, matches: false, error: outcome.reason?.message || String(outcome.reason) }))
  }
  assert(destination.every(item => item.matches), 'Every requested protected live response must return HTTP 200 and match its exact expected bytes')
}

async function inspectRedirectChain(test) {
  const initial = new URL(test.url)
  const record = { ...test, startedAt: new Date().toISOString(), hops: [] }
  let current = initial
  try {
    for (let hop = 0; hop < 6; hop += 1) {
      const response = await fetchBytes(current.href)
      const step = { url: current.href, status: response.status, location: response.location, contentType: response.contentType, search: current.search, sha256: response.sha256, bytes: response.bytes.length }
      record.hops.push(step)
      assert.notEqual(response.status, 404, 'No intermediate or final homepage-fallback 404')
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        assert(response.location, 'A redirect must provide a Location header')
        const next = new URL(response.location, current)
        step.resolvedLocation = next.href
        assert.equal(next.origin, initial.origin, 'Redirect retains the GitHub Pages origin')
        assert.equal(next.pathname.replace(/\/$/, ''), initial.pathname.replace(/\/$/, ''), 'Redirect retains the requested currency address')
        assert.deepEqual([...next.searchParams], [...initial.searchParams], 'Redirect preserves the selected book and benign extra query exactly')
        assert.equal(next.hash, initial.hash)
        assert(!record.hops.some(item => item.url === next.href), 'Redirect chain cannot loop')
        current = next
        continue
      }
      assert.equal(response.status, 200, 'Currency address finishes with HTTP 200')
      assert.match(response.contentType || '', /^text\/html(?:;|$)/i)
      assert.equal(response.sha256, report.documents[test.currency].sha256, 'The response is the exact requested currency document, including on selected-book queries')
      assert.deepEqual([...current.searchParams], [...initial.searchParams])
      record.final = { url: current.href, status: response.status, sha256: response.sha256, bytes: response.bytes.length, selectedBook: current.searchParams.get('keepsake'), extraQuery: current.searchParams.get(extraQuery[0]) }
      record.result = 'passed'
      return record
    }
    throw new Error('Currency redirect chain exceeded five redirects')
  } catch (error) {
    record.result = 'failed'
    record.error = error.stack || String(error)
    return record
  } finally {
    record.finishedAt = new Date().toISOString()
  }
}

async function verifyHttpMatrix() {
  const tests = currencies.flatMap(currency => [false, true].flatMap(slash => [null, ...books].map(book => ({ currency, pathForm: slash ? 'slash' : 'no-slash', keepsake: book?.slug || null, extraQuery: book ? Object.fromEntries([extraQuery]) : null, url: pricingUrl(currency, slash, book) }))))
  assert.equal(tests.length, report.expectedCounts.httpChains)
  for (let offset = 0; offset < tests.length; offset += 8) {
    const batch = tests.slice(offset, offset + 8)
    const outcomes = await Promise.allSettled(batch.map(inspectRedirectChain))
    outcomes.forEach((outcome, index) => report.httpChains.push(outcome.status === 'fulfilled' ? outcome.value : { ...batch[index], result: 'failed', error: outcome.reason?.stack || String(outcome.reason) }))
  }
  assert(report.httpChains.every(item => item.result === 'passed'), 'All 56 recorded HTTP redirect chains pass without retries')
}

async function settle(page) {
  await page.locator('[data-testid="pricing-page"]').waitFor({ timeout: 30000 })
  // A deadline is explicit so a font, image or frame wait cannot hang the job.
  return page.evaluate(async () => {
    let timeout
    try {
      return await Promise.race([
        (async () => {
          await document.fonts.ready
          await Promise.all([document.fonts.load('600 15px Manrope'), document.fonts.load('450 64px Newsreader'), document.fonts.load('italic 400 64px Newsreader')])
          await document.fonts.ready
          for (const image of document.images) image.loading = 'eager'
          await Promise.all([...document.images].map(image => image.decode()))
          scrollTo({ top: 0, behavior: 'instant' })
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          return ['Newsreader', 'Manrope'].map(name => ({ name, loaded: [...document.fonts].some(font => font.family.includes(name) && font.status === 'loaded') }))
        })(),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Page font/image/frame settlement exceeded 30000 ms')), 30000) })
      ])
    } finally { clearTimeout(timeout) }
  })
}

async function inspectSavedView(page, bytes) {
  return page.evaluate(html => {
    // Inert DOMParser examines the actual response HTML. It does not execute
    // scripts or mistake the recovered client DOM for the saved initial view.
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const text = element => element?.textContent.trim().replace(/\s+/g, ' ') || null
    return {
      title: doc.title,
      pricingCurrency: doc.querySelector('[data-testid="pricing-currency"]')?.value,
      currencies: [...doc.querySelectorAll('select')].map(element => ({ label: element.getAttribute('aria-label'), value: element.value })),
      selectedBookIds: [...doc.querySelectorAll('.pricing-book-choice[aria-pressed="true"]')].map(element => element.getAttribute('data-testid')),
      bookTitle: text(doc.querySelector('.pricing-active-copy h2')),
      plans: [...doc.querySelectorAll('.pricing-plan-card')].map(element => ({ id: element.getAttribute('data-testid'), name: text(element.querySelector('h3')), price: text(element.querySelector('.pricing-plan-value strong')), payment: text(element.querySelector('.pricing-plan-value span')) })),
      rootPresent: Boolean(doc.querySelector('[data-testid="pricing-page"]')),
      mainSections: [...doc.querySelectorAll('main>section')].map(element => element.className)
    }
  }, bytes.toString('utf8'))
}

async function measure(page) {
  return page.evaluate(() => {
    const text = element => element?.textContent.trim().replace(/\s+/g, ' ') || null
    const box = element => { const bounds = element.getBoundingClientRect(); return { x: bounds.x, y: bounds.y + scrollY, width: bounds.width, height: bounds.height } }
    const footer = document.querySelector('.site-footer')
    const contacts = [...document.querySelectorAll('.site-footer .footer-bottom a')].filter(element => element.textContent.trim().startsWith('Get in touch'))
    const contact = contacts[0]
    return {
      url: location.href, title: document.title,
      pricingTitle: document.querySelector('#pricing-title')?.innerText.trim().replace(/\s+/g, ' '),
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
      pageWidth: document.documentElement.scrollWidth, pageHeight: document.documentElement.scrollHeight,
      sections: [...document.querySelectorAll('main>section')].map(element => ({ className: element.className, ...box(element) })),
      header: document.querySelector('.site-header') ? box(document.querySelector('.site-header')) : null,
      footer: footer ? box(footer) : null,
      contactCount: contacts.length,
      contact: contact ? { text: contact.textContent, href: contact.getAttribute('href'), spans: contact.querySelectorAll('span').length, ...box(contact) } : null,
      footerLinks: footer ? [...footer.querySelectorAll('a')].map(element => ({ text: element.textContent, href: element.getAttribute('href') })) : [],
      currencies: [...document.querySelectorAll('select')].map(element => ({ label: element.getAttribute('aria-label'), value: element.value, options: [...element.options].map(option => ({ value: option.value, text: option.textContent })) })),
      pricingCurrency: document.querySelector('[data-testid="pricing-currency"]')?.value,
      books: [...document.querySelectorAll('.pricing-book-choice')].map(element => ({ id: element.getAttribute('data-testid'), selected: element.getAttribute('aria-pressed'), label: text(element.querySelector('.pricing-book-choice-label')) })),
      bookTitle: text(document.querySelector('.pricing-active-copy h2')),
      packageCount: document.querySelectorAll('.pricing-plan-card').length,
      plans: [...document.querySelectorAll('.pricing-plan-card')].map(element => ({ id: element.getAttribute('data-testid'), name: text(element.querySelector('h3')), price: text(element.querySelector('.pricing-plan-value strong')), payment: text(element.querySelector('.pricing-plan-value span')), summary: text(element.querySelector('.pricing-plan-summary')), facts: text(element.querySelector('.pricing-plan-facts')), highlights: text(element.querySelector('.pricing-plan-highlights')), ...box(element) })),
      planGrid: document.querySelector('.pricing-plan-grid') ? box(document.querySelector('.pricing-plan-grid')) : null,
      images: [...document.images].map(image => ({ src: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }))
    }
  })
}

function validateSavedView(view, currency) {
  assert(view.rootPresent, 'Saved document contains the pricing page')
  assert.equal(view.title, `StoriLeaf | ${currency.toUpperCase()} book packages`)
  assert.equal(view.pricingCurrency, currency)
  assert(view.currencies.length >= 2 && view.currencies.every(item => item.value === currency), 'Saved currency controls agree with the address')
  assert.deepEqual(view.selectedBookIds, ['pricing-book-life-story'], 'The saved default view remains Life Story')
  assert.equal(view.bookTitle, books[0].name)
  assert.deepEqual(view.mainSections, expectedSections)
  assert.deepEqual(view.plans, books[0].plans.map(plan => ({ id: `pricing-plan-${plan.slug}`, name: plan.name, price: expectedPrice(plan, currency), payment: `${currency.toUpperCase()} · One-time payment` })))
}

function validateFinalView(metrics, fonts, currency, book, width, requestUrl) {
  const actualUrl = new URL(metrics.url)
  const expectedUrl = new URL(requestUrl)
  assert.equal(actualUrl.origin, expectedUrl.origin)
  assert.equal(actualUrl.pathname.replace(/\/$/, ''), expectedUrl.pathname.replace(/\/$/, ''), 'Client retains the requested currency address')
  assert.deepEqual([...actualUrl.searchParams], [...expectedUrl.searchParams], 'Client direct entry and reload retain the selected-book query')
  assert.equal(metrics.title, `StoriLeaf | ${currency.toUpperCase()} book packages`)
  assert.equal(metrics.pricingTitle, 'Find your book. Choose how it comes together.')
  assert.deepEqual(metrics.viewport, { width, height: 1000, dpr: 1, reducedMotion: true })
  assert.equal(metrics.pageWidth, width, 'No horizontal document overflow')
  assert.deepEqual(metrics.sections.map(section => section.className), expectedSections)
  assert(metrics.sections.every(section => section.width > 0 && section.height > 0))
  assert(metrics.header?.height > 0 && metrics.footer?.height > 0 && metrics.planGrid?.height > 0)
  assert.equal(metrics.contactCount, 1)
  assert.equal(metrics.contact.text, 'Get in touch')
  assert.equal(metrics.contact.href, 'https://storileaf.com/contact/')
  assert.equal(metrics.contact.spans, 0, 'Previously corrected footer stays corrected')
  assert.equal(metrics.pricingCurrency, currency)
  assert(metrics.currencies.length >= 2 && metrics.currencies.every(item => item.value === currency))
  for (const selector of metrics.currencies) assert.deepEqual(selector.options.map(option => option.value), currencies, 'Every currency selector retains INR, USD, CAD and GBP')
  assert.deepEqual(metrics.books.map(item => ({ id: item.id, label: item.label })), books.map(item => ({ id: `pricing-book-${item.slug}`, label: item.name })))
  assert.deepEqual(metrics.books.filter(item => item.selected === 'true').map(item => item.id), [`pricing-book-${book.slug}`])
  assert.equal(metrics.bookTitle, book.name)
  assert.equal(metrics.packageCount, book.plans.length)
  assert.deepEqual(metrics.plans.map(plan => ({ id: plan.id, name: plan.name, price: plan.price, payment: plan.payment })), book.plans.map(plan => ({ id: `pricing-plan-${plan.slug}`, name: plan.name, price: expectedPrice(plan, currency), payment: `${currency.toUpperCase()} · One-time payment` })))
  assert(fonts.every(font => font.loaded), 'Both approved font families loaded')
  assert(metrics.images.length > 0 && metrics.images.every(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0), 'All image resources decoded')
}

function classifyErrors(events, allowKnownMismatch) {
  const isKnown418 = message => /^(?:Error: )?Minified React error #418; visit https:\/\/react\.dev\/errors\/418(?:\?|[ ;])/.test(message)
  const knownPageErrors = allowKnownMismatch ? events.pageErrors.filter(isKnown418) : []
  const knownConsoleErrors = allowKnownMismatch ? events.consoleErrors.filter(isKnown418) : []
  const unexpectedPageErrors = events.pageErrors.filter(message => !allowKnownMismatch || !isKnown418(message))
  const unexpectedConsoleErrors = events.consoleErrors.filter(message => !allowKnownMismatch || !isKnown418(message))
  const classification = { knownPageErrors, knownConsoleErrors, unexpectedPageErrors, unexpectedConsoleErrors, knownInitialRenderErrorCount: knownPageErrors.length + knownConsoleErrors.length }
  assert.deepEqual(unexpectedPageErrors, [], 'No unexpected page runtime errors')
  assert.deepEqual(unexpectedConsoleErrors, [], 'No unexpected browser console errors')
  assert.deepEqual(events.failedRequests, [], 'No failed network requests')
  assert.deepEqual(events.httpErrors, [], 'No HTTP error responses')
  assert.equal(classification.knownInitialRenderErrorCount, allowKnownMismatch ? 1 : 0, 'Only the single independently recorded non-default-book hydration mismatch is retained')
  return classification
}

async function capture(page, currency, width) {
  const bytes = await page.locator('.pricing-explorer-section').screenshot({ animations: 'disabled', timeout: 30000 })
  assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'Capture a real PNG screenshot')
  const file = `live-${currency}-default-${width}.png`
  await fs.writeFile(path.join(output, file), bytes)
  const record = { file, sha256: sha256(bytes), bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), scope: 'default pricing explorer', currency, viewportWidth: width }
  assert(record.width > 0 && record.height > 0)
  report.screenshots.push(record)
  return file
}

async function observePair(currency, book, width, selectedBookQuery) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  const destination = selectedBookQuery ? report.selectedBookObservations : report.defaultObservations
  // Query browser checks enter the unslashed address, exercise the real Pages
  // redirect, and then refresh its final address. The full HTTP matrix covers both.
  const requestUrl = pricingUrl(currency, !selectedBookQuery, selectedBookQuery ? book : null)
  const records = []
  try {
    const page = await context.newPage()
    let events
    page.on('pageerror', error => events?.pageErrors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') events?.consoleErrors.push(message.text()) })
    page.on('requestfailed', request => events?.failedRequests.push({ url: request.url(), resourceType: request.resourceType(), error: request.failure()?.errorText }))
    page.on('response', response => { if (response.status() >= 400) events?.httpErrors.push({ url: response.url(), status: response.status() }) })
    for (const action of ['direct', 'reload']) {
      events = { pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [] }
      const observation = { currency, keepsake: selectedBookQuery ? book.slug : null, requestedBook: book.slug, width, action, requestUrl, startedAt: new Date().toISOString(), events }
      destination.push(observation)
      try {
        const response = action === 'direct' ? await page.goto(requestUrl, { waitUntil: 'networkidle', timeout: 60000 }) : await page.reload({ waitUntil: 'networkidle', timeout: 60000 })
        assert(response, 'A navigation document response exists')
        const bytes = await response.body()
        observation.response = { status: response.status(), url: response.url(), sha256: sha256(bytes), bytes: bytes.length }
        assert.equal(observation.response.status, 200)
        assert.equal(observation.response.sha256, report.documents[currency].sha256, 'The browser receives the exact committed currency document')
        observation.savedView = await inspectSavedView(page, bytes)
        validateSavedView(observation.savedView, currency)
        const knownMismatch = selectedBookQuery && book.slug !== 'life-story'
        observation.initialRender = {
          requestedBook: book.slug, savedBook: 'life-story', requestedCurrency: currency,
          savedCurrency: observation.savedView.pricingCurrency,
          selectedBookMatches: !knownMismatch,
          status: knownMismatch ? 'known selected-book initial-render mismatch retained; not passed or repaired' : 'saved book and currency match request'
        }
        observation.fonts = await settle(page)
        observation.metrics = await measure(page)
        if (!selectedBookQuery && action === 'direct' && [390, 1440].includes(width)) observation.screenshot = await capture(page, currency, width)
        validateFinalView(observation.metrics, observation.fonts, currency, book, width, requestUrl)
        observation.errorClassification = classifyErrors(events, knownMismatch)
        observation.finalSelectionResult = 'passed'
        observation.result = knownMismatch ? 'final currency/book/prices passed; known initial-render mismatch retained' : 'passed'
        records.push(observation.metrics)
      } catch (error) {
        observation.result = 'failed'
        observation.error = error.stack || String(error)
        throw error
      } finally { observation.finishedAt = new Date().toISOString() }
    }
    const [direct, reload] = records
    for (const key of ['title', 'pageWidth', 'pageHeight', 'sections', 'header', 'footer', 'footerLinks', 'currencies', 'books', 'bookTitle', 'packageCount', 'plans', 'planGrid']) assert.deepEqual(reload[key], direct[key], `Direct entry and reload retain ${key} for ${currency}/${book.slug} at ${width}`)
    report.comparisons.push({ currency, book: book.slug, selectedBookQuery, width, directVersusReloadGeometryAndContent: 'identical' })
  } finally { await context.close() }
}

try {
  assert.match(currencyBaseline || '', /^[a-f0-9]{40}$/, 'Set CURRENCY_BASELINE_COMMIT to the explicitly approved four-document protection baseline')
  assert.notEqual(process.env.NODE_TLS_REJECT_UNAUTHORIZED, '0', 'Node must retain real TLS certificate verification')
  report.sourceCommit = git('rev-parse', 'HEAD').toString().trim()
  git('cat-file', '-e', currencyBaseline + '^{commit}')
  const executablePath = process.env.CHROME_BIN || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome'
  report.environment = { node: process.version, playwright: require('playwright-core/package.json').version, platform: os.platform(), architecture: os.arch(), kernel: os.release(), osRelease: await fs.readFile('/etc/os-release', 'utf8'), runnerImage: process.env.ImageOS, runnerImageVersion: process.env.ImageVersion, browserExecutable: executablePath, headless: true, tls: 'default certificate verification; no ignoreHTTPSErrors or certificate bypass flags', viewportHeight: 1000, dpr: 1, reducedMotion: 'reduce', defaultWidths: widths, selectedBookWidth: queryWidth }
  assert.equal(report.environment.playwright, '1.56.1', 'Use the pinned Playwright version')
  assert.deepEqual(lines(git('diff', '--name-status', previousBaseline, 'HEAD', '--', ...protectedPaths)).sort(), documentPaths.map(file => 'A\t' + file).sort(), 'Only the four authorised currency documents are added to the previously protected runtime')
  assert.deepEqual(lines(git('diff', '--name-only', currencyBaseline, 'HEAD', '--', ...protectedPaths)), [], 'Current protected runtime matches the deliberate new baseline')
  assert.deepEqual(lines(git('diff', '--name-only', 'HEAD', '--', ...protectedPaths)), [], 'Protected working files match the checked-out commit')
  assert.deepEqual(lines(git('ls-files', '--others', '--exclude-standard', '--', ...protectedPaths)), [], 'No untracked protected runtime files')
  assert.deepEqual(lines(git('diff', '--name-only', reviewCheckpoint, 'HEAD', '--', 'react-review/')), [], 'The separate review snapshot is unchanged')
  assert((await fs.readFile('index.html')).equals(git('show', originalHomepageBaseline + ':index.html')), 'The original root homepage is still byte-for-byte protected')
  report.protectionGuard = { file: 'frontend/scripts/guard-published.mjs', sha256: sha256(await fs.readFile('frontend/scripts/guard-published.mjs')), result: execFileSync(process.execPath, ['frontend/scripts/guard-published.mjs'], { encoding: 'utf8' }).trim() }
  const protectedFiles = lines(git('ls-tree', '-r', '--name-only', 'HEAD', '--', ...protectedPaths))
  for (const file of protectedFiles) {
    const bytes = await fs.readFile(file)
    const newCurrencyDocument = documentPaths.includes(file)
    const reference = newCurrencyDocument ? currencyBaseline : previousBaseline
    assert(bytes.equals(git('show', reference + ':' + file)), file + ' retains its expected protected bytes')
    assert(bytes.equals(git('show', 'HEAD:' + file)), file + ' matches the verified checkout')
    report.repositoryProtectedFiles.push({ file, sha256: sha256(bytes), bytes: bytes.length, matches: true, reference, authorisedCurrencyDocument: newCurrencyDocument })
    if (newCurrencyDocument) {
      const currency = file.split('/')[1]
      candidateBytes.set(currency, bytes)
      report.documents[currency] = { file, sha256: sha256(bytes), bytes: bytes.length, reference }
    }
  }
  assert.equal(candidateBytes.size, 4)
  const manifestBytes = await fs.readFile(reviewManifestPath)
  assert(manifestBytes.equals(git('show', reviewCheckpoint + ':' + reviewManifestPath)), 'Review provenance itself is unchanged')
  const provenance = JSON.parse(manifestBytes.toString('utf8'))
  const reviewEntries = Object.entries(provenance.sha256)
  assert.equal(reviewEntries.length, 16, 'Verify every recorded review file')
  for (const [file, hash] of reviewEntries) {
    assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Review manifest paths are bounded')
    const bytes = await fs.readFile('react-review/' + file)
    assert.equal(sha256(bytes), hash, 'Repository review file matches provenance ' + file)
    assert(bytes.equals(git('show', reviewCheckpoint + ':react-review/' + file)), 'Review file matches its fixed checkpoint ' + file)
  }
  report.reviewProvenance = { path: reviewManifestPath, sha256: sha256(manifestBytes), sourceCommit: provenance.sourceCommit, runtimeCommit: provenance.runtimeCommit, fileCount: reviewEntries.length }

  await awaitDeployment()
  await verifyHttpMatrix()
  await verifyServedFiles(report.repositoryProtectedFiles.filter(item => item.file !== '.nojekyll'), report.servedProtectedFiles)
  await verifyServedFiles([{ file: reviewManifestPath, sha256: sha256(manifestBytes) }, ...reviewEntries.map(([file, hash]) => ({ file: 'react-review/' + file, sha256: hash }))], report.reviewFiles)
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
  report.environment.browser = browser.version()
  for (const currency of currencies) for (const width of widths) await observePair(currency, books[0], width, false)
  for (const currency of currencies) for (const book of books) await observePair(currency, book, queryWidth, true)
  assert.equal(report.defaultObservations.length, report.expectedCounts.defaultBrowserObservations)
  assert.equal(report.selectedBookObservations.length, report.expectedCounts.selectedBookBrowserObservations)
  assert.equal(report.screenshots.length, report.expectedCounts.screenshots)
  report.acceptance = {
    fourExactCurrencyDocuments: 'passed', manualHttpRedirectChains: 'passed', defaultDirectAndReload: 'passed', selectedBookFinalSelectionAndPrices: 'passed',
    selectedBookInitialRender: 'known mismatch retained for non-default books; not repaired or accepted',
    knownSelectedBookInitialRenderMismatchObservations: report.selectedBookObservations.filter(item => !item.initialRender.selectedBookMatches).length,
    observedKnownReact418Errors: report.selectedBookObservations.reduce((sum, item) => sum + item.errorClassification.knownInitialRenderErrorCount, 0),
    previousProtectedRuntimeAndFixedReview: 'unchanged in Git and live responses'
  }
  assert.equal(report.acceptance.knownSelectedBookInitialRenderMismatchObservations, 40)
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
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log('PRICING_CURRENCY_LIVE_RESULT ' + JSON.stringify({ result: report.result, sourceCommit: report.sourceCommit, currencyBaseline, documents: report.documents, deploymentAttempts: report.deploymentPolling.attempts.length, httpChains: report.httpChains.length, protectedResponses: report.servedProtectedFiles.length, reviewResponses: report.reviewFiles.length, defaultObservations: report.defaultObservations.length, selectedBookObservations: report.selectedBookObservations.length, screenshots: report.screenshots.length, acceptance: report.acceptance, environment: report.environment, problems: report.problems }))
}
