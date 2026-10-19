import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { inheritedHomepageBaseline, inheritedHomepageProblems } from './inherited-content.mjs'
import { inheritedSharedBaseline, inheritedSharedBundlePath, inheritedSharedHtmlPath, inheritedSharedProblems } from './inherited-shared-content.mjs'
import { inheritedDiscoveryBaseline, inheritedDiscoveryBundlePath, inheritedDiscoveryProblems, inheritedDiscoveryLedgerProblems } from './inherited-discovery-content.mjs'
import { contentReferenceProblems } from './content-references.mjs'

const root=resolve(import.meta.dirname, '..')
const records=JSON.parse(readFileSync(join(root,'content/ledger.json'),'utf8')).records
const ids=new Set()
const index=new Map()
const problems=[]
const allowedStatuses=new Set(['proposed','founder_approved','implemented_verified','existing_verified','superseded'])
const allowedDestinations=new Set(['existing_verified','unbuilt'])
let inheritedHomepageHtml
let inheritedSharedSources
let inheritedDiscoveryBundle

if(records.some(record=>record.approval_kind==='inherited_published_homepage')){
  try{
    inheritedHomepageHtml=execFileSync('git',['show',inheritedHomepageBaseline+':index.html'],{cwd:resolve(root,'..'),encoding:'utf8'})
  }catch(error){
    problems.push('Cannot read the immutable inherited homepage ('+String(error.code??'git failure')+'); ensure complete history and Git read access')
  }
}

if(records.some(record=>record.approval_kind==='inherited_published_shared')){
  try{
    inheritedSharedSources={
      bundle:execFileSync('git',['show',inheritedSharedBaseline+':'+inheritedSharedBundlePath],{cwd:resolve(root,'..'),encoding:'utf8'}),
      html:inheritedHomepageHtml??execFileSync('git',['show',inheritedSharedBaseline+':'+inheritedSharedHtmlPath],{cwd:resolve(root,'..'),encoding:'utf8'}),
    }
  }catch(error){
    problems.push('Cannot read the immutable inherited shared source ('+String(error.code??'git failure')+'); ensure complete history and Git read access')
  }
}

if(records.some(record=>record.approval_kind==='inherited_published_discovery')){
  try{
    inheritedDiscoveryBundle=inheritedSharedSources?.bundle??execFileSync('git',['show',inheritedDiscoveryBaseline+':'+inheritedDiscoveryBundlePath],{cwd:resolve(root,'..'),encoding:'utf8'})
    problems.push(...inheritedDiscoveryLedgerProblems(records,inheritedDiscoveryBundle))
  }catch(error){
    problems.push('Cannot read the immutable inherited discovery source ('+String(error.code??'git failure')+'); ensure complete history and Git read access')
  }
}

for(const record of records){
  if(!record.id || !/^[a-z][a-z0-9_.-]+$/.test(record.id) || ids.has(record.id)){
    problems.push('Invalid/duplicate content ID '+String(record.id))
  }
  ids.add(record.id)
  index.set(record.id,record)
  if(!record.copy?.trim() || !record.source?.trim())problems.push('Missing exact copy/provenance for '+record.id)
  if(!allowedStatuses.has(record.status))problems.push('Unknown approval status '+record.id)
  if(record.public && record.status !== 'founder_approved'){
    problems.push('Unapproved copy marked public '+record.id)
  }
  if(record.approval_kind==='inherited_published_homepage'){
    problems.push(...inheritedHomepageProblems(record,inheritedHomepageHtml??''))
  }else if(record.approval_kind==='inherited_published_shared'){
    problems.push(...inheritedSharedProblems(record,inheritedSharedSources??{bundle:'',html:''}))
  }else if(record.approval_kind==='inherited_published_discovery'){
    problems.push(...inheritedDiscoveryProblems(record,inheritedDiscoveryBundle??''))
  }else if(record.public && (!record.approved_on || !record.approval_reference?.startsWith('https://github.com/Storileaf/'))){
    problems.push('Founder approval evidence missing for public copy '+record.id)
  }
  if(record.destination_state==='existing_verified' && !record.destination_verified_on){
    problems.push('Date of destination check missing '+record.id)
  }
  if(record.destination_state && !allowedDestinations.has(record.destination_state)){
    problems.push('Unknown destination status '+record.id)
  }
  if(record.destination_state==='unbuilt' && record.href != null){
    problems.push('Unbuilt destination must not have href '+record.id)
  }
  if(record.destination_state==='existing_verified'){
    let safe=false
    try{
      const target=new URL(record.href)
      safe=target.protocol==='https:' && !!target.hostname && target.hostname!=='localhost'
    }catch{}
    if(!safe)problems.push('Existing destination must be a verified HTTPS URL '+record.id)
  }
  if(record.href && !record.destination_state)problems.push('Href without destination state '+record.id)
}

const scan=(dir)=>{
  for(const item of readdirSync(dir,{withFileTypes:true})){
    const full=join(dir,item.name)
    if(item.isDirectory()){scan(full);continue}
    if(!/\.(tsx?|jsx?)$/.test(item.name))continue
    const text=readFileSync(full,'utf8')
    problems.push(...contentReferenceProblems(text,index,item.name))
  }
}
scan(join(root,'src'))

const imageAssets=JSON.parse(readFileSync(join(root,'content/images.json'),'utf8')).assets
const seenImages=new Set()
for(const item of imageAssets){
  if(!item.id || seenImages.has(item.id))problems.push('Missing or repeated image ID '+item.id)
  seenImages.add(item.id)
  if(typeof item.src!=='string' || !item.src.startsWith('https://storileaf.com/images/brand/'))
    problems.push('Unverified photo origin '+item.id)
  if(!Number.isInteger(item.width)||item.width<=0||!Number.isInteger(item.height)||item.height<=0)
    problems.push('Intrinsic image dimensions missing '+item.id)
  if(item.role==='informative'&&!item.alt?.trim())
    problems.push('Informative image lacks alt text '+item.id)
  if(!item.origin||!item.rights_review)
    problems.push('Image origin/rights review state missing '+item.id)
}


if(problems.length){
  problems.forEach(problem=>console.error(problem))
  process.exitCode=1
}else{
  console.log('Content, approval provenance, source references and destination gate passed')
}
