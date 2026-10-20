import test from 'node:test'
import assert from 'node:assert/strict'
import { settledSnapshot, refreshClosedDisclosureLayout } from './browser-readiness.mjs'
const page={bringToFront:async()=>{},evaluate:async()=>{},waitForTimeout:ms=>new Promise(resolve=>setTimeout(resolve,ms))}
test('stable snapshots retain every value rather than filtering expected differences',async()=>{
  const actual={margin:'0px 20px',width:320,unexpected:'kept'}
  assert.deepEqual(await settledSnapshot(page,async()=>actual,{quietMilliseconds:20,timeout:500}),actual)
})
test('transient measurements must settle before they are returned',async()=>{
  let samples=0
  const actual=await settledSnapshot(page,async()=>({width:++samples<3?100:200}),{quietMilliseconds:20,timeout:500})
  assert.equal(actual.width,200)
})
test('perpetually changing measurements fail rather than passing a comparison',async()=>{
  let value=0
  await assert.rejects(settledSnapshot(page,async()=>++value,{quietMilliseconds:20,timeout:100}),/did not settle/)
})
test('closed disclosure refresh restores original states and never touches open details',()=>{
  const measured=[],closed={open:false,getBoundingClientRect(){measured.push(this.open)}},open={open:true}
  const prior=globalThis.document
  globalThis.document={querySelectorAll(selector){assert.equal(selector,'details:not([open])');return [closed,open].filter(e=>!e.open)}}
  try {assert.equal(refreshClosedDisclosureLayout(),1);assert.deepEqual(measured,[true,false]);assert.equal(closed.open,false);assert.equal(open.open,true)} finally {globalThis.document=prior}
})
test('a failed native layout read still restores all closed disclosure states',()=>{
  const first={open:false,getBoundingClientRect(){if(this.open)throw new Error('layout failed')}},second={open:false,getBoundingClientRect(){}}
  const prior=globalThis.document
  globalThis.document={querySelectorAll(){return [first,second]}}
  try {assert.throws(refreshClosedDisclosureLayout,/layout failed/);assert.equal(first.open,false);assert.equal(second.open,false)} finally {globalThis.document=prior}
})
