import test from 'node:test'
import assert from 'node:assert/strict'
import { settledSnapshot } from './browser-readiness.mjs'
const page={bringToFront:async()=>{},waitForTimeout:ms=>new Promise(resolve=>setTimeout(resolve,ms))}
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
