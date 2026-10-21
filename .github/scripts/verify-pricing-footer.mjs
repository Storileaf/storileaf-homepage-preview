import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'

const originalBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const htmlPath = 'pricing/index.html'
const stale = 'Get in touch <span aria-hidden="true">↗</span>'
const corrected = 'Get in touch'
const root = process.cwd()
const prefix = '/storileaf-homepage-preview/'
const published = 'https://storileaf.github.io' + prefix
const output = 'qa/pricing-footer-candidate'
const widths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const geometryTolerance = 0.15
const channelThreshold = 24
const pixelRatioLimit = 0.01
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args)
const original = git('show', originalBaseline + ':' + htmlPath)
const originalText = original.toString('utf8')
assert.equal(originalText.split(stale).length - 1, 1, 'Exactly one approved saved footer target')
const candidate = Buffer.from(originalText.replace(stale, corrected))
const repositoryBytes = await fs.readFile(htmlPath)
assert(repositoryBytes.equals(original) || repositoryBytes.equals(candidate), 'Reject an unrelated pricing change')
const deployedCandidate = repositoryBytes.equals(candidate)
const report = {
  scope: 'P4 07 default saved pricing footer only',
  originalBaseline, sourceCommit: git('rev-parse', 'HEAD').toString().trim(),
  runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT,
  startedAt: new Date().toISOString(), deployedCandidate,
  input: { originalSha256: sha256(original), candidateSha256: sha256(candidate), originalBytes: original.length, candidateBytes: candidate.length, removedBytes: original.length - candidate.length, trailingNewline: originalText.endsWith('\n'), exactSingleReplacement: true },
  thresholds: { geometryTolerance, channelThreshold, pixelRatioLimit },
  protectedFiles: [], observations: [], comparisons: [], screenshots: [], problems: [],
  limits: 'Chromium on the recorded Linux runner. Normal text and reduced motion at ten widths. Saved documents and settled default INR Life Story, direct load and reload. No currency route or book query repair, native zoom, other engines, physical devices or spoken screen reader acceptance.'
}
const sections = '.site-header,main>section,.pricing-plan-grid,.pricing-plan-card,.pricing-comparison table,.site-footer,.footer-grid,.footer-bottom'
await fs.mkdir(output, { recursive: true })
await fs.writeFile(output + '/original-pricing.html', original)
await fs.writeFile(output + '/candidate-pricing.html', candidate)
await fs.writeFile(output + '/default-footer.patch', '--- a/pricing/index.html\n+++ b/pricing/index.html\n@@ -1 +1 @@\n-' + originalText + '\n\\ No newline at end of file\n+' + candidate.toString('utf8') + '\n\\ No newline at end of file\n')

