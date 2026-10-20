import { execFileSync } from 'node:child_process'
import { isDeepStrictEqual } from 'node:util'
import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'

export const writingBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const writingBundle = 'assets/routes-DrwDv2x2.js'
export const writingSharedBundle = 'assets/content-sections-CfrmOVRI.js'
export const writingReference = `https://github.com/Storileaf/storileaf-homepage-preview/blob/${writingBaseline}/${writingBundle}`
const recordedOn = '2026-10-20'
export const writingContentIds = [
  'home.writing.title', 'home.writing.intro', 'home.writing.editor.avatar',
  'home.writing.editor.title', 'home.writing.editor.chapters',
  'home.writing.editor.chapter.0', 'home.writing.editor.chapter.1',
  'home.writing.editor.chapter.2', 'home.writing.editor.chapter.3',
  'home.writing.editor.aside', 'home.writing.editor.draft',
  'home.writing.question', 'home.writing.helper', 'home.writing.editor.answer',
  'home.writing.editor.reminder', 'home.writing.editor.continue',
  'home.writing.try', 'home.writing.close_label', 'home.writing.privacy',
  'home.writing.answer_label', 'home.writing.placeholder',
  'home.writing.word', 'home.writing.words', 'home.writing.clear', 'home.writing.close',
]
const exactKeys = (value, keys) => value && isDeepStrictEqual(Object.keys(value).sort(), [...keys].sort())
function expression(parsed, range, expected, description) {
  if (!range || !isDeepStrictEqual(parsed.tokens.slice(range.start, range.end), parse.parseRegion(expected).tokens)) throw Error('Unexpected protected writing ' + description)
}

/** Only the named device component, its editor illustration and the actual logo
 * binding are parsed. Source and template expressions are never executed. */
