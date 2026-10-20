import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'

export const heroBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const heroBundle = 'assets/content-sections-CfrmOVRI.js'
export const heroReference = `https://github.com/Storileaf/storileaf-homepage-preview/blob/${heroBaseline}/${heroBundle}`
const publishedHome = 'https://storileaf.github.io/storileaf-homepage-preview/'
const recordedOn = '2026-10-20'
const photoKeys = ['binding', 'spread', 'family']

// This is a membership boundary, not permission for arbitrary home.hero IDs.
export const heroContentIds = Object.freeze([
  'home.hero.title',
  'home.hero.progression.label',
  'home.hero.progression.0', 'home.hero.progression.1', 'home.hero.progression.2',
  'home.hero.carousel.label', 'home.hero.carousel.choose',
  'home.hero.carousel.show.0', 'home.hero.carousel.show.1', 'home.hero.carousel.show.2',
  'home.hero.carousel.previous', 'home.hero.carousel.next',
  'home.hero.description', 'home.hero.explore', 'home.hero.samples',
  'home.hero.ticker.pause', 'home.hero.ticker.resume',
  'home.hero.ticker.0', 'home.hero.ticker.1', 'home.hero.ticker.2',
  'home.hero.ticker.3', 'home.hero.ticker.4', 'home.hero.ticker.5',
])

const expression = (parsed, range, expected, description) => {
  if (!range || !isDeepStrictEqual(parsed.tokens.slice(range.start, range.end), parse.parseRegion(expected).tokens)) throw Error('Unexpected protected hero ' + description)
}
const declaration = (parsed, name) => {
  const start = parse.namedDeclaration(parsed, name, '[')
  return parse.parts(parsed, start + 1, parsed.groups.get(start))
}
const number = (parsed, range) => {
  const tokens = parsed.tokens.slice(range.start, range.end)
  const raw = tokens.map(token => token.value).join('')
  if (tokens.some(token => token.kind !== 'punctuation') || !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(raw)) throw Error('Unexpected protected hero numeric literal')
  return Number(raw)
}
const exactKeys = (value, keys) => value && isDeepStrictEqual(Object.keys(value).sort(), [...keys].sort())

/** Read only the named Hero/HeroCoverOrbits functions and explicit declarations.
 * Compiled JavaScript and URL templates are parsed as inert data, never run. */
