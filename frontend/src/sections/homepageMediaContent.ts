import manifest from '../../content/media-images.json'
import ledger from '../../content/media-ledger.json'
import { approvedCopy } from '../content'
export const galleryImages = manifest.assets
export function mediaTitle(id: string) {
  const text = approvedCopy(id)
  const record = ledger.records.find(item => item.id === id)
  const emphasis = record && 'emphasis' in record ? record.emphasis : undefined
  if (typeof emphasis !== 'string' || !text.endsWith(emphasis)) throw new Error('Missing media title emphasis')
  return { title: text.slice(0, -emphasis.length).trimEnd(), emphasis }
}
export const gallerySrc = (file: string) => import.meta.env.BASE_URL + file
