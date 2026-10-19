import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
const file='assets/index-DhPZyX4z.css'
const old=await fs.readFile(file,'utf8')
const blob=s=>createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex')
assert.equal(blob(old),'3c1a3051f8a3428197a261213012b99acafde249','Published CSS changed; review the new head')
let css=old
const edit=(selector, from, to)=>{
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
  const rx=new RegExp('(^|\\n)'+escaped+' \\{([^{}]*)\\}','g')
  let count=0
  css=css.replace(rx,(match,prefix,body)=>{
    if(!body.includes(from))return match
    count++
    return prefix+selector+' {'+body.replace(from,to)+'}'
  })
  assert.equal(count,1,'Expected one exact rule for '+selector+' '+from)
}
// Scope tokens to the homepage, including its portalled dialogs.
// Existing fallback values preserve all other published routes.
const anchor='/* Shared floating header and properly anchored desktop navigation */'
assert.equal(css.split(anchor).length,2)
css=css.replace(anchor,`/* Approved Package 1 values mirrored from the editable public source. */\nbody:has(#top[data-testid="storileaf-home"]) {\n  --sl-radius-action:6px;\n  --sl-teal-hover:#0b5848;\n  --sl-gold-action-hover:#e9cb93;\n}\n\n${anchor}`)
edit('.button:hover','background: hsl(var(--foreground));','background: var(--sl-teal-hover, hsl(var(--foreground)));')
edit('.button:hover','border-color: hsl(var(--foreground));','border-color: var(--sl-teal-hover, hsl(var(--foreground)));')
edit('.button-gold:hover','background: hsl(var(--warm-glow));','background: var(--sl-gold-action-hover, hsl(var(--warm-glow)));')
edit('.button-gold:hover','border-color: hsl(var(--warm-glow));','border-color: var(--sl-gold-action-hover, hsl(var(--warm-glow)));')
edit('.site-header .header-actions .header-find-book','border-radius:9px;','border-radius:var(--sl-radius-action,9px);')
edit('.site-header .header-find-book:hover','background:hsl(var(--primary) / .82);','background:var(--sl-teal-hover,hsl(var(--primary) / .82));')
edit('.site-header .header-find-book:hover','border-color:hsl(var(--primary) / .82);','border-color:var(--sl-teal-hover,hsl(var(--primary) / .82));')
for(const selector of ['.newsletter-strip .newsletter-inline-preview input','.newsletter-strip .newsletter-inline-preview .button'])edit(selector,'border-radius:9px;','border-radius:var(--sl-radius-action,9px);')
edit('.resources-section .resource-category-link:focus-visible','border-radius:20px;','border-radius:inherit;')
// Outline text and mobile header height already match the approved source rules.
await fs.mkdir('qa/package1-published',{recursive:true})
await fs.writeFile('qa/package1-published/before.css',old)
await fs.writeFile('qa/package1-published/after.css',css)
await fs.writeFile(file,css)
console.log(JSON.stringify({file,before:blob(old),after:blob(css)}))