export function heroFragments(bundle) {
  const section = parse.region(bundle, 'src/components/storileaf/header-hero.tsx')
  const parsed = parse.parseRegion(section)
  const nodes = parse.jsxNodes(parsed, parse.namedFunction(parsed, 'Hero'))
  const orbitNodes = parse.jsxNodes(parsed, parse.namedFunction(parsed, 'HeroCoverOrbits'))
  const node = (type, property, value) => parse.one(nodes.filter(n => n.type === type && parse.property(parsed, n, property) === value), 'hero ' + value)
  const root = node('section', 'className', 'hero')
  if (parse.property(parsed, root, 'aria-labelledby') !== 'hero-title') throw Error('Unexpected protected hero root')
  const records = []
  const add = (id, copy, source_fragment, extra = {}) => {
    if (typeof copy !== 'string' || !copy.trim()) throw Error('Missing protected hero copy ' + id)
    records.push({ id, copy, ...extra, source_fragment })
  }

  const heading = node('h1', 'id', 'hero-title')
  const emphasisNode = parse.one(nodes.filter(n => n.type === 'em' && parse.inside(n, heading)), 'hero emphasis')
  const headingRange = heading.props.get('children')
  const headingParts = parse.parts(parsed, headingRange.start + 1, headingRange.end - 1)
  const first = parse.literal(parsed, headingParts[0])
  const emphasis = parse.property(parsed, emphasisNode, 'children')
  if (headingParts.length !== 2 || typeof first !== 'string' || typeof emphasis !== 'string') throw Error('Unexpected protected hero heading')
  // The published em is a separate visual line. Keep one joining space in the
  // content record, while retaining the exact two source strings and emphasis.
  add('home.hero.title', first + ' ' + emphasis, 'Hero h1#hero-title children', { emphasis })

  const progressionNode = node('div', 'className', 'hero-progression')
  add('home.hero.progression.label', parse.property(parsed, progressionNode, 'aria-label'), 'Hero .hero-progression aria-label')
  const progressionNodes = nodes.filter(n => n.type === 'span' && parse.inside(n, progressionNode))
  if (progressionNodes.length !== 3) throw Error('Hero requires three original progression items')
  const progression = progressionNodes.map((item, index) => {
    const marker = parse.one(nodes.filter(n => n.type === 'b' && parse.inside(n, item)), 'hero progression marker')
    const range = item.props.get('children')
    const pieces = parse.parts(parsed, range.start + 1, range.end - 1)
    const copy = parse.literal(parsed, pieces[1])
    const number = parse.property(parsed, marker, 'children')
    if (pieces.length !== 2 || typeof copy !== 'string' || number !== String(index + 1).padStart(2, '0')) throw Error('Unexpected protected hero progression')
    const copy_id = `home.hero.progression.${index}`
    add(copy_id, copy.trim(), `Hero .hero-progression span[${index}] text`)
    return { number, copy_id }
  })

  const carousel = node('div', 'className', 'hero-window')
  if (parse.property(parsed, carousel, 'role') !== 'region' || parse.property(parsed, carousel, 'aria-roledescription') !== 'carousel') throw Error('Unexpected protected hero carousel semantics')
  add('home.hero.carousel.label', parse.property(parsed, carousel, 'aria-label'), 'Hero .hero-window aria-label')
  const dots = node('div', 'className', 'hero-image-dots')
  add('home.hero.carousel.choose', parse.property(parsed, dots, 'aria-label'), 'Hero .hero-image-dots aria-label')
  const dot = parse.one(nodes.filter(n => n.type === 'button' && parse.inside(n, dots)), 'hero photograph selector')
  expression(parsed, dot.props.get('aria-label'), '"Show photograph " + (index + 1)', 'photograph selector label')
  expression(parsed, dots.props.get('children'), 'heroScenes.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: index === active ? "hero-dot is-active" : "hero-dot", "aria-label": "Show photograph " + (index + 1), "aria-current": index === active ? "true" : void 0, onClick: () => goTo(index, index > active ? 1 : -1), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) }, item.image))', 'photograph selector binding')
  for (let index = 0; index < 3; index++) add(`home.hero.carousel.show.${index}`, 'Show photograph ' + (index + 1), `Hero .hero-image-dots button[${index}] aria-label`)
  for (const action of ['previous', 'next']) {
    const control = node('button', 'data-testid', 'hero-' + action)
    add('home.hero.carousel.' + action, parse.property(parsed, control, 'aria-label'), 'Hero #hero-' + action + ' aria-label')
  }

  add('home.hero.description', parse.property(parsed, node('p', 'className', 'hero-description'), 'children'), 'Hero p.hero-description children')
  const actions = node('div', 'className', 'button-row hero-actions')
  for (const [id, hash] of [['explore', 'books'], ['samples', 'samples']]) {
    const action = parse.one(nodes.filter(n => n.type === 'Link$1' && parse.inside(n, actions) && parse.property(parsed, n, 'hash') === hash), 'hero ' + hash + ' action')
    if (parse.property(parsed, action, 'to') !== '/') throw Error('Unexpected protected hero action destination')
    add('home.hero.' + id, parse.arrowLabel(parsed, action, nodes), 'Hero action #' + hash, { href: new URL('#' + hash, publishedHome).href })
  }
  const tickerNode = node('div', 'className', 'hero-marquee')
  expression(parsed, tickerNode.props.get('aria-label'), 'tickerHeld ? "Resume moving phrases" : "Pause moving phrases"', 'ticker state labels')
  add('home.hero.ticker.pause', 'Pause moving phrases', 'Hero .hero-marquee unheld aria-label')
  add('home.hero.ticker.resume', 'Resume moving phrases', 'Hero .hero-marquee held aria-label')
  const phrases = declaration(parsed, 'heroMarquee')
  if (phrases.length !== 6) throw Error('Hero requires six original ticker phrases')
  const ticker = phrases.map((range, index) => {
    const id = `home.hero.ticker.${index}`
    add(id, parse.literal(parsed, range), `heroMarquee[${index}]`)
    return id
  })
  if (!isDeepStrictEqual(records.map(record => record.id), heroContentIds)) throw Error('Hero content allowlist changed')

  const dataSource = parse.region(bundle, 'src/data/homepage.ts')
  const data = parse.parseRegion(dataSource)
  if (parse.namedString(data, 'LIVE_SITE') !== 'https://storileaf.com' || !dataSource.includes('var library = `${LIVE_SITE}/images/brand`;')) throw Error('Hero image origin changed')
  const imagesBlock = parse.one([...dataSource.matchAll(/var images = \{([\s\S]*?)\n\};/g)], 'homepage image declaration')[1]
  const activePhoto = node('img', 'data-testid', 'hero-image')
  if (parse.property(parsed, activePhoto, 'width') !== '1400' || parse.property(parsed, activePhoto, 'height') !== '650') throw Error('Hero declared photograph dimensions changed')
  expression(parsed, activePhoto.props.get('src'), 'scene.image', 'active photograph source')
  expression(parsed, activePhoto.props.get('alt'), 'scene.alt', 'active photograph alternative text')
  expression(parsed, activePhoto.props.get('style'), '{ objectPosition: scene.position }', 'active photograph crop')
  const scenes = declaration(data, 'heroScenes')
  if (scenes.length !== 3) throw Error('Hero requires three original photographs')
  const photos = scenes.map((range, index) => {
    const props = parse.properties(data, range.start), id = photoKeys[index]
    if (!isDeepStrictEqual([...props.keys()].sort(), ['alt', 'image', 'label', 'position', 'title'])) throw Error('Unexpected protected hero photograph fields')
    expression(data, props.get('image'), 'images.' + id, 'photograph order/binding')
    const suffix = parse.one([...imagesBlock.matchAll(new RegExp('\\b' + id + ': `\\$\\{library\\}(/[^`]+)`', 'g'))], 'hero photograph ' + id)[1]
    if (!/^\/[a-zA-Z0-9_./-]+\.webp$/.test(suffix) || suffix.includes('..')) throw Error('Unexpected protected hero image template')
    const value = field => {
      const result = parse.literal(data, props.get(field))
      if (typeof result !== 'string' || !result.trim()) throw Error('Missing protected hero photograph ' + field)
      return result
    }
    return { id, src: 'https://storileaf.com/images/brand' + suffix, alt: value('alt'), title: value('title'), label: value('label'), width: 1400, height: 650, object_position: value('position'), source_fragment: `heroScenes[${index}]` }
  })

  const coverDeclarations = declaration(parsed, 'orbitCoverImages')
  if (coverDeclarations.length !== 7) throw Error('Hero requires seven original cover assets')
  const coverImages = orbitNodes.filter(n => n.type === 'img' && parse.property(parsed, n, 'className') === 'hero-orbit-square')
  if (coverImages.length !== 2 || coverImages.some(n => parse.property(parsed, n, 'alt') !== '' || parse.property(parsed, n, 'width') !== '240' || parse.property(parsed, n, 'height') !== '240')) throw Error('Hero decorative cover semantics/dimensions changed')
  expression(parsed, coverImages[0].props.get('src'), 'orbitCoverImages[i]', 'inner cover binding')
  expression(parsed, coverImages[1].props.get('src'), 'orbitCoverImages[outerTileCoverIndices[i]]', 'outer cover binding')
  const covers = coverDeclarations.map((range, index) => {
    const published_src = parse.literal(parsed, range)
    const id = 'cover-' + String(index + 1).padStart(2, '0')
    if (published_src !== '/storileaf-homepage-preview/covers/' + id + '.jpg') throw Error('Unexpected protected hero cover identity')
    return { id, src: '/covers/' + id + '.jpg', published_src, alt: '', width: 240, height: 240, object_position: '50% 50%', role: 'decorative', source_fragment: `orbitCoverImages[${index}]` }
  })
  const innerAngles = declaration(parsed, 'innerTileAngles').map(range => number(parsed, range))
  const outerAngles = declaration(parsed, 'outerTileAngles').map(range => number(parsed, range))
  const outerIndices = declaration(parsed, 'outerTileCoverIndices').map(range => number(parsed, range))
  if (innerAngles.length !== 6 || outerAngles.length !== 8 || outerIndices.length !== 8 || outerIndices.some(index => !Number.isInteger(index) || index < 0 || index >= covers.length)) throw Error('Hero cover arrangement membership changed')
  const orbits = {
    inner: innerAngles.map((angle, cover_index) => ({ angle, cover_index })),
    outer: outerAngles.map((angle, index) => ({ angle, cover_index: outerIndices[index] })),
  }
  if (covers.some((_, index) => [...orbits.inner, ...orbits.outer].filter(tile => tile.cover_index === index).length !== 2)) throw Error('Hero must use each original cover exactly twice')
  return { records, photos, covers, orbits, progression, ticker }
}

