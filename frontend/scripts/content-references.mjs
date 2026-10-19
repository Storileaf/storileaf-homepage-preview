/** Verify the existing direct calls and literal content records used by sections. */
export function contentReferenceProblems(source, index, filename) {
  const problems = []
  const references = [
    ...source.matchAll(/\b(approvedCopy|verifiedHref|editorialTitle)\(\s*['"]([^'"]+)['"]\s*\)/g),
    ...source.matchAll(/\b(copyId|questionId|answerId|actionId|labelId|introId)\s*:\s*['"]([^'"]+)['"]/g),
  ]
  // Discovery's three bullets are data-driven, so each literal ID needs the
  // same check as a direct approvedCopy call. Dynamic arrays are not approved.
  for (const match of source.matchAll(/\bpointIds\s*:\s*\[([^\]]*)\]/g)) {
    const values = match[1].match(/['"][^'"]+['"]/g) ?? []
    if (!/^\s*(?:['"][^'"]+['"]\s*,\s*)*['"][^'"]+['"]\s*,?\s*$/.test(match[1])) problems.push('Point content references must use literal ledger IDs (' + filename + ')')
    for (const value of values) references.push([value, 'pointIds', value.slice(1, -1)])
  }
  if ([...source.matchAll(/\bpointIds\s*:/g)].length !== [...source.matchAll(/\bpointIds\s*:\s*\[/g)].length) problems.push('Point content references must declare their literal IDs (' + filename + ')')
  for (const [, method, id] of references) {
    const record = index.get(id)
    if (!record) problems.push('Unknown ledger ID in source ' + id + ' (' + filename + ')')
    const destination = method === 'verifiedHref' || method === 'actionId' || (method === 'labelId' && id.startsWith('shared.footer.books.'))
    if (destination && record && !record.destination_state) problems.push('Action reference used for non-destination ' + id)
  }
  return problems
}
