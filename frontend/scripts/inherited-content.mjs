// This migration carries forward the exact existing Gifting copy. It does not
// assign a new approval date or allow new wording to inherit an old approval.
export const inheritedHomepageBaseline = 'e9550069d91b5a9b48ade43fcfb0a71bbed2875b'
export const inheritedHomepageReference = 'https://github.com/Storileaf/storileaf-homepage-preview/blob/' + inheritedHomepageBaseline + '/index.html'

const entities = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201c', rdquo: '\u201d',
  ndash: '\u2013', mdash: '\u2014', hellip: '\u2026'
}

export function normalisePublishedCopy(value) {
  return String(value ?? '')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, entity) => {
      if (!entity.startsWith('#')) return entities[entity] ?? whole
      const point = entity[1].toLowerCase() === 'x'
        ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10)
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point) : whole
    })
    .replace(/\s+/gu, ' ')
    .trim()
}

export function inheritedHomepageProblems(record, baselineHtml) {
  const problems = []
  const fail = message => problems.push(message + ' ' + record.id)
  if (record.approval_kind !== 'inherited_published_homepage' || record.public !== true || record.status !== 'founder_approved') {
    fail('Invalid inherited published approval state')
  }
  if (record.baseline_commit !== inheritedHomepageBaseline || record.approval_reference !== inheritedHomepageReference) {
    fail('Inherited copy must identify the protected homepage baseline and exact file')
  }
  if (Object.hasOwn(record, 'approved_on')) fail('Inherited copy must not invent an original approval date')
  if (record.migration_recorded_on !== '2026-10-19' || !record.approval_note?.trim()) {
    fail('Inherited copy needs the Group 1 migration record and explanation')
  }

  const gifting = baselineHtml.match(/<section\b[^>]*\bid="gifting"[^>]*>([^]*?)<\/section>/i)?.[1] ?? ''
  const fragments = {
    'home.gifting.title': gifting.match(/<h2\b[^>]*>([^]*?)<\/h2>/i)?.[1],
    'home.gifting.description': gifting.match(/<p\b[^>]*>([^]*?)<\/p>/i)?.[1],
    'home.gifting.cta': gifting.match(/<a\b[^>]*>([^]*?)<\/a>/i)?.[1]
  }
  const fragment = fragments[record.id]
  if (typeof fragment !== 'string') {
    fail('No permitted inherited homepage fragment')
  } else if (normalisePublishedCopy(record.copy) !== normalisePublishedCopy(fragment)) {
    fail('Inherited wording differs from the exact protected homepage fragment')
  }
  return problems
}
