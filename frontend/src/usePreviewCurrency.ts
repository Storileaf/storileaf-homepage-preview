import { useEffect, useState } from 'react'
import type { Currency } from './components/NewsletterFooter'

const preferenceKey = 'storileaf.preview.currency'
const isCurrency = (value: string | null): value is Currency =>
  value === 'inr' || value === 'usd' || value === 'cad' || value === 'gbp'

/** Preserve the published homepage's INR first render and guarded preference.
 * Storage is optional. A blocked or invalid preference leaves the default intact.
 */
export function usePreviewCurrency(): readonly [Currency, (currency: Currency) => void] {
  const [currency, setCurrency] = useState<Currency>('inr')
  useEffect(() => {
    try {
      const saved = localStorage.getItem(preferenceKey)
      if (isCurrency(saved)) setCurrency(saved)
    } catch { /* The current page remains usable when storage is unavailable. */ }
  }, [])
  const changeCurrency = (value: Currency) => {
    setCurrency(value)
    try { localStorage.setItem(preferenceKey, value) } catch { /* Optional persistence. */ }
  }
  return [currency, changeCurrency]
}