export function heroContentProblems(document, bundle) {
  let expected
  try { expected = heroFragments(bundle) } catch (error) { return [String(error)] }
  const problems = [], p = document?.provenance
  if (!exactKeys(document, ['version', 'provenance', 'records', 'photos', 'covers', 'orbits', 'progression', 'ticker']) || document.version !== 1) problems.push('Invalid hero content document shape')
  const provenanceKeys = ['approval_kind', 'migration_group', 'baseline_commit', 'source', 'approval_reference', 'migration_recorded_on', 'status', 'public', 'approval_note']
  if (!exactKeys(p, provenanceKeys) || p.approval_kind !== 'inherited_published_hero' || p.migration_group !== 7 || p.baseline_commit !== heroBaseline || p.source !== heroReference || p.approval_reference !== heroReference || p.migration_recorded_on !== recordedOn || p.status !== 'founder_approved' || p.public !== true || !p.approval_note?.trim()) problems.push('Invalid hero migration provenance')
  if (!Array.isArray(document?.records) || !isDeepStrictEqual(document.records.map(record => record?.id), heroContentIds)) problems.push('Hero exact content membership/order changed')
  for (const [index, fragment] of expected.records.entries()) {
    const record = document?.records?.[index]
    const full = { ...fragment, ...(fragment.href ? { destination_state: 'existing_verified', destination_verified_on: recordedOn } : {}) }
    if (!isDeepStrictEqual(record, full)) problems.push('Hero wording, emphasis, source fragment, approval or destination changed ' + fragment.id)
  }
  for (const key of ['photos', 'covers']) {
    const full = expected[key].map(asset => ({ ...asset, origin: key === 'photos' ? asset.src : new URL(asset.published_src, publishedHome).href, rights_review: 'pending_final_production_check' }))
    if (!isDeepStrictEqual(document?.[key], full)) problems.push('Hero ' + key + ' identity, order, labels, dimensions, crop or provenance changed')
  }
  for (const key of ['orbits', 'progression', 'ticker']) if (!isDeepStrictEqual(document?.[key], expected[key])) problems.push('Hero ' + key + ' arrangement or content references changed')
  return problems
}

