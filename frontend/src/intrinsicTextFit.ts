/** Intrinsic text measurements for the two bounded homepage reflow cases.
 * Uses the rendered font and letter spacing. No text or font size is changed. */
export function longestWordWidth(element: HTMLElement, context: CanvasRenderingContext2D, directText = false) {
  const style = getComputedStyle(element)
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const spacing = parseFloat(style.letterSpacing) || 0
  const text = directText
    ? [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(' ')
    : element.textContent || ''
  return Math.max(0, ...text.trim().split(/\s+/).map(word => context.measureText(word).width + Math.max(0, word.length - 1) * spacing))
}

/** Batch native resize/font notifications and make teardown safe for StrictMode. */
export function observeIntrinsicFit(elements: Element[], measure: () => void, win: Window = window) {
  let frame = 0
  let disposed = false
  const schedule = () => {
    if (!disposed && !frame) frame = win.requestAnimationFrame(() => {
      frame = 0
      if (!disposed) measure()
    })
  }
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
  elements.forEach(element => observer?.observe(element))
  win.addEventListener('resize', schedule)
  void win.document.fonts.ready.then(schedule)
  measure()
  return () => {
    disposed = true
    observer?.disconnect()
    win.removeEventListener('resize', schedule)
    if (frame) win.cancelAnimationFrame(frame)
  }
}
