import { normalisePublishedCopy } from './inherited-content.mjs'

export const inheritedSharedBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const inheritedSharedBundlePath = 'assets/content-sections-CfrmOVRI.js'
export const inheritedSharedHtmlPath = 'index.html'
const reference = path => 'https://github.com/Storileaf/storileaf-homepage-preview/blob/' + inheritedSharedBaseline + '/' + path
const publishedHome = 'https://storileaf.github.io/storileaf-homepage-preview/'

function one(values, description) {
  if (values.length !== 1) throw new Error('Expected one protected ' + description)
  return values[0]
}

function region(source, name) {
  const marker = '//#region ' + name + '\n'
  const parts = source.split(marker)
  if (parts.length !== 2) throw new Error('Missing or ambiguous protected source region ' + name)
  const end = parts[1].indexOf('\n//#endregion')
  if (end < 0) throw new Error('Unclosed protected source region ' + name)
  return parts[1].slice(0, end)
}

// Parse only the two named regions of the protected, readable compiled bundle.
// Inherited strings use JSON double quotes. URL templates are opaque tokens,
// never evaluated. Delimiters and comments are parsed without executing source
// or searching arbitrary literals for the desired wording.
function parseRegion(source) {
  const tokens = []
  const groups = new Map()
  const stack = []
  const closing = { '(': ')', '[': ']', '{': '}' }
  for (let cursor = 0; cursor < source.length;) {
    const char = source[cursor]
    if (/\s/u.test(char)) { cursor++; continue }
    if (source.startsWith('//', cursor)) {
      const next = source.indexOf('\n', cursor + 2)
      cursor = next < 0 ? source.length : next + 1
      continue
    }
    if (source.startsWith('/*', cursor)) {
      const next = source.indexOf('*/', cursor + 2)
      if (next < 0) throw new Error('Unclosed protected comment')
      cursor = next + 2
      continue
    }
    if (char === '"') {
      const start = cursor++
      while (cursor < source.length && source[cursor] !== '"') {
        cursor += source[cursor] === '\\' ? 2 : 1
      }
      if (cursor >= source.length) throw new Error('Unclosed protected string')
      tokens.push({ kind: 'string', value: JSON.parse(source.slice(start, ++cursor)) })
      continue
    }
    if (char === '`') {
      cursor++
      while (cursor < source.length && source[cursor] !== '`') cursor += source[cursor] === '\\' ? 2 : 1
      if (cursor >= source.length) throw new Error('Unclosed protected template')
      cursor++
      tokens.push({ kind: 'opaque', value: 'template' })
      continue
    }
    if (char === "'") throw new Error('Unsupported protected string syntax')
    const word = source.slice(cursor).match(/^[A-Za-z_$][\w$]*/)?.[0]
    if (word) {
      tokens.push({ kind: 'word', value: word })
      cursor += word.length
      continue
    }
    const index = tokens.length
    tokens.push({ kind: 'punctuation', value: char })
    cursor++
    if (closing[char]) stack.push({ index, end: closing[char] })
    else if (Object.values(closing).includes(char)) {
      const opening = stack.pop()
      if (!opening || opening.end !== char) throw new Error('Unbalanced protected source')
      groups.set(opening.index, index)
    }
  }
  if (stack.length) throw new Error('Unclosed protected source delimiter')
  return { tokens, groups }
}

function parts(parsed, start, end) {
  const values = []
  let first = start
  for (let index = start; index < end; index++) {
    if (parsed.groups.has(index)) { index = parsed.groups.get(index); continue }
    if (parsed.tokens[index].value === ',') {
      if (first < index) values.push({ start: first, end: index })
      first = index + 1
    }
  }
  if (first < end) values.push({ start: first, end })
  return values
}

function properties(parsed, start) {
  if (parsed.tokens[start]?.value !== '{' || !parsed.groups.has(start)) throw new Error('Expected protected properties')
  const found = new Map()
  for (const entry of parts(parsed, start + 1, parsed.groups.get(start))) {
    const key = parsed.tokens[entry.start]
    if (!['string', 'word'].includes(key.kind) || parsed.tokens[entry.start + 1]?.value !== ':') continue
    if (found.has(key.value)) throw new Error('Duplicate protected property ' + key.value)
    found.set(key.value, { start: entry.start + 2, end: entry.end })
  }
  return found
}

function literal(parsed, value) {
  return value && value.end === value.start + 1 && parsed.tokens[value.start]?.kind === 'string'
    ? parsed.tokens[value.start].value : undefined
}

