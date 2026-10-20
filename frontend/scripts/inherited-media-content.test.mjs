import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { checkMediaContent, mediaContentProblems, mediaBaseline, mediaBundle } from './inherited-media-content.mjs'
const ledger=JSON.parse(readFileSync('content/media-ledger.json','utf8'))
const images=JSON.parse(readFileSync('content/media-images.json','utf8'))
const original=JSON.parse(readFileSync('content/ledger.json','utf8')).records
const routes=execFileSync('git',['show',mediaBaseline+':'+mediaBundle],{encoding:'utf8'})
const data=execFileSync('git',['show',mediaBaseline+':assets/content-sections-CfrmOVRI.js'],{encoding:'utf8'})
const validate=(copy,assets=images)=>mediaContentProblems(copy,assets,routes,data,original)
test('Gallery retains exact protected words and all six unchanged placeholder files',()=>assert.deepEqual(checkMediaContent(ledger,images,original),[]))
test('Media gate rejects revised text, invented approval and extra records',()=>{
  for (const change of [r=>r.copy+=' extra',r=>r.approved_on='2026-10-19',r=>r.href='https://storileaf.com/new/',r=>r.migration_group=4]) {
    const altered=structuredClone(ledger);change(altered.records[0]);assert.ok(validate(altered).length)
  }
  const altered=structuredClone(ledger);altered.records.push({...altered.records[0],id:'home.gallery.unapproved'});assert.ok(validate(altered).length)
})
test('Media gate rejects missing images, reordered images and unverified captions or crops',()=>{
  for (const change of [a=>a.pop(),a=>a.reverse(),a=>a[0].alt='An actual customer book',a=>a[0].object_position='20% 30%',a=>a[0].file='gallery/missing.svg']) {
    const altered=structuredClone(images);change(altered.assets);assert.ok(validate(ledger,altered).length)
  }
})
test('Source has one owned samples target and preserves the gallery-before-craft composition slot',()=>{
  const source=readFileSync('src/sections/BookGallery.tsx','utf8'),app=readFileSync('src/App.tsx','utf8')
  assert.equal((source.match(/id="samples"/g)||[]).length,1)
  assert.ok(app.includes("'samples'"));assert.ok(app.indexOf('<BookDiscovery')<app.indexOf('<BookGallery'))
  assert.ok(source.indexOf('{children}')>source.indexOf('sl-sample-rail-outer'))
  assert.ok(!source.includes('aria-current='))
})
test('Physical copy and the single pricing action remain bounded to their actual render nodes',()=>{
  for(const change of [l=>l.records.find(r=>r.id==='home.craft.intro').copy+=' Unlimited support.',l=>l.records.find(r=>r.id==='home.craft.cta').href='https://storileaf.com/gift/',l=>l.records.find(r=>r.id==='home.craft.cta').destination_state='unbuilt']){
    const altered=structuredClone(ledger);change(altered);assert.ok(validate(altered).length)
  }
  for(const changed of [routes.replace('`${LIVE_SITE}/pricing/`','`${LIVE_SITE}/gift/`'),routes.replace('Show book image ','Show sample '),routes.replace('src:images.binding','src:images.gift')])assert.ok(mediaContentProblems(ledger,images,changed,data,original).length)
})
test('Physical manifest rejects missing, reordered or revised photographs and labels',()=>{
  for(const change of [a=>a.pop(),a=>a.reverse(),a=>a[0].src='https://storileaf.com/images/brand/new.webp',a=>a[0].alt='Customer book',a=>a[0].object_position='30% 50%',a=>a[0].labelId='home.gallery.close']){
    const altered=structuredClone(images);change(altered.craftAssets);assert.ok(validate(ledger,altered).length)
  }
})
test('Physical composition follows the rail and preserves visible-only 6500ms slideshow cleanup',()=>{
  const app=readFileSync('src/App.tsx','utf8'),source=readFileSync('src/sections/PhysicalBookPresentation.tsx','utf8')
  assert.ok(app.includes('<BookGallery><PhysicalBookPresentation /></BookGallery>'))
  assert.ok(source.includes('if (reduced || !visible) return'))
  assert.ok(source.includes('6500)')&&source.includes('window.clearInterval(timer)')&&source.includes('observer.disconnect()'))
  assert.ok(source.includes('[active, reduced, visible]'))
  assert.ok(!source.includes('aria-current='))
})
