import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { inheritedDiscoveryBaseline, inheritedDiscoveryBundlePath, inheritedDiscoveryFragments, inheritedDiscoveryProblems, inheritedDiscoveryLedgerProblems } from './inherited-discovery-content.mjs'
import { inheritedHomepageProblems } from './inherited-content.mjs'
import { contentReferenceProblems } from './content-references.mjs'

const gitFile = (commit, path) => execFileSync('git', ['show', commit + ':' + path], { cwd: new URL('../..', import.meta.url), encoding: 'utf8' })
const bundle = gitFile(inheritedDiscoveryBaseline, inheritedDiscoveryBundlePath)
const allRecords = JSON.parse(readFileSync(new URL('../content/ledger.json', import.meta.url), 'utf8')).records
const records = allRecords.filter(item => item.approval_kind === 'inherited_published_discovery')
const record = id => allRecords.find(item => item.id === id)
const replaceDiscovery = (before, after) => {
  const start = bundle.indexOf('//#region src/components/storileaf/book-discovery.tsx\n')
  const end = bundle.indexOf('\n//#endregion', start)
  const section = bundle.slice(start, end)
  assert.ok(section.includes(before), 'Fixture discovery binding exists: ' + before)
  return bundle.slice(0, start) + section.replace(before, after) + bundle.slice(end)
}

test('discovery inherits exactly the 28 protected fragments and leaves the existing 88 records unchanged', () => {
  const fragments = inheritedDiscoveryFragments(bundle)
  const previous = JSON.parse(gitFile('68734585fa4834962c548d1f57993721a5a82782', 'frontend/content/ledger.json')).records
  assert.equal(previous.length, 88)
  assert.deepEqual(allRecords.slice(0, 88), previous)
  assert.equal(allRecords.length, 116)
  assert.equal(records.length, 28)
  assert.deepEqual(records.map(item => item.id).sort(), Object.keys(fragments).sort())
  assert.deepEqual(inheritedDiscoveryLedgerProblems(allRecords, bundle), [])
  for (const item of records) assert.deepEqual(inheritedDiscoveryProblems(item, bundle), [], item.id)
  assert.equal(record('home.discovery.title').copy, 'Which part of life would you like to tell?')
  assert.equal(record('home.discovery.title').emphasis, 'would you like to tell?')
  assert.equal(record('home.discovery.label').copy, 'Six StoriLeaf books')
  assert.equal(record('home.discovery.cta').copy, 'Explore this book')
  assert.equal(record('home.discovery.books.life.intro').copy, 'A personal memoir of the people, places and experiences that shaped a life.')
  assert.notEqual(record('home.discovery.books.life.intro').copy, record('shared.header.books.life.description').copy)
  assert.equal(record('shared.footer.books.founder').copy, "Founder's Memoir")
})

test('discovery inheritance rejects altered copy, markup, invented destinations, provenance and approval dates', () => {
  const life = record('home.discovery.books.life.intro')
  for (const patch of [
    { copy: record('shared.header.books.life.description').copy },
    { copy: life.copy.slice(0, -1) },
    { copy: life.copy + '<span>Guaranteed delivery</span>' },
    { copy: life.copy + '&lt;span&gt;Guaranteed delivery&lt;/span&gt;' },
    { copy: life.copy + String.raw`\u003cspan\u003eExtra words` },
    { copy: record('home.discovery.books.travel.intro').copy },
    { emphasis: 'life' },
    { id: 'home.discovery.books.life.point4' },
    { id: 'shared.header.books.life.description' },
    { href: 'https://storileaf.com/pricing/', destination_state: 'existing_verified' },
    { approved_on: '2026-10-19' },
    { migration_recorded_on: '2026-10-20' },
    { migration_group: 3 },
    { approval_kind: 'inherited_published_shared' },
    { status: 'proposed' },
    { public: false },
    { approval_note: '' },
    { baseline_commit: '68734585fa4834962c548d1f57993721a5a82782' },
    { approval_reference: 'https://github.com/Storileaf/storileaf-homepage-preview/blob/main/assets/content-sections-CfrmOVRI.js' },
    { source_fragment: 'books[life-story].description' },
  ]) assert.ok(inheritedDiscoveryProblems({ ...life, ...patch }, bundle).length > 0, JSON.stringify(patch))
  assert.ok(inheritedDiscoveryProblems({ ...record('home.discovery.title'), emphasis: 'life would you like to tell?' }, bundle).length > 0)
  assert.ok(inheritedDiscoveryProblems({ ...record('home.discovery.cta'), href: 'https://storileaf.com/life-story/', destination_state: 'existing_verified' }, bundle).length > 0)
})