export function writingFragments(bundle, sharedBundle) {
  const parsed = parse.parseRegion(parse.region(bundle, 'src/components/storileaf/device-showcase.tsx'))
  const editor = parse.jsxNodes(parsed, parse.namedFunction(parsed, 'EditorScreen'))
  const showcase = parse.jsxNodes(parsed, parse.namedFunction(parsed, 'DeviceShowcase'))
  const pick = (nodes, type, property, value) => parse.one(nodes.filter(n => n.type === type && parse.property(parsed, n, property) === value), 'writing ' + value)
  const oneType = (nodes, type) => parse.one(nodes.filter(n => n.type === type), 'writing ' + type)
  const childText = node => parse.property(parsed, node, 'children')
  const records = []
  function add(id, copy, source_fragment, extra = {}) {
    if (typeof copy !== 'string' || !copy.trim()) throw Error('Missing protected writing text ' + id)
    records.push({ id: 'home.writing.' + id, copy, ...extra, source_fragment })
  }
  const root = pick(showcase, 'section', 'id', 'writing-space')
  if (parse.property(parsed, root, 'className') !== 'devices-section section-space' || parse.property(parsed, root, 'aria-labelledby') !== 'devices-title') throw Error('Writing landmark changed')
  const heading = pick(showcase, 'h2', 'id', 'devices-title')
  const emphasis = childText(parse.one(showcase.filter(n => n.type === 'em' && parse.inside(n, heading)), 'writing heading emphasis'))
  const headingRange = heading.props.get('children')
  const headingParts = parse.parts(parsed, headingRange.start + 1, parsed.groups.get(headingRange.start))
  const firstHeading = parse.literal(parsed, headingParts[0])
  if (headingParts.length !== 2 || typeof firstHeading !== 'string' || typeof emphasis !== 'string') throw Error('Writing heading structure changed')
  add('title', firstHeading + emphasis, 'DeviceShowcase h2#devices-title children', { emphasis })
  add('intro', childText(pick(showcase, 'p', 'className', 'section-lead')), 'DeviceShowcase p.section-lead children')
  add('editor.avatar', childText(pick(editor, 'span', 'className', 'editor-avatar')), 'EditorScreen .editor-avatar children')
  const sidebar = pick(editor, 'div', 'className', 'editor-sidebar')
  add('editor.title', childText(parse.one(editor.filter(n => n.type === 'strong' && parse.inside(n, sidebar)), 'writing editor title')), 'EditorScreen .editor-sidebar strong children')
  add('editor.chapters', childText(pick(editor, 'span', 'className', 'screen-sidebar-label')), 'EditorScreen .screen-sidebar-label children')
  const chapter = childText(pick(editor, 'span', 'className', 'screen-active-chapter'))
  add('editor.chapter.0', chapter, 'EditorScreen .screen-active-chapter children')
  const otherChapters = editor.filter(n => n.type === 'span' && parse.inside(n, sidebar) && !n.props.has('className'))
  if (otherChapters.length !== 3) throw Error('Writing editor chapter membership changed')
  otherChapters.forEach((node, index) => add('editor.chapter.' + (index + 1), childText(node), `EditorScreen .editor-sidebar unclassified span[${index}] children`))
  add('editor.aside', childText(pick(editor, 'div', 'className', 'screen-sidebar-bottom')), 'EditorScreen .screen-sidebar-bottom children')
  add('editor.draft', childText(pick(editor, 'span', 'className', 'screen-draft')), 'EditorScreen .screen-draft children')
  const breadcrumb = pick(editor, 'div', 'className', 'screen-breadcrumb')
  const breadcrumbText = childText(parse.one(editor.filter(n => n.type === 'span' && parse.inside(n, breadcrumb) && !n.props.has('className')), 'writing breadcrumb'))
  if (breadcrumbText !== chapter) throw Error('Writing breadcrumb no longer matches the active chapter')
  const question = childText(oneType(editor, 'h3')), helper = childText(pick(editor, 'p', 'className', 'screen-helper'))
  const mobile = pick(showcase, 'div', 'className', 'mobile-workspace-preview')
  if (childText(parse.one(showcase.filter(n => n.type === 'h3' && parse.inside(n, mobile)), 'mobile writing question')) !== question || childText(oneType(showcase, 'DialogTitle')) !== question) throw Error('Writing question occurrences disagree')
  if (childText(parse.one(showcase.filter(n => n.type === 'p' && parse.inside(n, mobile)), 'mobile writing helper')) !== helper) throw Error('Writing helper occurrences disagree')
  add('question', question, 'EditorScreen h3; DeviceShowcase mobile h3 and DialogTitle children')
  add('helper', helper, 'EditorScreen p.screen-helper and DeviceShowcase mobile p children')
  const answer = pick(editor, 'div', 'className', 'screen-answer')
  const answerRange = answer.props.get('children'), answerParts = parse.parts(parsed, answerRange.start + 1, parsed.groups.get(answerRange.start))
  if (answerParts.length !== 2) throw Error('Writing illustration answer changed')
  add('editor.answer', parse.literal(parsed, answerParts[0]), 'EditorScreen .screen-answer first child')
  const bottom = pick(editor, 'div', 'className', 'screen-bottom')
  const bottomSpans = editor.filter(n => n.type === 'span' && parse.inside(n, bottom) && !n.props.has('className'))
  if (bottomSpans.length !== 2 || childText(bottomSpans[1]) !== '→') throw Error('Writing illustration continuation changed')
  add('editor.reminder', childText(bottomSpans[0]), 'EditorScreen .screen-bottom first span children')
  const continuation = pick(editor, 'span', 'className', 'screen-next'), continueRange = continuation.props.get('children')
  const continueParts = parse.parts(parsed, continueRange.start + 1, parsed.groups.get(continueRange.start))
  if (continueParts.length !== 2) throw Error('Writing illustration continuation structure changed')
  add('editor.continue', parse.literal(parsed, continueParts[0])?.trim(), 'EditorScreen .screen-next first child')
  add('try', parse.arrowLabel(parsed, pick(showcase, 'button', 'data-testid', 'try-question'), showcase), 'DeviceShowcase button[data-testid=try-question] children')
  add('close_label', parse.property(parsed, pick(showcase, 'DialogClose', 'className', 'icon-button'), 'aria-label'), 'DeviceShowcase icon DialogClose aria-label')
  add('privacy', childText(pick(showcase, 'DialogDescription', 'id', 'demo-privacy')), 'DeviceShowcase DialogDescription#demo-privacy children')
  const label = pick(showcase, 'label', 'className', 'demo-label')
  if (parse.property(parsed, label, 'htmlFor') !== 'demo-answer') throw Error('Writing answer label binding changed')
  add('answer_label', childText(label), 'DeviceShowcase label.demo-label children')
  const input = pick(showcase, 'textarea', 'id', 'demo-answer')
  if (parse.property(parsed, input, 'aria-describedby') !== 'demo-privacy') throw Error('Writing answer privacy binding changed')
  expression(parsed, input.props.get('value'), 'answer', 'controlled answer')
  expression(parsed, input.props.get('maxLength'), '2e3', 'answer length')
  expression(parsed, input.props.get('rows'), '6', 'answer rows')
  add('placeholder', parse.property(parsed, input, 'placeholder'), 'DeviceShowcase textarea#demo-answer placeholder')
  const meta = pick(showcase, 'div', 'className', 'demo-answer-meta')
  const count = parse.one(showcase.filter(n => n.type === 'span' && parse.inside(n, meta)), 'writing word count')
  expression(parsed, count.props.get('children'), '[wordCount, " ", wordCount === 1 ? "word" : "words"]', 'word count forms')
  add('word', 'word', 'DeviceShowcase .demo-answer-meta singular word count')
  add('words', 'words', 'DeviceShowcase .demo-answer-meta plural word count')
  add('clear', childText(pick(showcase, 'button', 'className', 'subtle-button')), 'DeviceShowcase button.subtle-button children')
  const close = pick(showcase, 'DialogClose', 'className', 'button'), closeRange = close.props.get('children')
  const closeParts = parse.parts(parsed, closeRange.start + 1, parsed.groups.get(closeRange.start))
  const closeIcon = parse.one(showcase.filter(n => n.type === 'Icon' && parse.inside(n, close)), 'writing close icon')
  if (closeParts.length !== 2 || parse.property(parsed, closeIcon, 'name') !== 'check') throw Error('Writing final close control changed')
  add('close', parse.literal(parsed, closeParts[0])?.trim(), 'DeviceShowcase final DialogClose children')
  if (!isDeepStrictEqual(records.map(r => r.id), writingContentIds)) throw Error('Writing content allowlist changed')

  const image = oneType(editor, 'img')
  if (parse.property(parsed, image, 'alt') !== '' || parse.property(parsed, image, 'width') !== '80' || parse.property(parsed, image, 'height') !== '20' || parse.property(parsed, image, 'loading') !== 'lazy') throw Error('Writing illustration logo attributes changed')
  expression(parsed, image.props.get('src'), 'logo', 'illustration logo binding')
  const dataSource = parse.region(sharedBundle, 'src/data/homepage.ts'), data = parse.parseRegion(dataSource)
  if (parse.namedString(data, 'LIVE_SITE') !== 'https://storileaf.com' || !dataSource.includes('var logo = `${LIVE_SITE}/logo.png`;')) throw Error('Writing logo origin changed')
  const assets = [{ id: 'logo', src: 'https://storileaf.com/logo.png', alt: '', width: 80, height: 20, loading: 'lazy', role: 'decorative', source_fragment: 'EditorScreen img and homepage logo binding' }]
  return { records, assets }
}

