import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { writingBaseline, writingBundle, writingSharedBundle, writingContentIds, writingContentProblems, writingLedgerProblems } from './inherited-writing-content.mjs'

const document = JSON.parse(readFileSync(new URL('../content/writing.json', import.meta.url), 'utf8'))
const bundle = execFileSync('git', ['show', writingBaseline + ':' + writingBundle], { encoding: 'utf8' })
const shared = execFileSync('git', ['show', writingBaseline + ':' + writingSharedBundle], { encoding: 'utf8' })
const rejects = mutate => {
  const candidate = structuredClone(document)
  mutate(candidate)
  assert.ok(writingContentProblems(candidate, bundle, shared).length, 'Altered writing content must fail its protected source gate')
}

test('writing retains the exact 25 records and existing decorative logo from named source regions', () => {
  assert.deepEqual(writingContentProblems(document, bundle, shared), [])
  assert.equal(document.records.length, 25)
  assert.deepEqual(document.records.map(record => record.id), writingContentIds)
  assert.equal(document.assets.length, 1)
})

test('writing gate rejects wording, emphasis, membership, source fragments and invented approval dates', () => {
  for (const mutate of [
    d => d.records[0].copy += '!',
    d => d.records[0].emphasis = 'A revised invitation',
    d => d.records[1].source_fragment = 'Other text elsewhere',
    d => d.records.reverse(),
    d => d.records.pop(),
    d => d.records.push({ ...d.records[0], id: 'home.writing.new_message' }),
    d => d.records[0].approved_on = '2026-10-20',
    d => d.provenance.approved_on = '2026-10-20',
    d => d.provenance.migration_group = 7,
    d => d.provenance.baseline_commit = 'main',
    d => d.provenance.source = 'https://example.com/',
    d => d.provenance.public = false,
    d => d.provenance.approval_note = '',
    d => d.extra_content = 'Unreviewed content',
    d => d.records[0].href = 'https://storileaf.com/',
  ]) rejects(mutate)
})

test('writing gate rejects substituted logos, dimensions, image meanings and changed rights state', () => {
  for (const mutate of [
    d => d.assets[0].src = 'https://example.com/logo.png',
    d => d.assets[0].alt = 'New informative image',
    d => d.assets[0].width = 100,
    d => d.assets[0].height = 30,
    d => d.assets[0].loading = 'eager',
    d => d.assets[0].role = 'informative',
    d => d.assets[0].rights_review = 'approved',
    d => d.assets[0].origin = 'https://example.com/',
    d => d.assets.push(d.assets[0]),
  ]) rejects(mutate)
})

test('writing parser fails closed on replaced regions, mismatched question occurrences and changed control bindings', () => {
  for (const [before, after] of [
    ['//#region src/components/storileaf/device-showcase.tsx', '//#region unrelated.tsx'],
    ['function DeviceShowcase()', 'function OtherShowcase()'],
    ['function EditorScreen({ format })', 'function OtherScreen({ format })'],
    ['"aria-labelledby": "devices-title",', '"aria-labelledby": "other-title",'],
    ['"What do you remember about the home you grew up in?"', '"A changed question?"'],
    ['"Think about a room, a sound or someone who was always there."', '"Different guidance."'],
    ['maxLength: 2e3,', 'maxLength: 4e3,'],
    ['value: answer,', 'value: savedAnswer,'],
    ['wordCount === 1 ? "word" : "words"', 'wordCount === 1 ? "word" : "characters"'],
    ['"aria-describedby": "demo-privacy",', '"aria-describedby": "other-message",'],
    ['src: logo,', 'src: images.family,'],
  ]) {
    assert.ok(bundle.includes(before), 'Mutation must hit its intended source fragment')
    assert.ok(writingContentProblems(document, bundle.replace(before, after), shared).length, 'Changed binding must fail closed')
  }
  for (const [before, after] of [
    ['var LIVE_SITE = "https://storileaf.com";', 'var LIVE_SITE = "https://example.com";'],
    ['var logo = `${LIVE_SITE}/logo.png`;', 'var logo = `${LIVE_SITE}/${run()}.png`;'],
  ]) {
    assert.ok(shared.includes(before))
    assert.ok(writingContentProblems(document, bundle, shared.replace(before, after)).length)
  }
})

test('writing inheritance cannot admit extra ledger records or a forged approval kind', () => {
  const records = document.records.map(record => ({ ...document.provenance, ...record }))
  const unrelated = { id: 'home.other.title', copy: 'Existing content', approval_kind: 'earlier_kind' }
  assert.deepEqual(writingLedgerProblems([unrelated, ...records], document), [])
  for (const changed of [
    [...records, { ...records[0], id: 'home.other.unapproved' }],
    [...records, { ...unrelated, id: 'home.writing.new_message' }],
    [...records, records[0]],
    records.slice(1),
    records.map((record, index) => index ? record : { ...record, approval_kind: 'founder_approved' }),
  ]) assert.ok(writingLedgerProblems(changed, document).length)
})
