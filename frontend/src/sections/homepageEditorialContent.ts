import ledger from '../../content/ledger.json'
import imageManifest from '../../content/images.json'
import { approvedCopy } from '../content'

/** Display emphasis is a substring of the approved full title, never replacement copy. */
export function editorialTitle(id: string) {
  const copy = approvedCopy(id)
  const record = ledger.records.find(item => item.id === id)
  const emphasis = record && 'emphasis' in record ? record.emphasis : undefined
  if (typeof emphasis !== 'string' || !copy.endsWith(emphasis)) {
    throw new Error('Approved editorial title emphasis is missing or inconsistent: ' + id)
  }
  return { title: copy.slice(0, -emphasis.length).trimEnd(), emphasis }
}

/** Keep the exact published photograph, accessible description and intrinsic size together. */
export function editorialImage(id: string) {
  const asset = imageManifest.assets.find(item => item.id === id)
  if (!asset) throw new Error('Homepage editorial image is missing: ' + id)
  return asset
}
