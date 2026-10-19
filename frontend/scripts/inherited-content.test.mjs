import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { inheritedHomepageBaseline, inheritedHomepageReference, inheritedHomepageProblems, normalisePublishedCopy } from './inherited-content.mjs'

const baselineHtml = execFileSync('git', ['show', inheritedHomepageBaseline + ':index.html'], {
  cwd: new URL('../..', import.meta.url), encoding: 'utf8'
})
const inherited = {
  id: 'home.gifting.title',
  copy: 'Give someone the chance to make their book.',
  public: true,
  status: 'founder_approved',
  approval_kind: 'inherited_published_homepage',
  baseline_commit: inheritedHomepageBaseline,
  approval_reference: inheritedHomepageReference,
  migration_recorded_on: '2026-10-19',
  approval_note: 'Existing published wording carried forward without assigning an original approval date.'
}

test('inherited Gifting copy matches the immutable published wording without a fabricated approval date', () => {
  assert.deepEqual(inheritedHomepageProblems(inherited, baselineHtml), [])
  assert.equal(normalisePublishedCopy('Give someone the chance to make <em>their book.</em>'), inherited.copy)
  assert.equal(normalisePublishedCopy('Blog &amp; guides&#160; &#x26; stories'), 'Blog & guides & stories')
})

test('inheritance cannot authorise revised wording, an arbitrary fragment or another baseline', () => {
  for (const patch of [
    { copy: 'Give someone the chance to make a book.' },
    { copy: 'the chance to make' },
    { id: 'home.gifting.unapproved' },
    { baseline_commit: '75bfe77d7522ae93a51a0f51d322ff93eb4ec9c3' },
    { approval_reference: 'https://github.com/Storileaf/storileaf-homepage-preview/blob/main/index.html' },
    { approved_on: '2026-10-19' },
    { migration_recorded_on: undefined },
    { approval_note: '' },
    { status: 'proposed' }
  ]) {
    assert.ok(inheritedHomepageProblems({ ...inherited, ...patch }, baselineHtml).length > 0, JSON.stringify(patch))
  }
  assert.ok(inheritedHomepageProblems(inherited, '').length > 0)
})

const group2 = JSON.parse(readFileSync(new URL('../content/ledger.json', import.meta.url), 'utf8')).records
  .filter(record => record.migration_group === 2)

test('all authorised Group 2 wording and resolved actions retain their complete protected fragments', () => {
  assert.equal(group2.length, 25)
  for (const record of group2) assert.deepEqual(inheritedHomepageProblems(record, baselineHtml), [], record.id)
  assert.equal(group2.find(record => record.id === 'home.reassurance.schedule').copy, 'Progress on your own schedule')
  assert.equal(group2.find(record => record.id === 'home.faq.time.cta').href, 'https://storileaf.github.io/storileaf-homepage-preview/pricing')
  assert.equal(group2.find(record => record.id === 'home.invitation.title').copy, 'Let’s find your book.')
  assert.equal(group2.find(record => record.id === 'home.invitation.cta').href, 'https://storileaf.github.io/storileaf-homepage-preview/#books')
})

test('Group 2 inheritance rejects revised claims, reassigned fragments, extra links and lost migration scope', () => {
  const patchProblems = (id, patch) => inheritedHomepageProblems({ ...group2.find(record => record.id === id), ...patch }, baselineHtml)
  for (const [id, patch] of [
    ['home.reassurance.schedule', { copy: 'Unlimited time to write' }],
    ['home.reassurance.schedule', { copy: 'Progress on your <em>own</em> schedule' }],
    ['home.reassurance.schedule', { copy: 'Progress on your own schedule<script>Guaranteed delivery</script>' }],
    ['home.reassurance.payment', { copy: 'One-time payment' }],
    ['home.faq.time.answer', { copy: 'You have unlimited time to contribute.' }],
    ['home.faq.gifting.answer', { id: 'home.faq.writer.answer' }],
    ['home.faq.media.answer', { href: 'https://storileaf.com/', destination_state: 'existing_verified' }],
    ['home.faq.title', { id: 'home.faq.unapproved' }],
    ['home.invitation.title', { migration_group: undefined }],
    ['home.invitation.title', { copy: 'Let&rsquo;s find your book.' }],
    ['home.invitation.title', { approved_on: '2026-10-19' }],
    ['home.invitation.title', { approval_reference: 'https://github.com/Storileaf/storileaf-homepage-preview/blob/main/index.html' }],
  ]) assert.ok(patchProblems(id, patch).length > 0, id + ' ' + JSON.stringify(patch))
})

test('inherited actions cannot silently change pricing scope, destination or link state', () => {
  for (const [id, patch] of [
    ['home.faq.time.cta', { href: 'https://storileaf.github.io/storileaf-homepage-preview/pricing/inr' }],
    ['home.faq.media.cta', { href: 'https://storileaf.com/pricing/' }],
    ['home.invitation.cta', { href: 'https://storileaf.github.io/storileaf-homepage-preview/#resources' }],
    ['home.invitation.cta', { destination_state: 'unbuilt' }],
    ['home.faq.cta', { href: undefined }],
  ]) {
    const record = { ...group2.find(record => record.id === id), ...patch }
    assert.ok(inheritedHomepageProblems(record, baselineHtml).length > 0, id)
  }
})
