import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { protectedSourceParsing as parse } from './inherited-shared-content.mjs'
export const mediaBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const mediaBundle = 'assets/routes-DrwDv2x2.js'
const ref = 'https://github.com/Storileaf/storileaf-homepage-preview/blob/' + mediaBaseline + '/' + mediaBundle
const keys = ['life','travel','relationship','founder','letters','occasions']
const slugs = ['life-story','travel-memoir','relationship-memoir','founders-memoir','parent-to-child-letters','celebrating-occasions']
// Preserve URL templates as inert data for this bounded media gate. The shared
// parser leaves them opaque; this pass skips comments/quoted strings and checks
// a one-to-one correspondence, without evaluating any template or JavaScript.
function mediaParsedRegion(source) {
  const templates=[...source.matchAll(/"(?:\\.|[^"\\])*"|\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`/g)].map(x=>x[0]).filter(x=>x.startsWith('`'))
  const parsed=parse.parseRegion(source)
  let index=0
  for(const token of parsed.tokens)if(token.kind==='opaque'&&token.value==='template'){token.kind='template';token.value=templates[index++]}
  if(index!==templates.length)throw new Error('Ambiguous protected media templates')
  return parsed
}
export function mediaFragments(routes, dataBundle) {
  const region = mediaParsedRegion(parse.region(routes, 'src/components/storileaf/sample-gallery.tsx'))
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
  // The second authorised checkpoint owns only the physical presentation within
  // the same SampleGallery function, plus its named slideshow data/function.
  const craft = node('div','className','page-width samples-frame book-craft')
  const craftCopy = node('div','className','book-craft-copy')
  if (!parse.inside(craftCopy,craft)) throw new Error('Physical copy moved outside its protected composition')
  const craftTitle=node('h3','id','book-craft-title')
  const craftEm=parse.one(nodes.filter(n=>n.type==='em'&&parse.inside(n,craftTitle)),'physical emphasis')
  const titleParts=parse.parts(region,craftTitle.props.get('children').start+1,craftTitle.props.get('children').end-1)
  const titleFirst=parse.literal(region,titleParts[0]),titleEnd=parse.property(region,craftEm,'children')
  if(titleParts.length!==2||typeof titleFirst!=='string'||typeof titleEnd!=='string')throw new Error('Unexpected physical title')
  copy['home.craft.title']={copy:titleFirst+titleEnd,emphasis:titleEnd,source_fragment:'SampleGallery h3#book-craft-title children'}
  const intro=parse.one(nodes.filter(n=>n.type==='p'&&parse.inside(n,craftCopy)&&!n.props.has('className')),'physical introduction')
  copy['home.craft.intro']={copy:parse.property(region,intro,'children'),source_fragment:'SampleGallery .book-craft-copy introductory paragraph'}
  const details=nodes.filter(n=>n.type==='div'&&parse.property(region,n,'className')==='book-craft-detail'&&parse.inside(n,craftCopy))
  if(details.length!==3)throw new Error('Unexpected physical detail count')
  for(const [index,detail] of details.entries()){
    const heading=parse.one(nodes.filter(n=>n.type==='h4'&&parse.inside(n,detail)),'physical detail heading')
    const paragraph=parse.one(nodes.filter(n=>n.type==='p'&&parse.inside(n,detail)),'physical detail paragraph')
    for(const [role,item]of [['heading',heading],['description',paragraph]])copy['home.craft.detail.'+index+'.'+role]={copy:parse.property(region,item,'children'),source_fragment:'SampleGallery book-craft-detail '+index+' '+role}
  }
  const action=parse.one(nodes.filter(n=>n.type==='a'&&parse.inside(n,craftCopy)),'physical action')
  const actionHref=action.props.get('href')
  const hrefTokens=region.tokens.slice(actionHref.start,actionHref.end)
  if(JSON.stringify(hrefTokens)!==JSON.stringify(mediaParsedRegion('`${LIVE_SITE}/pricing/`').tokens))throw new Error('Physical destination expression changed')
  const data=mediaParsedRegion(sampleRegion)
  const liveSite=parse.namedString(data,'LIVE_SITE')
  if(liveSite!=='https://storileaf.com')throw new Error('Physical destination origin changed')
  copy['home.craft.cta']={copy:parse.arrowLabel(region,action,nodes),source_fragment:'SampleGallery .book-craft-copy text-link',href:liveSite+'/pricing/'}
  const slideNodes=parse.jsxNodes(region,parse.namedFunction(region,'CraftPhotoSlideshow'))
  for(const [id,className] of [['slideshow','book-craft-image book-craft-slideshow'],['indicators','book-craft-indicators']]){
    const group=parse.one(slideNodes.filter(n=>parse.property(region,n,'className')===className),'physical '+id)
    copy['home.craft.'+id]={copy:parse.property(region,group,'aria-label'),source_fragment:'CraftPhotoSlideshow '+className+' aria-label'}
  }
  const button=parse.one(slideNodes.filter(n=>n.type==='button'),'physical slide control')
  const label=button.props.get('aria-label')
  if(JSON.stringify(region.tokens.slice(label.start,label.end))!==JSON.stringify(parse.parseRegion('"Show book image "+(index+1)+" of 4"').tokens))throw new Error('Physical slide control label changed')
  for(let index=0;index<4;index++)copy['home.craft.slide.'+index]={copy:'Show book image '+(index+1)+' of 4',source_fragment:'CraftPhotoSlideshow indicator '+index+' aria-label'}
  const declarations=[]
  for(let i=0;i<region.tokens.length;i++)if(region.tokens[i].value==='const'&&region.tokens[i+1]?.value==='craftPhotoSlides'&&region.tokens[i+2]?.value==='='&&region.tokens[i+3]?.value==='[')declarations.push(i+3)
  const start=parse.one(declarations,'craftPhotoSlides declaration')
  const imageData=parse.properties(data,parse.namedDeclaration(data,'images','{'))
  const libraryDefinitions=[]
  for(let i=0;i<data.tokens.length;i++)if(data.tokens[i].value==='var'&&data.tokens[i+1]?.value==='library'&&data.tokens[i+2]?.value==='=')libraryDefinitions.push(data.tokens[i+3])
  const library=parse.one(libraryDefinitions,'library template')
  if(library.kind!=='template'||library.value!=='`${LIVE_SITE}/images/brand`')throw new Error('Physical image library origin changed')
  const craftAssets=parse.parts(region,start+1,region.groups.get(start)).map((range,index)=>{
    const props=parse.properties(region,range.start),src=props.get('src')
    if(props.size!==2||src.end-src.start!==3||region.tokens[src.start].value!=='images'||region.tokens[src.start+1].value!=='.')throw new Error('Unexpected physical image binding')
    const key=region.tokens[src.start+2].value,imageRange=imageData.get(key),template=data.tokens[imageRange?.start]
    const suffix=template?.kind==='template'&&imageRange.end===imageRange.start+1?template.value.match(/^`\$\{library\}(\/[a-zA-Z0-9_./-]+)`$/)?.[1]:null
    const url=suffix&&!suffix.includes('..')?liveSite+'/images/brand'+suffix:undefined,alt=parse.literal(region,props.get('alt'))
    if(!url?.startsWith(liveSite+'/images/brand/')||typeof alt!=='string')throw new Error('Missing protected physical image data')
    return {id:key,src:url,alt,labelId:'home.craft.slide.'+index,width:1200,height:800,object_position:'50% 50%',kind:'temporary_photograph'}
  })
  if(JSON.stringify(craftAssets.map(x=>x.id))!==JSON.stringify(['binding','spread','life','family']))throw new Error('Physical slideshow membership changed')
  return {copy, samples, craftAssets}
}
export function mediaContentProblems(ledger, manifest, routes, dataBundle, existingRecords, readAsset) {
  const problems = [], fail = message => problems.push(message)
  let expected
  try { expected = mediaFragments(routes,dataBundle) } catch(error) { return [String(error)] }
  if (JSON.stringify(ledger.records.map(r=>r.id).sort()) !== JSON.stringify(Object.keys(expected.copy).sort())) fail('Media ledger membership differs from the bounded gallery and physical scope')
  for (const item of ledger.records) {
    const record = {...ledger.provenance, ...item}
    const fragment = expected.copy[record.id]
    if (!fragment || record.copy !== fragment.copy || record.emphasis !== fragment.emphasis || record.source_fragment !== fragment.source_fragment) fail('Protected media wording or fragment differs '+record.id)
    if (record.approval_kind !== 'inherited_published_media' || record.migration_group !== 5 || record.baseline_commit !== mediaBaseline || record.approval_reference !== ref || record.migration_recorded_on !== '2026-10-19' || !record.approval_note?.trim() || record.status !== 'founder_approved' || record.public !== true) fail('Invalid media migration provenance '+record.id)
    if ('approved_on' in record) fail('Media copy gained an invented approval '+record.id)
    if(fragment?.href){
      if(record.href!==fragment.href||record.destination_state!=='existing_verified'||record.destination_verified_on!=='2026-10-19')fail('Physical action destination differs '+record.id)
    }else if(record.href!=null||record.destination_state!=null||record.destination_verified_on!=null)fail('Media copy gained an invented destination '+record.id)
  }
  if (manifest.assets.length !== 6) fail('Gallery must retain exactly six image records')
  for (const [index,sample] of expected.samples.entries()) {
    const asset=manifest.assets[index], name=existingRecords.find(r=>r.id==='shared.footer.books.'+keys[index])
    const file=sample.image.replace('/storileaf-homepage-preview/','')
    if (!asset || asset.id!==sample.id || asset.file!==file || asset.alt!==sample.alt || asset.nameId!==name?.id || name?.copy!==sample.category || asset.openId!=='home.gallery.open.'+sample.id || asset.width!==1200 || asset.height!==800 || asset.object_position!=='50% 50%' || asset.origin!==sample.image || asset.kind!=='temporary_placeholder' || !asset.rights_review?.trim()) fail('Gallery image identity, wording, crop or provenance differs '+sample.id)
    if (readAsset && asset && !readAsset(file).equals(execFileSync('git',['show',mediaBaseline+':'+file]))) fail('Gallery asset bytes differ '+sample.id)
  }
  if(!Array.isArray(manifest.craftAssets)||manifest.craftAssets.length!==4)fail('Physical slideshow must retain exactly four photographs')
  for(const [index,expectedAsset]of expected.craftAssets.entries()){
    const asset=manifest.craftAssets?.[index]
    if(!asset||Object.entries(expectedAsset).some(([key,value])=>asset[key]!==value)||asset.origin!==expectedAsset.src||!asset.rights_review?.trim())fail('Physical photo identity, order, crop or provenance differs '+expectedAsset.id)
  }
  return problems
}
export function checkMediaContent(ledger, manifest, existingRecords) {
  const routes=execFileSync('git',['show',mediaBaseline+':'+mediaBundle],{encoding:'utf8'})
  const data=execFileSync('git',['show',mediaBaseline+':assets/content-sections-CfrmOVRI.js'],{encoding:'utf8'})
  return mediaContentProblems(ledger,manifest,routes,data,existingRecords,file=>readFileSync(new URL('../public/'+file,import.meta.url)))
}
