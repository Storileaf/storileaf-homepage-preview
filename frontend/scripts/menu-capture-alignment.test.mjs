import test from 'node:test'
import assert from 'node:assert/strict'
import { alignMenuForCapture, restoreMenuAfterCapture } from './menu-capture-alignment.mjs'

function fixture({ left = 430.46875, top = 84, resize = false, existing = 'none' } = {}) {
  const properties = new Map(), priorities = new Map()
  const element = {
    matches: () => true,
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
  globalThis.window = { devicePixelRatio: 1 }
  globalThis.getComputedStyle = () => ({ translate: existing, position: 'absolute', left: left + 'px', top: top + 'px' })
  return element
}

test('menu capture aligns only the fractional origin and restores every original bound', () => {
  const element = fixture(), original = element.getBoundingClientRect(), record = alignMenuForCapture(element)
  assert.deepEqual(record.delta, { x: 0.53125, y: 0 })
  assert.equal(record.aligned.left, 431)
  assert.equal(record.aligned.width, original.width)
  assert.equal(restoreMenuAfterCapture(element, record), true)
  assert.deepEqual(element.getBoundingClientRect(), original)
  assert.equal(element.style.getPropertyValue('left'), '')
})
test('integer origins remain unchanged and subpixel vertical alignment is bounded', () => {
  const integer = fixture({ left: 431, top: 84 }), a = alignMenuForCapture(integer)
  assert.deepEqual(a.delta, { x: 0, y: 0 }); assert.equal(restoreMenuAfterCapture(integer, a), true)
  const fractional = fixture({ left: 355.1875, top: 84.75 }), b = alignMenuForCapture(fractional)
  assert.deepEqual(b.delta, { x: 0.8125, y: 0.25 }); assert.equal(restoreMenuAfterCapture(fractional, b), true)
})
test('capture preparation rejects size changes and restores state on failure', () => {
  const element = fixture({ resize: true })
  assert.throws(() => alignMenuForCapture(element), /altered dimensions/)
  assert.equal(element.style.getPropertyValue('left'), '')
  assert.equal(element.getBoundingClientRect().width, 630)
})
test('capture preparation cannot target unrelated elements or overwrite existing translation', () => {
  const element = fixture(); element.matches = () => false
  assert.throws(() => alignMenuForCapture(element), /limited/)
  assert.throws(() => alignMenuForCapture(fixture({ existing: '1px' })), /existing/)
  const scaled = fixture(); window.devicePixelRatio = 2
  assert.throws(() => alignMenuForCapture(scaled), /1x/)
})
