// Authorised migrations carry forward only the explicitly listed homepage copy.
// Group 2 adds reassurance, the six FAQs and their final book invitation. It does not
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

/** Bounded fragments from the immutable homepage, never arbitrary source text. */
export function inheritedHomepageFragments(baselineHtml) {
  const text = value => typeof value === 'string'
    ? { copy: normalisePublishedCopy(value) } : undefined
  const match = (html, expression) => html.match(expression)?.[1]
  const link = html => {
    const anchor = html.match(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([^]*?)<\/a>/i)
    return anchor ? {
      copy: normalisePublishedCopy(anchor[2]),
      href: new URL(normalisePublishedCopy(anchor[1]), 'https://storileaf.github.io/storileaf-homepage-preview/').href,
    } : undefined
  }
  const gifting = match(baselineHtml, /<section\b[^>]*\bid="gifting"[^>]*>([^]*?)<\/section>/i) ?? ''
  const reassurance = match(baselineHtml, /<section\b[^>]*\bclass="trust-band"[^>]*>([^]*?)<\/section>/i) ?? ''
  const reassuranceLabel = match(baselineHtml, /<section\b[^>]*\bclass="trust-band"[^>]*\baria-label="([^"]+)"/i)
  const statements = [...reassurance.matchAll(/<div\b[^>]*\bclass="trust-band-item"[^>]*>([^]*?)<\/div>/gi)]
  const questions = match(baselineHtml, /<section\b[^>]*\bid="questions"[^>]*>([^]*?)<\/section>/i) ?? ''
  const invitation = match(questions, /<div\b[^>]*\bclass="final-invitation"[^>]*>([^]*)/i) ?? ''
  const fragments = {
    'home.gifting.title': text(match(gifting, /<h2\b[^>]*>([^]*?)<\/h2>/i)),
    'home.gifting.description': text(match(gifting, /<p\b[^>]*>([^]*?)<\/p>/i)),
    'home.gifting.cta': link(gifting),
    'home.reassurance.label': text(reassuranceLabel),
    'home.reassurance.schedule': text(statements[0]?.[1]),
    'home.reassurance.editorial': text(statements[1]?.[1]),
    'home.reassurance.payment': text(statements[2]?.[1]),
    'home.faq.title': text(match(questions, /<h2\b[^>]*\bid="faq-title"[^>]*>([^]*?)<\/h2>/i)),
    'home.faq.cta': link(questions),
    'home.invitation.intro': text(match(invitation, /<p\b[^>]*\bclass="final-invitation-intro"[^>]*>([^]*?)<\/p>/i)),
    'home.invitation.title': text(match(invitation, /<h2\b[^>]*>([^]*?)<\/h2>/i)),
    'home.invitation.cta': link(invitation),
  }
  const faqKeys = ['writer', 'gifting', 'time', 'media', 'choice', 'review']
  for (const [index, key] of faqKeys.entries()) {
    const detail = match(questions, new RegExp('<details\\b[^>]*\\bdata-testid="faq-' + index + '"[^>]*>([^]*?)<\\/details>', 'i')) ?? ''
    fragments['home.faq.' + key + '.question'] = text(match(detail, /<summary\b[^>]*>([^]*?)<\/summary>/i))
    fragments['home.faq.' + key + '.answer'] = text(match(detail, /<p\b[^>]*>([^]*?)<\/p>/i))
    if (['gifting', 'time', 'media', 'review'].includes(key)) fragments['home.faq.' + key + '.cta'] = link(detail)
  }
  return fragments
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
    fail('Inherited copy needs the authorised migration record and explanation')
  }
  if (/^home\.(reassurance|faq|invitation)\./.test(record.id) && record.migration_group !== 2) {
    fail('Group 2 inherited copy needs its explicit migration scope')
  }
  const fragment = inheritedHomepageFragments(baselineHtml)[record.id]
  // Ledger values render as React text. Decode markup/entities only in the
  // baseline HTML, or literal extra text in a ledger value could be concealed.
  const plainCopy = String(record.copy ?? '').replace(/\s+/gu, ' ').trim()
  if (!fragment || !fragment.copy) {
    fail('No permitted inherited homepage fragment')
  } else if (plainCopy !== fragment.copy) {
    fail('Inherited wording differs from the exact protected homepage fragment')
  }
  if (fragment?.href && (record.href !== fragment.href || record.destination_state !== 'existing_verified')) {
    fail('Inherited action must retain the exact resolved published destination')
  }
  if (fragment && !fragment.href && (record.href != null || record.destination_state != null)) {
    fail('Inherited reading copy must not gain a destination')
  }
  return problems
}
