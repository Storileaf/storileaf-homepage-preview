import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { settledSnapshot } from './browser-readiness.mjs'

const out = 'qa/process'
const widths = process.env.PROCESS_WIDTHS?.split(',').map(Number) || [320,360,390,430,600,768,820,1024,1280,1440]
const baseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
const urls = { published: process.env.STORILEAF_BASELINE_URL || 'http://127.0.0.1:4173/storileaf-homepage-preview/', source: process.env.STORILEAF_SOURCE_URL || 'http://127.0.0.1:4180/' }
const content = JSON.parse(await fs.readFile('content/process.json','utf8'))
const problems = [], qualityFindings = []
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const report = { checkpoint: 'Package 3 Group 6 How it works', sourceCommit: process.env.GITHUB_SHA || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), baseline, createdAt: new Date().toISOString(), thresholds:{ geometry:.15, pixelChannel:24, pixelRatio:.01 }, widths:[], states:[], captures:[], preparation:[], sourceHashes:{}, problems, qualityFindings, limits:'Actual served static and React pages in Chromium. Touch is emulated and enlargement is targeted text doubling, not native zoom, physical device, other engine or accessibility certification.', captureMethod:'Align the section document origin by less than one CSS pixel of body padding, asserting unchanged section dimensions. No target CSS or scroll formula is replaced. Clean captures hide only the unrelated fixed header. Context captures retain it. Native rendering, fonts, image decoding and real scroll events remain in use.' }
const check = (ok,message) => { if (!ok) problems.push(message) }
const cls = (kind,name) => '.' + (kind === 'source' ? 'sl-' : '') + name
await fs.mkdir(out,{recursive:true})
for (const folder of ['src','content']) {
  async function walk(dir) { for(const e of await fs.readdir(dir,{withFileTypes:true})) { const file=path.join(dir,e.name); if(e.isDirectory()) await walk(file); else report.sourceHashes[file]=hash(await fs.readFile(file)) } }
  await walk(folder)
}
report.harnessHashes={}
for (const file of ['scripts/verify-process-parity.mjs','scripts/browser-readiness.mjs','scripts/inherited-process-content.mjs']) report.harnessHashes[file]=hash(await fs.readFile(file))
report.protectedHashes={}
for (const file of ['index.html','assets/index-DhPZyX4z.css','assets/content-sections-CfrmOVRI.js','pricing/index.html']) {
  const bytes=await fs.readFile('../'+file)
  check(bytes.equals(execFileSync('git',['show',baseline+':'+file])),'Protected baseline changed '+file)
  report.protectedHashes[file]=hash(bytes)
}
const styleKeys=['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color','backgroundColor','borderTopWidth','borderBottomWidth','borderColor','borderRadius','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','gap','rowGap','columnGap','objectFit','objectPosition','display','position','alignItems','alignSelf','justifySelf','boxShadow','opacity','outlineWidth','outlineStyle','outlineColor','outlineOffset']
function queries(kind) {const c=name=>cls(kind,name);return [
 ['root','#how-it-works'],['grid',c('process-grid')],['heading','#process-title'],['emphasis','#process-title strong'],['steps',c('process-steps')],['row',c('process-steps')+' li'],['button',c('process-step')],['number',c('step-number')],['text',c('step-text')],['step-title',c('step-text')+' strong'],['description',c('step-text')+'>span'],['actions',c('process-bottom-actions')],['action',c('process-bottom-actions')+' a'],['arrow',c('process-bottom-actions')+' svg'],['visual','#process-visual'],['photo',c('process-photo')]
]}
async function snapshot(p,kind) {
  return settledSnapshot(p,()=>p.evaluate(({queries,styleKeys})=>{
    const root=document.querySelector('#how-it-works'), origin=root.getBoundingClientRect()
    const nodes=Object.fromEntries(queries.map(([key,selector])=>[key,[...document.querySelectorAll(selector)].map(el=>{
      const r=el.getBoundingClientRect(), s=getComputedStyle(el), style=Object.fromEntries(styleKeys.map(k=>[k,k==='fontFamily'?s[k].split(',')[0].replaceAll('"','').trim():s[k]]))
      if(!['heading','emphasis','number','step-title','description','action'].includes(key))for(const k of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color'])delete style[k]
      if(s.borderTopWidth==='0px'&&s.borderBottomWidth==='0px')delete style.borderColor
      if(s.outlineStyle==='none'||s.outlineWidth==='0px')for(const k of ['outlineWidth','outlineStyle','outlineColor','outlineOffset'])delete style[k]
      return {rect:[r.x-origin.x,r.y-origin.y,r.width,r.height],style,text:['heading','emphasis','number','step-title','description','action'].includes(key)?el.textContent.replace(/\s+/g,' ').trim():undefined,pressed:el.getAttribute('aria-pressed'),controls:el.getAttribute('aria-controls'),alt:el.getAttribute('alt'),src:el.tagName==='IMG'?el.currentSrc:undefined}
    })]))
    const after=getComputedStyle(root,'::after')
    return {nodes,active:[...root.querySelectorAll('button[aria-pressed]')].findIndex(e=>e.getAttribute('aria-pressed')==='true'),pressedCount:root.querySelectorAll('[aria-pressed="true"]').length,runway:after.content==='none'?0:parseFloat(after.height)||0,overflow:document.documentElement.scrollWidth>innerWidth+1,ids:['how-it-works','process-title','process-visual'].map(id=>document.querySelectorAll('[id="'+id+'"]').length)}
  },{queries:queries(kind),styleKeys}))
}
function compare(b,a,label,{enlarged=false}={}) {
  const differences=[];let maximumGeometry=0
  for(const [key,values]of Object.entries(b.nodes)){
    if(values.length!==a.nodes[key]?.length){differences.push(key+' count');continue}
    for(const [i,x]of values.entries()){
      const y=a.nodes[key][i]
      for(let j=0;j<4;j++){const delta=Math.abs(x.rect[j]-y.rect[j]);maximumGeometry=Math.max(maximumGeometry,delta);if(delta>.15)differences.push(`${key}[${i}].rect[${j}] ${x.rect[j]} versus ${y.rect[j]}`)}
      for(const k of ['style','text','pressed','controls','alt','src'])if(JSON.stringify(x[k])!==JSON.stringify(y[k]))differences.push(`${key}[${i}].${k}`)
    }
  }
  if(b.active!==a.active||b.pressedCount!==1||a.pressedCount!==1)differences.push('active/pressed state')
  if(b.runway!==a.runway)differences.push('runway')
  if(!b.ids.every(n=>n===1)||!a.ids.every(n=>n===1))differences.push('unique IDs')
  check(!differences.length,label+' '+differences.join('; '))
  if(!enlarged)check(!b.overflow&&!a.overflow,label+' document overflow')
  return {maximumGeometry,differences}
}
let browser
async function settled(p){await p.bringToFront();await p.waitForFunction(()=>[...document.querySelector('#how-it-works').getAnimations({subtree:true})].every(a=>a.playState!=='running'))}
async function newPage(kind,viewport,motion='no-preference',touch=false){
  const context=await browser.newContext({viewport,reducedMotion:motion,hasTouch:touch,deviceScaleFactor:1})
  const p=await context.newPage();p.on('pageerror',e=>problems.push(kind+' runtime '+e.message))
  await p.goto(urls[kind],{waitUntil:'domcontentloaded'});await p.locator('#how-it-works').waitFor()
  await p.evaluate(async()=>{await Promise.all([document.fonts.load('450 59px Newsreader'),document.fonts.load('italic 420 59px Newsreader'),document.fonts.load('400 15px Manrope'),document.fonts.load('700 18px Manrope')]);await document.fonts.ready})
  check(await p.evaluate(()=>['Newsreader','Manrope'].every(name=>[...document.fonts].some(f=>f.family.includes(name)&&f.status==='loaded'))),kind+' real fonts required')
  await p.locator('#how-it-works').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-220,behavior:'instant'}))
  await p.locator('#process-visual img').evaluate(i=>i.decode());await settled(p)
  const prep=await p.locator('#how-it-works').evaluate(root=>{const b=root.getBoundingClientRect(),top=b.top+scrollY,delta=Math.ceil(top)-top;document.body.style.paddingTop=(parseFloat(getComputedStyle(document.body).paddingTop)+delta)+'px';const a=root.getBoundingClientRect();return {delta,before:[b.width,b.height],after:[a.width,a.height]}})
  check(prep.delta>=0&&prep.delta<1&&prep.before.every((v,i)=>Math.abs(v-prep.after[i])<.015),kind+' capture alignment changed section dimensions');report.preparation.push({kind,viewport,motion,...prep})
  await settled(p);return p
}
async function select(p,index,method='click'){
  await p.bringToFront();const button=p.getByTestId('process-step-'+(index+1))
  if(method==='tap')await button.tap();else await button.click()
  await p.waitForFunction(i=>document.querySelector('[data-testid="process-step-'+(i+1)+'"]').getAttribute('aria-pressed')==='true',index)
  await p.locator('#process-visual img').evaluate(i=>i.decode());await p.mouse.move(0,0);await p.evaluate(()=>document.activeElement?.blur());await settled(p)
  const image=await p.locator('#process-visual img').evaluate(i=>({src:i.currentSrc,alt:i.alt,width:i.width,height:i.height,natural:[i.naturalWidth,i.naturalHeight],loading:i.getAttribute('loading'),decoding:i.getAttribute('decoding')}))
  check(image.src===content.assets[index].src&&image.alt===content.assets[index].alt&&image.natural.every(n=>n>0)&&image.loading==='lazy'&&image.decoding==='async','Original process image '+index)
  return image
}
async function pair(pages,label,options={}) {
  const b=await snapshot(pages.published,'published'),a=await snapshot(pages.source,'source')
  return {label,published:b,source:a,...compare(b,a,label,options)}
}
async function captures(pages,label){
  const files=[]
  for(const kind of ['published','source']){
    const p=pages[kind];await p.bringToFront();const before=await p.locator(cls(kind,'process-grid')).boundingBox()
    const hide=await p.addStyleTag({content:'.site-header,.sl-header{visibility:hidden!important}'})
    const file=kind+'-'+label+'.png';await p.locator(cls(kind,'process-grid')).screenshot({path:path.join(out,file),animations:'disabled',caret:'hide'})
    const after=await p.locator(cls(kind,'process-grid')).boundingBox();check(Math.abs(before.width-after.width)<.15&&Math.abs(before.height-after.height)<.15,label+' capture dimension change')
    await hide.evaluate(e=>e.remove());files.push(file);report.captures.push({kind,file,viewport:p.viewportSize(),sha256:hash(await fs.readFile(path.join(out,file)))})
  }
  const pixelPage=await browser.newPage();const inputs=await Promise.all(files.map(async f=>'data:image/png;base64,'+(await fs.readFile(path.join(out,f))).toString('base64')))
  const pixels=await pixelPage.evaluate(async ([b,a])=>{
    const load=async src=>{const i=new Image();i.src=src;await i.decode();return i};const [x,y]=await Promise.all([load(b),load(a)])
    if(x.width!==y.width||x.height!==y.height)return {ratio:null,before:[x.width,x.height],after:[y.width,y.height]}
    const canvas=document.createElement('canvas');canvas.width=x.width;canvas.height=x.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(x,0,0);const one=ctx.getImageData(0,0,x.width,x.height).data;ctx.clearRect(0,0,x.width,x.height);ctx.drawImage(y,0,0);const two=ctx.getImageData(0,0,x.width,x.height).data
    let changed=0;for(let i=0;i<one.length;i+=4)if(Math.max(Math.abs(one[i]-two[i]),Math.abs(one[i+1]-two[i+1]),Math.abs(one[i+2]-two[i+2]))>24)changed++
    return {changed,total:x.width*x.height,ratio:changed/(x.width*x.height),size:[x.width,x.height]}
  },inputs);await pixelPage.close();check(pixels.ratio!==null&&pixels.ratio<=.01,label+' pixels '+JSON.stringify(pixels));return {files,pixels}
}
async function close(pages){for(const p of Object.values(pages))await p.context().close()}
async function pages(viewport,motion='no-preference',touch=false){return {published:await newPage('published',viewport,motion,touch),source:await newPage('source',viewport,motion,touch)}}
async function scrollProgress(p,progress){
  await p.bringToFront();await p.locator('#how-it-works').evaluate((e,progress)=>scrollTo({top:scrollY+e.getBoundingClientRect().top-20+progress,behavior:'instant'}),progress)
  await p.waitForTimeout(60);await settled(p)
  return p.locator('#how-it-works').evaluate(root=>({top:root.getBoundingClientRect().top,gridTop:root.querySelector('.process-grid,.sl-process-grid').getBoundingClientRect().top,active:[...root.querySelectorAll('button[aria-pressed]')].findIndex(e=>e.getAttribute('aria-pressed')==='true'),height:root.getBoundingClientRect().height}))
}
try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});report.browser=browser.version()
  for(const width of widths){
    const ps=await pages({width,height:900});const stages=[]
    for(let stage=0;stage<4;stage++){
      const images={};for(const kind of ['published','source'])images[kind]=await select(ps[kind],stage)
      const entry=await pair(ps,width+'-stage-'+(stage+1));entry.images=images;entry.rendered=await captures(ps,width+'-stage-'+(stage+1));stages.push(entry)
    }
    report.widths.push({width,stages});await close(ps)
  }
  for(const width of [1024,1440]){
    const ps=await pages({width,height:900});const sequence=[]
    for(const progress of [-100,0,111,112,223,224,335,336,400,416,500,650,416,335,224,223,112,111,0]){
      const state={progress};for(const kind of ['published','source']){
        state[kind]=await scrollProgress(ps[kind],progress)
        check(Math.abs(20-state[kind].top-progress)<1,kind+' requested progress '+progress)
        check(state[kind].active===Math.min(3,Math.floor(Math.max(0,progress)/112)),kind+' independent stage at '+progress)
      }
      check(Math.abs(state.source.gridTop-state.published.gridTop)<.15,width+' pinned position at '+progress);sequence.push(state)
      if([336,416,650].includes(progress)&&sequence.length<14)for(const [kind,p]of Object.entries(ps)){const file=kind+'-context-'+width+'-'+progress+'.png';await p.screenshot({path:path.join(out,file)});report.captures.push({kind,file,context:true})}
    }
    for(const kind of ['published','source']){
      const first=sequence.find(s=>s.progress===336)[kind],held=sequence.find(s=>s.progress===416)[kind],released=sequence.find(s=>s.progress===650)[kind]
      check(first.active===3&&held.active===3&&Math.abs(first.gridTop-held.gridTop)<.15,kind+' deliberate fourth stage hold '+width)
      check(released.gridTop<held.gridTop-20,kind+' sticky releases after hold '+width)
    }
    report.states.push({label:'forward reverse and fourth hold '+width,sequence});
    for(const p of Object.values(ps))await p.locator('li[data-step-index]').evaluateAll(items=>items.forEach(e=>e.style.minHeight='140px'))
    const independent={};for(const kind of ['published','source']){independent[kind]=[];for(const progress of [0,112,224,336]){const measured=await scrollProgress(ps[kind],progress);check(measured.active===progress/112,kind+' expanded rows must not change stage interval');independent[kind].push(measured)}}
    report.states.push({label:'140px row height diagnostic '+width,independent,testOnlyRowHeight:true});await close(ps)
  }
  for(const viewport of [{width:900,height:900},{width:901,height:900},{width:1100,height:900},{width:1101,height:900},{width:1440,height:730},{width:1440,height:731},{width:320,height:568},{width:1024,height:500}]){
    const ps=await pages(viewport);for(const p of Object.values(ps))await select(p,2)
    const entry=await pair(ps,'boundary-'+viewport.width+'x'+viewport.height);entry.viewport=viewport
    const enabled=viewport.width>=901&&viewport.height>=731
    check(entry.source.runway===(enabled?525:0),'Runway boundary '+JSON.stringify(viewport));report.states.push(entry);await close(ps)
  }
  {
    const ps=await pages({width:1440,height:900})
    for(const p of Object.values(ps)){await select(p,2);await p.emulateMedia({reducedMotion:'reduce'});await scrollProgress(p,400)}
    let entry=await pair(ps,'live-reduced-motion');check(entry.source.active===2&&entry.source.runway===0,'Reduced motion retains manual selection without runway');entry.rendered=await captures(ps,'reduced-motion');report.states.push(entry)
    for(const p of Object.values(ps)){await select(p,1);await scrollProgress(p,336);check(await p.getByTestId('process-step-2').getAttribute('aria-pressed')==='true','Reduced motion must not advance with scroll');await p.emulateMedia({reducedMotion:'no-preference'});await scrollProgress(p,224)}
    entry=await pair(ps,'restored-motion');check(entry.source.active===2&&entry.source.runway===525,'Live motion restoration');report.states.push(entry);await close(ps)
  }
  {
    const ps=await pages({width:1440,height:900},'reduce')
    for(const p of Object.values(ps)){
      await p.getByTestId('process-step-1').focus();await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.locator('#process-visual img').evaluate(i=>i.decode());await settled(p)
      check(await p.getByTestId('process-step-2').evaluate(e=>document.activeElement===e&&e.getAttribute('aria-pressed')==='true'),'Native keyboard Space and focus')
    }
    const entry=await pair(ps,'keyboard-space-focus');entry.rendered=await captures(ps,'keyboard-space-focus');report.states.push(entry)
    for(const p of Object.values(ps)){await p.keyboard.press('Shift+Tab');await p.keyboard.press('Enter');check(await p.getByTestId('process-step-1').getAttribute('aria-pressed')==='true','Native Enter');await p.getByTestId('process-step-3').hover();await settled(p)}
    report.states.push(await pair(ps,'inactive-hover'));await close(ps)
  }
  {
    const ps=await pages({width:390,height:844},'no-preference',true)
    for(let stage=0;stage<4;stage++){for(const p of Object.values(ps))await select(p,stage,'tap');report.states.push(await pair(ps,'touch-stage-'+stage))}
    await close(ps)
  }
  for(const viewport of [{width:320,height:568},{width:1440,height:900}]){
    const ps=await pages(viewport)
    for(const [kind,p]of Object.entries(ps)){
      await select(p,0)
      await p.locator('#how-it-works').evaluate(root=>{
        const items=[...root.querySelectorAll('h2,h2>strong,.step-text strong,.sl-step-text strong,.step-text>span,.sl-step-text>span,.step-number,.sl-step-number,a')].map(el=>({el,size:parseFloat(getComputedStyle(el).fontSize),line:parseFloat(getComputedStyle(el).lineHeight)}))
        for(const {el,size,line}of items){el.style.fontSize=size*2+'px';el.style.lineHeight=line*2+'px'}
      });await settled(p)
    }
    const entry=await pair(ps,'text-200-'+viewport.width,{enlarged:true});entry.rendered=await captures(ps,'text-200-'+viewport.width);entry.quality={}
    for(const [kind,p]of Object.entries(ps)){
      entry.quality[kind]=await p.locator('#how-it-works').evaluate(root=>{const clipped=[];for(const el of root.querySelectorAll('h2,.step-text strong,.sl-step-text strong,.step-text>span,.sl-step-text>span,a')){const range=document.createRange();range.selectNodeContents(el);const box=el.getBoundingClientRect();for(const r of range.getClientRects())if(r.width>0&&(r.left<box.left-1||r.right>box.right+1||r.left<0||r.right>innerWidth+1))clipped.push({text:el.textContent.trim(),left:r.left,right:r.right,boxLeft:box.left,boxRight:box.right})}return {clipped,overflow:document.documentElement.scrollWidth>innerWidth+1}})
      if(entry.quality[kind].clipped.length||entry.quality[kind].overflow)qualityFindings.push({label:entry.label,kind,...entry.quality[kind]})
    }
    report.states.push(entry);await close(ps)
  }
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
    const p=await newPage('source',viewport);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const header=p.locator('header a[href="#how-it-works"]').first()
    if(await header.isVisible())await header.click();else{await p.getByRole('button',{name:'Open navigation',exact:true}).click();await p.locator('[role="dialog"] a[href="#how-it-works"]').click();await p.locator('[role="dialog"]').waitFor({state:'hidden'})}
    await p.waitForFunction(()=>location.hash==='#how-it-works');await p.waitForTimeout(700)
    const landing=await p.locator('#how-it-works').evaluate(e=>({top:e.getBoundingClientRect().top,expected:parseFloat(getComputedStyle(e).scrollMarginTop)+parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),unique:document.querySelectorAll('#how-it-works').length,current:[...document.querySelectorAll('a[href="#how-it-works"]')].some(e=>e.getAttribute('aria-current')==='page')}))
    check(Math.abs(landing.top-landing.expected)<2&&landing.unique===1&&!landing.current,'How it works actual header landing '+viewport.width)
    const actions=p.locator('.sl-process-bottom-actions a');check(await actions.nth(1).getAttribute('href')===content.records.at(-1).href,'Unchanged process gifting destination')
    await actions.first().click();await p.waitForFunction(()=>location.hash==='#books');await p.goBack();await p.waitForFunction(()=>location.hash==='#how-it-works');await p.goForward();await p.waitForFunction(()=>location.hash==='#books')
    report.states.push({label:'actual navigation and history '+viewport.width,landing,booksAndHistory:true,gift:await actions.nth(1).getAttribute('href')});await p.context().close()
  }
}catch(error){problems.push(error.stack||String(error))}
finally{
  report.completedAt=new Date().toISOString();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n')
  const images=report.captures.filter(x=>x.kind==='published'&&!x.context).map(x=>`<section><h2>${x.file.replace('published-','')}</h2><div><img src="${x.file}" alt="Published"><img src="${x.file.replace('published-','source-')}" alt="React"></div></section>`).join('\n')
  await fs.writeFile(path.join(out,'index.html'),`<!doctype html><html lang="en-GB"><meta charset="utf-8"><title>How it works comparisons</title><style>body{font:16px system-ui;margin:24px}section{margin:32px 0}section div{display:flex;gap:16px;align-items:start}img{width:calc(50% - 8px);height:auto}</style><h1>Published and React How it works</h1><p>Published on the left. React on the right. See report.json for methods, results and limits.</p>${images}</html>`)
  if(browser)await browser.close();console.log(JSON.stringify({widths:report.widths.length,states:report.states.length,captures:report.captures.length,problems,qualityFindings},null,2));if(problems.length)process.exitCode=1
}
