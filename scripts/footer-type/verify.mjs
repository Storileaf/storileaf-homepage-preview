import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'

const baseline='898958276bb82c8c7c5b2c9839456a26f8cf0591'
const cssPath='assets/index-DhPZyX4z.css'
const prior=execFileSync('git',['show',baseline+':'+cssPath],{encoding:'utf8'})
const current=await fs.readFile(cssPath,'utf8')
const live=process.argv.includes('--live')
const folder=live?'qa/footer-type-live':'qa/footer-type'
const url=live?'https://storileaf.github.io/storileaf-homepage-preview/':'http://127.0.0.1:4173/storileaf-homepage-preview/'
const widths=[320,360,390,430,768,820,1024,1280,1440]
const report={baseline,commit:process.env.GITHUB_SHA,live,widths:[],source:[],checks:[],problems:[]}
const check=(ok,message)=>{if(!ok)report.problems.push(message)}
const hash=s=>createHash('sha256').update(s).digest('hex')
await fs.mkdir(folder,{recursive:true})
let browser
const fonts=async p=>{await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([document.fonts.load('650 15px Manrope'),document.fonts.load('450 64px Newsreader')])});const loaded=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));for(const name of ['Manrope','Newsreader'])check(loaded.some(n=>n.includes(name)),'Missing downloaded font '+name)}
const reset=async p=>{await p.mouse.move(0,0);await p.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges();scrollTo({top:0,behavior:'instant'})});await p.waitForTimeout(200)}
const selectors=source=>source?{footer:'.sl-footer',heading:'.sl-footer-column h3',menu:'.sl-footer-column a',currency:'.sl-footer-currency select',control:'.sl-footer-currency',legal:'.sl-footer-bottom > span,.sl-footer-bottom a',unit:'.sl-newsletter-footer'}:{footer:'.site-footer',heading:'.footer-column h3',menu:'.footer-column a',currency:'.currency-picker select',control:'.currency-picker',legal:'.footer-bottom > span,.footer-bottom a',unit:'.newsletter-footer-unit'}
const read=(p,source=false)=>p.evaluate(q=>{
 const describe=el=>{const s=getComputedStyle(el);return {tag:el.tagName,text:el.textContent.trim(),href:el.getAttribute('href'),size:s.fontSize,line:s.lineHeight,font:s.fontFamily,weight:s.fontWeight,colour:s.color,background:s.backgroundColor,padding:s.padding,margin:s.margin,gap:s.gap,radius:s.borderRadius}}
 const select=document.querySelector(q.currency),s=getComputedStyle(select),r=select.getBoundingClientRect(),c=document.querySelector(q.control).getBoundingClientRect()
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
 const labelWidth=ctx.measureText(select.selectedOptions[0].textContent).width
 const f=document.querySelector(q.footer),fr=f.getBoundingClientRect()
 // Chromium's native option gap is 0.5em. Preserve that ratio as the approved font grows.
 const frozen=[...f.querySelectorAll('*')].map(el=>{const x=describe(el);if(el.tagName==='OPTION'&&/^\d+(\.\d+)?px$/.test(x.gap))x.gap=String(parseFloat(x.gap)/parseFloat(x.size))+'em';if(el.matches(q.heading)||el.matches(q.currency)||el.closest(q.currency)){delete x.size;delete x.line}return x})
 const outside=[...document.querySelectorAll('.site-header,main>section,.newsletter-strip,.sl-header,.sl-reference-section,.sl-newsletter')].filter(el=>!el.contains(f)&&!el.closest(q.footer)).map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent,cls:el.className,rect:[r.x,r.y+scrollY,r.width,r.height]}})
 return {headings:[...document.querySelectorAll(q.heading)].map(describe),menu:[...document.querySelectorAll(q.menu)].map(describe),legal:[...document.querySelectorAll(q.legal)].map(describe),currency:{...describe(select),value:select.value,options:[...select.options].map(o=>({value:o.value,label:o.label})),width:r.width,controlWidth:c.width,left:c.left,right:c.right,labelWidth,available:select.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)},frozen,outside,footer:{x:fr.x,y:fr.y+scrollY,width:fr.width,height:fr.height},background:{photo:getComputedStyle(document.querySelector(q.unit),'::before').backgroundImage,fade:getComputedStyle(document.querySelector(q.unit),'::after').backgroundImage},pageWidth:document.documentElement.scrollWidth,viewport:innerWidth}
},selectors(source))
function assertResult(a,label){
 check(a.headings.length===3&&a.headings.every(x=>x.size==='15px'&&x.line==='21px'&&x.weight==='650'&&x.font.includes('Manrope')),label+' heading role')
 check(a.menu.length===17&&a.menu.every(x=>x.size==='14px'&&x.weight==='400'),label+' menu links changed')
 check(a.legal.length===4&&a.legal.every(x=>x.size==='13px'),label+' legal text changed')
 check(a.currency.size==='13px'&&a.currency.options.length===4,label+' currency size or options')
 check(a.currency.left>=0&&a.currency.right<=a.viewport+1&&a.currency.labelWidth<=a.currency.available+1,label+' currency label clipped')
 check(a.pageWidth<=a.viewport+1,label+' document overflow')
}
function compare(b,a,label){
 check(JSON.stringify(a.frozen)===JSON.stringify(b.frozen),label+' unrelated footer style/content change')
 check(JSON.stringify(a.background)===JSON.stringify(b.background),label+' footer photo or fade changed')
 check(JSON.stringify(a.outside)===JSON.stringify(b.outside),label+' unrelated section geometry/content change')
 check(JSON.stringify(a.currency.options)===JSON.stringify(b.currency.options),label+' currency choices changed')
}
async function capture(p,a,width,stage,source=false){
 await reset(p)
 await p.screenshot({path:`${folder}/${source?'source':'homepage'}-${stage}-${width}.png`,fullPage:true,animations:'disabled'})
 await fs.writeFile(`${folder}/${source?'source':'homepage'}-${stage}-${width}-crop.json`,JSON.stringify(a.footer))
}
async function exercise(p,source=false){
 const q=selectors(source),select=p.locator(q.currency),initial=await select.inputValue()
 await p.keyboard.press('Tab');await select.focus()
 check(await select.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineWidth!=='0px'),(source?'Source':'Static')+' currency keyboard focus absent')
 const opts=await select.locator('option').evaluateAll(items=>items.map(o=>o.value))
 for(const value of opts){await select.selectOption(value);await p.waitForTimeout(120);check(await select.inputValue()===value,'Currency selection failed '+value);assertResult(await read(p,source),'Selected '+value)}
 await select.selectOption(initial);await reset(p)
 report.checks.push((source?'Source':'Static')+' currency focus and all four selections')
}
try{
 if(live){let deployed=false;for(let n=0;n<60;n++){try{const r=await fetch(url+cssPath+'?footer='+Date.now(),{signal:AbortSignal.timeout(15000)});if(r.ok&&hash(await r.text())===hash(current)){deployed=true;break}}catch{}await new Promise(r=>setTimeout(r,5000))}if(!deployed)throw new Error('Expected footer stylesheet is not deployed')}
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>report.problems.push(e.message))
 const response=page.waitForResponse(r=>r.url().includes('/'+cssPath));await page.goto(url,{waitUntil:'networkidle'});report.cssSha256=hash(await(await response).text());check(report.cssSha256===hash(current),'Loaded CSS hash differs');await fonts(page)
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=750){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60)}await page.waitForTimeout(500)
 for(const width of widths){
  await page.setViewportSize({width,height:1000});await reset(page)
  let b
  if(!live){const style=await page.addStyleTag({content:prior});await page.evaluate(()=>document.querySelector('link[href*="index-DhPZyX4z.css"]').disabled=true);await reset(page);b=await read(page);if([390,1440].includes(width))await capture(page,b,width,'before');await style.evaluate(e=>e.remove());await page.evaluate(()=>document.querySelector('link[href*="index-DhPZyX4z.css"]').disabled=false);await reset(page)}
  const a=await read(page);assertResult(a,'Static '+width);if(b)compare(b,a,'Static '+width)
  report.widths.push({width,before:b,after:a})
  if([390,1440].includes(width)){await capture(page,a,width,live?'live':'after');await exercise(page)}
 }
 for(const width of [390,1440]){await page.setViewportSize({width,height:500});await reset(page);assertResult(await read(page),'Short height '+width)}report.checks.push('Short screen heights with reduced motion')
 // Desktop 200% zoom reflow equivalent. Not a native browser zoom certification.
 await page.setViewportSize({width:720,height:450});await reset(page);assertResult(await read(page),'720 CSS pixel desktop zoom reflow');report.checks.push('200% desktop zoom reflow equivalent at 720 CSS pixels')
 if(!live){
  const sp=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});sp.on('pageerror',e=>report.problems.push('Source '+e.message));await sp.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});await fonts(sp)
  const sh=await sp.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<sh;y+=600){await sp.evaluate(y=>scrollTo(0,y),y);await sp.waitForTimeout(70)}await sp.waitForTimeout(350);await reset(sp)
  const originalSource=execFileSync('git',['show',baseline+':frontend/src/styles/components.css'],{encoding:'utf8'})
  for(const width of widths){await sp.setViewportSize({width,height:1000});await reset(sp);const style=await sp.addStyleTag({content:originalSource});await reset(sp);const b=await read(sp,true);if([390,1440].includes(width))await capture(sp,b,width,'before',true);await style.evaluate(e=>e.remove());await reset(sp);const a=await read(sp,true);assertResult(a,'Source '+width);compare(b,a,'Source '+width);report.source.push({width,before:b,after:a});if([390,1440].includes(width)){await capture(sp,a,width,'after',true);await exercise(sp,true)}}
  await sp.close()
 }
 const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});await touch.goto(url,{waitUntil:'networkidle'});await fonts(touch);await touch.locator('.currency-picker select').scrollIntoViewIfNeeded();await touch.locator('.currency-picker select').tap();await touch.keyboard.press('Escape');assertResult(await read(touch),'Touch currency');report.checks.push('Touch control tap and fit');await touch.close()
 await page.close()
}catch(e){report.problems.push(String(e))}finally{if(browser)await browser.close()}
await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({live,widths:report.widths.map(x=>x.width),sourceWidths:report.source.map(x=>x.width),checks:report.checks,problems:report.problems}))
if(report.problems.length)process.exitCode=1
