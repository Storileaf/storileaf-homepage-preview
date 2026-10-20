import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { transformWithOxc } from 'vite'

const compiled = await transformWithOxc(readFileSync(new URL('../src/homepageScrollRestoration.ts', import.meta.url), 'utf8'), 'homepageScrollRestoration.ts')
const { installHomepageScrollRestoration } = await import('data:text/javascript;base64,' + Buffer.from(compiled.code).toString('base64'))
let key = 0

class Surface {
  listeners = new Map()
  addEventListener(type, listener) { const set = this.listeners.get(type) || new Set(); set.add(listener); this.listeners.set(type, set) }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener) }
  emit(type, event = {}) { for (const listener of this.listeners.get(type) || []) listener(event) }
  listenerCount() { return [...this.listeners.values()].reduce((count, set) => count + set.size, 0) }
}

function browser({ href = 'https://preview.test/#top', state = { unrelated: { retained: true } }, storage = new Map(), maxY = 10000, blockedStorage = false } = {}) {
  const win = new Surface(), doc = new Surface(), frames = new Map()
  let index = 0, frameId = 0
  const entries = [{ href, state: structuredClone(state) }]
  win.document = doc
  win.crypto = { randomUUID: () => 'entry-' + ++key }
  win.scrollX = 0; win.scrollY = 0
  Object.defineProperty(win, 'location', { get: () => new URL(entries[index].href) })
  win.sessionStorage = {
    getItem(name) { if (blockedStorage) throw new Error('Blocked storage'); return storage.get(name) ?? null },
    setItem(name, value) { if (blockedStorage) throw new Error('Blocked storage'); storage.set(name, value) },
  }
  win.history = {
    scrollRestoration: 'auto',
    get state() { return entries[index].state },
    get length() { return entries.length },
    replaceState(value) { entries[index].state = structuredClone(value) },
  }
  win.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId }
  win.cancelAnimationFrame = id => frames.delete(id)
  win.scrollTo = ({ left = 0, top = 0, ...options }) => {
    assert.deepEqual(options, {}, 'Restoration must leave motion behaviour to the published CSS')
    win.scrollX = Math.max(0, left); win.scrollY = Math.min(maxY, Math.max(0, top))
    doc.emit('scroll', { target: doc })
  }
  const head = { localName: 'head' }, html = { children: [] }, body = { localName: 'body', parentElement: html, children: [] }
  html.children = [head, body]
  const rail = { localName: 'div', parentElement: body, isConnected: true, scrollLeft: 0, scrollTop: 0 }
  const dialog = { localName: 'div', parentElement: body, isConnected: true, children: [] }
  const textarea = { localName: 'textarea', parentElement: dialog, isConnected: true, scrollLeft: 0, scrollTop: 0, value: '' }
  dialog.children = [textarea]
  body.children = [rail, dialog]
  doc.querySelector = selector => {
    if (selector === 'body:nth-child(2) > div:nth-child(1)') return rail.isConnected ? rail : null
    if (selector === 'body:nth-child(2) > div:nth-child(2) > textarea:nth-child(1)') return textarea.isConnected ? textarea : null
    return null
  }
  doc.getElementById = id => ({ top: 0, samples: 2072, questions: 7758 })[id] === undefined ? null : {
    scrollIntoView() { win.scrollTo({ top: ({ top: 0, samples: 2072, questions: 7758 })[id] }) },
  }
  const flush = () => { const pending = [...frames.values()]; frames.clear(); for (const callback of pending) callback() }
  const scroll = y => { win.scrollY = y; doc.emit('scroll', { target: doc }) }
  const click = hash => {
    const event = { target: { closest() { return this }, href: new URL(hash, win.location.href).href, target: '', hasAttribute: () => false, focus() { throw new Error('Native focus must remain untouched') } }, button: 0, defaultPrevented: false, preventDefault() { throw new Error('Native anchor must not be intercepted') } }
    doc.emit('click', event)
    return event
  }
  const navigate = (hash, y, copiedState = false) => {
    click(hash)
    const next = new URL(hash, win.location.href).href
    if (next !== win.location.href) {
      const nextState = copiedState ? structuredClone(win.history.state) : null
      entries.splice(index + 1); entries.push({ href: next, state: nextState }); index++
      // A native fragment can scroll before delivering its location events.
      win.scrollY = y
      win.emit('popstate', { state: win.history.state }); win.emit('hashchange')
    }
    scroll(y); flush()
  }
  const traverse = (delta, finish = true) => {
    index += delta
    // Deliberately model intervening native hash movement before popstate.
    win.scrollY = 0
    win.emit('popstate', { state: win.history.state }); win.emit('hashchange')
    if (finish) flush()
  }
  return { win, doc, entries, storage, rail, textarea, frames, flush, scroll, click, navigate, traverse }
}

