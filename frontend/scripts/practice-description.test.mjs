import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { comparePracticeReferences, practiceQuestion, practicePrivacy } from './practice-description-contract.mjs'

const refs = text => [
  { attribute: 'aria-labelledby', texts: [practiceQuestion] },
  { attribute: 'aria-describedby', texts: [text] }
]
const broken = refs(null), fixed = refs(practicePrivacy)

test('P4-05 permits only the documented dialog description correction', () => {
  const result = comparePracticeReferences('dialog', broken, fixed)
  assert.equal(result.equal, true)
  assert.equal(result.approvedDifference, true)
  assert.deepEqual(result.published, broken)
  assert.deepEqual(result.source, fixed)
})

test('P4-05 rejects a missing, removed, changed or additional description', () => {
  for (const source of [broken, undefined, [], refs('Different privacy text'), fixed.slice(0, 1), [...fixed, { attribute: 'aria-describedby', texts: ['extra'] }]]) {
    assert.equal(comparePracticeReferences('dialog', broken, source).equal, false)
  }
  const duplicate = structuredClone(fixed); duplicate[1].texts.push(practicePrivacy)
  assert.equal(comparePracticeReferences('dialog', broken, duplicate).equal, false)
  const dangling = structuredClone(fixed); dangling[1].texts.push(null)
  assert.equal(comparePracticeReferences('dialog', broken, dangling).equal, false)
})

test('P4-05 cannot change the title or authorise another baseline defect', () => {
  const title = structuredClone(fixed); title[0].texts[0] = 'Changed title'
  assert.equal(comparePracticeReferences('dialog', broken, title).equal, false)
  assert.equal(comparePracticeReferences('dialog', refs('Other baseline'), fixed).equal, false)
  assert.equal(comparePracticeReferences('dialog', fixed, fixed).equal, false)
})

test('P4-05 does not exempt textarea or unrelated references from exact comparison', () => {
  assert.equal(comparePracticeReferences('textarea', broken, fixed).equal, false)
  assert.equal(comparePracticeReferences('textarea', fixed, fixed).equal, true)
  assert.equal(comparePracticeReferences('other', broken, fixed).equal, false)
})

test('PracticeDialog explicitly connects both consumers to one native approved paragraph', () => {
  const source = readFileSync(new URL('../src/sections/PracticeDialog.tsx', import.meta.url), 'utf8')
  assert.match(source, /<Dialog\.Content\b[^>]*\baria-describedby="demo-privacy"/)
  assert.match(source, /<p id="demo-privacy">\{approvedCopy\('home\.writing\.privacy'\)\}<\/p>/)
  assert.doesNotMatch(source, /<Dialog\.Description\b/)
  assert.match(source, /<textarea\b[^>]*\baria-describedby="demo-privacy"/)
  assert.equal((source.match(/\bid="demo-privacy"/g) || []).length, 1)
  assert.equal((source.match(/approvedCopy\('home\.writing\.privacy'\)/g) || []).length, 1)
})
