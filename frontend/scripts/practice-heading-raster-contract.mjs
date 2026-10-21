import assert from 'node:assert/strict'
const question = 'What do you remember about the home you grew up in?'

/** Only the explicitly approved 320px enlarged question may change its raster.
 * Full images and their original changed-pixel ratios remain in the report.
 * Every other pixel, all measured boxes, styles, content and controls retain
 * the existing gates. This is not a generic image mask or an enlarged exemption. */
export function practiceHeadingRegion(label, before, after) {
  assert.equal(label, 'text-200-320-dialog')
  assert.equal(before.viewportWidth, 320); assert.equal(after.viewportWidth, 320)
  assert.equal(before.text, question); assert.equal(after.text, question)
  assert.equal(before.style.fontSize, '60px'); assert.equal(after.style.fontSize, '60px')
  assert.equal(before.style.fontFamily, 'Newsreader')
  assert.deepEqual(after.style, before.style)
  assert.equal(before.overflowWrap, 'normal'); assert.equal(after.overflowWrap, 'anywhere')
  for (const key of ['heading', 'clip']) {
    assert.deepEqual(Object.keys(before[key]), Object.keys(after[key]))
    for (const field of Object.keys(before[key])) {
      assert(Number.isFinite(before[key][field]) && Number.isFinite(after[key][field]))
      assert(Math.abs(before[key][field] - after[key][field]) <= .15, key + '.' + field)
    }
  }
  assert.equal(before.clip.width, 288)
  assert(before.ranges.length && after.ranges.length && after.glyphs.length)
  const inside = r => r.left >= after.heading.left - .15 && r.right <= after.heading.right + .15
  assert(after.ranges.every(inside), 'The repaired text must fit its content box')
  assert(after.glyphs.every(g => g.rects.length && g.rects.every(r => r.right > r.left && inside(r))), 'Every non-space character must retain a fitting rectangle')
  assert.equal(after.glyphs.map(g => g.text).join(''), question.replace(/\s/g, ''))
  assert(Math.max(...before.ranges.map(r => r.right)) > before.heading.right + 1, 'Require the recorded inherited extent, not an unrelated difference')
  const ranges = [...before.ranges, ...after.ranges]
  assert(ranges.every(r => [r.left,r.top,r.right,r.bottom].every(Number.isFinite)))
  const x = Math.max(0, Math.floor(Math.min(...ranges.map(r => r.left))) - 1)
  const y = Math.max(0, Math.floor(Math.min(...ranges.map(r => r.top))) - 1)
  const right = Math.min(before.clip.width, Math.ceil(Math.max(...ranges.map(r => r.right))) + 1)
  const bottom = Math.min(before.clip.height, Math.ceil(Math.max(...ranges.map(r => r.bottom))) + 1)
  assert(right > x && bottom > y && y > 0 && bottom < before.clip.height)
  return { label, region: { x, y, width: right-x, height: bottom-y }, before, after }
}

export async function measurePracticeHeadingPair(pages, label) {
  const measure = p => p.evaluate(() => {
    const d = document.querySelector('[data-testid="question-dialog"]'), h = d.querySelector('h2')
    const db = d.getBoundingClientRect(), hb = h.getBoundingClientRect(), s = getComputedStyle(h)
    const x = Math.max(0,Math.floor(db.x)), y = Math.max(0,Math.floor(db.y))
    const rect = r => ({ left:r.left-x, top:r.top-y, right:r.right-x, bottom:r.bottom-y })
    const range = document.createRange();range.selectNodeContents(h)
    const ranges = [...range.getClientRects()].filter(r => r.width > 0).map(rect), glyphs = []
    const walker = document.createTreeWalker(h,NodeFilter.SHOW_TEXT);let n
    while((n=walker.nextNode()))for(let i=0;i<n.length;i++)if(!/\s/.test(n.data[i])){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);glyphs.push({text:n.data[i],rects:[...r.getClientRects()].map(rect)})}
    return { text:h.textContent, viewportWidth:innerWidth, heading:rect(hb), clip:{width:Math.min(innerWidth,Math.ceil(db.right))-x,height:Math.min(innerHeight,Math.ceil(db.bottom))-y}, style:Object.fromEntries(['fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','wordSpacing','textAlign','whiteSpace','textWrap'].map(k=>[k,s[k]]).concat([['fontFamily',s.fontFamily.split(',')[0].replaceAll('"','').trim()]])), overflowWrap:s.overflowWrap, ranges,glyphs }
  })
  return practiceHeadingRegion(label, await measure(pages.published), await measure(pages.source))
}
