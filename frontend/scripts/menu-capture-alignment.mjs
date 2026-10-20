// Browser-test preparation only. Raw geometry/style assertions run beforehand.
// Do not import this utility from any public runtime component.
export async function alignMenuForCapture(element) {
  if (!element.matches('.books-dropdown,.sl-header-books-menu,.resources-dropdown,.sl-resources-menu')) throw new Error('Raster alignment is limited to the two shared menu panels')
  if (window.devicePixelRatio !== 1) throw new Error('Menu raster alignment requires the recorded 1x capture scale')
  const css = getComputedStyle(element)
  if (css.translate !== 'none') throw new Error('Do not replace an existing menu translation')
  if (!['absolute', 'fixed', 'relative'].includes(css.position) || !Number.isFinite(parseFloat(css.left)) || !Number.isFinite(parseFloat(css.top))) throw new Error('Menu raster preparation needs explicit positioned offsets')
  const r = element.getBoundingClientRect()
  const original = { left: r.left, top: r.top, width: r.width, height: r.height }
  const delta = { x: Math.ceil(r.left) - r.left, y: Math.ceil(r.top) - r.top }
  if (![...Object.values(original), ...Object.values(delta)].every(Number.isFinite) || delta.x < 0 || delta.x >= 1 || delta.y < 0 || delta.y >= 1) throw new Error('Invalid bounded menu raster adjustment')
  const before = Object.fromEntries(['left', 'top'].map(name => [name, { value: element.style.getPropertyValue(name), priority: element.style.getPropertyPriority(name) }]))
  const paint = async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    let timer
    try { await Promise.race([Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Menu capture transition did not settle')), 5000) })]) }
    finally { clearTimeout(timer) }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  }
  const offsets = { left: parseFloat(css.left) + delta.x, top: parseFloat(css.top) + delta.y }
  try {
    // Layout offsets, not compositor transforms. Text must rasterise at the
    // aligned origin rather than resampling an already painted fractional layer.
    for (const name of ['left', 'top']) element.style.setProperty(name, offsets[name] + 'px')
    await paint()
    let a = element.getBoundingClientRect()
    // Resolved CSS offsets may be serialised with fewer decimals than layout
    // units. Correct that serialisation residue, still to the same <1px target.
    for (let attempt = 0; attempt < 2 && (Math.abs(a.left - Math.ceil(r.left)) > 0.001 || Math.abs(a.top - Math.ceil(r.top)) > 0.001); attempt++) {
      offsets.left += Math.ceil(r.left) - a.left
      offsets.top += Math.ceil(r.top) - a.top
      for (const name of ['left', 'top']) element.style.setProperty(name, offsets[name] + 'px')
      await paint()
      a = element.getBoundingClientRect()
    }
    const aligned = { left: a.left, top: a.top, width: a.width, height: a.height }
    if (Math.abs(a.width - r.width) > 0.001 || Math.abs(a.height - r.height) > 0.001 || Math.abs(a.left - r.left - delta.x) > 0.015 || Math.abs(a.top - r.top - delta.y) > 0.015) throw new Error('Menu raster preparation altered dimensions or did not apply the exact bounded translation ' + JSON.stringify({ original, aligned, delta, offsets }))
    return { original, aligned, delta, before }
  } catch (error) {
    for (const [name, saved] of Object.entries(before)) {
      if (saved.value) element.style.setProperty(name, saved.value, saved.priority)
      else element.style.removeProperty(name)
    }
    await paint()
    throw error
  }
}

export async function restoreMenuAfterCapture(element, record) {
  for (const [name, saved] of Object.entries(record.before)) {
    if (saved.value) element.style.setProperty(name, saved.value, saved.priority)
    else element.style.removeProperty(name)
  }
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  let timer
  try { await Promise.race([Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Menu capture restoration did not settle')), 5000) })]) }
  finally { clearTimeout(timer) }
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const r = element.getBoundingClientRect()
  return ['left', 'top', 'width', 'height'].every(key => Math.abs(r[key] - record.original[key]) < 0.015)
}
