import { useEffect, useState } from 'react'
/** Preserve the published preference lifecycle, including a live preference change. */
export function useMediaReducedMotion() {
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  return reduced
}
