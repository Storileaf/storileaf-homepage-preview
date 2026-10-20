import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'
import { settledSnapshot } from './browser-readiness.mjs'

const root=path.resolve('..'),out=process.env.CRAFT_QA_OUT||'qa/media/physical'
const baseline='e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const widths=[320,360,390,430,600,768,820,1024,1280,1440]
const hash=b=>createHash('sha256').update(b).digest('hex')
const c=(kind,name)=>'.'+(kind==='source'?'sl-':'')+name
const problems=[],qualityFindings=[]
const report={checkpoint:'Physical book and complete shared samples section',baseline,sourceCommit:process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),createdAt:new Date().toISOString(),thresholds:{geometry:.15,pixelChannel:24,pixelRatio:.01},widths:[],states:[],captures:[],problems,qualityFindings}
const check=(ok,message)=>{if(!ok)problems.push(message)}
await fs.mkdir(out,{recursive:true})
report.sourceHashes={}
for(const folder of ['src','content']){
  async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else report.sourceHashes[file]=hash(await fs.readFile(file))}}
  await walk(folder)
}
report.harnessHashes={}
for(const file of ['scripts/verify-craft-parity.mjs','scripts/browser-readiness.mjs','scripts/verify-media-parity.mjs'])report.harnessHashes[file]=hash(await fs.readFile(file))
report.protectedHashes={}
for(const file of ['index.html','assets/index-DhPZyX4z.css','assets/routes-DrwDv2x2.js','assets/content-sections-CfrmOVRI.js','pricing/index.html']){
  const bytes=await fs.readFile(path.join(root,file)),protectedBytes=execFileSync('git',['show',baseline+':'+file])
  check(bytes.equals(protectedBytes),'Protected file differs '+file);report.protectedHashes[file]=hash(bytes)
}
const styleKeys=['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color','backgroundColor','backgroundImage','borderTopWidth','borderTopColor','borderRadius','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','gap','objectFit','objectPosition','display','position','alignItems','alignSelf','aspectRatio','opacity','strokeWidth','textDecorationLine']
function queries(kind){const x=n=>c(kind,n);return [
 ['field','#samples'],['heading',x('samples-heading')],['gallery-title','#samples-title'],['gallery-intro',x('samples-heading')+' p'],['rail',x('sample-rail')],['card',x('sample-card')],['craft',x('book-craft')],['photo-frame',x('book-craft-image')],['photo',x('book-craft-slide')],['copy',x('book-craft-copy')],['title','#book-craft-title'],['emphasis','#book-craft-title em'],['intro',x('book-craft-copy')+'>p'],['details',x('book-craft-details')],['detail',x('book-craft-detail')],['detail-heading',x('book-craft-detail-heading')],['icon',x('book-craft-detail-icon')],['icon-svg',x('book-craft-detail-icon')+' svg'],['detail-title',x('book-craft-detail')+' h4'],['description',x('book-craft-detail-description')],['action',x('book-craft-copy')+'>a'],['arrow',x('book-craft-copy')+'>a svg'],['indicators',x('book-craft-indicators')],['indicator',x('book-craft-indicator')],['dot',x('book-craft-indicator')+' span']
]}
async function snapshot(p,kind){return settledSnapshot(p,()=>p.evaluate(({queries,styleKeys})=>{
 const field=document.querySelector('#samples'),origin=field.getBoundingClientRect();
 const nodes=Object.fromEntries(queries.map(([key,selector])=>[key,[...document.querySelectorAll(selector)].map(el=>{
   const r=el.getBoundingClientRect(),s=getComputedStyle(el),style=Object.fromEntries(styleKeys.map(k=>[k,k==='fontFamily'?s[k].split(',')[0].replaceAll('"','').trim():s[k]]));
   if(!['title','emphasis','intro','detail-title','description','action','gallery-title','gallery-intro'].includes(key))for(const k of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color','textDecorationLine'])delete style[k];
   if(s.borderTopWidth==='0px')delete style.borderTopColor;
   const text=['title','emphasis','intro','detail-title','description','action','gallery-title','gallery-intro'].includes(key)?el.textContent.replace(/\s+/g,' ').trim():undefined;
   return {rect:[r.x-origin.x,r.y-origin.y,r.width,r.height],style,text,href:el.getAttribute('href'),alt:el.getAttribute('alt'),hidden:el.getAttribute('aria-hidden'),pressed:el.getAttribute('aria-pressed'),label:el.getAttribute('aria-label'),src:el.tagName==='IMG'?el.currentSrc:undefined}
 })]));
 return {nodes,active:field.querySelector('[data-active-slide]').getAttribute('data-active-slide'),overflow:document.documentElement.scrollWidth>innerWidth+1,pseudo:{fieldBefore:getComputedStyle(field,'::before').backgroundImage,photoAfter:getComputedStyle(field.querySelector('[data-active-slide]'),'::after').backgroundImage}}
},{queries:queries(kind),styleKeys}))}
function compare(b,a,label){let maxGeometry=0,differences=[];
 for(const [key,items]of Object.entries(b.nodes)){
  if(items.length!==a.nodes[key]?.length){differences.push(key+' count');continue}
  for(let i=0;i<items.length;i++){
   const x=items[i],y=a.nodes[key][i];for(let j=0;j<4;j++){const delta=Math.abs(x.rect[j]-y.rect[j]);maxGeometry=Math.max(maxGeometry,delta);if(delta>.15)differences.push(`${key}[${i}].rect[${j}] ${x.rect[j]} versus ${y.rect[j]}`)}
   for(const k of ['style','text','href','alt','hidden','pressed','label','src'])if(JSON.stringify(x[k])!==JSON.stringify(y[k]))differences.push(`${key}[${i}].${k}`)
  }
 }
 if(JSON.stringify(b.pseudo)!==JSON.stringify(a.pseudo))differences.push('shared background or photograph gradient')
 if(b.active!==a.active)differences.push('active slide')
 check(!differences.length,label+': '+differences.join('; '));check(!a.overflow&&!b.overflow,label+' document overflow');return {maxGeometry,differences}
}
async function ready(p,kind){
 await p.locator(c(kind,'book-craft')).waitFor()
 await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([document.fonts.load('450 58px Newsreader'),document.fonts.load('600 23px Newsreader'),document.fonts.load('400 15px Manrope')])})
 const originalLoading=await p.locator(c(kind,'book-craft-slide')).evaluateAll(images=>images.map(i=>i.getAttribute('loading')))
 check(JSON.stringify(originalLoading)===JSON.stringify(['eager','lazy','lazy','lazy']),kind+' original slideshow loading contract')
 await p.locator('#samples').evaluate(async el=>{for(const i of el.querySelectorAll('img'))i.loading='eager';await Promise.all([...el.querySelectorAll('img')].map(i=>i.decode()))})
 check(await p.locator('#samples img').evaluateAll(images=>images.length===10&&images.every(i=>i.complete&&i.naturalWidth>0)),kind+' all ten media images decode')
 const fonts=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));check(['Manrope','Newsreader'].every(n=>fonts.some(f=>f.includes(n))),kind+' actual fonts loaded')
}
async function select(p,kind,index){
 await p.bringToFront()
 await p.locator(c(kind,'book-craft-indicator')).nth(index).click()
 await p.waitForFunction(({selector,index})=>{const root=document.querySelector(selector);return root.getAttribute('data-active-slide')===String(index)&&[...root.querySelectorAll('img')].every((i,n)=>Math.abs(Number(getComputedStyle(i).opacity)-(n===index?1:0))<.001)}, {selector:c(kind,'book-craft-slideshow'),index},{timeout:5000})
 await p.mouse.move(0,0);await p.evaluate(()=>document.activeElement?.blur())
}
async function capture(p,kind,label){
 await p.bringToFront();const viewport=p.viewportSize();
 const before=await p.locator('#samples').boundingBox();const height=Math.ceil(before.height)+200
 await p.setViewportSize({width:viewport.width,height});
 const hidden=await p.addStyleTag({content:'.site-header,.sl-header{visibility:hidden!important}'});
 const padding=await p.evaluate(()=>document.body.style.paddingTop)
 await p.locator('#samples').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-60,behavior:'instant'}))
 const adjustment=await p.locator('#samples').evaluate(el=>{const r=el.getBoundingClientRect(),n=Math.ceil(r.top)-r.top;document.body.style.paddingTop=(parseFloat(getComputedStyle(document.body).paddingTop)+n)+'px';return n})
 await p.waitForTimeout(80)
 const bounds=await p.locator('#samples').boundingBox();check(Math.abs(bounds.width-before.width)<.15&&Math.abs(bounds.height-before.height)<.15,label+' capture changed section dimensions')
 const file=kind+'-'+label+'.png';await p.screenshot({path:path.join(out,file),clip:bounds,animations:'disabled'});
 report.captures.push({kind,file,width:viewport.width,height:bounds.height,adjustment,unchangedDimensions:Math.abs(bounds.height-before.height)<.15})
 await p.evaluate(value=>document.body.style.paddingTop=value,padding);await hidden.evaluate(el=>el.remove());await p.setViewportSize(viewport);return file
}
async function pixels(browser,before,after,label){
 const p=await browser.newPage();const data=await Promise.all([before,after].map(async file=>'data:image/png;base64,'+(await fs.readFile(path.join(out,file))).toString('base64')))
 const result=await p.evaluate(async ([b,a])=>{async function load(src){const i=new Image();i.src=src;await i.decode();return i}const [x,y]=await Promise.all([load(b),load(a)]);if(x.width!==y.width||x.height!==y.height)return {sameSize:false,widths:[x.width,y.width],heights:[x.height,y.height]};const canvas=document.createElement('canvas');canvas.width=x.width;canvas.height=x.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(x,0,0);const first=ctx.getImageData(0,0,x.width,x.height).data;ctx.clearRect(0,0,x.width,x.height);ctx.drawImage(y,0,0);const second=ctx.getImageData(0,0,x.width,x.height).data;let changed=0;for(let i=0;i<first.length;i+=4)if(Math.max(Math.abs(first[i]-second[i]),Math.abs(first[i+1]-second[i+1]),Math.abs(first[i+2]-second[i+2]))>24)changed++;return {sameSize:true,width:x.width,height:x.height,changed,total:x.width*x.height,ratio:changed/(x.width*x.height)}},data)
 await p.close();check(result.sameSize&&result.ratio<=.01,label+' screenshot comparison '+JSON.stringify(result));return result
}
async function enlarge(p,kind){const selector=c(kind,'book-craft-copy')+' h3,'+c(kind,'book-craft-copy')+'>p,'+c(kind,'book-craft-detail')+' h4,'+c(kind,'book-craft-detail-description')+','+c(kind,'book-craft-copy')+'>a';return p.evaluate(q=>{
 const items=[...document.querySelectorAll(q)].map(el=>({el,size:parseFloat(getComputedStyle(el).fontSize),line:parseFloat(getComputedStyle(el).lineHeight)}));for(const {el,size,line}of items){el.style.fontSize=size*2+'px';el.style.lineHeight=line*2+'px'}return items.map(({size,line})=>({size,line}))
},selector)}
async function clipped(p,kind){return p.evaluate(selector=>{const root=document.querySelector(selector),bad=[];for(const el of root.querySelectorAll('h3,h4,p,a')){const range=document.createRange();range.selectNodeContents(el);const box=el.getBoundingClientRect();for(const r of range.getClientRects())if(r.width>0&&(r.left<box.left-1||r.right>box.right+1||r.left<0||r.right>innerWidth+1))bad.push({text:el.textContent.trim(),left:r.left,right:r.right,boxLeft:box.left,boxRight:box.right})}return bad},c(kind,'book-craft-copy'))}
let browser
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});report.browser=await browser.version();
 const pages={};for(const kind of ['published','source']){const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>problems.push(kind+' '+e.message));await p.goto(kind==='source'?'http://127.0.0.1:4180/':'http://127.0.0.1:4173/storileaf-homepage-preview/',{waitUntil:'networkidle'});await ready(p,kind);pages[kind]=p}
 for(const width of widths){
  for(const p of Object.values(pages)){await p.setViewportSize({width,height:1000});await p.bringToFront();await p.waitForTimeout(100)}
  const row={width,slides:[]};
  for(let index=0;index<4;index++){
   const snapshots={},files={};for(const [kind,p]of Object.entries(pages)){await select(p,kind,index);snapshots[kind]=await snapshot(p,kind);files[kind]=await capture(p,kind,`${width}-slide-${index}`)}
   const result=compare(snapshots.published,snapshots.source,`${width} slide ${index}`),image=await pixels(browser,files.published,files.source,`${width} slide ${index}`);
   row.slides.push({index,...result,image,published:snapshots.published,source:snapshots.source});
  }report.widths.push(row)
 }
 for(const width of [390,1440]){
  const state={name:'keyboard-and-hover',width};for(const [kind,p]of Object.entries(pages)){
   await p.bringToFront();await p.setViewportSize({width,height:900});await p.keyboard.press('Tab');const controls=p.locator(c(kind,'book-craft-indicator'));await controls.nth(1).focus();await p.keyboard.press('Enter');await p.waitForTimeout(300);
   check(await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide')==='1',kind+' Enter selection');check(await controls.nth(1).evaluate(e=>e.matches(':focus-visible')&&getComputedStyle(e).outlineWidth==='2px'),kind+' indicator focus');
   await p.keyboard.press('Tab');await p.keyboard.press('Space');check(await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide')==='2',kind+' Tab and Space selection');
   const action=p.locator(c(kind,'book-craft-copy')+'>a');await action.hover();await p.waitForTimeout(300);state[kind]=await action.evaluate(el=>({href:el.href,decoration:getComputedStyle(el).textDecorationLine,transform:getComputedStyle(el.querySelector('svg')).transform}));check(state[kind].href==='https://storileaf.com/pricing/'&&state[kind].decoration==='underline',kind+' physical action hover/destination');
  }check(JSON.stringify(state.published)===JSON.stringify(state.source),'physical hover parity');report.states.push(state)
 }
 for(const [width,height]of [[320,568],[1024,500]]){
  const snapshots={};for(const [kind,p]of Object.entries(pages)){await p.setViewportSize({width,height});await select(p,kind,0);snapshots[kind]=await snapshot(p,kind)}report.states.push({name:'short-screen',width,height,...compare(snapshots.published,snapshots.source,'short '+width)})
 }
 for(const width of [320,1440]){
  const state={name:'targeted-200-percent-text',width,method:'Double computed physical heading, paragraph and editorial action font size and line height. This is not native browser zoom.'};const snaps={},files={};
  for(const [kind,p]of Object.entries(pages)){await p.setViewportSize({width,height:width===320?568:900});await select(p,kind,0);state[kind]={metrics:await enlarge(p,kind)};snaps[kind]=await snapshot(p,kind);state[kind].clipped=await clipped(p,kind);files[kind]=await capture(p,kind,width+'-text200');if(state[kind].clipped.length)qualityFindings.push({kind,width,issue:'Physical text exceeds its element or viewport bounds',details:state[kind].clipped})}
  state.comparison=compare(snaps.published,snaps.source,'enlarged '+width);state.image=await pixels(browser,files.published,files.source,'enlarged '+width);report.states.push(state)
  for(const [kind,p]of Object.entries(pages))await p.locator(c(kind,'book-craft-copy')+' [style]').evaluateAll(nodes=>nodes.forEach(n=>n.removeAttribute('style')))
 }
 // Actual elapsed time, not patched timers. Test both implementations together.
 const timed={name:'slideshow-real-time',intervalMilliseconds:6500,variants:{}}
 for(const [kind,p]of Object.entries(pages)){
  await p.setViewportSize({width:1440,height:900});
  await p.locator(c(kind,'book-craft-slideshow')).evaluate(el=>{
   window.__craftTransitions=[];
   window.__craftObserver=new MutationObserver(()=>window.__craftTransitions.push({index:el.getAttribute('data-active-slide'),at:performance.now()}));
   window.__craftObserver.observe(el,{attributes:true,attributeFilter:['data-active-slide']});
  });
  await p.emulateMedia({reducedMotion:'no-preference'});
 }
 for(const [kind,p]of Object.entries(pages)){await select(p,kind,3);await p.locator(c(kind,'book-craft-slideshow')).scrollIntoViewIfNeeded()}
 const start=Date.now();await Promise.all(Object.entries(pages).map(async([kind,p])=>{await p.bringToFront();await p.waitForFunction(q=>document.querySelector(q).getAttribute('data-active-slide')==='0',c(kind,'book-craft-slideshow'),{timeout:8500});const transitions=await p.evaluate(()=>window.__craftTransitions),three=transitions.find(x=>x.index==='3'),zero=transitions.find(x=>x.index==='0');
  const interval=three&&zero?zero.at-three.at:null;
  check(interval>=6300&&interval<=8000,kind+' real 6500ms interval '+interval);
  timed.variants[kind]={wrapped:true,elapsedMilliseconds:Date.now()-start,intervalMilliseconds:interval,transitions}}));
 for(const [kind,p]of Object.entries(pages)){await p.emulateMedia({reducedMotion:'reduce'});await select(p,kind,2)}await new Promise(r=>setTimeout(r,6800));for(const [kind,p]of Object.entries(pages))check(await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide')==='2',kind+' reduced motion disables autoplay')
 for(const [kind,p]of Object.entries(pages)){await p.emulateMedia({reducedMotion:'no-preference'});await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(250);timed.variants[kind].offscreenStart=await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide')}
 await new Promise(r=>setTimeout(r,6800));for(const [kind,p]of Object.entries(pages)){timed.variants[kind].offscreenEnd=await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide');check(timed.variants[kind].offscreenStart===timed.variants[kind].offscreenEnd,kind+' offscreen slideshow pause')}
 report.states.push(timed)
 for(const kind of ['published','source']){const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});await p.goto(kind==='source'?'http://127.0.0.1:4180/':'http://127.0.0.1:4173/storileaf-homepage-preview/',{waitUntil:'networkidle'});await ready(p,kind);for(let i=0;i<4;i++){await p.locator(c(kind,'book-craft-indicator')).nth(i).tap();check(await p.locator(c(kind,'book-craft-slideshow')).getAttribute('data-active-slide')===String(i),kind+' touch slide '+i)}report.states.push({name:'emulated-touch-four-slides',kind});await p.close()}
 for(const p of Object.values(pages))await p.close()
}catch(error){problems.push('Physical checkpoint interrupted: '+error.stack)}finally{if(browser)await browser.close()}
report.completedAt=new Date().toISOString();report.result=problems.length?'failed':'passed';report.captureMethod='Real endpoint renders with downloaded fonts and decoded existing media. Complete samples field, including radial background, compared in every slide. Clean crops temporarily enlarge viewport height, hide the unrelated fixed header and add less than one pixel body padding; section dimensions are asserted unchanged and adjustments restored.'
await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({result:report.result,widths:report.widths.length,slides:report.widths.reduce((n,x)=>n+x.slides.length,0),states:report.states.length,captures:report.captures.length,problems,qualityFindings}))
if(problems.length)process.exitCode=1
