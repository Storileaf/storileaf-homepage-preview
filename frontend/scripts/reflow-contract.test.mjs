import test from 'node:test'
import assert from 'node:assert/strict'
import { tabMinimumEquivalent, cleanQuality, footerReflowDimension, discoveryReflowDimension, heroReflowDimension, heroReflowStyle } from './reflow-contract.mjs'

test('P4-03 permits only the six documented intrinsic tab minima', () => {
  for (const width of ['0px','147px','158px','174px']) assert.equal(tabMinimumEquivalent('tab2',width,'min-content'),true)
  for (const [node,b,a] of [['photo','0px','min-content'],['tab6','147px','min-content'],['tab2','148px','min-content'],['tab2','147px','0px']]) assert.equal(tabMinimumEquivalent(node,b,a),false)
})
test('reflow quality requires explicit empty findings and no overflow', () => {
  assert.equal(cleanQuality({documentOverflow:false,clipped:[]},['clipped']),true)
  for (const q of [null,{}, {documentOverflow:true,clipped:[]},{documentOverflow:false},{documentOverflow:false,clipped:[{}]}]) assert.equal(cleanQuality(q,['clipped']),false)
})
test('P4-02 does not authorise a newsletter, header or style change', () => {
  assert.equal(footerReflowDimension('footerLink16','width'),true)
  assert.equal(footerReflowDimension('grid','height'),true)
  for (const [n,d] of [['heading','height'],['newsletter','height'],['header','height'],['root','width'],['grid','x'],['footerLink17','width'],['brand','fontSize']]) assert.equal(footerReflowDimension(n,d),false)
})
test('P4-03 requires an exact tab-height displacement of the unchanged panel', () => {
  assert.equal(discoveryReflowDimension('photo','y',100,120,20),true)
  assert.equal(discoveryReflowDimension('photo','y',100,121,20),false)
  assert.equal(discoveryReflowDimension('photo','width',100,120,20),false)
  assert.equal(discoveryReflowDimension('title','y',100,120,20),false)
  assert.equal(discoveryReflowDimension('tab2','width',100,200,20),true)
})
test('P4-04 permits reflow and only its measured downstream displacement', () => {
  assert.equal(heroReflowDimension('photo',1,100,261,161),true)
  assert.equal(heroReflowDimension('photo',1,100,262,161),false)
  assert.equal(heroReflowDimension('photo',2,100,261,161),false)
  assert.equal(heroReflowDimension('root',3,100,261,161),true)
  assert.equal(heroReflowDimension('header',3,100,261,161),false)
  assert.equal(heroReflowDimension('photo',1,100,NaN,161),false)
})
test('P4-04 does not excuse changed text styling, motion or image transforms', () => {
  assert.equal(heroReflowStyle('progression-container','flexDirection','row','column'),true)
  assert.equal(heroReflowStyle('progression-arrow','transform','none','matrix(0, 1, -1, 0, 0, 0)'),true)
  assert.equal(heroReflowStyle('photo','transform','none','matrix(0, 1, -1, 0, 0, 0)'),false)
  assert.equal(heroReflowStyle('progression','fontSize','26px','20px'),false)
  assert.equal(heroReflowStyle('root','transformOrigin','160px 500px','160px 550px',[0,0,320,1000],[0,0,320,1100]),true)
  assert.equal(heroReflowStyle('root','transformOrigin','160px 500px','150px 550px',[0,0,320,1000],[0,0,320,1100]),false)
})
