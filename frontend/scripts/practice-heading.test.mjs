import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('P4-06 scopes emergency wrapping to the practice question without restyling it', () => {
  const css = fs.readFileSync('src/styles/homepage-reflow.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(match => match[1].includes('sl-practice-dialog'))
  assert.equal(rules.length, 1)
  assert.equal(rules[0][1].trim(), '.sl-practice-dialog h2')
  assert.equal(rules[0][2].replace(/\s+/g, ' ').trim(), 'overflow-wrap: anywhere;')
})