test('discovery fragments must come from the named panel data and its actual render bindings', () => {
  const life = record('home.discovery.books.life.intro')
  const replacements = [
    ['function BookDiscovery({ currency: _currency })', 'function HistoricalBookDiscovery({ currency: _currency })'],
    ['children: bookPanelIntroductions[book.slug]', 'children: book.description'],
    ['children: bookPoints[book.slug]?.map', 'children: draftPoints[book.slug]?.map'],
    ['children: point }, point)', 'children: "Other point" }, point)'],
    ['children: book.formalLabel', 'children: book.label'],
    ['href: LIVE_SITE + "/" + book.slug + "/"', 'href: LIVE_SITE + "/pricing/"'],
    [JSON.stringify(life.copy), '"A different panel introduction."'],
    ['"aria-label": "Six StoriLeaf books"', '"aria-label": "Different rail label"'],
  ]
  for (const [before, after] of replacements) {
    const changed = replaceDiscovery(before, after) + '\nvar unrelatedDraft = ' + JSON.stringify(life.copy) + ';\n'
    const checked = before.includes('Six StoriLeaf') ? record('home.discovery.label') : life
    assert.ok(inheritedDiscoveryProblems(checked, changed).length > 0, before)
  }
  const point = record('home.discovery.books.life.point1')
  const displaced = bundle.replace(JSON.stringify(point.copy), '"A different point"') + '\nvar unrelatedPoint = ' + JSON.stringify(point.copy) + ';\n'
  assert.ok(inheritedDiscoveryProblems(point, displaced).length > 0)
  assert.ok(inheritedDiscoveryProblems(life, '').length > 0)
})

test('discovery preserves all six formal-name destinations and rejects missing, added or reassigned content', () => {
  for (const patch of [
    { copy: 'Founder’s Memoir' },
    { href: 'https://storileaf.com/pricing/?keepsake=founders-memoir' },
    { href: 'https://storileaf.com/life-story/' },
    { destination_state: 'unbuilt' },
  ]) {
    const changed = allRecords.map(item => item.id === 'shared.footer.books.founder' ? { ...item, ...patch } : item)
    assert.ok(inheritedDiscoveryLedgerProblems(changed, bundle).length > 0, JSON.stringify(patch))
  }
  assert.ok(inheritedDiscoveryLedgerProblems(allRecords.filter(item => item.id !== 'home.discovery.books.life.point3'), bundle).length > 0)
  assert.ok(inheritedDiscoveryLedgerProblems([...allRecords, { ...record('home.discovery.books.life.point3'), id: 'home.discovery.books.life.point4' }], bundle).length > 0)
  const reordered = bundle.replace('"Childhood, family and the places you called home",\n\t\t"Choices, relationships and defining moments"', '"Choices, relationships and defining moments",\n\t\t"Childhood, family and the places you called home"')
  assert.notEqual(reordered, bundle)
  assert.ok(inheritedDiscoveryProblems(record('home.discovery.books.life.point1'), reordered).length > 0)
})

test('data-driven discovery references receive the same ledger and destination checks as existing source calls', () => {
  const index = new Map(allRecords.map(item => [item.id, item]))
  const source = `
    editorialTitle('home.discovery.title')
    approvedCopy('home.discovery.description')
    verifiedHref('shared.footer.books.life')
    { labelId: 'shared.footer.books.life', introId: 'home.discovery.books.life.intro',
      pointIds: ['home.discovery.books.life.point1', 'home.discovery.books.life.point2', 'home.discovery.books.life.point3'] }
    { copyId: 'home.reassurance.schedule', actionId: 'home.invitation.cta' }
  `
  assert.deepEqual(contentReferenceProblems(source, index, 'fixture.ts'), [])
  for (const [before, after] of [
    ['home.discovery.title', 'home.discovery.unapproved_title'],
    ['home.discovery.books.life.intro', 'home.discovery.books.life.unapproved_intro'],
    ['home.discovery.books.life.point2', 'home.discovery.books.life.point4'],
    ['home.reassurance.schedule', 'home.reassurance.unapproved'],
    ["pointIds: ['home.discovery.books.life.point1', 'home.discovery.books.life.point2', 'home.discovery.books.life.point3']", "pointIds: ['home.discovery.books.life.point1', ...otherIds]"],
    ["pointIds: ['home.discovery.books.life.point1', 'home.discovery.books.life.point2', 'home.discovery.books.life.point3']", 'pointIds: otherIds'],
  ]) assert.ok(contentReferenceProblems(source.replace(before, after), index, 'fixture.ts').length > 0, after)
  const noDestination = new Map(index)
  noDestination.set('shared.footer.books.life', { ...record('shared.footer.books.life'), destination_state: undefined })
  assert.ok(contentReferenceProblems("{ labelId: 'shared.footer.books.life' }", noDestination, 'fixture.ts').some(problem => problem.includes('non-destination')))
})

test('local Books integration never relaxes the invitation ledger canonical destination', () => {
  const html = gitFile(inheritedDiscoveryBaseline, 'index.html')
  const invitation = record('home.invitation.cta')
  assert.equal(invitation.href, 'https://storileaf.github.io/storileaf-homepage-preview/#books')
  assert.deepEqual(inheritedHomepageProblems(invitation, html), [])
  assert.ok(inheritedHomepageProblems({ ...invitation, href: '#books' }, html).length > 0)
})
