import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { inheritedSharedBaseline, inheritedSharedBundlePath, inheritedSharedHtmlPath, inheritedSharedFragments, inheritedSharedProblems } from './inherited-shared-content.mjs'

const baseline = path => execFileSync('git', ['show', inheritedSharedBaseline + ':' + path], {
  cwd: new URL('../..', import.meta.url), encoding: 'utf8'
})
const sources = { bundle: baseline(inheritedSharedBundlePath), html: baseline(inheritedSharedHtmlPath) }
const records = JSON.parse(readFileSync(new URL('../content/ledger.json', import.meta.url), 'utf8')).records.filter(record => record.approval_kind === 'inherited_published_shared')
const record = id => records.find(item => item.id === id)

test('the authorised shared copy retains its scoped protected text, labels and existing links', () => {
  const fragments = inheritedSharedFragments(sources)
  assert.equal(records.length, 17)
  assert.deepEqual(records.map(item => item.id).sort(), Object.keys(fragments).sort())
  for (const item of records) assert.deepEqual(inheritedSharedProblems(item, sources), [], item.id)
  assert.equal(record('shared.header.books.life.description').copy, 'The homes, people, choices and ordinary details you still remember.')
  assert.equal(record('shared.header.activities').href, 'https://storileaf.github.io/storileaf-homepage-preview/#resources-activity')
  assert.equal(record('shared.header.login_long').href, 'https://app.storileaf.com/login')
  assert.equal(record('shared.footer.currency_label').copy, 'Currency for the pricing page')
  assert.equal(record('shared.header.skip').copy, 'Skip to content')
  assert.equal(record('shared.header.skip').href, 'https://storileaf.github.io/storileaf-homepage-preview/#main-content')
  assert.deepEqual(inheritedSharedProblems(record('shared.header.skip'), {
    ...sources, html: sources.html.replace('class="skip-link active"', 'class="active skip-link"'),
  }), [])
})

test('shared inheritance cannot approve revised text, literal markup, invented links or new approval dates', () => {
  const life = record('shared.header.books.life.description')
  for (const patch of [
    { copy: 'The homes, people and choices you still remember.' },
    { copy: 'The homes, people, choices' },
    { copy: life.copy + '<script>Guaranteed delivery</script>' },
    { copy: life.copy + '&lt;strong&gt;Guaranteed delivery&lt;/strong&gt;' },
    { copy: life.copy + String.raw`\u003cscript\u003eExtra words` },
    { href: 'https://storileaf.com/', destination_state: 'existing_verified' },
    { id: 'shared.header.unapproved' },
    { id: 'home.gifting.title' },
    { approved_on: '2026-10-19' },
    { migration_recorded_on: '2026-10-20' },
    { migration_group: 2 },
    { approval_kind: 'inherited_published_homepage' },
    { status: 'proposed' },
    { approval_note: '' },
    { baseline_commit: 'e4458092ae64749350ac1339c97ac7f83c9ce65c' },
    { approval_reference: 'https://github.com/Storileaf/storileaf-homepage-preview/blob/main/assets/content-sections-CfrmOVRI.js' },
    { approval_reference: record('shared.footer.currency_label').approval_reference },
    { source_fragment: 'books[travel-memoir].description' },
  ]) assert.ok(inheritedSharedProblems({ ...life, ...patch }, sources).length > 0, JSON.stringify(patch))
  const action = record('shared.header.all_resources')
  for (const patch of [
    { copy: 'All&nbsp;resources' },
    { href: 'https://storileaf.com/resources/' },
    { href: 'https://storileaf.github.io/storileaf-homepage-preview/#books' },
    { href: '#resources' },
    { href: undefined },
    { destination_state: 'unbuilt' },
  ]) assert.ok(inheritedSharedProblems({ ...action, ...patch }, sources).length > 0, JSON.stringify(patch))
  const skip = record('shared.header.skip')
  for (const patch of [
    { copy: 'Skip to main content' },
    { copy: skip.copy + '&lt;span&gt;Extra&lt;/span&gt;' },
    { href: '#main-content' },
    { href: 'https://storileaf.github.io/storileaf-homepage-preview/#top' },
    { source_fragment: 'unrelated a.skip-link' },
  ]) assert.ok(inheritedSharedProblems({ ...skip, ...patch }, sources).length > 0, JSON.stringify(patch))
})

test('shared inheritance requires the actual named rendered fragment and never falls back to an unrelated literal', () => {
  const life = record('shared.header.books.life.description')
  const displacedCopy = sources.bundle.replace(JSON.stringify(life.copy), '"A different description."') + '\nvar unrelatedDraft = ' + JSON.stringify(life.copy) + ';\n'
  assert.ok(inheritedSharedProblems(life, { ...sources, bundle: displacedCopy }).length > 0)
  assert.ok(inheritedSharedProblems(life, { ...sources, bundle: sources.bundle.replace('children: book.description', 'children: book.heading') }).length > 0)
  assert.ok(inheritedSharedProblems(record('shared.header.intro'), { ...sources, bundle: sources.bundle.replace('function Header({ currency })', 'function HistoricalHeader({ currency })') }).length > 0)
  assert.ok(inheritedSharedProblems(record('shared.footer.currency_label'), { ...sources, html: sources.html.replace('class="currency-picker"', 'class="historical-currency-picker"') }).length > 0)
  const skip = record('shared.header.skip')
  const misplacedSkip = sources.html.replace('class="skip-link active"', 'class="historical-skip-link active"') + '<a class="skip-link" href="/storileaf-homepage-preview/#main-content">Skip to content</a>'
  assert.ok(inheritedSharedProblems(skip, { ...sources, html: misplacedSkip }).length > 0)
  assert.ok(inheritedSharedProblems(skip, { ...sources, html: sources.html.replace('href="/storileaf-homepage-preview/#main-content"', 'href="/storileaf-homepage-preview/#top"') }).length > 0)
  assert.ok(inheritedSharedProblems(skip, { ...sources, html: sources.html.replace('data-testid="storileaf-home"', 'data-testid="historical-home"') }).length > 0)
  assert.ok(inheritedSharedProblems(life, { bundle: '', html: '' }).length > 0)
})
