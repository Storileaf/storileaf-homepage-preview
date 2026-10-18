import { readFileSync } from 'node:fs'
const records=JSON.parse(readFileSync(new URL('../content/ledger.json',import.meta.url),'utf8')).records
const ids=new Set()
let bad=false
for(const record of records){
  if(!record.id||ids.has(record.id)){ console.error('Duplicate content ID',record.id);bad=true }
  ids.add(record.id)
  if(!record.copy?.trim()||!record.source?.trim()){console.error('Content/source missing',record.id);bad=true}
  if(record.public&&!['founder_approved','implemented_verified'].includes(record.status)){console.error('Public copy not approved',record.id);bad=true}
  if(record.destination_state==='unbuilt'&&record.href){console.error('Unbuilt destination linked',record.id);bad=true}
  if(record.destination_state==='existing_verified'&&!record.href?.startsWith('https://')){console.error('Verified destination missing',record.id);bad=true}
}
if(bad)process.exitCode=1
else console.log('Content approval and destination gate passed')
