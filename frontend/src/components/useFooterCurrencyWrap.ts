import { useLayoutEffect, useRef } from 'react'
import { longestWordWidth, observeIntrinsicFit } from '../intrinsicTextFit'

/** Preserve the mobile composition until real label widths need more room.
 * The declared logo width is its minimum, even if a crowded grid shrinks it. */
export function useFooterCurrencyWrap() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const brand = ref.current
    const grid = brand?.parentElement
    const logo = brand?.querySelector<HTMLImageElement>('.sl-footer-logo img')
    const currency = brand?.querySelector<HTMLElement>('.sl-footer-currency')
    const context = document.createElement('canvas').getContext('2d')
    if (!brand || !grid || !logo || !currency || !context) return
    const columns = [...grid.querySelectorAll<HTMLElement>('.sl-footer-column')]
    const measure = () => {
      const mobile = matchMedia('(max-width:720px)').matches
      const style = getComputedStyle(brand)
      const logoWidth = Math.max(logo.getBoundingClientRect().width, parseFloat(style.getPropertyValue('--sl-footer-logo-width')) || 0)
      const needed = logoWidth + currency.getBoundingClientRect().width + (parseFloat(style.columnGap) || 0)
      const currencyWrap = mobile && needed > brand.clientWidth + .5
      brand.toggleAttribute('data-currency-wrap', currencyWrap)
      const minimum = columns.slice(0, 2).map(column => Math.max(0, ...[...column.querySelectorAll<HTMLElement>('h3,a')].map(label => longestWordWidth(label, context))))
      // The existing mobile columns use 1.3fr / 1fr; Help already spans both.
      const gridStyle = getComputedStyle(grid)
      const ratio = parseFloat(gridStyle.getPropertyValue('--sl-footer-column-ratio')) || 1.3
      const required = Math.max((minimum[0] || 0) / ratio, minimum[1] || 0) * (ratio + 1) + (parseFloat(gridStyle.columnGap) || 0)
      grid.toggleAttribute('data-text-wrap', mobile && required > grid.clientWidth + .5)
    }
    const dispose = observeIntrinsicFit([brand, grid, logo, currency, ...columns], measure)
    return () => {
      dispose()
      brand.removeAttribute('data-currency-wrap')
      grid.removeAttribute('data-text-wrap')
    }
  }, [])
  return ref
}
