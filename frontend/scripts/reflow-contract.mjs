/** Founder-authorised P4-01..04 changes are not equality to broken enlarged layouts.
 * Only the named layout dimensions below may change. Normal geometry, content,
 * typography, assets, semantics and existing pixel tolerances remain strict. */
export function tabMinimumEquivalent(name, before, after) {
  return /^tab[0-5]$/.test(name) && ['0px', '147px', '158px', '174px'].includes(before) && after === 'min-content'
}
export function cleanQuality(value, arrayKeys, overflowKey = 'documentOverflow') {
  return !!value && value[overflowKey] === false && arrayKeys.every(key => Array.isArray(value[key]) && value[key].length === 0)
}
export function footerReflowDimension(name, dimension) {
  if (!['x', 'y', 'width', 'height'].includes(dimension)) return false
  if (['root', 'footer', 'container', 'grid'].includes(name)) return dimension === 'height'
  return /^(brand|logo|logoImage|brandDescription|currency|select|globe|currencyChevron|column[0-2]|columnHeading[0-2]|footerLink(?:[0-9]|1[0-6])|bottom|copyright|legal|legalLink[0-2])$/.test(name)
}
export function discoveryReflowDimension(name, dimension, before, after, delta) {
  if (![before, after, delta].every(Number.isFinite)) return false
  if (/^(tabs|rail|list|tab[0-5])$/.test(name)) return ['x', 'y', 'width', 'height'].includes(dimension)
  if (['section','container'].includes(name) && dimension === 'height') return Math.abs(after - before - delta) <= .15
  if (/^(panel|copy|intro|points|point[0-2]|action|arrow|visual|photo)$/.test(name) && dimension === 'y') return Math.abs(after - before - delta) <= .15
  return false
}
const heroBelow = new Set(['window','frame','photo','controls','dots','dot','dot-mark','buttons','button','control-icon','outro','description','actions','action','action-icon','ticker','ticker-viewport','track','group','phrase','ornament','band','books'])
const heroHeight = new Set(['root','intro','progression-container','orbit-layer','fade'])
export function heroReflowDimension(name, index, before, after, delta) {
  if (![before, after, delta].every(Number.isFinite)) return false
  if (['progression','progression-arrow'].includes(name)) return [0,1,2,3].includes(index)
  if (name === 'progression-number') return [0,1].includes(index)
  if ((heroBelow.has(name) && index === 1) || (heroHeight.has(name) && index === 3)) return Math.abs(after - before - delta) <= .15
  return false
}
export function centredTransformOrigin(value, rect) {
  const n = typeof value === 'string' ? value.split(/\s+/).map(x => /^-?[\d.]+px$/.test(x) ? parseFloat(x) : NaN) : []
  return Array.isArray(rect) && rect.length === 4 && n.length >= 2 && Math.abs(n[0] - rect[2] / 2) <= .15 && Math.abs(n[1] - rect[3] / 2) <= .15
}
export function heroReflowStyle(name, property, before, after, beforeRect, afterRect) {
  if (property === 'flexDirection') return name === 'progression-container' && before === 'row' && after === 'column'
  if (property === 'transform') return name === 'progression-arrow' && before === 'none' && after === 'matrix(0, 1, -1, 0, 0, 0)'
  if (property === 'transformOrigin' && (heroHeight.has(name) || ['progression','progression-arrow'].includes(name))) return centredTransformOrigin(before, beforeRect) && centredTransformOrigin(after, afterRect)
  return false
}

/** The underline keeps its exact insets and tracks the authorised tab width. */
export function discoveryUnderlineWidthEquivalent(name, before, after) {
  if (!/^tab[0-5]$/.test(name)) return false
  const values = [before?.geometry?.width, after?.geometry?.width]
  for (const node of [before, after]) {
    const dimensions = ['width', 'left', 'right'].map(key => /^-?[\d.]+px$/.test(node?.pseudo?.[key]) ? parseFloat(node.pseudo[key]) : NaN)
    values.push(...dimensions)
    if (!dimensions.every(Number.isFinite) || Math.abs(dimensions[0] - (node.geometry.width - dimensions[1] - dimensions[2])) > .15) return false
  }
  return values.every(Number.isFinite) && before.pseudo.left === after.pseudo.left && before.pseudo.right === after.pseudo.right
}
