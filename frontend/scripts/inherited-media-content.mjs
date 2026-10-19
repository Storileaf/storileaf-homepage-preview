import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'
export const mediaBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const mediaBundle = 'assets/routes-DrwDv2x2.js'
const ref = 'https://github.com/Storileaf/storileaf-homepage-preview/blob/' + mediaBaseline + '/' + mediaBundle
const keys = ['life','travel','relationship','founder','letters','occasions']
const slugs = ['life-story','travel-memoir','relationship-memoir','founders-memoir','parent-to-child-letters','celebrating-occasions']
export function mediaFragments(routes, dataBundle) {
  const region = parse.parseRegion(parse.region(routes, 'src/components/storileaf/sample-gallery.tsx'))
  const nodes = parse.jsxNodes(region, parse.namedFunction(region, 'SampleGallery'))
  const node = (type, prop, value) => parse.one(nodes.filter(n => n.type === type && parse.property(region,n,prop) === value), value)
  const root = node('section','id','samples')
  if (parse.property(region,root,'className') !== 'samples-section section-space') throw new Error('Unexpected media root')
  const title = node('h2','id','samples-title'), range = title.props.get('children')
  const parts = parse.parts(region, range.start + 1, range.end - 1)
  const emphasis = parse.one(nodes.filter(n=>n.type==='em' && parse.inside(n,title)), 'gallery emphasis')
  const suffix = parse.property(region,emphasis,'children')
  const first = parse.literal(region,parts[0])
  if (parts.length !== 2 || typeof first !== 'string' || typeof suffix !== 'string') throw new Error('Unexpected gallery title structure')
  const copy = {
    'home.gallery.title': {copy:first+suffix, emphasis:suffix, source_fragment:'SampleGallery h2#samples-title children'},
    'home.gallery.intro': {copy:parse.property(region,node('p','className','section-lead'),'children'),source_fragment:'SampleGallery p.section-lead children'},
    'home.gallery.rail': {copy:parse.property(region,node('div','className','sample-rail'),'aria-label'),source_fragment:'SampleGallery .sample-rail aria-label'},
    'home.gallery.instructions': {copy:parse.property(region,node('DialogDescription','className','sample-lightbox-description'),'children'),source_fragment:'SampleGallery DialogDescription children'},
  }
  for (const [id,label,type] of [
    ['previous','Previous book image','button'],['next','Next book image','button'],
    ['close','Close book image','DialogClose'],['previous-book','Previous book','button'],['next-book','Next book','button']
  ]) copy['home.gallery.'+id] = {copy:parse.property(region,node(type,'aria-label',label),'aria-label'),source_fragment:'SampleGallery '+label+' aria-label'}
  const sampleRegion = parse.region(dataBundle, 'src/data/homepage.ts')
  const sampleText = sampleRegion.match(/\bvar samples = (\[[\s\S]*?\n\]);/)?.[1]
  if (!sampleText) throw new Error('Missing protected samples data')
  const samples = JSON.parse(sampleText)
  if (JSON.stringify(samples.map(x=>x.id)) !== JSON.stringify(slugs)) throw new Error('Unexpected media membership')
  const opener = node('button','className','sample-open')
  const expression = opener.props.get('aria-label')
  const actual = region.tokens.slice(expression.start,expression.end)
  if (JSON.stringify(actual) !== JSON.stringify(parse.parseRegion('"Open "+sample.category+" book image"').tokens)) throw new Error('Unexpected open-image label expression')
  for (const sample of samples) copy['home.gallery.open.'+sample.id] = {copy:'Open '+sample.category+' book image',source_fragment:'SampleGallery sample-open aria-label for '+sample.id}
  return {copy, samples}
}
export function mediaContentProblems(ledger, manifest, routes, dataBundle, existingRecords, readAsset) {
  const problems = [], fail = message => problems.push(message)
  let expected
  try { expected = mediaFragments(routes,dataBundle) } catch(error) { return [String(error)] }
  if (JSON.stringify(ledger.records.map(r=>r.id).sort()) !== JSON.stringify(Object.keys(expected.copy).sort())) fail('Media ledger membership differs from the bounded gallery scope')
  for (const item of ledger.records) {
    const record = {...ledger.provenance, ...item}
    const fragment = expected.copy[record.id]
    if (!fragment || record.copy !== fragment.copy || record.emphasis !== fragment.emphasis || record.source_fragment !== fragment.source_fragment) fail('Protected media wording or fragment differs '+record.id)
    if (record.approval_kind !== 'inherited_published_media' || record.migration_group !== 5 || record.baseline_commit !== mediaBaseline || record.approval_reference !== ref || record.migration_recorded_on !== '2026-10-19' || !record.approval_note?.trim() || record.status !== 'founder_approved' || record.public !== true) fail('Invalid media migration provenance '+record.id)
    if ('approved_on' in record || record.href != null || record.destination_state != null) fail('Media copy gained an invented approval or destination '+record.id)
  }
  if (manifest.assets.length !== 6) fail('Gallery must retain exactly six image records')
  for (const [index,sample] of expected.samples.entries()) {
    const asset=manifest.assets[index], name=existingRecords.find(r=>r.id==='shared.footer.books.'+keys[index])
    const file=sample.image.replace('/storileaf-homepage-preview/','')
    if (!asset || asset.id!==sample.id || asset.file!==file || asset.alt!==sample.alt || asset.nameId!==name?.id || name?.copy!==sample.category || asset.openId!=='home.gallery.open.'+sample.id || asset.width!==1200 || asset.height!==800 || asset.object_position!=='50% 50%' || asset.origin!==sample.image || asset.kind!=='temporary_placeholder' || !asset.rights_review?.trim()) fail('Gallery image identity, wording, crop or provenance differs '+sample.id)
    if (readAsset && asset && !readAsset(file).equals(execFileSync('git',['show',mediaBaseline+':'+file]))) fail('Gallery asset bytes differ '+sample.id)
  }
  return problems
}
export function checkMediaContent(ledger, manifest, existingRecords) {
  const routes=execFileSync('git',['show',mediaBaseline+':'+mediaBundle],{encoding:'utf8'})
  const data=execFileSync('git',['show',mediaBaseline+':assets/content-sections-CfrmOVRI.js'],{encoding:'utf8'})
  return mediaContentProblems(ledger,manifest,routes,data,existingRecords,file=>readFileSync(new URL('../public/'+file,import.meta.url)))
}
