import { useLayoutEffect, useRef } from 'react'
import { longestWordWidth, observeIntrinsicFit } from '../intrinsicTextFit'

/** Stack the existing steps only when their words cannot fit their current row.
 * Numbers, order, copy and all independent hero motion remain untouched. */
export function useProgressionTextFit() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    const context = document.createElement('canvas').getContext('2d')
    if (!root || !context) return
    const steps = [...root.querySelectorAll<HTMLElement>(':scope > span')]
    const separators = [...root.querySelectorAll<HTMLElement>(':scope > i')]
    const measure = () => {
      const style = getComputedStyle(root)
      const widths = steps.map(step => {
        const label = longestWordWidth(step, context, true)
        const number = step.querySelector('b')?.getBoundingClientRect().width || 0
        const stepStyle = getComputedStyle(step)
        return stepStyle.flexDirection === 'column'
          ? Math.max(label, number)
          : label + number + (parseFloat(stepStyle.columnGap) || 0)
      })
      const available = root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      // offsetWidth stays unrotated when the same separator points down.
      const needed = widths.reduce((sum, width) => sum + width, 0) + separators.reduce((sum, el) => sum + el.offsetWidth, 0) + (parseFloat(style.columnGap) || 0) * (steps.length + separators.length - 1)
      const cap = parseFloat(style.getPropertyValue('--sl-progression-label-cap')) || Infinity
      const wrap = needed > available + .5 || widths.some(width => width > cap + .5)
      root.toggleAttribute('data-progression-wrap', wrap)
    }
    const dispose = observeIntrinsicFit([root, ...steps, ...separators], measure)
    return () => { dispose(); root.removeAttribute('data-progression-wrap') }
  }, [])
  return ref
}
