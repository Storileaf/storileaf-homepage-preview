import test from 'node:test'
import assert from 'node:assert/strict'
import { compareAutoMargins, comparePixelCoordinates } from './computed-style-parity.mjs'

const centred = raw => ({
  bounded: true, available: true,
  typed: { marginLeft: 'auto', marginRight: 'auto' },
  raw: { marginLeft: raw, marginRight: raw },
  rect: [20, 100, 280, 200], parentRect: [0, 50, 320, 400],
  parentEdges: { borderLeft: 0, paddingLeft: 0, borderRight: 0, paddingRight: 0 },
  layout: { display: 'grid', position: 'static', transform: 'none', parentTransform: 'none' },
  measured: { marginLeft: 20, marginRight: 20 }
})

test('centred auto margins preserve the observed raw zero versus used-value evidence', () => {
  const before = centred('0px'), after = centred('20px')
  assert.deepEqual(compareAutoMargins(before, after, { tolerance: 0 }), { equal: true, differences: [], maximumGeometry: 0 })
  assert.equal(before.raw.marginLeft, '0px')
  assert.equal(after.raw.marginLeft, '20px')
})

test('bounded auto-margin comparison rejects missing evidence and real layout or style changes', () => {
  const mutations = {
    unavailable: value => { value.available = false },
    outsideScope: value => { value.bounded = false },
    missing: value => { delete value.parentEdges },
    nonAuto: value => { value.typed.marginLeft = '20px' },
    invalidRaw: value => { value.raw.marginRight = '2px' },
    invalidUnit: value => { value.raw.marginLeft = 'auto' },
    changedBox: value => { value.rect[2] += 1 },
    changedParent: value => { value.parentRect[2] += 1 },
    changedEdge: value => { value.parentEdges.paddingRight = 1 },
    changedDisplay: value => { value.layout.display = 'block' },
    changedTransform: value => { value.layout.transform = 'matrix(1,0,0,1,0,0)' },
    changedGap: value => { value.measured.marginLeft += 1 },
    negativeGap: value => { value.measured.marginLeft = -1 },
    nonFinite: value => { value.parentRect[0] = NaN },
    movedBoth: value => { value.rect[0] += 1; value.parentRect[0] += 1 }
  }
  for (const [label, mutate] of Object.entries(mutations)) {
    const after = centred('20px'); mutate(after)
    assert.equal(compareAutoMargins(centred('0px'), after, { tolerance: 0 }).equal, false, label)
  }
  for (const field of ['rect', 'parentRect', 'measured']) {
    const after = centred('20px')
    if (field === 'measured') after.measured.marginLeft += .001
    else after[field][0] += .001
    assert.equal(compareAutoMargins(centred('0px'), after, { tolerance: 0 }).equal, false, field + ' changed by .001px')
  }
})

test('auto-margin comparisons honour the supplied existing geometry gate including zero', () => {
  const before = centred('0px'), within = centred('20px'), outside = centred('20px')
  within.rect[1] += .125
  outside.rect[1] += .25
  assert.equal(compareAutoMargins(before, within, { tolerance: .15 }).equal, true)
  assert.equal(compareAutoMargins(before, within, { tolerance: 0 }).equal, false)
  assert.equal(compareAutoMargins(before, outside, { tolerance: .15 }).equal, false)
})

test('pixel coordinates use the existing geometry gate and reject invalid or changed coordinates', () => {
  assert.equal(comparePixelCoordinates('46.2422px 17.7891px', '46.2734px 17.7891px', .15).equal, true)
  assert.equal(comparePixelCoordinates('46.2422px 17.7891px', '46.5px 17.7891px', .15).equal, false)
  assert.equal(comparePixelCoordinates('46px 17px', '46.125px 17px', 0).equal, false)
  assert.equal(comparePixelCoordinates('46px 17px', '46px 17px 0px', .15).equal, false)
  assert.equal(comparePixelCoordinates('46px 17px', '50% 17px', .15).equal, false)
  assert.equal(comparePixelCoordinates(undefined, '46px 17px', .15).equal, false)
})
