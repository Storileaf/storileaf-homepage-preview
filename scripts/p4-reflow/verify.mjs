import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'

const out = process.env.P4_OUT || 'qa/p4-reflow'
const widths = (process.env.P4_WIDTHS || '320,360,390,430,600,768,820,1024,1280,1440').split(',').map(Number)
const urls = { before: process.env.P4_BEFORE || 'http://127.0.0.1:4173/react-review/', candidate: process.env.P4_AFTER || 'http://127.0.0.1:4173/frontend/dist/' }
const targets = { header: '.sl-header', gifting: '#gifting', footer: '.sl-footer', tabs: '.sl-book-tabs-scroll', progression: '.hero-progression' }
const textTargets = { header: '.sl-header a,.sl-header button', gifting: '#gifting h2,#gifting p,#gifting a', footer: '.sl-footer h3,.sl-footer p,.sl-footer a,.sl-footer-bottom span', tabs: '.sl-book-tab-trigger', progression: '.hero-progression>span' }
const enlargeSelector = '#gifting h2,#gifting h2 em,#gifting p,#gifting a,.sl-header a,.sl-header button,.sl-newsletter h2,.sl-newsletter h2 em,.sl-newsletter p,.sl-newsletter a,.sl-newsletter input,.sl-footer h3,.sl-footer p,.sl-footer a,.sl-footer select,.sl-footer-bottom span,#books h2,#books h2 em,#books p,#books li,#books [role="tab"],#books [role="tabpanel"][data-state="active"] a,.hero h1,.hero h1 em,.hero-progression,.hero-progression b,.hero-progression i,.hero-description,.hero-actions a,.hero-marquee-group>span,.hero-marquee-group i'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const report = { checkpoint: 'P4-01 through P4-04 text reflow', sourceCommit: process.env.GITHUB_SHA || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), baselineSource: '051c69611d8bd685b79268489e5ff04bd64b9ed5', protectedBaseline: 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b', createdAt: new Date().toISOString(), thresholds: {geometry:.15,pixelChannel:24,pixelRatio:.01}, widths:[], states:[], failures:[], sourceHashes:{}, captureMethod:'Native scrolled viewport tiles. The sticky header is hidden only for nonheader component crops, without changing layout. No target text, image, CSS or comparison threshold is replaced. Enlarged before/after images are evidence of the authorised difference, not pixel equality gates.', limits:'Chromium automation. Text enlargement explicitly doubles targeted font sizes and line heights. Touch, when exercised, is emulated. No native browser zoom, physical-device or screen-reader speech claim.' }
const check = (ok,message) => { if(!ok) report.failures.push(message) }
await fs.mkdir(out,{recursive:true})
async function files(dir){for(const ent of await fs.readdir(dir,{withFileTypes:true})){const name=path.join(dir,ent.name);if(ent.isDirectory())await files(name);else report.sourceHashes[name]=hash(await fs.readFile(name))}}
await files('frontend/src');await files('frontend/content')
let browser
const frames = p => p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
async function ready(p,url) {
  await p.goto(url,{waitUntil:'domcontentloaded'})
  await p.locator('.sl-footer').waitFor({state:'attached'})
  await p.evaluate(async()=>{
    await Promise.all([document.fonts.load('650 14px Manrope'),document.fonts.load('400 15px Manrope'),document.fonts.load('450 50px Newsreader'),document.fonts.load('italic 420 50px Newsreader')]);await document.fonts.ready
  })
  await frames(p)
  check(await p.evaluate(()=>['Manrope','Newsreader'].every(name=>[...document.fonts].some(f=>f.family.includes(name)&&f.status==='loaded'))),'Real approved fonts loaded '+url)
}
async function snapshot(p){return p.evaluate(targets=>{
 const r=e=>{const b=e.getBoundingClientRect();return[b.x,b.y+scrollY,b.width,b.height]}
 const groups={}
 for(const [key,selector]of Object.entries(targets)){
  const root=document.querySelector(selector)
  groups[key]=[root,...root.querySelectorAll('*')].filter(e=>e.getClientRects().length&&e.checkVisibility()).map(e=>({tag:e.tagName,text:e.children.length?null:e.textContent,rect:r(e),href:e.getAttribute('href'),style:Object.fromEntries(['fontFamily','fontSize','lineHeight','fontWeight','letterSpacing','color','backgroundColor','paddingTop','paddingRight','paddingBottom','paddingLeft','borderRadius'].map(k=>[k,getComputedStyle(e)[k]]))}))
 }
 return {groups, sections:[...document.querySelectorAll('main>section,.sl-newsletter-footer')].map(e=>({id:e.id,rect:r(e)})),overflow:document.documentElement.scrollWidth>innerWidth+1}
},targets)}
async function tiles(p,selector,label){
 const hide=selector!=='.sl-header'
 if(hide) await p.locator('.sl-header').evaluate(e=>{e.dataset.p4Visibility=e.style.visibility;e.style.visibility='hidden'})
 const captures=[]
 try{
  const el=p.locator(selector)
  await el.scrollIntoViewIfNeeded()
  await el.evaluate(async root=>{await Promise.all([...root.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})))})
  await frames(p)
  const original=await el.evaluate(e=>{const r=e.getBoundingClientRect();return{top:r.top+scrollY,height:r.height}})
  for(let offset=0;offset<original.height;offset+=800){
   if(selector==='.sl-header')await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
   else await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.floor(original.top+offset))
   await frames(p)
   const box=await el.boundingBox(),v=p.viewportSize()
   const top=Math.max(0,box.y),left=Math.max(0,box.x),height=Math.min(v.height-top,box.y+box.height-top,800)
   const width=Math.min(v.width-left,box.x+box.width-left)
   if(height<=0||width<=0)break
   const name=label+'-'+captures.length+'.png'
   const data=await p.screenshot({path:path.join(out,name),clip:{x:left,y:top,width,height},caret:'hide'})
   captures.push({file:name,sha256:hash(data),width,height,offset,scrollY:await p.evaluate(()=>scrollY)})
   if(selector==='.sl-header')break
  }
 }finally{if(hide)await p.locator('.sl-header').evaluate(e=>{e.style.visibility=e.dataset.p4Visibility;delete e.dataset.p4Visibility})}
 return captures
}
async function pixels(p,left,right){return p.evaluate(async([a,b])=>{
 const load=s=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src='data:image/png;base64,'+s})
 const [x,y]=await Promise.all([load(a),load(b)]);if(x.width!==y.width||x.height!==y.height)return{sameSize:false,left:[x.width,x.height],right:[y.width,y.height]}
 const canvas=document.createElement('canvas');canvas.width=x.width;canvas.height=x.height;const c=canvas.getContext('2d');c.drawImage(x,0,0);const u=c.getImageData(0,0,x.width,x.height).data;c.clearRect(0,0,x.width,x.height);c.drawImage(y,0,0);const v=c.getImageData(0,0,x.width,x.height).data;let changed=0;for(let i=0;i<u.length;i+=4)if([0,1,2,3].some(k=>Math.abs(u[i+k]-v[i+k])>24))changed++;return{sameSize:true,changed,ratio:changed/(x.width*x.height)}
},await Promise.all([left,right].map(async name=>(await fs.readFile(path.join(out,name))).toString('base64'))))}
async function enlarge(p,selector=enlargeSelector){
 const metrics=await p.locator(selector).evaluateAll(es=>{
  const nodes=es.filter(e=>e.checkVisibility()&&!e.closest('svg')&&(e.textContent.trim()||e.matches('select,input')))
  const data=nodes.map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}))
  for(const {e,size,line}of data){e.style.fontSize=size*2+'px';if(Number.isFinite(line))e.style.lineHeight=line*2+'px'}
  return data.map(({e,size,line})=>({tag:e.tagName,text:e.textContent.trim().slice(0,80),size:size*2,line:line*2}))
 })
 await frames(p);return metrics
}
async function quality(p){return p.evaluate(textTargets=>{
 const findings=[]
 for(const [group,selector]of Object.entries(textTargets))for(const e of document.querySelectorAll(selector)){
  if(!e.checkVisibility()||!e.getClientRects().length||e.closest('[aria-hidden="true"]'))continue
  const box=e.getBoundingClientRect(),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n
  while(n=walker.nextNode()){
   if(!n.textContent.trim()||n.parentElement.closest('svg,option'))continue
   const range=document.createRange();range.selectNodeContents(n)
   for(const r of range.getClientRects())if(r.width>.1&&(r.left<box.left-1||r.right>box.right+1||(group!=='tabs'&&(r.left<0||r.right>innerWidth+1)))) findings.push({group,text:n.textContent.trim(),left:r.left,right:r.right,boxLeft:box.left,boxRight:box.right})
  }
 }
 const header=document.querySelector('.sl-header-inner'),hr=header.getBoundingClientRect()
 const headerChildren=[...header.children].filter(e=>e.checkVisibility()&&getComputedStyle(e).position!=='absolute'&&e.getBoundingClientRect().width).map(e=>({name:e.className,rect:e.getBoundingClientRect().toJSON()}))
 for(const {name,rect} of headerChildren)if(rect.left<hr.left-1||rect.right>hr.right+1||rect.top<hr.top-1||rect.bottom>hr.bottom+1)findings.push({group:'header-box',name,rect,container:hr.toJSON()})
 for(let i=1;i<headerChildren.length;i++)if(headerChildren[i-1].rect.right>headerChildren[i].rect.left+1)findings.push({group:'header-overlap',left:headerChildren[i-1],right:headerChildren[i]})
 const currency=document.querySelector('.sl-footer-currency'),logo=document.querySelector('.sl-footer-logo img'),brand=document.querySelector('.sl-footer-brand'),cr=currency.getBoundingClientRect(),lr=logo.getBoundingClientRect()
 if(cr.left<0||cr.right>innerWidth+1)findings.push({group:'currency-box',rect:cr.toJSON()})
 if(Math.min(cr.right,lr.right)>Math.max(cr.left,lr.left)+1&&Math.min(cr.bottom,lr.bottom)>Math.max(cr.top,lr.top)+1)findings.push({group:'currency-logo-overlap'})
 return{findings,overflow:document.documentElement.scrollWidth>innerWidth+1,headerHeight:hr.height,currency:{rect:cr.toJSON(),wrapped:brand.hasAttribute('data-currency-wrap'),value:currency.querySelector('select').value},tabs:[...document.querySelectorAll('.sl-book-tab-trigger')].map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()}))}
},textTargets)}
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']})
 report.browser=browser.version();report.node=process.version;report.platform=process.platform;report.playwright=JSON.parse(await fs.readFile('node_modules/playwright-core/package.json','utf8')).version
 for(const width of widths){
  const row={width,normal:{},enlarged:{},normalPixels:[],geometryDifferences:[]},ps={}
  for(const kind of ['before','candidate']){ps[kind]=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});ps[kind].on('pageerror',e=>check(false,kind+' '+width+' '+e.message));await ready(ps[kind],urls[kind])}
  for(const [kind,p]of Object.entries(ps)){row.normal[kind]=await snapshot(p);row.normal[kind].captures={};for(const [key,selector]of Object.entries(targets))row.normal[kind].captures[key]=await tiles(p,selector,'normal-'+kind+'-'+key+'-'+width)}
  const b=row.normal.before,a=row.normal.candidate
  for(const key of Object.keys(targets)){
   const x=b.groups[key],y=a.groups[key];check(x.length===y.length,`Normal ${key} node membership ${width}`)
   for(let i=0;i<Math.min(x.length,y.length);i++){for(const prop of ['tag','text','href','style'])check(JSON.stringify(x[i][prop])===JSON.stringify(y[i][prop]),`Normal ${key}[${i}] ${prop} ${width}`);x[i].rect.forEach((v,j)=>{if(Math.abs(v-y[i].rect[j])>.15)row.geometryDifferences.push({key,node:i,dimension:j,before:v,after:y[i].rect[j]})})}
   const before=b.captures[key],after=a.captures[key];check(before.length===after.length,`Normal ${key} tile count ${width}`)
   for(let i=0;i<Math.min(before.length,after.length);i++){const result=await pixels(ps.candidate,before[i].file,after[i].file);row.normalPixels.push({key,tile:i,...result});check(result.sameSize&&result.ratio<=.01,`Normal ${key} pixels ${width} tile ${i}`)}
  }
  check(!row.geometryDifferences.length,'Normal target geometry '+width)
  check(b.sections.length===a.sections.length&&b.sections.every((s,i)=>s.id===a.sections[i]?.id&&s.rect.every((v,j)=>Math.abs(v-a.sections[i].rect[j])<=.15)),'Normal complete section positions '+width)
  check(!a.overflow,'Normal document overflow '+width)
  for(const [kind,p]of Object.entries(ps)){
   row.enlarged[kind]={metrics:await enlarge(p)};row.enlarged[kind].quality=await quality(p);row.enlarged[kind].captures={}
   for(const [key,selector]of Object.entries(targets))row.enlarged[kind].captures[key]=await tiles(p,selector,'enlarged-'+kind+'-'+key+'-'+width)
  }
  check(!row.enlarged.candidate.quality.findings.length,'Enlarged text/controls fit '+width)
  check(!row.enlarged.candidate.quality.overflow,'Enlarged document overflow '+width)
  const p=ps.candidate;row.currency=[]
  for(const value of ['inr','usd','cad','gbp']){await p.locator('.sl-footer-currency select').selectOption(value);await frames(p);const q=await quality(p);row.currency.push({value,quality:q});check(!q.findings.some(f=>f.group.startsWith('currency')),'Enlarged currency fit '+value+' '+width);check(await p.locator('.sl-header-simple-link').last().getAttribute('href')==='https://storileaf.github.io/storileaf-homepage-preview/pricing/'+value,'Currency preserves pricing destination '+value+' '+width)}
  row.tabs=[];await p.locator('.sl-book-tab-trigger').first().focus()
  for(let i=0;i<6;i++){const tab=p.locator('.sl-book-tab-trigger').nth(i);await tab.focus();await tab.press('Enter');await frames(p);const state=await tab.evaluate(e=>({label:e.textContent,selected:e.getAttribute('aria-selected'),focused:document.activeElement===e,panel:document.getElementById(e.getAttribute('aria-controls'))?.getAttribute('data-state')}));row.tabs.push(state);check(state.selected==='true'&&state.focused&&state.panel==='active','Enlarged native tab '+i+' '+width)}
  row.menu={}
  await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await frames(p)
  if(width>1130){for(const name of ['Books','Resources']){const t=p.locator('.sl-header-nav-trigger').filter({hasText:name});await t.focus();await t.press('Enter');await p.locator(name==='Books'?'[data-testid="books-dropdown"]':'[data-testid="resources-dropdown"]').waitFor();await t.press('Escape');row.menu[name]=await t.evaluate(e=>document.activeElement===e);check(row.menu[name],'Enlarged desktop menu Escape/focus '+name+' '+width)}}
  else{const t=p.getByTestId('mobile-menu');await t.focus();await t.press('Enter');await p.locator('.sl-mobile-nav-dialog').waitFor();await enlarge(p,'.sl-mobile-nav-dialog p,.sl-mobile-nav-dialog a,.sl-mobile-nav-dialog summary');await p.keyboard.press('Escape');await p.locator('.sl-mobile-nav-dialog').waitFor({state:'detached'});await frames(p);row.menu.mobile=await t.evaluate(e=>document.activeElement===e);check(row.menu.mobile,'Mobile menu focus restoration '+width)}
  report.widths.push(row);for(const p of Object.values(ps))await p.close()
 }
}catch(error){report.failures.push(error.stack||String(error))}
finally{report.finishedAt=new Date().toISOString();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');await browser?.close()}
console.log(JSON.stringify({widths:report.widths.length,failures:report.failures,report:path.join(out,'report.json')},null,2))
if(report.failures.length)process.exitCode=1
