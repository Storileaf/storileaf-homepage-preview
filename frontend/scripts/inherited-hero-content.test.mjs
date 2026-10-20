import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { heroBaseline, heroBundle, heroContentIds, heroContentProblems, heroLedgerProblems, heroCoverProblems } from './inherited-hero-content.mjs'

const document = JSON.parse(readFileSync(new URL('../content/hero.json', import.meta.url), 'utf8'))
const bundle = execFileSync('git', ['show', heroBaseline + ':' + heroBundle], { encoding: 'utf8' })
const rejects = mutate => {
  const candidate = structuredClone(document)
  mutate(candidate)
  assert.ok(heroContentProblems(candidate, bundle).length, 'Changed hero content must fail its immutable source gate')
}

test('hero retains the bounded 23 records, three photographs and fourteen positions using seven covers twice', () => {
  assert.deepEqual(heroContentProblems(document, bundle), [])
  assert.equal(document.records.length, 23)
  assert.deepEqual(document.records.map(record => record.id), heroContentIds)
  assert.equal(document.photos.length, 3)
  assert.equal(document.covers.length, 7)
  assert.equal(document.orbits.inner.length, 6)
  assert.equal(document.orbits.outer.length, 8)
  for (let index = 0; index < 7; index++) assert.equal([...document.orbits.inner, ...document.orbits.outer].filter(tile => tile.cover_index === index).length, 2)
})

test('hero gate rejects changed wording, emphasis, provenance, membership and invented approval dates', () => {
  for (const mutate of [
    d => d.records[0].copy += '!',
    d => d.records[0].emphasis = 'A different emphasis',
    d => d.records[1].source_fragment = 'elsewhere',
    d => d.records.reverse(),
    d => d.records.push({ ...d.records[0], id: 'home.hero.new_message' }),
    d => d.records.pop(),
    d => d.records[0].approved_on = '2026-10-20',
    d => d.provenance.approved_on = '2026-10-20',
    d => d.provenance.migration_group = 8,
    d => d.provenance.baseline_commit = 'main',
    d => d.provenance.approval_note = '',
    d => d.provenance.public = false,
    d => d.extra_content = 'Unreviewed text',
  ]) rejects(mutate)
})

test('hero gate rejects altered actions and destinations attached to reading text', () => {
  for (const mutate of [
    d => d.records.find(r => r.id === 'home.hero.explore').href = '#books',
    d => d.records.find(r => r.id === 'home.hero.samples').href = 'https://storileaf.com/pricing/',
    d => d.records.find(r => r.id === 'home.hero.samples').destination_verified_on = '',
    d => d.records[0].href = 'https://storileaf.com/',
    d => d.records[0].destination_state = 'existing_verified',
  ]) rejects(mutate)
})

test('hero gate rejects photograph identity, order, captions, alternative text, dimensions and crops', () => {
  for (const mutate of [
    d => d.photos.reverse(),
    d => d.photos[0].src = d.photos[1].src,
    d => d.photos[0].alt = 'Changed alternative text',
    d => d.photos[1].title = 'Changed unused source title',
    d => d.photos[1].label = 'Changed announcement',
    d => d.photos[2].width = 1200,
    d => d.photos[2].height = 600,
    d => d.photos[0].object_position = '50% 50%',
    d => d.photos[0].origin = 'https://example.com/photo.webp',
    d => d.photos[0].rights_review = 'approved',
  ]) rejects(mutate)
})

test('hero gate rejects cover replacements, dimensions, decoration semantics and arrangement changes', () => {
  for (const mutate of [
    d => d.covers.reverse(),
    d => d.covers[0].src = '/covers/other.jpg',
    d => d.covers[0].published_src = '/covers/cover-01.jpg',
    d => d.covers[0].alt = 'New visible meaning',
    d => d.covers[0].width = 300,
    d => d.covers[0].object_position = '50% 40%',
    d => d.covers[0].role = 'informative',
    d => d.covers[0].rights_review = 'approved',
    d => d.orbits.inner[0].angle = 1,
    d => d.orbits.outer[0].cover_index = 0,
    d => d.orbits.outer.reverse(),
    d => d.orbits.inner.push({ angle: 360, cover_index: 6 }),
  ]) rejects(mutate)
})

test('hero gate rejects progression or ticker reference substitutions and order changes', () => {
  for (const mutate of [
    d => d.progression[0].number = '1',
    d => d.progression[0].copy_id = 'home.hero.progression.1',
    d => d.progression.reverse(),
    d => d.ticker.reverse(),
    d => d.ticker[0] = 'home.hero.description',
    d => d.ticker.push('home.hero.ticker.0'),
  ]) rejects(mutate)
})

test('hero parser fails closed on missing source regions, altered bindings and executable URL or numeric expressions', () => {
  for (const [before, after] of [
    ['function Hero()', 'function OtherHero()'],
    ['function HeroCoverOrbits({ paused })', 'function OtherOrbits({ paused })'],
    ['//#region src/components/storileaf/header-hero.tsx', '//#region unrelated.tsx'],
    ['var LIVE_SITE = "https://storileaf.com";', 'var LIVE_SITE = "https://example.com";'],
    ['image: images.binding,', 'image: images.spread,'],
    ['src: orbitCoverImages[outerTileCoverIndices[i]],', 'src: orbitCoverImages[i],'],
    ['var outerTileCoverIndices = [6, 0, 1, 2, 6, 3, 4, 5];', 'var outerTileCoverIndices = [6, 0, 1, 2, 6, 3, 4, run()];'],
    ['binding: `${library}/craft/storileaf-square-hardcover-binding-detail-wide-1200.webp`,', 'binding: `${library}/${run()}.webp`,'],
    ['"aria-label": "Show photograph " + (index + 1),', '"aria-label": "Show photograph " + (index + 2),'],
  ]) {
    assert.ok(bundle.includes(before), 'Mutation must hit its intended source fragment')
    assert.ok(heroContentProblems(document, bundle.replace(before, after)).length, 'Altered source fragment must fail closed')
  }
})

test('hero inheritance cannot admit extra records through another ledger or a forged approval kind', () => {
  const records = document.records.map(record => ({ ...document.provenance, ...record }))
  const unrelated = { id: 'home.other.title', copy: 'An earlier record', approval_kind: 'earlier_kind' }
  assert.deepEqual(heroLedgerProblems([unrelated, ...records], document), [])
  for (const changed of [
    [...records, { ...records[0], id: 'home.other.unapproved' }],
    [...records, { ...unrelated, id: 'home.hero.new_message' }],
    [...records, records[0]],
    records.slice(1),
    records.map((record, index) => index ? record : { ...record, approval_kind: 'founder_approved' }),
  ]) assert.ok(heroLedgerProblems(changed, document).length)
})

test('hero copied covers require identical protected bytes and reject a missing or substituted asset', () => {
  const published = new Map(Array.from({ length: 7 }, (_, index) => {
    const path = 'covers/cover-' + String(index + 1).padStart(2, '0') + '.jpg'
    return [path, execFileSync('git', ['show', heroBaseline + ':' + path])]
  }))
  const readPublished = path => published.get(path)
  const readCopied = path => readFileSync(new URL('../public/' + path, import.meta.url))
  assert.deepEqual(heroCoverProblems(readPublished, readCopied), [])
  assert.equal(heroCoverProblems(readPublished, path => path.endsWith('01.jpg') ? Buffer.from('replacement image') : readCopied(path)).length, 1)
  assert.equal(heroCoverProblems(readPublished, path => {
    if (path.endsWith('07.jpg')) throw Error('missing')
    return readCopied(path)
  }).length, 1)
})
