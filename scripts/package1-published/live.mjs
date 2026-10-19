import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'

// Real Pages inspection. No CSS injection, substituted requests or form submission.
const base='https://storileaf.github.io/storileaf-homepage-preview/'
const cssPath='assets/index-DhPZyX4z.css'
const hash=s=>createHash('sha256').update(s).digest('hex')
const expectedHash=hash(await fs.readFile(cssPath,'utf8'))
const folder='qa/package1-live'
await fs.mkdir(folder,{recursive:true})
const report={url:base,commit:process.env.GITHUB_SHA||'',expectedCssSha256:expectedHash,widths:[],problems:[]}
const check=(ok,message)=>{if(!ok)report.problems.push(message)}
let browser
try {
 let matched=false
 for(let attempt=0;attempt<60;attempt++){
  try {
   const r=await fetch(base+cssPath+'?package1='+Date.now(),{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)})
   if(r.ok&&hash(await r.text())===expectedHash){matched=true;break}
  }catch{}
  await new Promise(resolve=>setTimeout(resolve,5000))
 }
 if(!matched)throw new Error('Pages did not serve the expected stylesheet within the deployment window')
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',extraHTTPHeaders:{'Cache-Control':'no-cache'}})
 const page=await context.newPage()
 page.on('pageerror',e=>report.problems.push(e.message))
 const cssResponse=page.waitForResponse(r=>r.url().includes('/'+cssPath))
 check((await page.goto(base,{waitUntil:'networkidle'}))?.ok(),'Live homepage HTTP request failed')
 report.actualCssSha256=hash(await (await cssResponse).text())
 check(report.actualCssSha256===expectedHash,'Live page loaded an older stylesheet')
 await page.locator('.site-header').waitFor();await page.evaluate(()=>document.fonts.ready)
 for(const width of [320,360,390,430,768,820,1024,1280,1440]){
  await page.setViewportSize({width,height:900})
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
  const data=await page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,
   controls:[...document.querySelectorAll('.button,.newsletter-inline-preview input')].map(el=>({text:el.textContent.trim(),radius:getComputedStyle(el).borderTopLeftRadius})),
   headerHeight:document.querySelector('.header-find-book').getBoundingClientRect().height,
   covers:document.querySelectorAll('.hero-orbit-square').length,cards:document.querySelectorAll('.resource-category-card').length}))
  check(data.pageWidth<=width+1,'Live overflow at '+width)
  check(data.controls.every(c=>c.radius==='6px'),'Live action radius differs at '+width)
  check(data.covers===14&&data.cards===2,'Live content count changed')
  if(width===390||width===430)check(data.headerHeight===45,'Live mobile action height changed')
  const card=page.locator('.resource-category-link')
  await page.keyboard.press('Tab');await card.focus();await page.waitForTimeout(300)
  data.focus=await card.evaluate(el=>({visible:el.matches(':focus-visible'),radius:getComputedStyle(el).borderTopLeftRadius,outline:getComputedStyle(el).outlineWidth}))
  check(data.focus.visible&&data.focus.outline==='3px'&&data.focus.radius===(width<=480?'17px':'20px'),'Live resource focus differs at '+width)
  report.widths.push({width,...data})
  if(width===390||width===1440){
   await card.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}))
   await card.screenshot({path:`${folder}/resource-focus-${width}.png`,animations:'disabled'})
   await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
   await page.mouse.move(0,0)
   await page.screenshot({path:`${folder}/homepage-${width}.png`,animations:'disabled'})
   await page.locator('.site-header').screenshot({path:`${folder}/header-${width}.png`,animations:'disabled'})
   await page.locator('.newsletter-strip').scrollIntoViewIfNeeded()
   await page.locator('.newsletter-strip').screenshot({path:`${folder}/newsletter-${width}.png`,animations:'disabled'})
  }
 }
 await page.setViewportSize({width:1440,height:900});report.hover={}
 for(const [name,selector,colour] of [['header','.header-find-book','rgb(11, 88, 72)'],['primary','.hero-actions .button:not(.button-outline)','rgb(11, 88, 72)'],['gold','.gift-copy .button','rgb(233, 203, 147)'],['newsletter','.newsletter-inline-preview .button','rgb(233, 203, 147)']]){
  const el=page.locator(selector).first();await el.hover();await page.waitForTimeout(300)
  report.hover[name]=await el.evaluate(el=>getComputedStyle(el).backgroundColor)
  check(report.hover[name]===colour,'Live hover differs for '+name)
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0))
 const trigger=page.getByRole('button',{name:'Open navigation',exact:true})
 await trigger.click();await page.getByRole('dialog').waitFor({state:'visible'})
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'})
 await page.getByRole('button',{name:'Try answering a question',exact:true}).click()
 await page.getByRole('dialog').waitFor({state:'visible'})
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'})
 report.mobileNavigationAndPracticeVerified=true
 await context.close()
}catch(error){report.problems.push(String(error))}
finally{if(browser)await browser.close()}
await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report))
if(report.problems.length)process.exitCode=1