function namedFunction(parsed, name) {
  const starts = []
  for (let index = 0; index < parsed.tokens.length; index++) {
    if (parsed.tokens[index].value === 'function' && parsed.tokens[index + 1]?.value === name && parsed.tokens[index + 2]?.value === '(') {
      starts.push(parsed.groups.get(index + 2) + 1)
    }
  }
  const start = one(starts, name + ' function')
  if (parsed.tokens[start]?.value !== '{') throw new Error('Expected protected function body ' + name)
  return { start: start + 1, end: parsed.groups.get(start) }
}

function jsxNodes(parsed, range) {
  const nodes = []
  for (let index = range.start; index < range.end; index++) {
    if (!['jsx', 'jsxs'].includes(parsed.tokens[index].value) || parsed.tokens[index - 1]?.value !== '.' || parsed.tokens[index + 1]?.value !== ')' || parsed.tokens[index + 2]?.value !== '(') continue
    const start = index + 2
    const end = parsed.groups.get(start)
    const args = parts(parsed, start + 1, end)
    const component = parsed.tokens[args[0]?.start]
    if (!args[1] || args[0].end !== args[0].start + 1 || !['string', 'word'].includes(component?.kind) || parsed.tokens[args[1].start]?.value !== '{') continue
    nodes.push({ type: component.value, start, end, props: properties(parsed, args[1].start) })
  }
  return nodes
}

const property = (parsed, node, name) => literal(parsed, node.props.get(name))
const inside = (node, parent) => node.start > parent.start && node.end < parent.end

function arrowLabel(parsed, node, nodes) {
  const children = node.props.get('children')
  const text = literal(parsed, children)
  if (text !== undefined) return text.trim()
  if (parsed.tokens[children?.start]?.value !== '[') throw new Error('Missing protected action label')
  const items = parts(parsed, children.start + 1, parsed.groups.get(children.start))
  const first = literal(parsed, items[0])
  const icon = nodes.filter(candidate => candidate.start >= items[1]?.start && candidate.end < items[1]?.end && candidate.type === 'Icon' && property(parsed, candidate, 'name') === 'arrow')
  if (items.length !== 2 || first === undefined || icon.length !== 1) throw new Error('Unexpected protected action label structure')
  return first.trim()
}

function namedDeclaration(parsed, name, startToken) {
  const matches = []
  for (let index = 0; index < parsed.tokens.length; index++) {
    if (parsed.tokens[index].value === 'var' && parsed.tokens[index + 1]?.value === name && parsed.tokens[index + 2]?.value === '=' && parsed.tokens[index + 3]?.value === startToken) matches.push(index + 3)
  }
  return one(matches, name + ' declaration')
}

function namedString(parsed, name) {
  const values = []
  for (let index = 0; index < parsed.tokens.length; index++) {
    if (parsed.tokens[index].value === 'var' && parsed.tokens[index + 1]?.value === name && parsed.tokens[index + 2]?.value === '=' && parsed.tokens[index + 3]?.kind === 'string' && parsed.tokens[index + 4]?.value === ';') values.push(parsed.tokens[index + 3].value)
  }
  return one(values, name + ' string declaration')
}

