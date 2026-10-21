import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import vm from 'node:vm'

const storageKey = 'storileaf.preview.currency'
const cataloguePath = 'assets/pricing-page-eOuxT0Kj.js'
const catalogueSha256 = '6933843cad74c1e867b84d543394c8070251ca7d6777dea894efd011963f2027'
const widths = [390, 1440]
const pricingSelector = '#pricing-currency-select'
const footerSelector = '.site-footer select[aria-label="Pricing currency"]'

async function catalogue(base) {
  const response = await fetch(new URL(cataloguePath, base))
  assert.equal(response.status, 200, 'The public pricing catalogue is available')
  const source = await response.text()
  assert.equal(createHash('sha256').update(source).digest('hex'), catalogueSha256, 'Use the unchanged public catalogue')
  const start = source.indexOf('var pricingCurrencies = ')
  const end = source.indexOf('//#endregion', start)
  assert(start >= 0 && end > start, 'Find the public data declarations')
  const context = vm.createContext({ images: Object.fromEntries(['celebration', 'founder', 'letters', 'life', 'relationship', 'travel'].map(key => [key, key])) })
  new vm.Script(source.slice(start, end) + '\nthis.extracted = JSON.stringify({ pricingCurrencies, pricePrefixes, pricingBooks });').runInContext(context, { timeout: 1000 })
  return JSON.parse(context.extracted)
}

function watchEvents(page) {
  const records = []
  let phase = 'initial'
  page.on('pageerror', error => records.push({ phase, type: 'pageerror', message: error.message }))
  page.on('console', message => {
    if (message.type() === 'error') records.push({ phase, type: 'console', message: message.text(), location: message.location() })
  })
  page.on('requestfailed', request => records.push({ phase, type: 'requestfailed', url: request.url(), resourceType: request.resourceType(), message: request.failure()?.errorText }))
  page.on('response', response => {
    if (response.status() >= 400) records.push({ phase, type: 'http', url: response.url(), status: response.status(), resourceType: response.request().resourceType() })
  })
  return { records, interactions: () => { phase = 'interaction' } }
}

function classifyErrors(records, variant, initialUrl) {
  const expectedOriginal = []
  const unexpected = []
  for (const record of records) {
    const originalInitial = variant === 'original' && record.phase === 'initial'
    const knownHydration = originalInitial && record.type === 'pageerror' && /Minified React error #418\b/.test(record.message)
    const knownResponse = originalInitial && record.type === 'http' && record.status === 404 && record.resourceType === 'document' && record.url === initialUrl
    const knownConsole = originalInitial && record.type === 'console' && /Failed to load resource.*404/.test(record.message) && record.location?.url === initialUrl
    if (knownHydration || knownResponse || knownConsole) expectedOriginal.push({ ...record, classification: knownHydration ? 'existing missing-document hydration recovery' : 'existing missing currency document' })
    else unexpected.push(record)
  }
  return { expectedOriginal, unexpected }
}

async function readView(page) {
  return page.evaluate(key => {
    const clean = value => value?.replace(/\s+/g, ' ').trim() ?? null
    const selected = document.querySelector('.pricing-book-choice[aria-pressed="true"]')
    return {
      // Slash canonicalisation is recorded separately. It differs legitimately on
      // original 404 recovery and the new exported directory document.
      relativeUrl: location.pathname.replace(/\/$/, '') + location.search + location.hash,
      currency: document.querySelector('#pricing-currency-select')?.value ?? null,
      footerCurrency: document.querySelector('.site-footer select[aria-label="Pricing currency"]')?.value ?? null,
      book: clean(document.querySelector('.pricing-active-copy h2')?.textContent),
      selectedBook: selected?.getAttribute('data-testid')?.replace('pricing-book-', '') ?? null,
      selectedCount: document.querySelectorAll('.pricing-book-choice[aria-pressed="true"]').length,
      planNames: [...document.querySelectorAll('.pricing-plan-top h3')].map(item => clean(item.textContent)),
      prices: [...document.querySelectorAll('.pricing-plan-value strong')].map(item => clean(item.textContent)),
      storedCurrency: localStorage.getItem(key)
    }
  }, storageKey)
}

