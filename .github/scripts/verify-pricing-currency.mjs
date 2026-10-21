import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import vm from 'node:vm'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import { verifyInteractions } from './verify-pricing-currency-interactions.mjs'

const originalCheckpoint = '848633b1f1cb6c460e11ca680b50aeb65cb0d7f3'
const root = process.cwd()
const prefix = '/storileaf-homepage-preview/'
const output = 'qa/pricing-currency-candidate'
const currencies = ['inr', 'usd', 'cad', 'gbp']
const widths = [320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440]
const geometryTolerance = 0.15, channelThreshold = 24, pixelRatioLimit = 0.01
const protectedPaths = ['index.html','404.html','assets/','covers/','gallery/','pricing/','favicon.svg','manifest.json','logo192.png','logo512.png','robots.txt','.nojekyll']
const currencyPaths = currencies.map(currency => `pricing/${currency}/index.html`).sort()
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const git = (...args) => execFileSync('git', args)
const lines = bytes => bytes.toString('utf8').trim().split('\n').filter(Boolean)
const sections = '.site-header,main>section,.pricing-plan-grid,.pricing-plan-card,.pricing-comparison table,.site-footer,.footer-grid,.footer-bottom'
let activePage,activeDiagnostics
const recentCaptures=[]
const report = {
  scope: 'P4 07 four saved currency documents only', originalCheckpoint,
  sourceCommit: git('rev-parse','HEAD').toString().trim(),
  run: { id:process.env.GITHUB_RUN_ID, attempt:process.env.GITHUB_RUN_ATTEMPT, workflow:process.env.GITHUB_WORKFLOW, job:process.env.GITHUB_JOB },
  startedAt:new Date().toISOString(), thresholds:{ geometryTolerance,channelThreshold,pixelRatioLimit },
  protectedFiles:[], observations:[], queryObservations:[], comparisons:[], screenshots:[], checkpoints:[], problems:[],
  limits:'Recorded headless Chromium/Linux environment, ten CSS widths, normal text, reduced motion and DPR 1. Saved/no-JavaScript, direct and refreshed default currency pages. Query preservation and final selected views are verified separately from the retained non-default-book initial hydration mismatch. No pricing redesign, query initial-render repair, native zoom, other engines, physical devices or spoken screen-reader acceptance. Local redirects are a model; actual Pages HTTP is a separate live gate.'
}
await fs.mkdir(output,{recursive:true})
const generationOutput = execFileSync(process.execPath, ['.github/scripts/generate-pricing-currency-documents.mjs','--write','--source-root',root,'--output-root',path.resolve(output,'generated'),'--report',path.resolve(output,'generation.json')])
report.generation = JSON.parse(await fs.readFile(output+'/generation.json','utf8'))
await fs.writeFile(output+'/generation-stdout.txt',generationOutput)
const documents = new Map()
for (const currency of currencies) documents.set(currency, await fs.readFile(`${output}/generated/pricing/${currency}/index.html`))
const changes = lines(git('diff','--name-status',originalCheckpoint,'HEAD','--',...protectedPaths))
assert(changes.length===0 || JSON.stringify(changes)===JSON.stringify(currencyPaths.map(file=>'A\t'+file)), 'Only the exact four authorised currency additions may alter the protected export')
for (const file of lines(git('ls-tree','-r','--name-only',originalCheckpoint,'--',...protectedPaths))) {
  const bytes=await fs.readFile(file), expected=git('show',originalCheckpoint+':'+file)
  assert(bytes.equals(expected),file+' unchanged original bytes')
  report.protectedFiles.push({file,bytes:bytes.length,sha256:sha256(bytes),unchanged:true})
}
if(changes.length) for(const currency of currencies) assert((await fs.readFile(`pricing/${currency}/index.html`)).equals(documents.get(currency)),currency+' published source equals independently regenerated candidate')
assert.deepEqual(lines(git('diff','--name-only','HEAD','--',...protectedPaths)),[], 'No uncommitted protected edits')
const dataModule=await fs.readFile('assets/pricing-page-eOuxT0Kj.js','utf8')
const start=dataModule.indexOf('var pricingCurrencies = '), end=dataModule.indexOf('//#endregion',start)
const context=vm.createContext({images:Object.fromEntries(['celebration','founder','letters','life','relationship','travel'].map(key=>[key,key]))})
new vm.Script(dataModule.slice(start,end)+'\nthis.catalogue=JSON.stringify({pricingCurrencies,pricePrefixes,pricingBooks});').runInContext(context,{timeout:1000})
const catalogue=JSON.parse(context.catalogue)
const books=catalogue.pricingBooks.map(book=>book.slug)
assert.equal(books.length,6)
const expectedPrices=(currency,slug)=>catalogue.pricingBooks.find(book=>book.slug===slug).plans.map(plan=>catalogue.pricePrefixes[currency]+new Intl.NumberFormat(currency==='inr'?'en-IN':'en-GB',{maximumFractionDigits:0}).format(plan.prices[currency]))
report.catalogue = { bookSlugs:books, displayedPrices:Object.fromEntries(currencies.map(currency=>[currency,Object.fromEntries(books.map(book=>[book,expectedPrices(currency,book)]))])) }
const fallback=await fs.readFile('404.html')
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.woff2':'font/woff2'}
async function serve(candidate) {
  const server=http.createServer(async(req,res)=>{
    try {
      const url=new URL(req.url,'http://localhost'), pathname=decodeURIComponent(url.pathname)
      assert(pathname.startsWith(prefix))
      let relative=pathname.slice(prefix.length)
      assert(!relative.split('/').includes('..'))
      const match=relative.match(/^pricing\/(inr|usd|cad|gbp)(\/?(?:index\.html)?)$/)
      if(match) {
        if(!candidate){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fallback);return}
        if(match[2]===''){res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return}
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(documents.get(match[1]));return
      }
      let file=path.resolve(root,relative||'index.html')
      assert(file.startsWith(root+path.sep))
      if((await fs.stat(file)).isDirectory()) {
        if(!pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return}
        file=path.join(file,'index.html')
      }
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await fs.readFile(file))
    }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fallback)}
  })
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  return {name:candidate?'candidate':'original',server,base:'http://127.0.0.1:'+server.address().port+prefix}
}
async function checkedStep(label,operation) {
  const checkpoint={label,startedAt:new Date().toISOString()};report.checkpoints.push(checkpoint)
  console.log('CURRENCY_STEP '+label)
  await fs.writeFile(output+'/progress.json',JSON.stringify(report,null,2)+'\n')
  let timer
  try {const result=await Promise.race([operation(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('60-second deadline: '+label)),60000)})]);checkpoint.result='passed';return result}
  catch(error){checkpoint.result='failed';checkpoint.error=error.message;throw error}
  finally{clearTimeout(timer);checkpoint.finishedAt=new Date().toISOString()}
}
async function settle(page,saved=false) {
  await page.locator('[data-testid="pricing-page"]').waitFor()
  await page.evaluate(async()=>{
    await document.fonts.ready
    await Promise.all([document.fonts.load('600 15px Manrope'),document.fonts.load('450 64px Newsreader'),document.fonts.load('italic 400 64px Newsreader')])
    for(const image of document.images)image.loading='eager'
    await Promise.all([...document.images].map(image=>image.decode()))
    scrollTo({top:0,behavior:'instant'})
  })
  if(saved) {
    const snapshot=()=>page.evaluate(selectors=>JSON.stringify({scrollY,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,boxes:[...document.querySelectorAll(selectors)].map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})}),sections)
    let previous=await snapshot(),stable=0
    for(let attempt=0;attempt<100;attempt++) {
      await new Promise(resolve=>setTimeout(resolve,100));const next=await snapshot()
      stable=next===previous?stable+1:0;previous=next
      if(stable===3)break
    }
    assert.equal(stable,3,'Three identical saved layout samples')
  }else await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
  const fonts=await page.evaluate(()=>['Newsreader','Manrope'].map(name=>({name,loaded:[...document.fonts].some(font=>font.family.includes(name)&&font.status==='loaded')})))
  assert(fonts.every(font=>font.loaded),'Approved fonts loaded with normal TLS verification')
  return fonts
}
async function measure(page) {
  return page.evaluate(selectors=>{
    const box=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}
    const footer=document.querySelector('.site-footer'),contact=[...footer.querySelectorAll('a')].find(el=>el.textContent.trim().startsWith('Get in touch'))
    return {
      title:document.title,description:document.querySelector('meta[name="description"]')?.content,
      viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,
      sectionCount:document.querySelectorAll('main>section').length,
      elements:[...document.querySelectorAll(selectors)].map(el=>({tag:el.tagName,className:el.className,...box(el)})),
      mainText:document.querySelector('main').textContent,footerText:footer.textContent,
      links:[...document.querySelectorAll('a')].map(el=>({text:el.textContent,href:el.getAttribute('href'),className:el.className,current:el.getAttribute('aria-current'),status:el.getAttribute('data-status')})),
      contact:{text:contact.textContent,href:contact.getAttribute('href'),spans:contact.querySelectorAll('span').length,...box(contact)},
      currencies:[...document.querySelectorAll('select')].map(el=>({value:el.value,name:el.getAttribute('aria-label')||document.querySelector(`label[for="${el.id}"]`)?.textContent,options:[...el.options].map(option=>({value:option.value,text:option.textContent}))})),
      books:[...document.querySelectorAll('.pricing-book-choice')].map(el=>({id:el.getAttribute('data-testid'),selected:el.getAttribute('aria-pressed')})),
      packageCount:document.querySelectorAll('.pricing-plan-card').length,prices:[...document.querySelectorAll('.pricing-plan-value strong')].map(el=>el.textContent),
      images:[...document.images].map(el=>({src:el.getAttribute('src'),alt:el.alt,complete:el.complete,naturalWidth:el.naturalWidth})),
      typography:[...document.querySelectorAll('main h1,main h2,main h3,.pricing-plan-value strong,.site-footer a,.site-footer h3')].map(el=>{const s=getComputedStyle(el);return {text:el.textContent,font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,letterSpacing:s.letterSpacing}})
    }
  },sections)
}
function compareGeometry(before,after,label,regionalMetadataRepair=false) {
  let metadataTransition
  if(regionalMetadataRepair) {
    assert.equal(before.description,'Guided questions, thoughtful preparation and a printed book. Find the StoriLeaf book for your life story, travels, relationship, business, letters or celebration.','Original 404 recovery retains the recorded homepage description')
    assert.equal(after.description,'Compare fixed regional prices, writing time, printed books and guidance across all six StoriLeaf books.','The new document supplies the exact existing regional route description')
    metadataTransition={before:before.description,after:after.description,scope:'Exact regional metadata replaces the stale homepage fallback description'}
  }else assert.equal(after.description,before.description,label+' description')
  for(const key of ['title','viewport','pageWidth','pageHeight','sectionCount','mainText','footerText','links','contact','currencies','books','packageCount','prices','images','typography'])assert.deepEqual(after[key],before[key],label+' '+key)
  assert.equal(before.sectionCount,6,'Six pricing sections')
  assert.equal(before.elements.length,after.elements.length)
  let maxDelta=0
  for(let index=0;index<before.elements.length;index++) {
    assert.equal(before.elements[index].className,after.elements[index].className)
    for(const key of ['x','y','width','height']) {
      const delta=Math.abs(before.elements[index][key]-after.elements[index][key]);maxDelta=Math.max(maxDelta,delta)
      assert(delta<=geometryTolerance,label+' '+before.elements[index].className+' '+key+' '+delta)
    }
  }
  return {label,maxGeometryDelta:maxDelta,geometryPassed:true,...(metadataTransition?{metadataTransition}:{})}
}
function comparePixels(before,after,label) {
  const a=PNG.sync.read(before),b=PNG.sync.read(after)
  assert.equal(a.width,b.width,label+' width');assert.equal(a.height,b.height,label+' height')
  let changed=0
  for(let index=0;index<a.data.length;index+=4)if([0,1,2].some(channel=>Math.abs(a.data[index+channel]-b.data[index+channel])>channelThreshold))changed++
  const ratio=changed/(a.width*a.height)
  assert(ratio<=pixelRatioLimit,label+' changed pixel ratio '+ratio)
  return {label,width:a.width,height:a.height,changedPixels:changed,changedPixelRatio:ratio,pixelPassed:true}
}
async function capture(page,file,retain,fullPage=true) {
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
  assert.equal(await page.evaluate(()=>scrollY),0)
  const bytes=fullPage?await page.screenshot({fullPage:true,animations:'disabled'}):await page.locator('.site-footer').screenshot({animations:'disabled'})
  recentCaptures.push({file,bytes});if(recentCaptures.length>4)recentCaptures.shift()
  if(retain)await fs.writeFile(output+'/'+file,bytes)
  report.screenshots.push({file:retain?file:null,label:file,retained:retain,sha256:sha256(bytes),bytes:bytes.length})
  return bytes
}
function diagnostics(page) {
  const value={errors:[],consoleErrors:[],failedRequests:[],httpErrors:[]}
  page.on('pageerror',error=>value.errors.push(error.message))
  page.on('console',message=>{if(message.type()==='error')value.consoleErrors.push(message.text())})
  page.on('requestfailed',request=>value.failedRequests.push({url:request.url(),error:request.failure()}))
  page.on('response',response=>{if(response.status()>=400)value.httpErrors.push({url:response.url(),status:response.status(),type:response.request().resourceType()})})
  return {value,reset:()=>{for(const list of Object.values(value))list.length=0}}
}
function validate(metrics,diagnostic,currency,book,kind) {
  assert.equal(metrics.title,`StoriLeaf | ${currency.toUpperCase()} book packages`)
  assert.equal(metrics.currencies.length,2);assert(metrics.currencies.every(item=>item.value===currency))
  assert.deepEqual(metrics.books.filter(item=>item.selected==='true').map(item=>item.id),['pricing-book-'+book])
  assert.deepEqual(metrics.prices,expectedPrices(currency,book))
  assert.equal(metrics.packageCount,expectedPrices(currency,book).length)
  assert.equal(metrics.contact.text,'Get in touch');assert.equal(metrics.contact.spans,0)
  assert.equal(metrics.pageWidth,metrics.viewport.width,'No document overflow')
  const expectedErrors=kind==='original'||(kind==='candidate'&&book!=='life-story')?1:0
  assert.equal(diagnostic.errors.length,expectedErrors,'Exact expected hydration error count')
  assert(diagnostic.errors.every(error=>error.includes('#418')),'Only known React 418 mismatches')
  assert.equal(diagnostic.failedRequests.length,0,'No failed asset requests')
  if(kind==='original') {
    assert.equal(diagnostic.httpErrors.length,1,'Only original missing document 404')
    assert(diagnostic.httpErrors.every(item=>item.status===404&&item.type==='document'))
    assert(diagnostic.consoleErrors.every(error=>/404/.test(error)),'Only original document 404 console error')
  }else {assert.deepEqual(diagnostic.httpErrors,[]);assert.deepEqual(diagnostic.consoleErrors,[])}
}
let browser
const servers=[]
try {
  browser=await chromium.launch({executablePath:process.env.CURRENCY_CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']})
  report.environment={browser:browser.version(),executable:process.env.CURRENCY_CHROME_PATH||'/usr/bin/google-chrome',node:process.version,playwright:'1.56.1',pngjs:'7.0.0',os:await fs.readFile('/etc/os-release','utf8'),runnerImage:process.env.ImageVersion,viewportHeight:1000,dpr:1,reducedMotion:'reduce',tlsVerification:true}
  for(const candidate of [false,true])servers.push(await serve(candidate))
  for(const currency of currencies)for(const width of widths)await checkedStep(`${currency} ${width} saved/direct/reload comparison`,async()=>{
    const records={}
    for(const {name,base} of servers) {
      const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'})
      const page=await ctx.newPage(),diagnostic=diagnostics(page);records[name]={};activePage=page;activeDiagnostics=diagnostic.value
      for(const action of ['direct','reload']) {
        diagnostic.reset()
        const response=action==='direct'?await page.goto(base+'pricing/'+currency,{waitUntil:'networkidle'}):await page.reload({waitUntil:'networkidle'})
        assert.equal(response.status(),name==='original'?404:200)
        const body=await response.body();assert.equal(sha256(body),sha256(name==='original'?fallback:documents.get(currency)))
        const fonts=await settle(page),metrics=await measure(page)
        const row={name,currency,width,action,status:response.status(),responseSha256:sha256(body),url:page.url(),fonts,diagnostics:structuredClone(diagnostic.value),metrics}
        report.observations.push(row);records[name][action]=row
        validate(metrics,diagnostic.value,currency,'life-story',name)
        if(action==='direct') {
          records[name].image=await capture(page,`${name}-${currency}-page-${width}.png`,[390,1440].includes(width))
          if(width===390||width===1440)await capture(page,`${name}-${currency}-footer-${width}.png`,true,false)
        }
      }
      report.comparisons.push(compareGeometry(records[name].direct.metrics,records[name].reload.metrics,`${name} ${currency} ${width} direct/reload`))
      await ctx.close()
      activePage=undefined;activeDiagnostics=undefined
    }
    report.comparisons.push(compareGeometry(records.original.direct.metrics,records.candidate.direct.metrics,`${currency} ${width} original/candidate`,true))
    report.comparisons.push(comparePixels(records.original.image,records.candidate.image,`${currency} ${width} complete original/candidate pricing page`))
    const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',javaScriptEnabled:false})
    const page=await ctx.newPage(),diagnostic=diagnostics(page);activePage=page;activeDiagnostics=diagnostic.value
    const response=await page.goto(servers[1].base+'pricing/'+currency+'/',{waitUntil:'networkidle'})
    assert.equal(response.status(),200);assert.equal(sha256(await response.body()),sha256(documents.get(currency)))
    const fonts=await settle(page,true),metrics=await measure(page)
    report.observations.push({name:'candidate',currency,width,action:'saved without JavaScript',status:200,fonts,diagnostics:structuredClone(diagnostic.value),metrics})
    validate(metrics,diagnostic.value,currency,'life-story','saved')
    report.comparisons.push(compareGeometry(metrics,records.candidate.direct.metrics,`${currency} ${width} saved/settled`))
    const saved=await capture(page,`candidate-${currency}-saved-${width}.png`,width===390)
    report.comparisons.push(comparePixels(saved,records.candidate.image,`${currency} ${width} complete saved/settled pricing page`))
    await ctx.close()
    activePage=undefined;activeDiagnostics=undefined
  })
  for(const currency of currencies)for(const [index,book] of books.entries())await checkedStep(`${currency} ${book} query direct/reload`,async()=>{
    const width=index%2===0?390:1440,records={}
    for(const {name,base} of servers) {
      const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'})
      const page=await ctx.newPage(),diagnostic=diagnostics(page);records[name]={};activePage=page;activeDiagnostics=diagnostic.value
      for(const action of ['direct','reload']) {
        diagnostic.reset()
        const response=action==='direct'?await page.goto(base+'pricing/'+currency+'?keepsake='+book,{waitUntil:'networkidle'}):await page.reload({waitUntil:'networkidle'})
        assert.equal(response.status(),name==='original'?404:200)
        assert.equal(new URL(page.url()).searchParams.get('keepsake'),book)
        assert.equal(sha256(await response.body()),sha256(name==='original'?fallback:documents.get(currency)))
        const fonts=await settle(page),metrics=await measure(page)
        const row={name,currency,book,width,action,status:response.status(),url:page.url(),fonts,diagnostics:structuredClone(diagnostic.value),metrics,initialRender:name==='candidate'&&book!=='life-story'?'KNOWN SEPARATE ISSUE: saved Life Story differs from requested book; client recovers':'matches current scope expectations'}
        records[name][action]=row;report.queryObservations.push(row)
        validate(metrics,diagnostic.value,currency,book,name)
      }
      report.comparisons.push(compareGeometry(records[name].direct.metrics,records[name].reload.metrics,`${name} ${currency} ${book} query direct/reload`))
      await ctx.close()
      activePage=undefined;activeDiagnostics=undefined
    }
    report.comparisons.push(compareGeometry(records.original.direct.metrics,records.candidate.direct.metrics,`${currency} ${book} original/candidate selected view`,true))
  })
  report.interactions=await verifyInteractions({browser,originalBase:servers[0].base,candidateBase:servers[1].base})
  assert.equal(report.interactions.passed,true,'All original/candidate interaction journeys pass')
  report.result='passed within the authorised currency-document scope'
}catch(error){
  report.result='failed';report.problems.push(error.stack||String(error));process.exitCode=1
  report.failureDiagnostics=activeDiagnostics?structuredClone(activeDiagnostics):null
  if(activePage&&!activePage.isClosed()) {
    report.failureUrl=activePage.url()
    try{report.failureMetrics=await measure(activePage)}catch(measureError){report.failureMeasurementError=measureError.message}
    try{await capture(activePage,'failure-active-page.png',true)}catch(captureError){report.failureCaptureError=captureError.message}
  }
  report.failureRetainedCaptures=[]
  for(const {file,bytes} of recentCaptures){await fs.writeFile(output+'/failure-'+file,bytes);report.failureRetainedCaptures.push({file:'failure-'+file,sha256:sha256(bytes),bytes:bytes.length})}
}
finally {
  if(browser)await browser.close()
  for(const {server} of servers)await new Promise(resolve=>server.close(resolve))
  report.finishedAt=new Date().toISOString()
  report.counts={defaultObservations:report.observations.length,queryObservations:report.queryObservations.length,comparisons:report.comparisons.length,retainedScreenshots:report.screenshots.filter(item=>item.retained).length}
  await fs.writeFile(output+'/verification.json',JSON.stringify(report,null,2)+'\n')
  console.log(JSON.stringify({result:report.result,counts:report.counts,problems:report.problems}))
}