// Complete protected file identity, allowing only the exact authorised document correction.
const protectedPaths = ['index.html','404.html','assets/','covers/','gallery/','pricing/','favicon.svg','manifest.json','logo192.png','logo512.png','robots.txt','.nojekyll']
const changed = git('diff', '--name-only', originalBaseline, 'HEAD', '--', ...protectedPaths).toString().trim().split('\n').filter(Boolean)
assert.deepEqual(changed, deployedCandidate ? [htmlPath] : [])
for (const file of ['index.html','404.html','assets/index-DO3Vh6An.js','assets/index-DhPZyX4z.css','assets/content-sections-CfrmOVRI.js',htmlPath]) {
  const bytes = await fs.readFile(file)
  const before = git('show', originalBaseline + ':' + file)
  report.protectedFiles.push({ file, sha256: sha256(bytes), originalSha256: sha256(before), unchanged: bytes.equals(before) })
}
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.json':'application/json', '.woff2':'font/woff2' }
async function serve(html) {
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      if (!pathname.startsWith(prefix)) { response.writeHead(404); response.end(); return }
      let relative = pathname.slice(prefix.length)
      if (!relative || relative.endsWith('/')) relative += 'index.html'
      const file = path.resolve(root, relative)
      assert(file.startsWith(root + path.sep))
      const bytes = relative === htmlPath ? html : await fs.readFile(file)
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
      response.end(bytes)
    } catch { response.writeHead(404, { 'Content-Type':'text/html' }); response.end('Not found') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return { server, url: 'http://127.0.0.1:' + server.address().port + prefix + 'pricing/' }
}
async function settle(page) {
  await page.locator('[data-testid="pricing-page"]').waitFor()
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([document.fonts.load('600 15px Manrope'), document.fonts.load('450 64px Newsreader'), document.fonts.load('italic 400 64px Newsreader')])
    await document.fonts.ready
    // Force actual approved image loading before measurements or screenshots.
    for (const image of document.images) image.loading = 'eager'
    await Promise.all([...document.images].map(image => image.decode()))
    scrollTo({top:0,behavior:'instant'})
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
  const fonts = await page.evaluate(() => ['Newsreader','Manrope'].map(name => ({ name, loaded: [...document.fonts].some(font => font.family.includes(name) && font.status === 'loaded') })))
  assert(fonts.every(font => font.loaded), 'Approved fonts loaded')
  return fonts
}
async function measure(page) {
  return page.evaluate(selectors => {
    const box = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y + scrollY, width:r.width, height:r.height } }
    const footer = document.querySelector('.site-footer')
    const contact = [...footer.querySelectorAll('a')].find(el => el.textContent.trim().startsWith('Get in touch'))
    return {
      viewport: { width:innerWidth, height:innerHeight, dpr:devicePixelRatio },
      pageWidth:document.documentElement.scrollWidth, pageHeight:document.documentElement.scrollHeight,
      sectionCount:document.querySelectorAll('main>section').length,
      elements:[...document.querySelectorAll(selectors)].map(el => ({ tag:el.tagName, className:el.className, ...box(el) })),
      mainText:document.querySelector('main').textContent,
      footerText:footer.textContent,
      footerLinks:[...footer.querySelectorAll('a')].map(el => ({ text:el.textContent, href:el.getAttribute('href') })),
      contact: { text:contact.textContent, href:contact.getAttribute('href'), spans:contact.querySelectorAll('span').length, ...box(contact) },
      currencies:[...document.querySelectorAll('select')].map(el => ({ value:el.value, options:[...el.options].map(option => ({ value:option.value, text:option.textContent })) })),
      books:[...document.querySelectorAll('.pricing-book-choice')].map(el => ({ id:el.getAttribute('data-testid'), selected:el.getAttribute('aria-pressed') })),
      packageCount:document.querySelectorAll('.pricing-plan-card').length,
      prices:[...document.querySelectorAll('.pricing-plan-value strong')].map(el => el.textContent),
      images:[...document.images].map(el => ({ src:el.getAttribute('src'), alt:el.alt, complete:el.complete, naturalWidth:el.naturalWidth })),
      typography:[...document.querySelectorAll('main h1,main h2,main h3,.pricing-plan-value strong,.site-footer a,.site-footer h3')].map(el => { const s=getComputedStyle(el); return { text:el.textContent, font:s.fontFamily, size:s.fontSize, line:s.lineHeight, weight:s.fontWeight, letterSpacing:s.letterSpacing } })
    }
  }, sections)
}
function compareGeometry(before, after, label, saved = false) {
  for (const key of ['viewport','pageWidth','pageHeight','sectionCount','mainText','currencies','books','packageCount','prices','images']) assert.deepEqual(after[key], before[key], label + ' ' + key)
  assert.equal(before.sectionCount, 6, 'All six pricing sections retained')
  assert.equal(after.elements.length, before.elements.length, label + ' measured element count')
  let maxDelta = 0
  for (let i=0; i<before.elements.length; i++) {
    assert.equal(after.elements[i].className, before.elements[i].className)
    for (const key of ['x','y','width','height']) {
      const delta = Math.abs(after.elements[i][key] - before.elements[i][key]); maxDelta = Math.max(maxDelta, delta)
      assert(delta <= geometryTolerance, label + ' ' + before.elements[i].className + ' ' + key + ' differs by ' + delta)
    }
  }
  if (!saved) {
    for (const key of ['footerText','footerLinks','contact','typography']) assert.deepEqual(after[key], before[key], label + ' ' + key)
  } else {
    assert.equal(before.contact.text, 'Get in touch ↗')
    assert.equal(before.contact.spans, 1)
    assert.equal(after.contact.text, corrected)
    assert.equal(after.contact.spans, 0)
    assert.equal(after.contact.href, before.contact.href)
    assert.equal(after.footerText, before.footerText.replace('Get in touch ↗', corrected))
    assert.deepEqual(after.footerLinks, before.footerLinks.map(link => ({ ...link, text:link.text.replace('Get in touch ↗', corrected) })))
    assert.deepEqual(after.typography, before.typography.map(item => ({ ...item, text:item.text.replace('Get in touch ↗', corrected) })))
  }
  return { label, maxGeometryDelta:maxDelta, geometryPassed:true }
}
async function capture(page, file, fullPage = false) {
  const bytes = fullPage ? await page.screenshot({ fullPage:true, animations:'disabled' }) : await page.locator('.site-footer').screenshot({ animations:'disabled' })
  await fs.writeFile(output + '/' + file, bytes)
  report.screenshots.push({ file, sha256:sha256(bytes), bytes:bytes.length })
  return bytes
}
function comparePixels(before, after, label) {
  const a=PNG.sync.read(before), b=PNG.sync.read(after)
  assert.equal(a.width,b.width,label+' image width'); assert.equal(a.height,b.height,label+' image height')
  let changed=0
  for(let i=0;i<a.data.length;i+=4) if([0,1,2].some(channel=>Math.abs(a.data[i+channel]-b.data[i+channel])>channelThreshold))changed++
  const ratio=changed/(a.width*a.height)
  assert(ratio<=pixelRatioLimit,label+' changed pixel ratio '+ratio)
  return { label, width:a.width, height:a.height, changedPixels:changed, changedPixelRatio:ratio, pixelPassed:true }
}
function validateDefault(metrics, errors, expectedErrors) {
  assert.equal(metrics.packageCount,3)
  assert(metrics.currencies.every(item=>item.value==='inr'))
  assert.deepEqual(metrics.books.filter(book=>book.selected==='true').map(book=>book.id),['pricing-book-life-story'])
  assert.equal(metrics.contact.text,corrected); assert.equal(metrics.contact.spans,0)
  assert.equal(metrics.pageWidth,metrics.viewport.width,'No document overflow')
  assert.equal(errors.length,expectedErrors,'Expected page error count')
  if(expectedErrors) assert(errors.every(error=>error.includes('#418')),'Only the recorded original hydration mismatch')
}
let browser
const servers=[]
try {
  browser=await chromium.launch({ executablePath:'/usr/bin/google-chrome', headless:true, args:['--no-sandbox'] })
  report.environment={ browser:browser.version(), node:process.version, playwright:'1.56.1', pngjs:'7.0.0', os:await fs.readFile('/etc/os-release','utf8'), runnerImage:process.env.ImageVersion, viewportHeight:1000, dpr:1, reducedMotion:'reduce' }
  for(const [name,bytes] of [['original',original],['candidate',candidate]]) { const server=await serve(bytes);servers.push({name,...server}) }
  for(const width of widths) {
    const records={}
    for(const {name,url} of servers) {
      const context=await browser.newContext({ viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce' })
      const page=await context.newPage(), errors=[]
      page.on('pageerror',error=>errors.push(error.message))
      records[name]={}
      for(const action of ['direct','reload']) {
        errors.length=0
        const response=action==='direct'?await page.goto(url,{waitUntil:'networkidle'}):await page.reload({waitUntil:'networkidle'})
        assert.equal(response.status(),200,name+' '+action+' HTTP response')
        const body=await response.body()
        assert.equal(sha256(body),name==='original'?sha256(original):sha256(candidate),'Exact document served')
        const fonts=await settle(page), metrics=await measure(page)
        validateDefault(metrics,errors,name==='original'?1:0)
        const row={name,width,action,status:response.status(),responseSha256:sha256(body),fonts,errors:[...errors],metrics}
        report.observations.push(row);records[name][action]=row
        if(action==='direct') {
          records[name].footer=await capture(page,`${name}-footer-${width}.png`)
          if([320,390,820,1440].includes(width)) records[name].full=await capture(page,`${name}-page-${width}.png`,true)
        }
      }
      report.comparisons.push(compareGeometry(records[name].direct.metrics,records[name].reload.metrics,`${name} direct versus reload ${width}`))
      await context.close()
    }
    report.comparisons.push(compareGeometry(records.original.direct.metrics,records.candidate.direct.metrics,'settled original versus candidate '+width))
    report.comparisons.push(comparePixels(records.original.footer,records.candidate.footer,'complete settled footer '+width))
    if(records.original.full)report.comparisons.push(comparePixels(records.original.full,records.candidate.full,'complete settled pricing page '+width))
    // Saved-document rendering before JavaScript. This separately shows the intended span removal.
    const saved={}
    for(const {name,url} of servers) {
      const context=await browser.newContext({ viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',javaScriptEnabled:false })
      const page=await context.newPage()
      assert.equal((await page.goto(url,{waitUntil:'networkidle'})).status(),200)
      await settle(page)
      saved[name]=await measure(page)
      report.observations.push({name,width,action:'saved document without JavaScript',metrics:saved[name]})
      if([320,390,820,1440].includes(width))await capture(page,`${name}-saved-footer-${width}.png`)
      await context.close()
    }
    report.comparisons.push(compareGeometry(saved.original,saved.candidate,'saved document '+width,true))
  }
  report.result='passed'
} catch(error) { report.result='failed';report.problems.push(error.stack||String(error));process.exitCode=1 }
finally {
  await browser?.close()
  for(const {server} of servers)await new Promise(resolve=>server.close(resolve))
  report.finishedAt=new Date().toISOString()
  await fs.writeFile(output+'/report.json',JSON.stringify(report,null,2)+'\n')
  console.log('PRICING_FOOTER_RESULT '+JSON.stringify({result:report.result,input:report.input,widths,observations:report.observations.length,comparisons:report.comparisons,environment:report.environment,problems:report.problems}))
}