export function writingContentProblems(document, bundle, sharedBundle) {
  let expected
  try { expected = writingFragments(bundle, sharedBundle) } catch (error) { return [String(error)] }
  const problems = [], p = document?.provenance
  if (!exactKeys(document, ['version', 'provenance', 'records', 'assets']) || document.version !== 1) problems.push('Invalid writing content document shape')
  const keys = ['approval_kind', 'migration_group', 'baseline_commit', 'source', 'approval_reference', 'migration_recorded_on', 'status', 'public', 'approval_note']
  if (!exactKeys(p, keys) || p.approval_kind !== 'inherited_published_writing' || p.migration_group !== 8 || p.baseline_commit !== writingBaseline || p.source !== writingReference || p.approval_reference !== writingReference || p.migration_recorded_on !== recordedOn || p.status !== 'founder_approved' || p.public !== true || !p.approval_note?.trim()) problems.push('Invalid writing migration provenance')
  if (!isDeepStrictEqual(document?.records, expected.records)) problems.push('Writing exact membership, wording, emphasis, source fragments or approval fields changed')
  const assets = expected.assets.map(asset => ({ ...asset, origin: asset.src, rights_review: 'pending_final_production_check' }))
  if (!isDeepStrictEqual(document?.assets, assets)) problems.push('Writing logo identity, dimensions, decoration or provenance changed')
  return problems
}

export function writingLedgerProblems(records, document) {
  const actual = records.filter(record => record.approval_kind === 'inherited_published_writing' || record.id?.startsWith('home.writing.'))
  const expected = document.records.map(record => ({ ...document.provenance, ...record }))
  return isDeepStrictEqual(actual, expected) ? [] : ['Writing inheritance is limited to the exact 25 writing.json records']
}

export function checkWritingContent(document, records) {
  const read = path => execFileSync('git', ['show', writingBaseline + ':' + path], { encoding: 'utf8' })
  return [...writingContentProblems(document, read(writingBundle), read(writingSharedBundle)), ...(records ? writingLedgerProblems(records, document) : [])]
}
