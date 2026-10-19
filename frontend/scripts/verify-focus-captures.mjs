import { chromium } from 'playwright-core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

// Clean component captures supplement the realistic sticky-header context shots.
// No screenshot CSS hides the header, changes assets or alters the production root.
const out = 'qa/shape-foundation'
const baseline = 'a80e7dfd0b5fa18acdfabe34c54ab75492e026da'
// Preserve the historical Resource focus comparison without reapplying the
// superseded approximate header/footer CSS to their authorised Group 3 migration.
const original = execFileSync('git', ['show', baseline + ':frontend/src/styles/components.css'], { cwd: '..', encoding: 'utf8' }).split('/* Shared public site ending.')[0]
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const observations = []
await fs.mkdir(out, { recursive: true })
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    await page.goto('http://127.0.0.1:4180/', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const card = page.locator('a.sl-resource-link')
    for (const state of ['before', 'after']) {
      const priorStyle = state === 'before' ? await page.addStyleTag({ content: original }) : null
      await page.keyboard.press('Tab')
      await card.focus()
      await card.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await card.locator('img').evaluate(img => img.decode())
      const geometry = await card.evaluate(el => {
        const r = el.getBoundingClientRect(), h = document.querySelector('.sl-header').getBoundingClientRect(), s = getComputedStyle(el)
        return { top: r.top, bottom: r.bottom, headerBottom: h.bottom, viewportHeight: innerHeight, radius: s.borderTopLeftRadius, focusVisible: el.matches(':focus-visible') }
      })
      if (!geometry.focusVisible || geometry.top <= geometry.headerBottom + 5 || geometry.bottom > geometry.viewportHeight) throw new Error('Focus capture obscured or clipped at ' + width)
      if (state === 'after' && geometry.radius !== (width === 390 ? '17px' : '20px')) throw new Error('Incorrect focus radius at ' + width)
      await card.screenshot({ path: path.join(out, 'resource-focus-clean-' + state + '-' + width + '.png'), animations: 'disabled' })
      observations.push({ width, state, ...geometry })
      if (priorStyle) await priorStyle.evaluate(el => el.remove())
    }
    await page.close()
  }
  await fs.writeFile(path.join(out, 'focus-captures.json'), JSON.stringify({ baseline, observations }, null, 2) + '\n')
  console.log('Unobscured desktop and mobile focus captures passed')
} finally { await browser.close() }
