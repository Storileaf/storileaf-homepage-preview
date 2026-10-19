import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'

export const inheritedDiscoveryBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const inheritedDiscoveryBundlePath = 'assets/content-sections-CfrmOVRI.js'
const reference = 'https://github.com/Storileaf/storileaf-homepage-preview/blob/' + inheritedDiscoveryBaseline + '/' + inheritedDiscoveryBundlePath
const keys = ['life', 'travel', 'relationship', 'founder', 'letters', 'occasions']
const slugs = ['life-story', 'travel-memoir', 'relationship-memoir', 'founders-memoir', 'parent-to-child-letters', 'celebrating-occasions']
const normalise = value => String(value ?? '').replace(/\s+/gu, ' ').trim()

function requireExpression(parsed, range, expected, description) {
  const actual = range ? parsed.tokens.slice(range.start, range.end) : []
  if (JSON.stringify(actual) !== JSON.stringify(parse.parseRegion(expected).tokens)) throw new Error('Unexpected protected discovery ' + description)
}

function requirePrefix(parsed, range, expected, description) {
  const actual = range ? parsed.tokens.slice(range.start, range.start + expected.length).map(token => token.value) : []
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Unexpected protected discovery ' + description)
}

function arrayItems(parsed, range, description) {
  if (!range || parsed.tokens[range.start]?.value !== '[' || parsed.groups.get(range.start) !== range.end - 1) throw new Error('Expected protected discovery ' + description + ' array')
  return parse.parts(parsed, range.start + 1, range.end - 1)
}

function insideRange(node, range) {
  return node.start >= range.start && node.end < range.end
}

/** Read only the named published data and the rendered BookDiscovery function. */
function discoverySource(bundle) {
  const data = parse.parseRegion(parse.region(bundle, 'src/data/homepage.ts'))
  const section = parse.parseRegion(parse.region(bundle, 'src/components/storileaf/book-discovery.tsx'))
  const nodes = parse.jsxNodes(section, parse.namedFunction(section, 'BookDiscovery'))
  const node = (type, className, parent) => parse.one(nodes.filter(item => item.type === type && parse.property(section, item, 'className') === className && (!parent || parse.inside(item, parent))), 'discovery ' + className)
  const root = node('section', 'book-discovery-section section-space')
  if (parse.property(section, root, 'id') !== 'books' || parse.property(section, root, 'aria-labelledby') !== 'books-title') throw new Error('Unexpected protected discovery root')
  const heading = node('div', 'discovery-heading', root)
  const title = node('h2', 'discovery-title', heading)
  if (parse.property(section, title, 'id') !== 'books-title') throw new Error('Unexpected protected discovery heading identity')
  const titleItems = arrayItems(section, title.props.get('children'), 'heading')
  const titlePrefix = parse.literal(section, titleItems[0])
  const emphasisNode = parse.one(nodes.filter(item => item.type === 'em' && titleItems[1] && insideRange(item, titleItems[1])), 'discovery heading emphasis')
  const emphasis = parse.property(section, emphasisNode, 'children')
  if (titleItems.length !== 2 || typeof titlePrefix !== 'string' || typeof emphasis !== 'string') throw new Error('Unexpected protected discovery heading composition')
  const description = node('p', 'discovery-description', heading)
  const tabs = node('Tabs', 'book-discovery-tabs', root)
  const rail = node('div', 'book-tabs-scroll', tabs)
  const list = node('TabsList', 'book-tabs-list', rail)
  requirePrefix(section, list.props.get('children'), ['books', '.', 'map', '(', '(', 'book', ')', '=', '>'], 'tab book mapping')
  const trigger = node('TabsTrigger', 'book-tab-trigger', list)
  requireExpression(section, trigger.props.get('value'), 'book.slug', 'tab identity')
  requireExpression(section, trigger.props.get('children'), 'book.formalLabel', 'formal tab name')
  const tabChildren = arrayItems(section, tabs.props.get('children'), 'tabs')
  if (tabChildren.length !== 2 || !insideRange(rail, tabChildren[0])) throw new Error('Unexpected protected discovery tab layout')
  requirePrefix(section, tabChildren[1], ['books', '.', 'map', '(', '(', 'book', ')', '=', '>'], 'panel book mapping')
  const panel = node('TabsContent', 'book-detail-stage', tabs)
  if (!insideRange(panel, tabChildren[1])) throw new Error('Protected discovery panel must use its named books')
  requireExpression(section, panel.props.get('value'), 'book.slug', 'panel identity')
  const copy = node('div', 'book-detail-copy', panel)
  const introduction = node('p', 'book-detail-intro', copy)
  requireExpression(section, introduction.props.get('children'), 'bookPanelIntroductions[book.slug]', 'rendered introduction')
  const points = node('ul', 'book-detail-points', copy)
  requirePrefix(section, points.props.get('children'), ['bookPoints', '[', 'book', '.', 'slug', ']', '?', '.', 'map', '(', '(', 'point', ')', '=', '>'], 'rendered point mapping')
  const point = parse.one(nodes.filter(item => item.type === 'li' && parse.inside(item, points)), 'discovery list item')
  requireExpression(section, point.props.get('children'), 'point', 'rendered point')
  const action = node('a', 'button', copy)
  requireExpression(section, action.props.get('href'), 'LIVE_SITE + "/" + book.slug + "/"', 'product destination')
  const liveSite = parse.namedString(data, 'LIVE_SITE')
  if (liveSite !== 'https://storileaf.com') throw new Error('Unexpected protected discovery product origin')

  const fragments = {}
  const add = (id, text, sourceFragment, extra = {}) => {
    if (typeof text !== 'string' || !text.trim()) throw new Error('Missing protected discovery copy ' + id)
    fragments[id] = { copy: normalise(text), sourceFragment, reference, ...extra }
  }
  add('home.discovery.title', titlePrefix + emphasis, 'BookDiscovery h2#books-title children', { emphasis })
  add('home.discovery.description', parse.property(section, description, 'children'), 'BookDiscovery p.discovery-description children')
  add('home.discovery.cta', parse.arrowLabel(section, action, nodes), 'BookDiscovery .book-detail-copy a.button children')
  add('home.discovery.label', parse.property(section, rail, 'aria-label'), 'BookDiscovery .book-tabs-scroll aria-label')

  const bookStart = parse.namedDeclaration(data, 'books', '[')
  const books = parse.parts(data, bookStart + 1, data.groups.get(bookStart))
  const introductions = parse.properties(section, parse.namedDeclaration(section, 'bookPanelIntroductions', '{'))
  const bulletLists = parse.properties(section, parse.namedDeclaration(section, 'bookPoints', '{'))
  if (books.length !== 6 || JSON.stringify([...introductions.keys()]) !== JSON.stringify(slugs) || JSON.stringify([...bulletLists.keys()]) !== JSON.stringify(slugs)) throw new Error('Unexpected protected discovery book membership or order')
  const bookLinks = {}
  for (const [index, book] of books.entries()) {
    const props = parse.properties(data, book.start)
    const slug = parse.literal(data, props.get('slug'))
    const label = parse.literal(data, props.get('formalLabel'))
    if (slug !== slugs[index] || !label) throw new Error('Unexpected protected discovery book identity')
    const key = keys[index]
    bookLinks['shared.footer.books.' + key] = { copy: label, href: liveSite + '/' + slug + '/' }
    add('home.discovery.books.' + key + '.intro', parse.literal(section, introductions.get(slug)), 'bookPanelIntroductions[' + slug + '] rendered by BookDiscovery')
    const bullets = arrayItems(section, bulletLists.get(slug), slug + ' points')
    if (bullets.length !== 3) throw new Error('Protected discovery must retain three points per book')
    for (const [pointIndex, bullet] of bullets.entries()) add('home.discovery.books.' + key + '.point' + (pointIndex + 1), parse.literal(section, bullet), 'bookPoints[' + slug + '][' + pointIndex + '] rendered by BookDiscovery')
  }
  return { fragments, bookLinks }
}

