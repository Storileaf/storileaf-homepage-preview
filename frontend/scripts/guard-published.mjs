import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const repo = resolve(import.meta.dirname, '../..')
// Founder-authorised P4 07 default pricing footer correction only. Root homepage and React cutover remain protected.
const baseline = 'a9e6e6cf8ae078376837f91651a1ac9a3f1a9164'
const protectedPaths = [
  'index.html', '404.html', 'assets/', 'covers/', 'gallery/', 'pricing/',
  'favicon.svg', 'manifest.json', 'logo192.png', 'logo512.png',
  'robots.txt', '.nojekyll'
]

function check(args, explanation) {
  const run=spawnSync('git',args,{cwd:repo,encoding:'utf8'})
  if(run.status!==0){
    console.error(explanation)
    console.error(run.stderr || run.error?.message || '')
    process.exitCode=1
  }
}
check(['cat-file','-e',baseline+'^{commit}'],
  'The published homepage reference commit is not available; fetch complete repository history.')
check(['diff','--quiet',baseline,'HEAD','--',...protectedPaths],
  'Protected published page or asset changed without a reviewed new visual baseline.')
check(['diff','--quiet','HEAD','--',...protectedPaths],
  'Uncommitted changes to published files are not allowed in the React-source check.')
if(!process.exitCode) console.log('Published homepage, pricing, photography and compiled bundles match their protected baseline')
