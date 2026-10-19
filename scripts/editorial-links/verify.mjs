import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'

const baseline='66327e0fc83e48b7547c10e3ee58f4ddf89c4f39'
const cssPath='assets/index-DhPZyX4z.css'
const footerComparison = '#top[data-testid="storileaf-home"] .site-footer .footer-column h3{font-size:15px;line-height:1.4}#top[data-testid="storileaf-home"] .site-footer .currency-picker select{font-size:13px}'
const before=execFileSync('git',['show',baseline+':'+cssPath],{encoding:'utf8'})+'\n'+footerComparison
const after=await fs.readFile(cssPath,'utf8')
const live=process.argv.includes('--live')
const base=live?'https://storileaf.github.io/storileaf-homepage-preview/':'http://127.0.0.1:4173/storileaf-homepage-preview/'
const folder=live?'qa/editorial-links-live':'qa/editorial-links'
await fs.mkdir(folder,{recursive:true})
const report={baseline,commit:process.env.GITHUB_SHA,live,widths:[],footer:[],source:[],problems:[]}
const check=(ok,message)=>{if(!ok)report.problems.push(message)}
const hash=s=>createHash('sha256').update(s).digest('hex')
const targets='.text-link,.resource-card-link,.resource-all-link'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
page.on('pageerror',e=>report.problems.push(e.message))
const fonts=async p=>p.evaluate(async()=>{await document.fonts.ready;await Promise.all([document.fonts.load('650 15px Manrope'),document.fonts.load('450 64px Newsreader')]);await document.fonts.ready})
const useCss=async css=>{await page.evaluate(css=>{document.querySelector('link[href*="index-DhPZyX4z.css"]').disabled=true;let s=document.getElementById('editorial-review-css');if(!s){s=document.createElement('style');s.id='editorial-review-css';document.head.append(s)}s.textContent=css},css);await page.waitForTimeout(350)}
const reset=async()=>{await page.mouse.move(0,0);await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges();document.querySelectorAll('.faq-item').forEach(e=>e.open=true);scrollTo({top:0,behavior:'instant'})});await page.waitForTimeout(350)}
const controls=()=>page.evaluate(()=>[...document.querySelectorAll('.site-header,.site-header *,.button,.newsletter-inline-preview input,.site-footer,.site-footer *')].map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className:null,text:el.textContent.trim(),href:el.getAttribute('href'),w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,colour:s.color,background:s.backgroundColor,radius:s.borderRadius,padding:s.padding,margin:s.margin,gap:s.gap}}))
// Typed computed margins preserve the authored auto role. Its used pixel value
// legitimately changes when a flex item's approved text line becomes taller.
const labels=()=>page.locator(targets).evaluateAll(items=>items.map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect(),svg=el.querySelector('svg');return {text:el.textContent.trim(),tag:el.tagName,href:el.getAttribute('href'),size:s.fontSize,font:s.fontFamily,weight:s.fontWeight,colour:s.color,line:s.lineHeight,padding:s.padding,margin:['margin-top','margin-right','margin-bottom','margin-left'].map(p=>el.computedStyleMap().get(p).toString()).join(' '),usedMargin:s.margin,gap:s.gap,w:r.width,h:r.height,x:r.x,right:r.right,svg:svg?{w:getComputedStyle(svg).width,h:getComputedStyle(svg).height}:null}}))
async function shots(width,stage){
 await reset();await page.screenshot({path:`${folder}/homepage-${stage}-${width}.png`,fullPage:true,animations:'disabled'})
 const crops=await page.evaluate(()=>Object.fromEntries(['.book-craft','.resources-section','.faq-section','.site-footer'].map(q=>{const el=document.querySelector(q),r=el?.getBoundingClientRect();return [q,r?{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}:null]})))
 await fs.writeFile(`${folder}/crops-${stage}-${width}.json`,JSON.stringify(crops,null,2))
}
try {
 if(live){let deployed=false;for(let i=0;i<60;i++){try{const r=await fetch(base+cssPath+'?review='+Date.now(),{signal:AbortSignal.timeout(15000)});if(r.ok&&hash(await r.text())===hash(after)){deployed=true;break}}catch{}await new Promise(r=>setTimeout(r,5000))}check(deployed,'Expected stylesheet not deployed');if(!deployed)throw new Error('Deployment unavailable')}
 const responsePromise=page.waitForResponse(r=>r.url().includes('/'+cssPath));await page.goto(base,{waitUntil:'networkidle'});const cssResponse=await responsePromise
 check(hash(await cssResponse.text())===hash(after),'Browser stylesheet hash differs')
 await fonts(page)
 report.loadedFonts=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family))
 for(const f of ['Manrope','Newsreader'])check(report.loadedFonts.some(n=>n.includes(f)),'Brand font missing '+f)
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60)}
 await page.waitForTimeout(500)
 for(const width of [320,360,390,430,768,820,1024,1280,1440]){
  await page.setViewportSize({width,height:1000});await reset()
  let b,cb
  if(!live){await useCss(before);b=await labels();cb=await controls();if(width===390||width===1440)await shots(width,'before');await useCss(after);await reset()}
  const a=await labels(),ca=await controls()
  check(a.length===9,'Editorial label count changed at '+width)
  check(a.every(x=>x.size==='15px'&&x.font.includes('Manrope')),'Editorial size or font differs at '+width)
  check(a.every(x=>x.x>=-1&&x.right<=width+1),'Editorial text overflows at '+width)
  if(!live){check(JSON.stringify(cb)===JSON.stringify(ca),'Button/navigation/footer styling changed at '+width);for(let i=0;i<a.length;i++)for(const k of ['text','tag','href','font','weight','colour','padding','margin','gap','svg'])check(JSON.stringify(a[i][k])===JSON.stringify(b[i][k]),'Unexpected editorial '+k+' change at '+width+' '+a[i].text)}
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Page overflow at '+width)
  const footer=await page.evaluate(()=>({width:innerWidth,headings:[...document.querySelectorAll('.footer-column h3')].map(el=>({text:el.textContent,size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight,line:getComputedStyle(el).lineHeight})),links:[...document.querySelectorAll('.footer-column a')].map(el=>({text:el.textContent,size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight})),currency:getComputedStyle(document.querySelector('.currency-picker select')).fontSize,legal:getComputedStyle(document.querySelector('.footer-bottom')).fontSize,currentPageLinks:[...document.querySelectorAll('.site-footer [aria-current]')].map(el=>({text:el.textContent,href:el.getAttribute('href'),current:el.getAttribute('aria-current')}))}))
  report.footer.push(footer);report.widths.push({width,labels:a,unchangedControls:live?null:JSON.stringify(cb)===JSON.stringify(ca)})
  const ask=page.locator('.faq-intro .text-link');await page.keyboard.press('Tab');await ask.focus();check(await ask.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineWidth!=='0px'),'Editorial focus absent at '+width)
  if(width===390||width===1440)await shots(width,live?'live':'after')
 }
 if(!live){
  // Targeted text enlargement, not a claim of full native-browser zoom certification.
  await page.setViewportSize({width:320,height:900});await reset()
  const large=await page.addStyleTag({content:'#top[data-testid="storileaf-home"]{--sl-text-editorial-action:1.875rem}'});await page.waitForTimeout(350)
  check((await labels()).every(x=>x.size==='30px'&&x.right<=321&&x.x>=-1),'Editorial enlargement clips at 320px')
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>321)),'Enlarged editorial text creates document overflow');await large.evaluate(e=>e.remove())
  report.textEnlargement=true
  const sp=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});sp.on('pageerror',e=>report.problems.push('Source '+e.message));await sp.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});await fonts(sp)
  for(const width of [320,360,390,430,768,820,1024,1280,1440]){await sp.setViewportSize({width,height:1000});const sizes=await sp.locator('.sl-action--text').evaluateAll(items=>items.map(e=>getComputedStyle(e).fontSize));check(sizes.length===3&&sizes.every(s=>s==='15px'),'Source editorial role differs at '+width);report.source.push({width,sizes});check(!(await sp.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Source overflow at '+width)}
  // Test-only fixtures, removed before screenshots. No new copy or working destination is published.
  const fixtures=await sp.evaluate(()=>{const el=document.createElement('div');el.id='editorial-fixtures';el.innerHTML='<a class="sl-action sl-action--primary">Primary</a><a class="sl-action sl-action--outline">Outline</a><a class="sl-action sl-action--gold">Gold</a><p class="sl-copy sl-copy--body">Text <a>inline</a></p><p class="sl-copy sl-copy--lead">Lead <a>inline</a></p>';document.body.append(el);const result={buttons:[...el.querySelectorAll('.sl-action')].map(a=>getComputedStyle(a).fontSize),inline:[...el.querySelectorAll('p a')].map(a=>({child:getComputedStyle(a).fontSize,parent:getComputedStyle(a.parentElement).fontSize}))};el.remove();return result});check(fixtures.buttons.every(s=>s==='14px'),'Filled/outline/gold source button labels changed');check(fixtures.inline.every(x=>x.child===x.parent),'Inline source links do not inherit');report.fixtures=fixtures;await sp.close()
 }
 report.missingImages=await page.evaluate(()=>[...document.images].filter(img=>img.currentSrc&&(!img.complete||!img.naturalWidth)).map(img=>img.currentSrc));check(report.missingImages.length===0,'Missing homepage images')
} catch(e){report.problems.push(String(e))}
finally{await browser.close()}
await fs.writeFile(folder+'/report.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({live,widths:report.widths.map(x=>x.width),footer:report.footer.filter(x=>[390,1440].includes(x.width)),problems:report.problems}))
if(report.problems.length)process.exitCode=1
