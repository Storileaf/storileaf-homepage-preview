// Browser evidence retains the raw computed strings. These comparisons only
// handle measured values whose equivalent representations have been observed.
const sides = ['marginLeft', 'marginRight']
const pixelValue = value => typeof value === 'string' && /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?px$/i.test(value) ? Number.parseFloat(value) : NaN

export function comparePixelCoordinates(before, after, tolerance) {
  const a = typeof before === 'string' ? before.trim().split(/\s+/).map(pixelValue) : []
  const b = typeof after === 'string' ? after.trim().split(/\s+/).map(pixelValue) : []
  const valid = Number.isFinite(tolerance) && tolerance >= 0 && [2, 3].includes(a.length) && a.length === b.length && [...a, ...b].every(Number.isFinite)
  const maximumGeometry = valid ? Math.max(...a.map((value, index) => Math.abs(value - b[index]))) : null
  return { equal: valid && maximumGeometry <= tolerance, maximumGeometry, before: a, after: b }
}

// The caller bounds this to one identified centred block and still compares
// every other style. The native typed value must be auto on both sides. Actual
// boxes and content-edge distances prove the used margins independently of
// getComputedStyle's intermittent zero serialization. A raw value is accepted
// only when zero or the measured gap. Missing Typed OM evidence fails closed.
export function compareAutoMargins(before, after, { tolerance = 0 } = {}) {
  const differences = []
  let maximumGeometry = 0
  const fail = text => differences.push(text)
  const numeric = (a, b, label) => {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return fail(label + ' is not finite')
    const delta = Math.abs(a - b)
    maximumGeometry = Math.max(maximumGeometry, delta)
    if (delta > tolerance) fail(label + ' differs by ' + delta)
  }
  if (!Number.isFinite(tolerance) || tolerance < 0) fail('invalid tolerance')
  for (const [label, value] of [['before', before], ['after', after]]) {
    if (!value?.bounded) fail(label + ' is outside the approved selector/layout scope')
    if (!value?.available) fail(label + ' has no native typed-style evidence')
    if (!value || !Array.isArray(value.rect) || value.rect.length !== 4 || !Array.isArray(value.parentRect) || value.parentRect.length !== 4 || !value.parentEdges || !value.layout || !value.measured || !value.raw || !value.typed) {
      fail(label + ' has incomplete measurement evidence')
      continue
    }
    if (![...value.rect, ...value.parentRect, ...Object.values(value.parentEdges)].every(Number.isFinite)) fail(label + ' has non-finite box evidence')
    if (value.layout.transform !== 'none' || value.layout.parentTransform !== 'none') fail(label + ' has transformed box evidence')
    const edges = value.parentEdges
    const expected = {
      marginLeft: value.rect[0] - value.parentRect[0] - edges.borderLeft - edges.paddingLeft,
      marginRight: value.parentRect[0] + value.parentRect[2] - edges.borderRight - edges.paddingRight - value.rect[0] - value.rect[2]
    }
    for (const side of sides) {
      if (value.typed[side] !== 'auto') fail(label + ' ' + side + ' is not typed auto')
      const gap = value.measured[side], raw = pixelValue(value.raw[side])
      numeric(gap, expected[side], label + ' measured ' + side)
      if (gap < 0) fail(label + ' ' + side + ' is negative')
      if (!Number.isFinite(raw) || raw !== 0 && Math.abs(raw - gap) > tolerance) fail(label + ' raw ' + side + ' is neither zero nor its actual gap')
    }
    numeric(value.measured.marginLeft, value.measured.marginRight, label + ' centring')
  }
  if (before && after) {
    for (const field of ['layout', 'parentEdges']) if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) fail(field + ' differs')
    for (const field of ['rect', 'parentRect']) {
      if (before[field]?.length !== 4 || after[field]?.length !== 4) continue
      before[field].forEach((value, index) => numeric(value, after[field][index], field + '[' + index + ']'))
    }
    for (const side of sides) numeric(before.measured?.[side], after.measured?.[side], 'used ' + side)
  }
  return { equal: !differences.length, differences, maximumGeometry }
}
