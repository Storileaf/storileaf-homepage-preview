// Retain the original diagnostic suite. Tighten the discovered combined stress
// cases into release gates and compare ordinary dialog images without masking.
import fs from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {chromium} from 'playwright-core'
await import('./verify.mjs')
const out='qa/practice-heading'
const report=JSON.parse(await fs.readFile(out+'/report.json','utf8'))
const before=JSON.parse(await fs.readFile(out+'/before/report.json','utf8'))
const hash=b=>createHash('sha256').update(b).digest('hex')
const gate={checkpoint:'P4-06 repaired heading acceptance',sourceCommit:report.sourceCommit,beforeSource:before.sourceCommit,thresholds:{geometry:.15,pixelChannel:24,pixelRatio:.01},states:report.states.length,normal:[],failures:[...report.failures,...report.stressFindings]}
let browser
try {
  if(report.states.length!==66)gate.failures.push('All 66 recorded conditions are required')
  if(before.sourceCommit!=='241ba80a1351bb5595805c66bffe65b966df3a87')throw Error('Unexpected diagnostic baseline')
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']})
  const p=await browser.newPage()
  for(const state of report.states.filter(s=>s.label.startsWith('normal-'))){
    const original=before.states.find(s=>s.label===state.label)
    if(!original)throw Error('Missing original '+state.label)
    const differences=[]
    for(const key of ['dialog','headingBox','textLines','privacy','domOrder','description','inputDescription','font','letterSpacing','wordSpacing']){
      const compare=(a,b,field)=>{if(typeof a==='number'&&typeof b==='number'){if(Math.abs(a-b)>.15)differences.push({field,before:a,after:b})}else if(a&&b&&typeof a==='object'&&typeof b==='object'){if(JSON.stringify(Object.keys(a))!==JSON.stringify(Object.keys(b)))differences.push({field,shape:true});else for(const k of Object.keys(a))compare(a[k],b[k],field+'.'+k)}else if(a!==b)differences.push({field,before:a,after:b})}
      compare(original.measurement[key],state.measurement[key],key)
    }
    const a=await fs.readFile(out+'/before/'+original.captures[0].file),b=await fs.readFile(out+'/'+state.captures[0].file)
    if(hash(a)!==original.captures[0].sha256||hash(b)!==state.captures[0].sha256)throw Error('Capture hash mismatch')
    const clip=original.measurement.dialog
    const result=await p.evaluate(async({a,b,clip})=>{
      const load=data=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src='data:image/png;base64,'+data})
      const [left,right]=await Promise.all([load(a),load(b)])
      if(left.width!==right.width||left.height!==right.height)return{sameSize:false}
      const x=Math.floor(clip.x),y=Math.floor(clip.y),width=Math.ceil(clip.x+clip.width)-x,height=Math.ceil(clip.y+clip.height)-y
      const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d')
      ctx.drawImage(left,-x,-y);const u=ctx.getImageData(0,0,width,height).data;ctx.clearRect(0,0,width,height);ctx.drawImage(right,-x,-y);const v=ctx.getImageData(0,0,width,height).data
      let changed=0;for(let i=0;i<u.length;i+=4)if([0,1,2,3].some(k=>Math.abs(u[i+k]-v[i+k])>24))changed++
      return{sameSize:true,clip:{x,y,width,height},changed,ratio:changed/(width*height)}
    },{a:a.toString('base64'),b:b.toString('base64'),clip})
    gate.normal.push({label:state.label,geometryDifferences:differences,pixels:result})
    if(differences.length||!result.sameSize||result.ratio>.01)gate.failures.push('Ordinary dialog changed '+state.label)
  }
  if(gate.normal.length!==10)gate.failures.push('Ten ordinary width comparisons required')
} catch(error) { gate.failures.push(error.stack||String(error)) }
finally {
  await browser?.close();gate.result=gate.failures.length?'failed':'passed';gate.finishedAt=new Date().toISOString()
  await fs.writeFile(out+'/acceptance.json',JSON.stringify(gate,null,2)+'\n')
  console.log('P406_ACCEPTANCE '+JSON.stringify(gate));if(gate.failures.length)process.exitCode=1
}
