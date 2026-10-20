import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { transformWithOxc } from 'vite'
import { processBaseline, processBundle, processContentProblems } from './inherited-process-content.mjs'
const document = JSON.parse(readFileSync(new URL('../content/process.json', import.meta.url), 'utf8'))
const bundle = execFileSync('git', ['show', processBaseline + ':' + processBundle], {encoding:'utf8'})
const result = await transformWithOxc(readFileSync(new URL('../src/sections/processProgress.ts', import.meta.url),'utf8'),'processProgress.ts')
const progress = await import('data:text/javascript;base64,' + Buffer.from(result.code).toString('base64'))

test('process retains exactly eleven inherited records and four original photographs', () => {
  assert.equal(document.records.length,11); assert.equal(document.assets.length,4)
  assert.deepEqual(processContentProblems(document,bundle),[])
})
test('process gate rejects changed text, emphasis, fragments, order and invented approvals', () => {
  for (const change of [d=>d.records[0].copy+='!',d=>d.records[0].emphasis='changed',d=>d.records[2].source_fragment='elsewhere',d=>d.records.reverse(),d=>d.records[0].approved_on='2026-10-19',d=>d.provenance.approved_on='2026-10-19']) {
    const candidate=structuredClone(document);change(candidate);assert.ok(processContentProblems(candidate,bundle).length)
  }
})
test('process gate rejects added or changed destinations', () => {
  for(const change of [d=>d.records[0].href='https://storileaf.com/',d=>d.records.at(-1).href='https://storileaf.com/pricing/',d=>d.records.at(-2).href='#books']){
    const candidate=structuredClone(document);change(candidate);assert.ok(processContentProblems(candidate,bundle).length)
  }
})
test('process gate rejects altered photograph source, alt text, dimensions and responsive crops', () => {
  for(const change of [d=>d.assets.reverse(),d=>d.assets[0].src=d.assets[1].src,d=>d.assets[1].alt='changed',d=>d.assets[2].width=900,d=>d.assets[3].narrow_object_position='center',d=>d.assets[0].rights_review='approved']) {
    const candidate=structuredClone(document);change(candidate);assert.ok(processContentProblems(candidate,bundle).length)
  }
})
test('process parser rejects missing named regions and unexpected live destination', () => {
  assert.ok(processContentProblems(document,bundle.replace('function Process()', 'function OtherProcess()')).length)
  assert.ok(processContentProblems(document,bundle.replace('var LIVE_SITE = "https://storileaf.com"','var LIVE_SITE = "https://example.com"')).length)
})
test('process uses exact independent 112px intervals in both scroll directions', () => {
  for(const [top,stage]of [[1000,0],[20,0],[-91.99,0],[-92,1],[-203.99,1],[-204,2],[-315.99,2],[-316,3],[-400,3],[-10000,3],[-204,2],[-92,1],[20,0]])assert.equal(progress.processStageAt(top),stage)
})
test('manual process selection lands six pixels inside the corresponding interval', () => {
  for(let index=0;index<4;index++){
    const scroll=progress.processStageScrollTop(2000,index)
    assert.equal(scroll,2000-20+112*index+6)
    assert.equal(progress.processStageAt(2000-scroll),index)
  }
})
test('process eligible motion query retains width, height and preference boundaries', () => {
  assert.equal(progress.processMotionQuery,'(min-width: 901px) and (min-height: 731px) and (prefers-reduced-motion: no-preference)')
})
