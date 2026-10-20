import test from 'node:test'
import assert from 'node:assert/strict'
import { alignMenuForCapture, restoreMenuAfterCapture } from './menu-capture-alignment.mjs'

function fixture({ left = 430.46875, top = 84, resize = false, existing = 'none' } = {}) {
  const properties = new Map(), priorities = new Map()
  const element = {
    matches: () => true,
    getAnimations: () => [],
    style: {
      getPropertyValue: name => properties.get(name) || '',
      getPropertyPriority: name => priorities.get(name) || '',
      setProperty(name, value, priority = '') { properties.set(name, value); priorities.set(name, priority) },
      removeProperty(name) { properties.delete(name); priorities.delete(name) },
    },
    getBoundingClientRect() {
      const translated = properties.has('left')
      return { left: translated ? parseFloat(properties.get('left')) : left, top: properties.has('top') ? parseFloat(properties.get('top')) : top, width: 630 + (resize && translated ? 1 : 0), height: 416.25 }
    },
  }
  globalThis.requestAnimationFrame = callback => setImmediate(callback)
  globalThis.window = { devicePixelRatio: 1 }
  globalThis.getComputedStyle = () => ({ translate: existing, position: 'absolute', left: left + 'px', top: top + 'px' })
  return element
}

test('menu capture aligns only the fractional origin and restores every original bound', async () => {
  const element = fixture(), original = element.getBoundingClientRect(), record = await alignMenuForCapture(element)
  assert.deepEqual(record.delta, { x: 0.53125, y: 0 })
  assert.equal(record.aligned.left, 431)
  assert.equal(record.aligned.width, original.width)
  assert.equal(await restoreMenuAfterCapture(element, record), true)
  assert.deepEqual(element.getBoundingClientRect(), original)
  assert.equal(element.style.getPropertyValue('left'), '')
})
test('integer origins remain unchanged and subpixel vertical alignment is bounded', async () => {
  const integer = fixture({ left: 431, top: 84 }), a = await alignMenuForCapture(integer)
  assert.deepEqual(a.delta, { x: 0, y: 0 }); assert.equal(await restoreMenuAfterCapture(integer, a), true)
  const fractional = fixture({ left: 355.1875, top: 84.75 }), b = await alignMenuForCapture(fractional)
  assert.deepEqual(b.delta, { x: 0.8125, y: 0.25 }); assert.equal(await restoreMenuAfterCapture(fractional, b), true)
})
test('capture preparation rejects size changes and restores state on failure', async () => {
  const element = fixture({ resize: true })
  await assert.rejects(() => alignMenuForCapture(element), /altered dimensions/)
  assert.equal(element.style.getPropertyValue('left'), '')
  assert.equal(element.getBoundingClientRect().width, 630)
})
test('capture preparation cannot target unrelated elements or overwrite existing translation', async () => {
  const element = fixture(); element.matches = () => false
  await assert.rejects(() => alignMenuForCapture(element), /limited/)
  await assert.rejects(() => alignMenuForCapture(fixture({ existing: '1px' })), /existing/)
  const scaled = fixture(); window.devicePixelRatio = 2
  await assert.rejects(() => alignMenuForCapture(scaled), /1x/)
})

test('menu raster preparation waits for a pending transition instead of replacing its styles', async () => {
  const element = fixture(); let completed = false
  element.getAnimations = () => [{ finished: new Promise(resolve => setTimeout(() => { completed = true; resolve() }, 10)) }]
  const record = await alignMenuForCapture(element)
  assert.equal(completed, true)
  assert.equal(await restoreMenuAfterCapture(element, record), true)
})
