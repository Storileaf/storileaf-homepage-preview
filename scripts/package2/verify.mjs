import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'

const baseline = '4b14b91b642795d2b466a0c018f84f3474d44991'
const cssPath = 'assets/index-DhPZyX4z.css'
// Preserve Package 2's original comparison while accounting for the later approved editorial labels.
const editorialScope = '#top[data-testid="storileaf-home"]'
const editorialComparison = [ '.text-link', '.resource-card-link', '.resource-all-link' ].map(s => editorialScope + ' ' + s).join(',') + '{font-size:15px}'
const before = execFileSync('git', ['show', baseline + ':' + cssPath], { encoding: 'utf8' }) + '\n' + editorialComparison
const after = await fs.readFile(cssPath, 'utf8')
const base = process.env.PACKAGE2_BASE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/'
const folder = 'qa/package2'
await fs.mkdir(folder, { recursive: true })
const report = { baseline, commit:process.env.GITHUB_SHA, widths:[], pricingErrors:[], checks:{}, problems:[] }
const check = (ok, message) => { if (!ok) report.problems.push(message) }
const browser = await chromium.launch({ executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome', args:['--no-sandbox'] })
const page = await browser.newPage({ viewport:{width:1440,height:1000}, reducedMotion:'reduce' })
let phase = 'home'
page.on('pageerror', error => (phase === 'pricing' ? report.pricingErrors : report.problems).push(error.message))
const useCss = async css => {
  await page.evaluate(css => {
    document.querySelector('link[href*="index-DhPZyX4z.css"]').disabled = true
    let el = document.getElementById('p2-css')
    if (!el) { el=document.createElement('style');el.id='p2-css';document.head.append(el) }
    el.textContent=css
  }, css)
  await page.evaluate(()=>document.fonts.ready)
  await page.waitForTimeout(200)
}
const reset = async () => {
  await page.mouse.move(0,0)
  await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges();document.querySelectorAll('.faq-item').forEach(el=>el.open=false);scrollTo({top:0,behavior:'instant'})})
  await page.waitForTimeout(120)
}
const measure = () => page.evaluate(()=>[...document.querySelectorAll('.site-header,main>section,main h1,main h2,main h3,main p,.newsletter-footer-unit,.newsletter-strip,.site-footer,.button,.page-width,.resource-category-card,.hero-window,.book-craft-image,.process-visual')].map((el,index)=>{
  const s=getComputedStyle(el),r=el.getBoundingClientRect(),faq=document.querySelector('.faq-section')
  const downstream=!!faq && !!(faq.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)
  return {index,tag:el.tagName,cls:el.className,inFaq:!!el.closest('.faq-section'),downstream,text:el.matches('h1,h2,h3,p,.button')?el.textContent.trim():null,x:r.x,y:r.y+scrollY,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,leading:s.lineHeight,weight:s.fontWeight,tracking:s.letterSpacing,padding:s.padding,margin:s.margin}
}))
async function capture(width,stage) {
  await reset()
  await page.screenshot({path:`${folder}/page-${stage}-${width}.png`,fullPage:true,animations:'disabled'})
  const faq=await page.locator('.faq-section').boundingBox()
  report.checks['faqCrop-'+stage+'-'+width]=faq
  await page.locator('.faq-section').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-110,behavior:'instant'}))
  await page.screenshot({path:`${folder}/faq-closed-${stage}-${width}.png`,animations:'disabled'})
  await page.locator('.faq-item').first().locator('summary').click()
  await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges()})
  await page.screenshot({path:`${folder}/faq-open-${stage}-${width}.png`,animations:'disabled'})
}
async function checkQuestions(label) {
  await page.waitForTimeout(350)
  const data=await page.locator('.faq-item summary').evaluateAll(items=>items.map(el=>{
    const r=el.getBoundingClientRect(),s=getComputedStyle(el),span=el.querySelector('span').getBoundingClientRect()
    const range=document.createRange();range.selectNodeContents(el.querySelector('span'));const lines=[...range.getClientRects()];const icon=el.querySelector('svg').getBoundingClientRect()
    return {size:s.fontSize,leading:s.lineHeight,height:r.height,width:r.width,spanRight:span.right,left:r.left,right:r.right,textRight:Math.max(...lines.map(x=>x.right)),textLeft:Math.min(...lines.map(x=>x.left)),textBottom:Math.max(...lines.map(x=>x.bottom)),bottom:r.bottom,iconRight:icon.right,viewport:innerWidth,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}
  }))
  report.checks['questionMeasurements-'+label]=data
  check(data.length===6,'FAQ count differs in '+label)
  check(data.every(x=>x.spanRight<=x.right+.2 && x.textRight<=x.right+.2 && x.textLeft>=x.left-.2 && x.textBottom<=x.bottom+.2 && x.iconRight<=x.viewport && x.height>=44),'FAQ text or targets clipped in '+label)
  return data
}
try {
  await page.goto(base,{waitUntil:'networkidle'})
  await page.evaluate(()=>document.fonts.ready)
  // Trigger native lazy image loading, without changing approved imagery or destinations.
  const height=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let y=0;y<height;y+=750){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(50)}
  await page.waitForTimeout(400)
  for(const width of [320,360,390,430,768,820,1024,1280,1440]) {
    await page.setViewportSize({width,height:1000});await reset()
    await useCss(before);const b=await measure()
    await useCss(after);const a=await measure()
    let largestUnrelatedDelta=0
    check(a.length===b.length,'Page element count changed at '+width)
    for(let i=0;i<b.length;i++){
      const old=b[i],now=a[i];if(!now)continue
      if(!old.inFaq){
        for(const key of ['x','w','h',...(!old.downstream?['y']:[])]) {
          const delta=Math.abs(old[key]-now[key]);largestUnrelatedDelta=Math.max(largestUnrelatedDelta,delta)
          check(delta<.2,`${width}px unrelated ${key} changed for ${old.cls||old.tag} by ${delta}`)
        }
      }
      for(const key of ['text','font','size','leading','weight','tracking','padding','margin']) check(old[key]===now[key],`${width}px unrelated ${key} changed for ${old.cls||old.tag}`)
    }
    const faq=await checkQuestions(width+'px')
    check(faq.every(x=>x.size==='15px'&&x.leading==='22.5px'),'FAQ question role incorrect at '+width)
    await page.locator('.faq-item').first().evaluate(el=>el.open=true)
    await page.waitForTimeout(350)
    const answer=await page.locator('.faq-answer p').first().evaluate(el=>({size:getComputedStyle(el).fontSize,line:getComputedStyle(el).lineHeight}))
    const link=await page.locator('.faq-answer .text-link').first().evaluate(el=>getComputedStyle(el).fontSize)
    check(answer.size==='15px'&&answer.line==='26.25px'&&link==='15px','FAQ answer/link roles incorrect at '+width)
    check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Document overflow at '+width)
    await page.locator('.faq-item').first().evaluate(el=>el.open=false)
    await page.waitForTimeout(200)
    const summary=page.locator('.faq-item summary').first()
    await page.keyboard.press('Tab');await summary.focus();await page.keyboard.press('Enter')
    check(await summary.evaluate(el=>el.parentElement.open),'Keyboard Enter failed at '+width)
    check(await summary.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineWidth!=='0px'),'FAQ focus absent at '+width)
    await page.keyboard.press('Space');check(!(await summary.evaluate(el=>el.parentElement.open)),'Keyboard Space failed at '+width)
    report.widths.push({width,largestUnrelatedDelta,faq,answer,link})
    if(width===390||width===1440){await useCss(before);await capture(width,'before');await useCss(after);await capture(width,'after')}
  }
  // Focused checks for the changed disclosure at short screen heights.
  for(const [width,height] of [[1440,600],[390,568]]){
    await page.setViewportSize({width,height});await useCss(after);await reset()
    const el=page.locator('.faq-item summary').last();await el.click()
    check(await el.evaluate(n=>n.parentElement.open),'Short-height disclosure failed')
    await checkQuestions('short-height '+width)
  }
  report.checks.shortHeights=true
  // Explicit 200% text enlargement of the changed FAQ, not a claim of native browser zoom certification.
  await page.setViewportSize({width:320,height:900});await reset()
  const enlargement=await page.addStyleTag({content:'.faq-item summary{font-size:30px!important;line-height:1.5!important}.faq-answer p{font-size:30px!important;line-height:1.75!important}.faq-answer .text-link{font-size:30px!important}'})
  await page.locator('.faq-item summary').first().click()
  await checkQuestions('200 percent FAQ text')
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'200 percent FAQ text overflows')
  await page.locator('.faq-item summary').first().evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}))
  await page.screenshot({path:`${folder}/faq-text-200-percent-320.png`,animations:'disabled'})
  await enlargement.evaluate(el=>el.remove());await page.waitForTimeout(350);report.checks.faqTextEnlargement200Percent=true
  const spacing=await page.addStyleTag({content:'.faq-item summary,.faq-answer p,.faq-answer a{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}.faq-answer p{margin-bottom:2em!important}'})
  await checkQuestions('custom text spacing')
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'FAQ custom text spacing overflows')
  await spacing.evaluate(el=>el.remove());report.checks.faqTextSpacing=true
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'})
  const tp=await touch.newPage();await tp.goto(base,{waitUntil:'networkidle'})
  const q=tp.locator('.faq-item summary').first();await q.tap();check(await q.evaluate(n=>n.parentElement.open),'Touch disclosure failed')
  await q.tap();check(!(await q.evaluate(n=>n.parentElement.open)),'Touch close failed');await touch.close();report.checks.touch=true
  // Separate pricing preview retains original styles and its already documented hydration warning.
  phase='pricing';await page.setViewportSize({width:1440,height:1000})
  await page.goto(base+'pricing/',{waitUntil:'networkidle'});await page.locator('.pricing-intro').waitFor()
  await useCss(before);const pb=await measure();await useCss(after);const pa=await measure()
  check(JSON.stringify(pb)===JSON.stringify(pa),'Pricing typography or geometry changed')
  report.checks.pricingUnchanged=JSON.stringify(pb)===JSON.stringify(pa)
  const pp=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),pe=[]
  pp.on('pageerror',e=>pe.push(e.message));await pp.route('**/'+cssPath,route=>route.fulfill({contentType:'text/css',body:before}))
  await pp.goto(base+'pricing/',{waitUntil:'networkidle'});await pp.waitForTimeout(200)
  check(JSON.stringify(pe)===JSON.stringify(report.pricingErrors),'Pricing warning differs from baseline')
  report.pricingBaselineErrors=pe;await pp.close()
} catch(error) { report.problems.push(String(error)) }
finally { await browser.close() }
await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({widths:report.widths.map(x=>x.width),checks:report.checks,problems:report.problems}))
if(report.problems.length)process.exitCode=1