async function waitForView(page, currency, slug, data) {
  const book = data.pricingBooks.find(item => item.slug === slug)
  assert(book, 'Expected book exists in the public catalogue')
  await page.waitForFunction(({ currency, slug, name }) =>
    document.querySelector('#pricing-currency-select')?.value === currency &&
    document.querySelector('.site-footer select[aria-label="Pricing currency"]')?.value === currency &&
    document.querySelector('.pricing-active-copy h2')?.textContent?.trim() === name &&
    document.querySelector('[data-testid="pricing-book-' + slug + '"]')?.getAttribute('aria-pressed') === 'true',
  { currency, slug, name: book.name })
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const view = await readView(page)
  assert.equal(view.currency, currency)
  assert.equal(view.footerCurrency, currency)
  assert.equal(view.book, book.name)
  assert.equal(view.selectedBook, slug)
  assert.equal(view.selectedCount, 1)
  assert.deepEqual(view.planNames, book.plans.map(plan => plan.name))
  assert.deepEqual(view.prices, book.plans.map(plan => data.pricePrefixes[currency] + new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-GB', { maximumFractionDigits: 0 }).format(plan.prices[currency])))
  return view
}

function assertLocation(page, base, route, keepsake) {
  const url = new URL(page.url())
  const expected = new URL(route, base)
  assert.equal(url.pathname.replace(/\/$/, ''), expected.pathname.replace(/\/$/, ''))
  assert.equal(url.search, keepsake === undefined ? '' : '?keepsake=' + keepsake)
}

async function pricingLink(locator, page, base, currency) {
  assert.equal(await locator.count(), 1, 'Exactly one applicable Pricing link')
  const href = await locator.getAttribute('href')
  assert.equal(new URL(href, page.url()).href, new URL('pricing/' + currency, base).href, 'Pricing link preserves currency and clears the book query')
  return href
}

async function journey(browser, base, variant, width, data) {
  const report = { variant, width, steps: [], events: [], problems: [] }
  const context = await browser.newContext({
    viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce',
    storageState: { cookies: [], origins: [{ origin: new URL(base).origin, localStorage: [{ name: storageKey, value: 'usd' }] }] }
  })
  context.setDefaultTimeout(15000)
  const page = await context.newPage()
  const events = watchEvents(page)
  const initialUrl = new URL('pricing/cad', base).href
  const checkpoint = async (label, currency, slug, stored, route, keepsake, extra = {}) => {
    const view = await waitForView(page, currency, slug, data)
    assert.equal(view.storedCurrency, stored, label + ': preview storage')
    assertLocation(page, base, route, keepsake)
    report.steps.push({ label, ...view, ...extra })
    return view
  }
  try {
    const response = await page.goto(initialUrl, { waitUntil: 'networkidle', timeout: 30000 })
    report.initialResponse = { requestedUrl: initialUrl, finalUrl: response.url(), status: response.status() }
    assert.equal(response.status(), variant === 'original' ? 404 : 200, 'Initial CAD response retains the original failure or serves the new document')
    await checkpoint('explicit CAD wins stored USD', 'cad', 'life-story', 'usd', 'pricing/cad')
    events.interactions()

    await page.getByTestId('pricing-book-travel-memoir').click()
    await checkpoint('book selection preserves CAD and storage', 'cad', 'travel-memoir', 'usd', 'pricing/cad', 'travel-memoir')

    const mainCurrency = page.getByRole('combobox', { name: 'View prices in', exact: true })
    assert.equal(await mainCurrency.count(), 1, 'The main currency select retains its visible accessible name')
    assert.equal(await mainCurrency.getAttribute('id'), 'pricing-currency-select')
    assert.equal(await page.getByRole('combobox', { name: 'Pricing currency', exact: true }).count(), 1, 'The footer select retains its accessible name')
    await mainCurrency.focus()
    assert(await mainCurrency.evaluate(element => document.activeElement === element), 'Main currency select receives focus')
    await mainCurrency.press('End')
    await checkpoint('keyboard currency selection preserves book and writes GBP storage', 'gbp', 'travel-memoir', 'gbp', 'pricing/gbp', 'travel-memoir')
    assert(await page.locator(pricingSelector).evaluate(element => document.activeElement === element), 'Focus stays on the currency select after keyboard selection')
    report.steps.at(-1).keyboard = { key: 'End', name: 'View prices in', focusRetained: true }

    await page.locator(footerSelector).selectOption('usd')
    await checkpoint('footer currency selection preserves book and writes USD storage', 'usd', 'travel-memoir', 'usd', 'pricing/usd', 'travel-memoir')

    await page.goBack()
    await checkpoint('back restores GBP and book without rewriting storage', 'gbp', 'travel-memoir', 'usd', 'pricing/gbp', 'travel-memoir')
    await page.goBack()
    await checkpoint('back restores CAD and book without rewriting storage', 'cad', 'travel-memoir', 'usd', 'pricing/cad', 'travel-memoir')
    await page.goForward()
    await checkpoint('forward restores GBP and book', 'gbp', 'travel-memoir', 'usd', 'pricing/gbp', 'travel-memoir')
    await page.goForward()
    await checkpoint('forward restores USD and book', 'usd', 'travel-memoir', 'usd', 'pricing/usd', 'travel-memoir')

    const desktopPricing = page.locator('.desktop-nav-root a').filter({ hasText: /^Pricing$/ })
    const desktopHref = await pricingLink(desktopPricing, page, base, 'usd')
    let navigationHref
    if (width === 390) {
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      const mobilePricing = page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).getByRole('link', { name: 'Pricing', exact: true })
      navigationHref = await pricingLink(mobilePricing, page, base, 'usd')
      await mobilePricing.click()
      await page.locator('.mobile-menu-panel').waitFor({ state: 'hidden' })
    } else {
      navigationHref = desktopHref
      await desktopPricing.click()
    }
    await checkpoint(width === 390 ? 'mobile Pricing clears query and preserves USD' : 'header Pricing clears query and preserves USD', 'usd', 'life-story', 'usd', 'pricing/usd', undefined, { desktopHref, navigationHref })

    await page.getByTestId('pricing-book-travel-memoir').click()
    await checkpoint('prepare selected book for footer link', 'usd', 'travel-memoir', 'usd', 'pricing/usd', 'travel-memoir')
    const footerPricing = page.locator('.site-footer').getByRole('link', { name: 'Pricing', exact: true })
    const footerHref = await pricingLink(footerPricing, page, base, 'usd')
    await footerPricing.click()
    await checkpoint('footer Pricing clears query and preserves USD', 'usd', 'life-story', 'usd', 'pricing/usd', undefined, { footerHref })

    await page.locator('.site-header .brand').click()
    await page.getByTestId('storileaf-home').waitFor()
    await page.waitForFunction(() => document.querySelector('.site-footer select[aria-label="Pricing currency"]')?.value === 'usd')
    const homepageHeaderHref = await pricingLink(page.locator('.desktop-nav-root a').filter({ hasText: /^Pricing$/ }), page, base, 'usd')
    const homepageFooterHref = await pricingLink(page.locator('.site-footer').getByRole('link', { name: 'Pricing', exact: true }), page, base, 'usd')
    report.steps.push({ label: 'homepage reads the stored USD preference', ...(await readView(page)), homepageHeaderHref, homepageFooterHref })
    await page.waitForLoadState('networkidle')

    const genericResponse = await page.goto(new URL('pricing/', base).href, { waitUntil: 'networkidle', timeout: 30000 })
    assert.equal(genericResponse.status(), 200, 'The unchanged generic pricing document still loads directly')
    await checkpoint('generic default remains INR with stored USD', 'inr', 'life-story', 'usd', 'pricing/')
    await page.waitForLoadState('networkidle')
  } catch (error) {
    report.problems.push({ message: error.message, stack: error.stack })
  } finally {
    report.events = events.records
    report.errorClassification = classifyErrors(report.events, variant, initialUrl)
    if (report.errorClassification.unexpected.length) report.problems.push({ message: 'Unexpected errors occurred during the journey', events: report.errorClassification.unexpected })
    await context.close()
  }
  report.passed = report.problems.length === 0
  return report
}

export async function verifyInteractions({ browser, originalBase, candidateBase }) {
  for (const base of [originalBase, candidateBase]) assert(new URL(base).pathname.endsWith('/storileaf-homepage-preview/'), 'Pass the local site base including its trailing slash')
  const data = await catalogue(originalBase)
  const report = {
    scope: 'Focused preservation of existing currency, book, storage, keyboard select and navigation behaviour',
    catalogue: { path: cataloguePath, sha256: catalogueSha256 },
    environment: { widths, height: 1000, dpr: 1, reducedMotion: 'reduce', ignoreHTTPSErrors: false, touch: false },
    limits: 'Identical Chromium journeys at two CSS viewport widths. Keyboard operation uses the native select after explicit focus. This is neither physical touch testing nor screen reader acceptance. The original direct currency 404 and hydration error 418 are retained as initial diagnostics. No selected-book initial-render repair is asserted.',
    journeys: [], comparisons: [], problems: []
  }
  for (const width of widths) {
    const original = await journey(browser, originalBase, 'original', width, data)
    const candidate = await journey(browser, candidateBase, 'candidate', width, data)
    report.journeys.push(original, candidate)
    for (const result of [original, candidate]) {
      for (const problem of result.problems) report.problems.push({ variant: result.variant, width, ...problem })
    }
    try {
      assert.deepEqual(candidate.steps, original.steps, 'The original and candidate interaction journeys retain the same URLs, views, prices, names and storage')
      assert(original.passed && candidate.passed, 'Both complete journeys must pass')
      report.comparisons.push({ width, passed: true, checkpoints: original.steps.length })
    } catch (error) {
      report.comparisons.push({ width, passed: false, originalCheckpoints: original.steps.length, candidateCheckpoints: candidate.steps.length, message: error.message })
      report.problems.push({ width, message: error.message })
    }
  }
  report.passed = report.problems.length === 0
  return report
}
