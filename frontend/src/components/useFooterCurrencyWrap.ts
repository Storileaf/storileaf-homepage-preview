import { useLayoutEffect, useRef } from 'react'

/** Keep the existing mobile logo/currency row until their real widths no
 * longer fit. Observe text-driven resizing as well as viewport resizing.
 * No font size, copy, currency value or persistent state is changed. */
export function useFooterCurrencyWrap() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const brand = ref.current
    const logo = brand?.querySelector<HTMLImageElement>('.sl-footer-logo img')
    const currency = brand?.querySelector<HTMLElement>('.sl-footer-currency')
    if (!brand || !logo || !currency || typeof ResizeObserver === 'undefined') return
    let frame = 0
    let disposed = false
    const measure = () => {
      frame = 0
      if (disposed) return
      const gap = parseFloat(getComputedStyle(brand).columnGap) || 0
      const needed = logo.getBoundingClientRect().width + currency.getBoundingClientRect().width + gap
      const wrapped = matchMedia('(max-width:720px)').matches && needed > brand.clientWidth + .5
      if (brand.hasAttribute('data-currency-wrap') !== wrapped) brand.toggleAttribute('data-currency-wrap', wrapped)
    }
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    for (const element of [brand, logo, currency]) observer.observe(element)
    window.addEventListener('resize', schedule)
    void document.fonts.ready.then(schedule)
    measure()
    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
      brand.removeAttribute('data-currency-wrap')
    }
  }, [])
  return ref
}