function htmlAttributes(source) {
  const attributes = new Map()
  const pattern = /\s+([A-Za-z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gy
  const bounded = source.trimEnd()
  let cursor = 0
  while (cursor < bounded.length) {
    pattern.lastIndex = cursor
    const match = pattern.exec(bounded)
    if (!match) throw new Error('Unsupported protected HTML attribute')
    const key = match[1].toLowerCase()
    if (attributes.has(key)) throw new Error('Duplicate protected HTML attribute ' + key)
    attributes.set(key, match[2] ?? match[3])
    cursor = pattern.lastIndex
  }
  return attributes
}

function publishedSkipLink(html) {
  // The skip control is the sole anchor before the first header inside the
  // named homepage root. Match its class token, not the historical active class.
  const prefix = one([...html.matchAll(/<body\b[^>]*>([^]*?)<header\b/gi)], 'homepage body before header')[1]
  const root = prefix.match(/^\s*(?:<!--[^]*?-->\s*)*<div([^>]*)>([^]*)$/i)
  if (!root) throw new Error('Missing protected homepage root before header')
  const rootAttributes = htmlAttributes(root[1])
  if (rootAttributes.get('id') !== 'top' || rootAttributes.get('data-testid') !== 'storileaf-home') throw new Error('Unexpected protected homepage root')
  const anchor = root[2].match(/^\s*<a([^>]*)>([^<>]*)<\/a>\s*$/i)
  if (!anchor) throw new Error('Missing protected skip control before header')
  const attributes = htmlAttributes(anchor[1])
  if (!attributes.get('class')?.split(/\s+/u).includes('skip-link')) throw new Error('Missing protected skip class token')
  const href = attributes.get('href')
  if (href !== '/storileaf-homepage-preview/#main-content') throw new Error('Unexpected protected skip destination')
  return { copy: normalisePublishedCopy(anchor[2]), href: new URL(href, publishedHome).href }
}

/** Exact shared migration fragments. Unknown or missing structure fails closed. */
export function inheritedSharedFragments({ bundle, html }) {
  const data = parseRegion(region(bundle, 'src/data/homepage.ts'))
  const header = parseRegion(region(bundle, 'src/components/storileaf/header-hero.tsx'))
  const navigation = jsxNodes(header, namedFunction(header, 'HeaderNavigation'))
  const mobile = jsxNodes(header, namedFunction(header, 'Header'))
  const fragments = {}
  const add = (id, copy, sourceFragment, href, path = inheritedSharedBundlePath) => {
    if (typeof copy !== 'string' || !copy.trim()) throw new Error('Missing protected shared copy ' + id)
    fragments[id] = { copy: copy.replace(/\s+/gu, ' ').trim(), sourceFragment, reference: reference(path), ...(href ? { href } : {}) }
  }
  const bookKeys = ['life', 'travel', 'relationship', 'founder', 'letters', 'occasions']
  const bookSlugs = ['life-story', 'travel-memoir', 'relationship-memoir', 'founders-memoir', 'parent-to-child-letters', 'celebrating-occasions']
  const bookGrid = one(navigation.filter(node => property(header, node, 'className') === 'books-menu-grid'), 'desktop book grid')
  const renderedBooks = bookGrid.props.get('children')
  if (header.tokens.slice(renderedBooks?.start, renderedBooks?.start + 3).map(token => token.value).join('') !== 'books.map') throw new Error('Protected book menu must render its named book data')
  one(navigation.filter(node => node.type === 'span' && inside(node, bookGrid) && (() => {
    const children = node.props.get('children')
    return children?.end === children?.start + 3 && header.tokens.slice(children.start, children.end).map(token => token.value).join('') === 'book.description'
  })()), 'rendered desktop book description')
  const bookStart = namedDeclaration(data, 'books', '[')
  const books = parts(data, bookStart + 1, data.groups.get(bookStart))
  if (books.length !== bookSlugs.length) throw new Error('Unexpected protected book count')
  for (const [index, book] of books.entries()) {
    const props = properties(data, book.start)
    if (literal(data, props.get('slug')) !== bookSlugs[index]) throw new Error('Unexpected protected book order')
    add('shared.header.books.' + bookKeys[index] + '.description', literal(data, props.get('description')), 'books[' + bookSlugs[index] + '].description')
  }
  const resources = one(navigation.filter(node => property(header, node, 'className') === 'header-nav-panel resources-dropdown'), 'desktop Resources panel')
  for (const [key, hash] of [['all_resources', 'resources'], ['activities', 'resources-activity']]) {
    const node = one(navigation.filter(node => node.type === 'Link$1' && inside(node, resources) && property(header, node, 'to') === '/' && property(header, node, 'hash') === hash), 'desktop Resources ' + hash + ' link')
    add('shared.header.' + key, arrowLabel(header, node, navigation), 'HeaderNavigation.resources-dropdown #' + hash, new URL('#' + hash, publishedHome).href)
  }
  const intro = one(mobile.filter(node => node.type === 'DialogDescription' && property(header, node, 'className') === 'menu-description'), 'mobile description')
  add('shared.header.intro', property(header, intro, 'children'), 'Header DialogDescription.menu-description')
  const submenu = mobile.filter(node => property(header, node, 'className') === 'mobile-nav-submenu')
  const explore = one(mobile.filter(node => node.type === 'Link$1' && submenu.some(parent => inside(node, parent)) && property(header, node, 'to') === '/' && property(header, node, 'hash') === 'books'), 'mobile Explore all books link')
  add('shared.header.explore_books', property(header, explore, 'children'), 'Header mobile-nav-submenu #books', new URL('#books', publishedHome).href)
  const actions = one(mobile.filter(node => property(header, node, 'className') === 'mobile-menu-actions'), 'mobile actions')
  const login = one(mobile.filter(node => node.type === 'a' && inside(node, actions)), 'mobile login link')
  const loginHref = login.props.get('href')
  const loginParts = header.tokens.slice(loginHref?.start, loginHref?.end)
  if (loginParts.length !== 3 || loginParts[0].value !== 'APP_SITE' || loginParts[1].value !== '+' || loginParts[2].kind !== 'string' || loginParts[2].value !== '/login') throw new Error('Unexpected protected login destination')
  add('shared.header.login_long', property(header, login, 'children'), 'Header mobile-menu-actions login', namedString(data, 'APP_SITE') + loginParts[2].value)
  const title = one(mobile.filter(node => node.type === 'DialogTitle'), 'mobile dialog title')
  const logo = one(mobile.filter(node => node.type === 'img' && inside(node, title)), 'mobile title image')
  add('shared.header.navigation_alt', property(header, logo, 'alt'), 'Header DialogTitle img alt')
  const mainNav = one(navigation.filter(node => node.type === 'NavigationMenu'), 'desktop navigation root')
  add('shared.header.main_navigation', property(header, mainNav, 'aria-label'), 'HeaderNavigation NavigationMenu aria-label')
  const mobileNav = one(mobile.filter(node => node.type === 'nav'), 'mobile navigation root')
  add('shared.header.mobile_navigation', property(header, mobileNav, 'aria-label'), 'Header nav aria-label')
  const home = one(mobile.filter(node => node.type === 'Link$1' && property(header, node, 'to') === '/' && property(header, node, 'hash') === 'top'), 'header home link')
  add('shared.header.home_label', property(header, home, 'aria-label'), 'Header brand link aria-label')
  const footer = one([...html.matchAll(/<footer\b[^>]*\bclass="site-footer"[^>]*>([^]*?)<\/footer>/gi)], 'homepage footer')[1]
  const currency = one([...footer.matchAll(/<label\b[^>]*\bclass="currency-picker"[^>]*>([^]*?)<\/label>/gi)], 'footer currency label')[1]
  const accessibleLabel = one([...currency.matchAll(/<span\b[^>]*\bclass="sr-only"[^>]*>([^]*?)<\/span>/gi)], 'currency reading label')[1]
  add('shared.footer.currency_label', normalisePublishedCopy(accessibleLabel), 'site-footer label.currency-picker span.sr-only', undefined, inheritedSharedHtmlPath)
  const skip = publishedSkipLink(html)
  add('shared.header.skip', skip.copy, 'storileaf-home > a.skip-link before header', skip.href, inheritedSharedHtmlPath)
  return fragments
}

export function inheritedSharedProblems(record, sources) {
  const problems = []
  const fail = message => problems.push(message + ' ' + record.id)
  if (record.approval_kind !== 'inherited_published_shared' || record.public !== true || record.status !== 'founder_approved') fail('Invalid inherited shared approval state')
  if (record.baseline_commit !== inheritedSharedBaseline || record.migration_group !== 3) fail('Shared inheritance needs the protected baseline and Group 3 scope')
  if (Object.hasOwn(record, 'approved_on')) fail('Shared inheritance must not invent an original approval date')
  if (record.migration_recorded_on !== '2026-10-19' || !record.approval_note?.trim()) fail('Shared inheritance needs its authorised migration record and explanation')
  let fragment
  try { fragment = inheritedSharedFragments(sources)[record.id] } catch { fail('Cannot parse the bounded protected shared fragments') }
  if (!fragment) fail('No permitted inherited shared fragment')
  else {
    if (record.approval_reference !== fragment.reference || record.source_fragment !== fragment.sourceFragment) fail('Shared inheritance must identify the exact protected file and fragment')
    // Ledger values render as plain React text. Never decode their markup or
    // entities, which would conceal displayed additions or altered wording.
    if (String(record.copy ?? '').replace(/\s+/gu, ' ').trim() !== fragment.copy) fail('Shared wording differs from the complete protected fragment')
    if (fragment.href) {
      if (record.href !== fragment.href || record.destination_state !== 'existing_verified') fail('Shared action must preserve its exact existing destination')
    } else if (Object.hasOwn(record, 'href') || Object.hasOwn(record, 'destination_state')) fail('Shared reading copy must not gain a destination')
  }
  return problems
}
