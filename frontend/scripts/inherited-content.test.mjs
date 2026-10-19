import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
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
