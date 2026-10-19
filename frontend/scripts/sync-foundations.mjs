import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Default is a read-only check. --write is for an explicitly authorised static release.
const source = readFileSync(new URL('../src/styles/foundations.css', import.meta.url), 'utf8')
const target = new URL('../../assets/index-DhPZyX4z.css', import.meta.url)
const css = readFileSync(target, 'utf8')
const start = '/* BEGIN public type and spacing tokens */'
const end = '/* END public type and spacing tokens */'
const block = start + '\n' + source.replaceAll(':root', 'body:has(#top[data-testid="storileaf-home"])') + end
const a = css.indexOf(start), b = css.indexOf(end)
if (a < 0 || b <= a || css.indexOf(start, a + 1) >= 0) throw new Error('Expected exactly one bounded public foundation token block')
const next = css.slice(0, a) + block + css.slice(b + end.length)
if (process.argv.includes('--write')) writeFileSync(target, next)
else if (next !== css) throw new Error('Published foundation tokens differ from their canonical source; review and synchronise the authorised release')
console.log('Canonical typography and spacing tokens match ' + fileURLToPath(target))
