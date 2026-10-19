import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { transformWithOxc } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { execFileSync } from 'node:child_process'

const dir = new URL('./.type-test/', import.meta.url)
await fs.mkdir(dir, { recursive: true })
async function loadComponent(name) {
  const source = await fs.readFile(new URL('../src/components/' + name + '.tsx', import.meta.url), 'utf8')
  const result = await transformWithOxc(source, name + '.tsx', { jsx: { runtime: 'automatic' } })
  const url = new URL(name + '.mjs', dir)
  await fs.writeFile(url, result.code)
  return import(url.href)
}
const { Heading, Text } = await loadComponent('Typography')
const { Container, Section } = await loadComponent('Layout')
const css = await fs.readFile(new URL('../src/styles/foundations.css', import.meta.url), 'utf8')

test('heading hierarchy is independent of visual size', () => {
  const html = renderToStaticMarkup(createElement(Heading, { as: 'h1', variant: 'compact', id: 'title' }, 'Existing approved title'))
  assert.match(html, /^<h1/)
  assert.match(html, /sl-heading--compact/)
  assert.match(html, /id="title"/)
  assert.ok(!html.includes('role='))
})
test('text uses explicit roles and native elements', () => {
  const html = renderToStaticMarkup(createElement(Text, { as: 'span', variant: 'support' }, 'Existing supporting copy'))
  assert.match(html, /^<span/)
  assert.match(html, /sl-copy--support/)
})
test('layout primitives preserve native wrappers and accessible names', () => {
  const html = renderToStaticMarkup(createElement(Section, { 'aria-labelledby': 'title', spacing: 'compact' }, createElement(Container, null, 'Content')))
  assert.match(html, /<section[^>]+data-spacing="compact"[^>]+aria-labelledby="title"/)
  assert.match(html, /<div class="sl-container">/)
})
test('public type and spacing mirror is generated from one canonical source', () => {
  execFileSync(process.execPath, [new URL('./sync-foundations.mjs', import.meta.url).pathname], { stdio: 'pipe' })
})
test('role tokens retain editorial variation and readable question text', () => {
  for (const token of ['--sl-type-hero', '--sl-type-feature', '--sl-type-editorial', '--sl-type-compact', '--sl-type-card', '--sl-type-newsletter', '--sl-text-question: var(--sl-text-body)', '--sl-text-body: .9375rem', '--sl-leading-question: 1.5', '--sl-gap-heading-content', '--sl-pad-card']) assert.ok(css.includes(token), token)
  for (const width of [900,720,480,360]) assert.ok(css.includes(`max-width:${width}px`))
  assert.ok(!css.includes('html { font-size:'))
})
// Test modules are transient and excluded from source commits.
await fs.rm(dir, { recursive: true, force: true })
