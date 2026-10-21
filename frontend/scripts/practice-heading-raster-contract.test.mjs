import test from 'node:test'
import assert from 'node:assert/strict'
import { practiceHeadingRegion } from './practice-heading-raster-contract.mjs'
const question = 'What do you remember about the home you grew up in?'
const fixture = () => {
 const before={viewportWidth:320,text:question,style:{fontSize:'60px',fontFamily:'Newsreader'},overflowWrap:'normal',heading:{left:25,top:80,right:263,bottom:550},clip:{width:288,height:774},ranges:[{left:25,top:80,right:273.484375,bottom:550}],glyphs:[]}
 const after=structuredClone(before);after.overflowWrap='anywhere';after.ranges[0].right=263;after.glyphs=[...question.replace(/\s/g,'')].map(text=>({text,rects:[{left:25,top:80,right:40,bottom:140}]}));return{before,after}
}
test('P4-06 admits only the measured question wrap region and retains untouched image area',()=>{
 const {before,after}=fixture(),r=practiceHeadingRegion('text-200-320-dialog',before,after)
 assert.deepEqual(r.region,{x:24,y:79,width:251,height:472});assert(r.region.height<before.clip.height)
})
test('P4-06 rejects unrelated states, altered copy, typography and geometry',()=>{
 for(const mutate of [x=>x.after.viewportWidth=390,x=>x.after.text+='!',x=>x.after.style.fontSize='59px',x=>x.after.style.fontFamily='Georgia',x=>x.after.heading.bottom++,x=>x.after.clip.height++,x=>x.after.overflowWrap='normal']){
  const f=fixture();mutate(f);assert.throws(()=>practiceHeadingRegion('text-200-320-dialog',f.before,f.after))
 }
 const f=fixture();assert.throws(()=>practiceHeadingRegion('text-200-1440-dialog',f.before,f.after));assert.throws(()=>practiceHeadingRegion('empty-dialog-320',f.before,f.after))
})
test('P4-06 rejects clipped, missing or substituted glyphs and absent baseline evidence',()=>{
 for(const mutate of [x=>x.after.ranges[0].right=280,x=>x.after.glyphs.pop(),x=>x.after.glyphs[0].rects=[],x=>x.after.glyphs[0].rects[0].right=280,x=>x.before.ranges[0].right=263]){
  const f=fixture();mutate(f);assert.throws(()=>practiceHeadingRegion('text-200-320-dialog',f.before,f.after))
 }
})
