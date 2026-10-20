const entryKey = '__storileafHomepageScrollKey'
const storageKey = 'storileaf.homepage-scroll-v1'
const windowTarget = 'window'

type Position = { x: number; y: number }
type Positions = Record<string, Position>
type Cache = Record<string, Positions>

function historyKey(state: unknown): string | undefined {
  if (!state || typeof state !== 'object') return
  const key = (state as Record<string, unknown>)[entryKey]
  return typeof key === 'string' ? key : undefined
}

function readCache(win: Window): Cache {
  try {
    const saved: unknown = JSON.parse(win.sessionStorage.getItem(storageKey) || '{}')
    const cache: Cache = Object.create(null)
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return cache
    for (const [key, targets] of Object.entries(saved)) {
      if (!targets || typeof targets !== 'object' || Array.isArray(targets)) continue
      const positions: Positions = Object.create(null)
      for (const [selector, value] of Object.entries(targets)) {
        if (!value || typeof value !== 'object') continue
        const { x, y } = value as Position
        if (Number.isFinite(x) && Number.isFinite(y)) positions[selector] = { x, y }
      }
      cache[key] = positions
    }
    return cache
  } catch { return Object.create(null) as Cache }
}

// The protected router uses a stable ancestor path for connected scroll targets.
function selectorFor(element: Element): string {
  const parts: string[] = []
  for (let current: Element | null = element; current?.parentElement; current = current.parentElement) {
    const index = [...current.parentElement.children].indexOf(current) + 1
    parts.unshift(`${current.localName}:nth-child(${index})`)
  }
  return parts.join(' > ')
}

/** Reconstruct the protected router's scroll cache without intercepting anchors.
 * Each native history entry owns numeric window/element positions. Only this
 * cache is kept across pagehide; practice text never enters it. */
export function installHomepageScrollRestoration(win: Window): () => void {
  const doc = win.document
  const history = win.history
  const previousRestoration = history.scrollRestoration
  const cache = readCache(win)
  const tracked = new Map<Element, string>()
  let alive = true
  let frame: number | undefined
  const newEntry = () => {
    const key = win.crypto.randomUUID()
    const previous = history.state
    history.replaceState({ ...(previous && typeof previous === 'object' ? previous : {}), [entryKey]: key }, '')
    return key
  }
  let activeKey = historyKey(history.state) || newEntry()
  let activeHref = win.location.href
  history.scrollRestoration = 'manual'

  const persist = () => {
    try { win.sessionStorage.setItem(storageKey, JSON.stringify(cache)) } catch { /* Optional scroll cache. */ }
  }
  const snapshot = () => {
    const positions = cache[activeKey] ||= Object.create(null) as Positions
    positions[windowTarget] = { x: win.scrollX, y: win.scrollY }
    for (const [element, selector] of tracked) {
      if (element.isConnected) positions[selector] = { x: element.scrollLeft, y: element.scrollTop }
      else tracked.delete(element)
    }
  }
  const cancelRestore = () => {
    if (frame !== undefined) win.cancelAnimationFrame(frame)
    frame = undefined
  }
  const restore = (positions: Positions | undefined) => {
    cancelRestore()
    const key = activeKey, href = activeHref
    // A restored window can emit scroll before its connected targets finish.
    // Keep this request independent of the continuously updated entry cache.
    const savedPositions = Object.entries(positions || {}).map(([selector, position]) => [selector, { ...position }] as const)
    // popstate precedes the browser's remaining hash work. Restore next frame.
    frame = win.requestAnimationFrame(() => {
      frame = undefined
      if (!alive || key !== activeKey || href !== win.location.href) return
      let windowRestored = false
      for (const [selector, position] of savedPositions) {
        if (selector === windowTarget) {
          // Omitted behaviour preserves the published CSS motion preference.
          win.scrollTo({ left: position.x, top: position.y })
          windowRestored = true
        } else {
          try {
            const element = doc.querySelector(selector)
            if (element) { element.scrollLeft = position.x; element.scrollTop = position.y; tracked.set(element, selector) }
          } catch { /* An obsolete selector cannot interrupt window restoration. */ }
        }
      }
      if (!windowRestored) {
        const hash = win.location.hash.slice(1)
        if (!hash) win.scrollTo({ left: 0, top: 0 })
        else {
          try { doc.getElementById(decodeURIComponent(hash))?.scrollIntoView() } catch { /* Malformed native fragment. */ }
        }
      }
    })
  }
  const onScroll = (event: Event) => {
    if (frame !== undefined || activeHref !== win.location.href || historyKey(history.state) !== activeKey) return
    const target = event.target
    if (target && target !== doc && 'scrollTop' in target && 'parentElement' in target) {
      const element = target as Element
      if (element.isConnected) tracked.set(element, selectorFor(element))
    }
    snapshot()
  }
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
    const url = new URL(link.href, activeHref)
    const current = new URL(activeHref)
    if (url.origin !== current.origin || url.pathname !== current.pathname || url.search !== current.search || !url.hash) return
    // Capture before native focus/hash work, including when scroll events lag.
    cancelRestore()
    snapshot()
  }
  const onLocationChange = () => {
    const href = win.location.href
    let key = historyKey(history.state)
    if (key === activeKey && href === activeHref) return
    const traversing = Boolean(key && key !== activeKey)
    const saved = key ? cache[key] : undefined
    // Scroll and click capture already own the outgoing position. Reading it
    // here could instead capture the browser's intervening fragment movement.
    cancelRestore()
    // A new native fragment may have null state or copy the outgoing state.
    if (!key || key === activeKey) key = newEntry()
    activeKey = key
    activeHref = href
    if (traversing) restore(saved)
    // Fresh anchors retain the browser's own target scrolling and focus.
  }
  const onPageHide = () => {
    // A pending destination still owns its saved position, not interim hash work.
    if (frame === undefined) snapshot()
    cancelRestore()
    persist()
  }
  const onPageShow = (event: PageTransitionEvent) => {
    if (!event.persisted) return
    activeKey = historyKey(history.state) || newEntry()
    activeHref = win.location.href
    history.scrollRestoration = 'manual'
    restore(cache[activeKey])
  }

  doc.addEventListener('scroll', onScroll, true)
  doc.addEventListener('click', onClick, true)
  win.addEventListener('popstate', onLocationChange)
  win.addEventListener('hashchange', onLocationChange)
  win.addEventListener('pagehide', onPageHide)
  win.addEventListener('pageshow', onPageShow)
  restore(cache[activeKey])

  return () => {
    alive = false
    if (frame === undefined) snapshot()
    cancelRestore()
    persist()
    doc.removeEventListener('scroll', onScroll, true)
    doc.removeEventListener('click', onClick, true)
    win.removeEventListener('popstate', onLocationChange)
    win.removeEventListener('hashchange', onLocationChange)
    win.removeEventListener('pagehide', onPageHide)
    win.removeEventListener('pageshow', onPageShow)
    history.scrollRestoration = previousRestoration
  }
}