export function heroLedgerProblems(records, document) {
  const inherited = records.filter(record => record.approval_kind === 'inherited_published_hero' || record.id?.startsWith('home.hero.'))
  const expected = document.records.map(record => ({ ...document.provenance, ...record }))
  return isDeepStrictEqual(inherited, expected) ? [] : ['Hero inheritance is permitted only for the exact 23 hero.json records']
}

export function heroCoverProblems(readPublished, readCopied) {
  const problems = []
  for (let index = 1; index <= 7; index++) {
    const path = 'covers/cover-' + String(index).padStart(2, '0') + '.jpg'
    try {
      if (!readPublished(path).equals(readCopied(path))) problems.push('Hero cover bytes differ from the protected asset ' + path)
    } catch {
      problems.push('Cannot verify the exact protected hero cover ' + path)
    }
  }
  return problems
}

export function checkHeroContent(document, records) {
  const bundle = execFileSync('git', ['show', heroBaseline + ':' + heroBundle], { encoding: 'utf8' })
  return [
    ...heroContentProblems(document, bundle),
    ...(records ? heroLedgerProblems(records, document) : []),
    ...heroCoverProblems(
      path => execFileSync('git', ['show', heroBaseline + ':' + path]),
      path => readFileSync(new URL('../public/' + path, import.meta.url)),
    ),
  ]
}