test('native footer Back and Forward retain the exact click position and separate repeated fragment entries', () => {
  const page = browser(), cleanup = installHomepageScrollRestoration(page.win)
  page.flush()
  assert.equal(page.win.history.scrollRestoration, 'manual')
  assert.deepEqual(page.win.history.state.unrelated, { retained: true })
  const initialKey = page.win.history.state.__storileafHomepageScrollKey
  page.rail.scrollLeft = 125
  page.doc.emit('scroll', { target: page.rail })
  // Native pointer focus may move the viewport before its scroll event arrives.
  page.win.scrollY = 9262
  page.navigate('#samples', 2072)
  const samplesKey = page.win.history.state.__storileafHomepageScrollKey
  assert.notEqual(samplesKey, initialKey)
  page.rail.scrollLeft = 300
  page.doc.emit('scroll', { target: page.rail })
  page.traverse(-1); assert.equal(page.win.scrollY, 9262); assert.equal(page.rail.scrollLeft, 125)
  page.traverse(1); assert.equal(page.win.scrollY, 2072); assert.equal(page.rail.scrollLeft, 300)
  page.traverse(-1, false)
  assert.equal(page.frames.size, 1)
  page.navigate('#top', 0)
  assert.equal(page.win.scrollY, 0, 'A native repeated-fragment click cancels a pending restore')
  page.traverse(1); assert.equal(page.win.scrollY, 2072)
  page.navigate('#top', 0, true)
  assert.notEqual(page.win.history.state.__storileafHomepageScrollKey, initialKey)
  assert.notEqual(page.win.history.state.__storileafHomepageScrollKey, samplesKey)
  page.scroll(6000)
  const length = page.win.history.length
  page.navigate('#top', 0)
  assert.equal(page.win.history.length, length)
  page.traverse(-1); assert.equal(page.win.scrollY, 2072)
  page.traverse(1); assert.equal(page.win.scrollY, 0)
  cleanup()
})

test('numeric scroll cache survives pagehide, BFCache and document reload, with native clamping', () => {
  const page = browser(), cleanup = installHomepageScrollRestoration(page.win)
  page.flush(); page.scroll(8200)
  page.rail.scrollLeft = 125
  page.doc.emit('scroll', { target: page.rail })
  page.win.emit('pagehide')
  const state = structuredClone(page.win.history.state)
  const persisted = JSON.parse(page.storage.get('storileaf.homepage-scroll-v1'))
  for (const targets of Object.values(persisted)) for (const position of Object.values(targets)) {
    assert.deepEqual(Object.keys(position).sort(), ['x', 'y'])
    assert.ok(Number.isFinite(position.x) && Number.isFinite(position.y))
  }
  page.win.scrollY = 0; page.rail.scrollLeft = 0
  page.win.emit('pageshow', { persisted: true }); page.flush()
  assert.equal(page.win.scrollY, 8200); assert.equal(page.rail.scrollLeft, 125)
  page.navigate('#samples', 2072)
  page.traverse(-1, false)
  assert.equal(page.win.scrollY, 0)
  assert.equal(page.frames.size, 1)
  page.win.emit('pagehide')
  page.win.emit('pageshow', { persisted: true }); page.flush()
  assert.equal(page.win.scrollY, 8200, 'Leaving during a pending restore must preserve its destination cache')
  assert.equal(page.rail.scrollLeft, 125)
  cleanup()
  const reloaded = browser({ state, storage: page.storage, maxY: 7000 })
  const stop = installHomepageScrollRestoration(reloaded.win)
  reloaded.flush()
  assert.equal(reloaded.win.scrollY, 7000)
  assert.equal(reloaded.rail.scrollLeft, 125)
  stop()
})

test('missing or invalid saved positions retain direct hash handling when storage is unavailable', () => {
  for (const blockedStorage of [false, true]) {
    const storage = new Map([['storileaf.homepage-scroll-v1', '{"known":{"window":{"x":"invalid","y":20}}}']])
    const page = browser({ href: 'https://preview.test/#samples', state: { __storileafHomepageScrollKey: 'known', unrelated: true }, storage, blockedStorage })
    const cleanup = installHomepageScrollRestoration(page.win)
    page.flush()
    assert.equal(page.win.scrollY, 2072)
    assert.equal(page.win.history.state.unrelated, true)
    page.scroll(9000); page.navigate('#questions', 7758)
    page.traverse(-1); assert.equal(page.win.scrollY, 9000)
    cleanup()
  }
})

test('a disposed practice textarea never retains answer text or interrupts window restoration', () => {
  const page = browser(), cleanup = installHomepageScrollRestoration(page.win)
  page.flush(); page.scroll(8200)
  page.textarea.value = 'This unsaved practice answer must not be retained.'
  page.textarea.scrollTop = 140
  page.doc.emit('scroll', { target: page.textarea })
  page.win.emit('pagehide')
  const persisted = page.storage.get('storileaf.homepage-scroll-v1')
  assert.equal(persisted.includes(page.textarea.value), false)
  for (const targets of Object.values(JSON.parse(persisted))) for (const position of Object.values(targets)) {
    assert.deepEqual(Object.keys(position).sort(), ['x', 'y'])
    assert.ok(Number.isFinite(position.x) && Number.isFinite(position.y))
  }
  page.textarea.isConnected = false
  page.textarea.value = ''; page.textarea.scrollTop = 0
  page.win.scrollY = 0
  page.win.emit('pageshow', { persisted: true }); page.flush()
  assert.equal(page.win.scrollY, 8200)
  assert.equal(page.textarea.scrollTop, 0)
  cleanup()
})

test('mount cleanup cancels stale restoration and removes every listener before a StrictMode remount', () => {
  const page = browser({ href: 'https://preview.test/#samples' })
  const first = installHomepageScrollRestoration(page.win)
  assert.equal(page.frames.size, 1)
  first()
  assert.equal(page.frames.size, 0)
  assert.equal(page.win.listenerCount() + page.doc.listenerCount(), 0)
  assert.equal(page.win.history.scrollRestoration, 'auto')
  const second = installHomepageScrollRestoration(page.win)
  page.flush()
  assert.equal(page.win.scrollY, 2072)
  assert.equal(page.win.history.length, 1)
  second()
  assert.equal(page.win.listenerCount() + page.doc.listenerCount(), 0)
})