export const inheritedDiscoveryFragments = bundle => discoverySource(bundle).fragments

export function inheritedDiscoveryProblems(record, bundle) {
  const problems = []
  const fail = message => problems.push(message + ' ' + record.id)
  if (record.approval_kind !== 'inherited_published_discovery' || record.public !== true || record.status !== 'founder_approved') fail('Invalid inherited discovery approval state')
  if (record.baseline_commit !== inheritedDiscoveryBaseline || record.migration_group !== 4) fail('Discovery inheritance needs the protected baseline and Group 4 scope')
  if (Object.hasOwn(record, 'approved_on')) fail('Discovery inheritance must not invent an original approval date')
  if (record.migration_recorded_on !== '2026-10-19' || !record.approval_note?.trim()) fail('Discovery inheritance needs its authorised migration record and explanation')
  let fragment
  try { fragment = inheritedDiscoveryFragments(bundle)[record.id] } catch { fail('Cannot parse the bounded protected discovery fragments') }
  if (!fragment) fail('No permitted inherited discovery fragment')
  else {
    if (record.approval_reference !== fragment.reference || record.source_fragment !== fragment.sourceFragment) fail('Discovery inheritance must identify the exact protected file and fragment')
    // React renders ledger copy as text. Entities, escape notation and extra
    // markup must remain literal here, never decoded or stripped for approval.
    if (normalise(record.copy) !== fragment.copy) fail('Discovery wording differs from the complete protected fragment')
    if (record.emphasis !== fragment.emphasis) fail('Discovery heading emphasis differs from the protected fragment')
    // This shared CTA label is paired with the six existing per-book records.
    // It does not gain a pricing, generic or single-book destination of its own.
    if (Object.hasOwn(record, 'href') || Object.hasOwn(record, 'destination_state')) fail('Discovery reading copy must not gain a destination')
  }
  return problems
}

/** Reused formal names and CTA URLs remain the existing six verified records. */
export function inheritedDiscoveryLedgerProblems(records, bundle) {
  const problems = []
  let source
  try { source = discoverySource(bundle) } catch { return ['Cannot parse the bounded protected discovery catalogue'] }
  const inherited = records.filter(item => item.approval_kind === 'inherited_published_discovery')
  if (JSON.stringify(inherited.map(item => item.id).sort()) !== JSON.stringify(Object.keys(source.fragments).sort())) problems.push('Discovery inheritance must contain exactly the 28 authorised records')
  for (const [id, expected] of Object.entries(source.bookLinks)) {
    const matching = records.filter(item => item.id === id)
    const record = matching[0]
    if (matching.length !== 1 || record?.copy !== expected.copy || record?.href !== expected.href || record?.public !== true || record?.status !== 'founder_approved' || record?.destination_state !== 'existing_verified') problems.push('Discovery must reuse the exact verified book name and product destination ' + id)
  }
  return problems
}
