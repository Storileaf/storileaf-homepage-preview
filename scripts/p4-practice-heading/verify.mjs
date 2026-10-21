import fs from 'node:fs/promises'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {chromium} from 'playwright-core'

const out='qa/practice-heading', url='http://127.0.0.1:4180/'
// Native images use X11 window pixels with a fixed 100ms presentation interval.
// CDP zoom screenshots previously returned a uniform background and are not visual evidence.
const widths=[320,360,390,430,600,768,820,1024,1280,1440]
const hash=b=>createHash('sha256').update(b).digest('hex')
const report={checkpoint:'P4-06 practice heading',sourceCommit:process.env.GITHUB_SHA,frontendTree:execFileSync('git',['rev-parse','HEAD:frontend'],{encoding:'utf8'}).trim(),createdAt:new Date().toISOString(),states:[],failures:[],stressFindings:[],buildHashes:{},method:'Native headed Chrome UI Ctrl+0 and Ctrl+= via X11 XTest on Xvfb. Native zoom independently checked from devicePixelRatio and unchanged outer window with inverse inner width/height. No CSS zoom, pinch scale or CDP device emulation in native tests. Targeted font/line-height doubling and text-spacing overrides are labelled separately.',limits:'Linux Chromium only. Xvfb is a virtual desktop, not a physical device. No actual screen-reader speech. Scoped practice-heading diagnosis, not whole-website accessibility certification.'}
await fs.mkdir(out,{recursive:true})
async function list(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await list(f);else report.buildHashes[f]=hash(await fs.readFile(f))}}
await list('frontend/dist')
const expect=(ok,message)=>{if(!ok)report.failures.push(message)}
const frames=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))
const viewport=p=>p.evaluate(()=>({innerWidth,innerHeight,outerWidth,outerHeight,dpr:devicePixelRatio,visualScale:visualViewport.scale,rootZoom:getComputedStyle(document.documentElement).zoom}))
async function ready(p){await p.goto(url,{waitUntil:'networkidle'});await p.getByTestId('try-question').waitFor({state:'attached'});await p.evaluate(async()=>{await Promise.all([document.fonts.load('450 30px Newsreader'),document.fonts.load('400 12px Manrope')]);await document.fonts.ready});await frames(p)}
async function open(p){const t=p.getByTestId('try-question');await t.scrollIntoViewIfNeeded();await t.focus();await t.press('Enter');await p.getByTestId('question-dialog').waitFor();await p.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Close writing example');await frames(p)}
async function changeType(p,{double=false,spacing=false}){return p.evaluate(({double,spacing})=>{
  const root=document.querySelector('.sl-practice-dialog'),nodes=[...root.querySelectorAll('h2,p,label,textarea,button,.demo-answer-meta>span')]
  const rows=nodes.map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}))
  for(const {e,size,line} of rows){if(double){e.style.fontSize=size*2+'px';if(Number.isFinite(line))e.style.lineHeight=line*2+'px'}if(spacing){e.style.setProperty('line-height','1.5','important');e.style.setProperty('letter-spacing','.12em','important');e.style.setProperty('word-spacing','.16em','important');if(e.matches('p'))e.style.setProperty('margin-bottom','2em','important')}}
  return rows.map(({e,size,line})=>({tag:e.tagName,originalFontSize:size,originalLineHeight:line,fontSize:getComputedStyle(e).fontSize,lineHeight:getComputedStyle(e).lineHeight,letterSpacing:getComputedStyle(e).letterSpacing,wordSpacing:getComputedStyle(e).wordSpacing,marginBottom:getComputedStyle(e).marginBottom}))
},{double,spacing})}
async function measure(p){return p.evaluate(()=>{
  const d=document.querySelector('.sl-practice-dialog'),h=d.querySelector('h2'),privacy=d.querySelector('#demo-privacy'),cs=getComputedStyle(d),hs=getComputedStyle(h)
  const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}}
  const db=box(d),hb=box(h),range=document.createRange();range.selectNodeContents(h)
  const lines=[...range.getClientRects()].filter(r=>r.width>0).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}))
  const clip={left:db.left+parseFloat(cs.borderLeftWidth),right:db.right-parseFloat(cs.borderRightWidth),top:db.top+parseFloat(cs.borderTopWidth),bottom:db.bottom-parseFloat(cs.borderBottomWidth)}
  const maxRight=Math.max(...lines.map(r=>r.right)),minLeft=Math.min(...lines.map(r=>r.left)),control=d.querySelector('.dialog-topline').getBoundingClientRect(),pb=box(privacy)
  return{heading:h.textContent,title:document.querySelector('[aria-labelledby="'+h.id+'"]')!==null,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family),dialog:db,headingBox:hb,textLines:lines,font:hs.font,letterSpacing:hs.letterSpacing,wordSpacing:hs.wordSpacing,headingContentBoxIntrusion:Math.max(0,maxRight-hb.right,hb.left-minLeft),headingOutsideDialog:Math.max(0,maxRight-clip.right,clip.left-minLeft),headingVisibleAtTop:lines.every(r=>r.top>=clip.top-1&&r.bottom<=clip.bottom+1),overlapsPrivacy:Math.max(...lines.map(r=>r.bottom))>pb.top+1,overlapsClose:Math.min(...lines.map(r=>r.top))<control.bottom-1,dialogScrollWidth:d.scrollWidth,dialogClientWidth:d.clientWidth,documentOverflow:document.documentElement.scrollWidth>innerWidth+1,dialogOverflow:d.scrollWidth>d.clientWidth+1,clip,privacy:pb,scrollTop:d.scrollTop,scrollHeight:d.scrollHeight,clientHeight:d.clientHeight,domOrder:[...d.children].map(e=>e.tagName+':'+(e.getAttribute('id')||e.className)),description:d.getAttribute('aria-describedby'),inputDescription:d.querySelector('textarea').getAttribute('aria-describedby')}
})}
async function screenshot(p, file) {
  if (p.viewportSize() !== null) return p.screenshot({path:file})
  await p.bringToFront();await frames(p);await p.waitForTimeout(100)
  const observed={viewport:await viewport(p),heading:await p.locator('.sl-practice-dialog h2').boundingBox()}
  const metadata=JSON.parse(execFileSync('python3',['scripts/p4-practice-heading/native-capture.py',file,JSON.stringify(observed)],{encoding:'utf8'}))
  report.nativeCaptures ||= [];report.nativeCaptures.push({file:path.basename(file),...metadata})
}
async function observe(p,label,meta={},stress=false){
  await p.getByTestId('question-dialog').evaluate(e=>e.scrollTop=0);await frames(p)
  const m=await measure(p),row={label,...meta,viewport:await viewport(p),measurement:m,captures:[]}
  const image=label+'.png';await screenshot(p,out+'/'+image);row.captures.push({file:image,sha256:hash(await fs.readFile(out+'/'+image))})
  const problems=[]
  if(m.headingOutsideDialog>1)problems.push('heading extends beyond dialog clipping boundary')
  if(m.overlapsPrivacy||m.overlapsClose)problems.push('heading overlaps adjacent content')
  if(m.documentOverflow||m.dialogOverflow)problems.push('horizontal overflow')
  if(!m.title||m.description!=='demo-privacy'||m.inputDescription!=='demo-privacy')problems.push('semantics changed')
  if(!m.fonts.some(f=>f.includes('Newsreader'))||!m.fonts.some(f=>f.includes('Manrope')))problems.push('approved fonts not loaded')
  row.findings=problems;report.states.push(row)
  for(const message of problems)(stress?report.stressFindings:report.failures).push(label+' '+message)
  await p.getByTestId('demo-answer').fill('A room full of stories')
  expect(await p.locator('.demo-answer-meta>span').innerText()==='5 words',label+' word count')
  const close=p.getByRole('button',{name:'Close',exact:true});await close.scrollIntoViewIfNeeded();await frames(p)
  row.bottomControls=await close.evaluate(e=>{const b=e.getBoundingClientRect(),d=e.closest('[role="dialog"]').getBoundingClientRect();return{visible:b.top>=d.top&&b.bottom<=d.bottom+1&&b.left>=d.left&&b.right<=d.right+1}})
  expect(row.bottomControls.visible,label+' bottom Close reachable')
  if([320,390].includes(Math.round(row.viewport.innerWidth))){const bottom=label+'-bottom.png';await screenshot(p,out+'/'+bottom);row.captures.push({file:bottom,sha256:hash(await fs.readFile(out+'/'+bottom))})}
  await p.keyboard.press('Escape');await p.getByTestId('question-dialog').waitFor({state:'hidden'});await p.waitForFunction(()=>document.activeElement?.getAttribute('data-testid')==='try-question')
  await p.keyboard.press('Enter');await p.getByTestId('question-dialog').waitFor();expect(await p.getByTestId('demo-answer').inputValue()==='',label+' empty reopen');await p.getByRole('button',{name:'Close',exact:true}).click();await p.getByTestId('question-dialog').waitFor({state:'hidden'});row.keyboard='Opening, initial focus, typing, word count, bottom control reachability, Escape, focus return, empty reopening and Close passed'
  console.log(label,JSON.stringify({findings:problems,viewport:row.viewport,headingOutsideDialog:m.headingOutsideDialog,contentBoxIntrusion:m.headingContentBoxIntrusion}))
}
let browser,context
try{
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:false,args:['--no-sandbox','--disable-gpu','--window-size=1280,1000']})
  report.environment={browser:browser.version(),node:process.version,playwright:'1.56.1',os:await fs.readFile('/etc/os-release','utf8'),image:process.env.ImageVersion,display:'Xvfb :99 3600x2400x24',headed:true}
  context=await browser.newContext({viewport:null,reducedMotion:'reduce'});const p=await context.newPage();p.on('pageerror',e=>report.failures.push(e.message));await ready(p)
  const session=await context.newCDPSession(p),{windowId}=await session.send('Browser.getWindowForTarget')
  const keys=(...ks)=>execFileSync('python3',['scripts/p4-practice-heading/native-keys.py',...ks])
  for(const width of widths){
    await session.send('Browser.setWindowBounds',{windowId,bounds:{width:width*2,height:1287,windowState:'normal'}});await p.bringToFront();keys('0');await frames(p);const before=await viewport(p)
    keys('equal','equal','equal','equal','equal');await frames(p);const after=await viewport(p)
    expect(Math.abs(after.dpr/before.dpr-2)<.01,'Actual 200% native zoom '+width)
    expect(before.outerWidth===after.outerWidth&&before.outerHeight===after.outerHeight,'Outer window remains unchanged by zoom '+width)
    expect(Math.abs(after.innerWidth-before.innerWidth/2)<=1&&Math.abs(after.innerHeight-before.innerHeight/2)<=1,'Native layout viewport scales inversely '+width)
    expect(after.visualScale===1&&after.rootZoom==='1','No pinch or CSS zoom '+width)
    expect(Math.abs(after.innerWidth-width)<=1,'Actual required native CSS width '+width)
    await open(p);await observe(p,'native-200-'+width,{zoomBefore:before,zoomAfter:after})
    await open(p);const styles=await changeType(p,{spacing:true});await observe(p,'native-200-spacing-'+width,{zoomBefore:before,zoomAfter:after,styles})
  }
  await session.send('Browser.setWindowBounds',{windowId,bounds:{width:1440,height:987}});keys('0');await frames(p);const base=await viewport(p)
  for(const scale of [1.1,1.25,1.5,1.75,2]){keys('equal');await frames(p);const actual=await viewport(p);expect(Math.abs(actual.dpr/base.dpr-scale)<.01,'Intermediate native zoom '+scale);await open(p);await observe(p,'native-level-'+Math.round(scale*100),{zoomBefore:base,zoomAfter:actual})}
  await session.send('Browser.setWindowBounds',{windowId,bounds:{width:640,height:687}});keys('0');keys('equal','equal','equal','equal','equal');await frames(p);await open(p);await changeType(p,{spacing:true});await observe(p,'native-200-short-spacing',{shortScreen:true})
  keys('0');await frames(p);report.nativeReset=await viewport(p);expect(Math.abs(report.nativeReset.dpr-1)<.01,'Native zoom reset')
  await context.close();await browser.close();context=null;browser=null
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']})
  for(const width of widths){for(const [name,options,stress]of [['normal',{},false],['spacing',{spacing:true},false],['double',{double:true},false],['double-spacing',{double:true,spacing:true},true]]){
    const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>report.failures.push(e.message));await ready(p);await open(p);const styles=await changeType(p,options);await observe(p,name+'-'+width,{styles,headless:true,targetedDouble:!!options.double,spacing:!!options.spacing,combinedStress:stress},stress);await p.close()
  }}
  report.result=report.failures.length?'failed':'passed'
}catch(error){report.failures.push(error.stack||String(error));report.result='failed'}finally{await context?.close();await browser?.close();report.finishedAt=new Date().toISOString();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,states:report.states.length,failures:report.failures,stressFindings:report.stressFindings}));if(report.failures.length)process.exitCode=1}
