import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const repo = resolve(import.meta.dirname, '../..')
const publishedBaseline = '99acdf7f14aceb3de20dca1fe8bbc4b18a27248d'
const protectedFiles = [
  'index.html',
  '404.html',
  'assets/index-DhPZyX4z.css',
  'assets/routes-DrwDv2x2.js',
  'assets/content-sections-CfrmOVRI.js',
  'pricing/index.html',
]
const result = spawnSync('git', ['diff','--quiet',publishedBaseline,'HEAD','--',...protectedFiles], {cwd:repo,encoding:'utf8'})
if(result.status !== 0){
  console.error('Published root changed against approved snapshot. Require founder approval and refreshed browser screenshots.')
  console.error(result.stderr || result.error?.message || '')
  process.exitCode=1
}else{
  console.log('Published root files match approved baseline')
}
