import { useLayoutEffect, useRef } from 'react'
import { observeIntrinsicFit } from '../intrinsicTextFit'

/** Keep the selected tab visible after text changes its intrinsic width.
 * Selection, keyboard handling and vertical page position are untouched. */
export function useDiscoveryTextFit() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const rail = ref.current
    if (!rail) return
    const tabs = [...rail.querySelectorAll<HTMLElement>('[role="tab"]')]
    let previous = ''
    const measure = () => {
      const sizes = [rail.clientWidth, ...tabs.map(tab => tab.getBoundingClientRect().width)].join(',')
      const changed = previous !== '' && sizes !== previous
      previous = sizes
      if (!changed) return
      const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true')
      if (!active) return
      const outer = rail.getBoundingClientRect(), inner = active.getBoundingClientRect()
      const delta = inner.left < outer.left ? inner.left - outer.left
        : inner.right > outer.right ? inner.right - outer.right : 0
      if (Math.abs(delta) > .5) rail.scrollBy({ left: delta, behavior: 'instant' })
    }
    return observeIntrinsicFit([rail, ...tabs], measure)
  }, [])
  return ref
}
