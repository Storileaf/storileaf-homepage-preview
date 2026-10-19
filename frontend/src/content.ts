import ledger from '../content/ledger.json'
import mediaLedger from '../content/media-ledger.json'

type RecordValue = { id: string; copy: string; status: string; public: boolean; source: string; href?: string | null; destination_state?: string }
const entries = new Map<string, RecordValue>([...ledger.records, ...mediaLedger.records.map(record => ({...mediaLedger.provenance, ...record}))].map(record => [record.id, record]))

export function approvedCopy(id: string): string {
  const item = entries.get(id)
  if (!item || !item.public || item.status !== 'founder_approved') throw new Error('Unapproved public copy: ' + id)
  return item.copy
}

export function verifiedHref(id: string): string | undefined {
  const item = entries.get(id)
  if (!item || item.destination_state !== 'existing_verified') return undefined
  return item.href ?? undefined
}
