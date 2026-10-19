import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'

// Actual Pages, without stylesheet injection, request substitution or form submission.
const base='https://storileaf.github.io/storileaf-homepage-preview/'
const cssPath='assets/index-DhPZyX4z.css'
const folder='qa/package2-live'
const hash=s=>createHash('sha256').update(s).digest('hex')
const expected=hash(await fs.readFile(cssPath,'utf8'))
const report={url:base,commit:process.env.GITHUB_SHA,expectedCssSha256:expected,widths:[],crops:{},fontRequests:[],problems:[]}
const check=(ok,message)=>{if(!ok)report.problems.push(message)}
await fs.mkdir(folder,{recursive:true})
let browser
try {
  let found=false
  for(let attempt=0;attempt<60;attempt++){
    try {const r=await fetch(base+cssPath+'?package2='+Date.now(),{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});if(r.ok&&hash(await r.text())===expected){found=true;break}} catch {}
    await new Promise(resolve=>setTimeout(resolve,5000))
  }
  if(!found)throw new Error('The expected Package 2 stylesheet is not deployed')
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
  // A fresh browser has no stale cache. Do not add custom headers to cross-origin fonts.
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
  page.on('pageerror',e=>report.problems.push(e.message))
  page.on('requestfailed',r=>{if(/fonts\.(googleapis|gstatic)\.com/.test(r.url()))report.fontRequests.push({url:r.url(),failure:r.failure()?.errorText})})
  page.on('response',r=>{if(/fonts\.(googleapis|gstatic)\.com/.test(r.url()))report.fontRequests.push({url:r.url(),status:r.status()})})
  const cssResponse=page.waitForResponse(r=>r.url().includes('/'+cssPath))
  check((await page.goto(base,{waitUntil:'networkidle'}))?.ok(),'Live homepage HTTP request failed')
  report.actualCssSha256=hash(await(await cssResponse).text())
  check(report.actualCssSha256===expected,'Browser loaded an older stylesheet')
  await page.evaluate(async()=>{
    await document.fonts.ready
    await Promise.all([document.fonts.load('600 15px Manrope'),document.fonts.load('450 64px Newsreader'),document.fonts.load('italic 400 64px Newsreader')])
    await document.fonts.ready
  })
  report.fontFaces=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight,style:f.style,status:f.status})))
  for(const name of ['Manrope','Newsreader'])check(report.fontFaces.some(f=>f.family.includes(name)),'Brand font was not downloaded: '+name)
  if(report.problems.length)throw new Error('Live font or stylesheet verification failed before screenshots')
  const height=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70)}
  await page.waitForTimeout(500)
  for(const width of [320,360,390,430,768,820,1024,1280,1440]){
    await page.setViewportSize({width,height:1000})
    await page.evaluate(()=>{document.activeElement?.blur();document.querySelectorAll('.faq-item').forEach(el=>el.open=false);scrollTo({top:0,behavior:'instant'});getSelection()?.removeAllRanges()})
    await page.mouse.move(0,0)
    await page.waitForTimeout(250)
    const row=await page.evaluate(()=>({
      width:innerWidth,pageWidth:document.documentElement.scrollWidth,
      questions:[...document.querySelectorAll('.faq-item summary')].map(el=>{const s=getComputedStyle(el);return {size:s.fontSize,line:s.lineHeight,font:s.fontFamily,height:el.getBoundingClientRect().height}}),
      headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,
      actions:[...document.querySelectorAll('.button,.newsletter-inline-preview input')].map(el=>getComputedStyle(el).borderTopLeftRadius)
    }))
    check(row.pageWidth<=width+1,'Live overflow at '+width)
    check(row.questions.length===6&&row.questions.every(q=>q.size==='15px'&&q.line==='22.5px'&&q.font.includes('Manrope')&&q.height>=44),'Live question role differs at '+width)
    check(row.headingFont.includes('Newsreader'),'Live display font differs at '+width)
    check(row.actions.every(r=>r==='6px'),'Package 1 corners regressed at '+width)
    const summary=page.locator('.faq-item summary').first()
    await page.keyboard.press('Tab');await summary.focus();await page.keyboard.press('Enter')
    check(await summary.evaluate(el=>el.parentElement.open&&el.matches(':focus-visible')),'Live keyboard disclosure failed at '+width)
    await page.waitForTimeout(350)
    row.answerSize=await page.locator('.faq-answer p').first().evaluate(el=>getComputedStyle(el).fontSize)
    row.linkSize=await page.locator('.faq-answer .text-link').first().evaluate(el=>getComputedStyle(el).fontSize)
    check(row.answerSize==='15px'&&row.linkSize==='14px','Live answer and link roles differ at '+width)
    await page.keyboard.press('Space');check(!(await summary.evaluate(el=>el.parentElement.open)),'Live keyboard close failed at '+width)
    report.widths.push(row)
    if(width===390||width===1440){
      await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges();scrollTo({top:0,behavior:'instant'})})
      await page.screenshot({path:`${folder}/homepage-${width}.png`,fullPage:true,animations:'disabled'})
      report.crops[width]=await page.locator('.faq-section').boundingBox()
      await page.locator('.faq-section').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-110,behavior:'instant'}))
      await page.screenshot({path:`${folder}/faq-closed-${width}.png`,animations:'disabled'})
      await summary.click();await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges()})
      await page.waitForTimeout(300)
      await page.screenshot({path:`${folder}/faq-open-${width}.png`,animations:'disabled'})
    }
  }
  report.missingImages=await page.evaluate(()=>[...document.images].filter(img=>img.currentSrc&&(!img.complete||!img.naturalWidth)).map(img=>img.currentSrc))
  check(report.missingImages.length===0,'Live photography failed to load')
} catch(error){report.problems.push(String(error))}
finally{if(browser)await browser.close()}
await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({widths:report.widths.map(x=>x.width),actualCssSha256:report.actualCssSha256,fontFaces:report.fontFaces,problems:report.problems}))
if(report.problems.length)process.exitCode=1
