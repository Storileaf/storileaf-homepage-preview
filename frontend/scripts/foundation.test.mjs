import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const tokens=readFileSync(new URL('../src/styles/tokens.css',import.meta.url),'utf8')
const styles=readFileSync(new URL('../src/styles/components.css',import.meta.url),'utf8')
const ledger=JSON.parse(readFileSync(new URL('../content/ledger.json',import.meta.url),'utf8'))

test('uses Newsreader and Manrope for public pages',()=>{
  assert.ok(tokens.includes('Newsreader'))
  assert.ok(tokens.includes('Manrope'))
})
test('retains approved colour and editorial width tokens',()=>{
  for(const token of ['#253526','#0c6753','#cca86b','#f9f8f6','1184px'])assert.ok(tokens.includes(token))
})
test('resource overview CTA remains centred',()=>{
  assert.ok(styles.includes('justify-content:center'))
  assert.equal(ledger.records.find(item=>item.id==='home.resources.all.cta')?.copy,'Browse all resources')
})
test('planned activity and overview destinations are not made-up URLs',()=>{
  for(const id of ['home.resources.activities.cta','home.resources.all.cta']){
    const record=ledger.records.find(item=>item.id===id)
    assert.equal(record?.destination_state,'unbuilt')
    assert.equal(record?.href,null)
  }
})
