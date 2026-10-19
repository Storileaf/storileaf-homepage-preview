import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
const baseline='870aadee138b989423a8ef1ffec7ce826f452943'
const cssPath='assets/index-DhPZyX4z.css'
const before=execFileSync('git',['show',baseline+':'+cssPath],{encoding:'utf8'})
const after=await fs.readFile(cssPath,'utf8')
const base=process.env.PACKAGE1_BASE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/'
const folder='qa/package1-published'
await fs.mkdir(folder,{recursive:true})
const problems=[]
const check=(condition,message)=>{if(!condition)problems.push(message)}
const report={baseline,base,commit:process.env.GITHUB_SHA||'',widths:[],states:{},problems}
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
page.on('pageerror',e=>problems.push(e.message))
const useCss=async css=>{
 await page.evaluate(css=>{
  const link=document.querySelector('link[href*="index-DhPZyX4z.css"]');if(link)link.disabled=true
  let style=document.getElementById('package1-css-review')
  if(!style){style=document.createElement('style');style.id='package1-css-review';document.head.append(style)}
  style.textContent=css
 },css)
 await page.evaluate(()=>document.fonts.ready)
}
const geometry=()=>page.evaluate(()=>[...document.querySelectorAll('.site-header,main>section,.newsletter-footer-unit,.newsletter-strip,.site-footer,.button,h1,h2,h3,.resource-category-card,.hero-window,.book-craft-image,.process-visual')].map(el=>{
 const r=el.getBoundingClientRect(),s=getComputedStyle(el)
 return {tag:el.tagName,cls:el.className,text:el.matches('.button,h1,h2,h3')?el.textContent.trim():null,x:r.x,y:r.y,w:r.width,h:r.height,font:s.font,padding:s.padding,margin:s.margin,display:s.display}
}))
const styleOf=loc=>loc.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {radius:s.borderTopLeftRadius,bg:s.backgroundColor,colour:s.color,outline:s.outlineWidth,focus:el.matches(':focus-visible'),width:r.width,height:r.height}})
async function capture(width,stage){
 await page.evaluate(()=>{document.activeElement?.blur();window.getSelection()?.removeAllRanges();scrollTo(0,0)})
 await page.mouse.move(0,0)
 await page.screenshot({path:`${folder}/homepage-top-${stage}-${width}.png`,animations:'disabled'})
 await page.locator('.site-header').screenshot({path:`${folder}/header-${stage}-${width}.png`,animations:'disabled'})
 const nl=page.locator('.newsletter-strip');await nl.scrollIntoViewIfNeeded();await page.waitForTimeout(150)
 await nl.screenshot({path:`${folder}/newsletter-${stage}-${width}.png`,animations:'disabled'})
 const card=page.locator('.resource-category-link');await page.keyboard.press('Tab');await card.focus()
 await card.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}))
 await page.waitForTimeout(250)
 await card.screenshot({path:`${folder}/resource-focus-${stage}-${width}.png`,animations:'disabled'})
}
try{
 await page.goto(base,{waitUntil:'networkidle'})
 await page.locator('#top[data-testid="storileaf-home"]').waitFor()
 check(await page.evaluate(()=>CSS.supports('selector(body:has(#top))')),'Homepage token scope unsupported')
 await page.evaluate(()=>document.fonts.ready)
 for(const width of [320,360,390,430,768,820,1024,1280,1440]){
  await page.setViewportSize({width,height:900})
  await page.mouse.move(0,0);await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)})
  await useCss(before);const oldGeometry=await geometry()
  await useCss(after);const newGeometry=await geometry()
  check(oldGeometry.length===newGeometry.length,'Element count differs at '+width)
  for(let i=0;i<oldGeometry.length;i++){
   const a=oldGeometry[i],b=newGeometry[i];if(!b)continue
   for(const key of ['x','y','w','h'])check(Math.abs(a[key]-b[key])<0.2,`Geometry ${key} changed for ${a.cls} at ${width}`)
   for(const key of ['tag','cls','text','font','padding','margin','display'])check(a[key]===b[key],`${key} changed for ${a.cls} at ${width}`)
  }
  const values=await page.locator('.button,.newsletter-inline-preview input').evaluateAll(els=>els.map(el=>({text:el.textContent.trim(),radius:getComputedStyle(el).borderTopLeftRadius})))
  check(values.every(v=>v.radius==='6px'),'Action corners differ at '+width)
  const header=await styleOf(page.locator('.header-find-book'))
  if(width===390||width===430)check(header.height===45,'Mobile header height changed')
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Overflow at '+width)
  const resource=page.locator('.resource-category-link');await page.keyboard.press('Tab');await resource.focus();await page.waitForTimeout(250)
  const focused=await styleOf(resource)
  check(focused.focus&&focused.outline==='3px'&&focused.radius===(width<=480?'17px':'20px'),'Resource focus differs at '+width)
  report.widths.push({width,geometryUnchanged:JSON.stringify(oldGeometry)===JSON.stringify(newGeometry),header,values,resourceFocus:focused})
  if(width===390||width===1440){await useCss(before);await capture(width,'before');await useCss(after);await capture(width,'after')}
 }
 await page.setViewportSize({width:1440,height:900});await useCss(after)
 for(const [name,selector,bg] of [['header','.header-find-book','rgb(11, 88, 72)'],['primary','.hero-actions .button:not(.button-outline)','rgb(11, 88, 72)'],['gold','.gift-copy .button','rgb(233, 203, 147)'],['newsletter','.newsletter-inline-preview .button','rgb(233, 203, 147)'],['outline','.hero-actions .button-outline',null]]){
  const el=page.locator(selector).first();await el.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur())
  const normal=await styleOf(el);await el.hover();await page.waitForTimeout(250);const hover=await styleOf(el)
  if(bg)check(hover.bg===bg,'Wrong hover colour for '+name)
  if(name==='outline')check(normal.colour==='rgb(37, 53, 38)','Outline is not forest')
  check(normal.width===hover.width&&normal.height===hover.height,'Hover resizes '+name)
  await page.mouse.down();const pressed=await styleOf(el);await page.mouse.move(0,0);await page.mouse.up()
  await page.keyboard.press('Tab');await el.focus();const focus=await styleOf(el)
  check(focus.focus&&focus.outline!=='0px','Missing focus for '+name)
  await page.evaluate(()=>window.getSelection()?.removeAllRanges())
  await el.screenshot({path:`${folder}/action-${name}-focus.png`,animations:'disabled'})
  report.states[name]={normal,hover,pressed,focus}
 }
 // Use the tracked static pricing entry, not an unserved currency subdirectory.
 const pricingResponse=await page.goto(base+'pricing/',{waitUntil:'networkidle'})
 check(pricingResponse?.ok(),'Pricing HTTP request failed')
 await page.locator('.pricing-intro').waitFor()
 check(await page.locator('#top[data-testid="storileaf-home"]').count()===0,'Pricing resolved to the homepage')
 await useCss(before);const pricingBefore=await geometry();const hBefore=await styleOf(page.locator('.site-header'))
 await useCss(after);const pricingAfter=await geometry();const hAfter=await styleOf(page.locator('.site-header'))
 check(JSON.stringify(pricingBefore)===JSON.stringify(pricingAfter),'Pricing layout changed')
 check(JSON.stringify(hBefore)===JSON.stringify(hAfter),'Pricing header changed')
 report.pricingUnchanged=JSON.stringify(hBefore)===JSON.stringify(hAfter)&&JSON.stringify(pricingBefore)===JSON.stringify(pricingAfter)
}catch(e){problems.push(String(e))}finally{await browser.close()}
await fs.writeFile(`${folder}/report.json`,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({testedWidths:report.widths.map(x=>x.width),pricingUnchanged:report.pricingUnchanged,problems}))
if(problems.length)process.exitCode=1
