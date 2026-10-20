import { execFileSync } from 'node:child_process'
import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'
export const processBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const processBundle = 'assets/content-sections-CfrmOVRI.js'
export const processReference = `https://github.com/Storileaf/storileaf-homepage-preview/blob/${processBaseline}/${processBundle}`
const keys = ['memories', 'conversation', 'proof', 'life']

/** Extract only the named Process function, its two data declarations and the
 * named homepage image library. Never execute compiled source or templates. */
export function processFragments(bundle) {
  const section = parse.region(bundle, 'src/components/storileaf/content-sections.tsx')
  const parsed = parse.parseRegion(section)
  const nodes = parse.jsxNodes(parsed, parse.namedFunction(parsed, 'Process'))
  const node = (type, property, value) => parse.one(nodes.filter(n => n.type === type && parse.property(parsed, n, property) === value), value)
  const root = node('section', 'id', 'how-it-works')
  if (parse.property(parsed, root, 'className') !== 'process-section section-space') throw Error('Unexpected process root')
  const heading = node('h2', 'id', 'process-title')
  const emphasisNode = parse.one(nodes.filter(n => n.type === 'strong' && parse.inside(n, heading)), 'process emphasis')
  const range = heading.props.get('children')
  const pieces = parse.parts(parsed, range.start + 1, range.end - 1)
  const first = parse.literal(parsed, pieces[0]), emphasis = parse.property(parsed, emphasisNode, 'children')
  if (pieces.length !== 2 || typeof first !== 'string' || typeof emphasis !== 'string') throw Error('Unexpected process heading')
  const records = [{ id: 'home.process.title', copy: first + emphasis, emphasis, source_fragment: 'Process h2#process-title children' }]
  const declaration = name => {
    const start = parse.namedDeclaration(parsed, name, '[')
    return parse.parts(parsed, start + 1, parsed.groups.get(start)).map(range => parse.properties(parsed, range.start))
  }
  const steps = declaration('sharedSteps')
  if (steps.length !== 4) throw Error('Process requires four original stages')
  for (const [index, step] of steps.entries()) {
    if (step.size !== 2) throw Error('Unexpected process step data')
    for (const [field, suffix] of [['title', 'title'], ['text', 'description']]) {
      const copy = parse.literal(parsed, step.get(field))
      if (typeof copy !== 'string') throw Error('Missing process step text')
      records.push({ id: `home.process.step.${index}.${suffix}`, copy, source_fragment: `sharedSteps[${index}].${field}` })
    }
  }
  const choose = node('Link$1', 'className', 'button')
  if (parse.property(parsed, choose, 'to') !== '/' || parse.property(parsed, choose, 'hash') !== 'books') throw Error('Process Books destination changed')
  records.push({ id: 'home.process.choose', copy: parse.arrowLabel(parsed, choose, nodes), href: 'https://storileaf.github.io/storileaf-homepage-preview/#books', source_fragment: 'Process Books action' })
  const gift = node('a', 'className', 'button button-outline')
  const giftHref = gift.props.get('href')
  if (JSON.stringify(parsed.tokens.slice(giftHref.start, giftHref.end)) !== JSON.stringify(parse.parseRegion('LIVE_SITE + "/gift/"').tokens)) throw Error('Process gift destination expression changed')
  records.push({ id: 'home.process.gift', copy: parse.arrowLabel(parsed, gift, nodes), href: 'https://storileaf.com/gift/', source_fragment: 'Process gifting action' })
  const data = parse.region(bundle, 'src/data/homepage.ts')
  // URL interpolation is allowed only for this explicit, inert library prefix.
  if (!data.includes('var LIVE_SITE = "https://storileaf.com";') || !data.includes('var library = `${LIVE_SITE}/images/brand`;')) throw Error('Process image origin changed')
  const imagesBlock = parse.one([...data.matchAll(/var images = \{([\s\S]*?)\n\};/g)], 'homepage image declaration')[1]
  const photo = node('img', 'className', 'process-photo')
  if (parse.property(parsed, photo, 'width') !== '800' || parse.property(parsed, photo, 'height') !== '940') throw Error('Process image dimensions changed')
  const visuals = declaration('stepVisuals')
  if (visuals.length !== 4) throw Error('Process requires four original photographs')
  const assets = visuals.map((visual, index) => {
    const src = visual.get('src'), tokens = parsed.tokens.slice(src.start, src.end)
    const key = keys[index]
    if (visual.size !== 2 || JSON.stringify(tokens) !== JSON.stringify(parse.parseRegion('images.' + key).tokens)) throw Error('Process image order/binding changed')
    const matches = [...imagesBlock.matchAll(new RegExp('\\b' + key + ': `\\$\\{library\\}(/[^`]+)`', 'g'))]
    const suffix = parse.one(matches, 'process image ' + key)[1]
    if (!/^\/[a-zA-Z0-9_./-]+\.webp$/.test(suffix) || suffix.includes('..')) throw Error('Unexpected process image template')
    const alt = parse.literal(parsed, visual.get('alt'))
    if (typeof alt !== 'string') throw Error('Missing process alternative text')
    return { id: key, src: 'https://storileaf.com/images/brand' + suffix, alt, width: 800, height: 940, object_position: '50% 50%', narrow_object_position: '50% 35%', source_fragment: `stepVisuals[${index}]` }
  })
  return { records, assets }
}

export function processContentProblems(document, bundle) {
  let expected
  try { expected = processFragments(bundle) } catch (error) { return [String(error)] }
  const problems = [], p = document.provenance
  if (p?.approval_kind !== 'inherited_published_process' || p?.migration_group !== 6 || p?.baseline_commit !== processBaseline || p?.approval_reference !== processReference || p?.migration_recorded_on !== '2026-10-19' || p?.status !== 'founder_approved' || p?.public !== true || !p?.approval_note?.trim() || p?.source !== processReference || 'approved_on' in p) problems.push('Invalid process migration provenance')
  if (document.records?.length !== expected.records.length) problems.push('Process content membership changed')
  for (const [index, fragment] of expected.records.entries()) {
    const record = document.records?.[index]
    const permitted = new Set([...Object.keys(fragment), ...(fragment.href ? ['destination_state', 'destination_verified_on'] : [])])
    if (!record || Object.entries(fragment).some(([k,v]) => record[k] !== v) || Object.keys(record).some(k => !permitted.has(k))) problems.push('Process copy, emphasis, source fragment or destination changed ' + fragment.id)
    if (fragment.href && (record?.destination_state !== 'existing_verified' || record?.destination_verified_on !== '2026-10-19')) problems.push('Missing process destination provenance ' + fragment.id)
  }
  if (document.assets?.length !== 4) problems.push('Process image membership changed')
  for (const [index, asset] of expected.assets.entries()) {
    const record = document.assets?.[index]
    if (!record || Object.entries(asset).some(([k,v]) => record[k] !== v) || record.origin !== asset.src || record.rights_review !== 'pending_final_production_check') problems.push('Process image identity, order, crop or provenance changed ' + asset.id)
  }
  return problems
}
export function checkProcessContent(document) {
  return processContentProblems(document, execFileSync('git', ['show', processBaseline + ':' + processBundle], { encoding: 'utf8' }))
}
