// Advisory title matches only: input metadata explains choices, not semantic equivalence.
const GENERIC = new Set(['ai', 'agent', 'assistant', 'bot', 'the', 'for', 'and', 'a', 'an'])
const text = (value) => (typeof value === 'string' ? value.trim() : '')
const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
function words(name) {
  return (
    text(name)
      .normalize('NFKC')
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) || []
  ).map((word) =>
    word.length > 3 && word.endsWith('s') && !/(ss|us|is)$/.test(word) ? word.slice(0, -1) : word
  )
}
function titleMatch(left, right) {
  if (!left.full.length || !right.full.length) return false
  if (left.full.join(' ') === right.full.join(' ')) return true
  const shared = [...left.terms].filter((term) => right.terms.has(term)).length
  return (
    shared >= 2 &&
    shared / Math.min(left.terms.size, right.terms.size) >= 2 / 3 &&
    shared / (left.terms.size + right.terms.size - shared) >= 0.5
  )
}
function fields(agent) {
  return (Array.isArray(agent.inputs) ? agent.inputs : [])
    .filter((input) => input && text(input.label))
    .map((input) => ({
      key: JSON.stringify([
        text(input.id),
        text(input.label),
        text(input.type),
        Array.isArray(input.options) ? input.options : [],
      ]),
      label: `${text(input.label)}${text(input.type) ? ` (${input.type})` : ''}`,
    }))
}

export function buildAgentNameContext(agents = []) {
  const unique = new Map()
  for (const agent of Array.isArray(agents) ? agents : []) {
    if (agent && text(agent.id) && text(agent.name) && !unique.has(agent.id))
      unique.set(agent.id, agent)
  }
  const rows = [...unique.values()]
    .sort((a, b) => order(a.id, b.id))
    .map((agent) => {
      const full = words(agent.name)
      return {
        agent,
        full,
        terms: new Set(full.filter((word) => !GENERIC.has(word))),
        fields: fields(agent),
        peers: [],
      }
    })
  // Index token pairs: one common word must not cause quadratic comparisons.
  const buckets = new Map()
  const fullTitles = new Map()
  for (const row of rows) {
    const candidates = new Set(fullTitles.get(row.full.join(' ')) || [])
    const terms = [...row.terms].sort(order)
    const keys = terms.flatMap((term, index) =>
      terms.slice(index + 1).map((other) => JSON.stringify([term, other]))
    )
    for (const key of keys)
      for (const candidate of buckets.get(key) || []) candidates.add(candidate)
    for (const other of candidates)
      if (titleMatch(row, other)) {
        row.peers.push(other)
        other.peers.push(row)
      }
    for (const key of keys) buckets.set(key, [...(buckets.get(key) || []), row])
    fullTitles.set(row.full.join(' '), [...(fullTitles.get(row.full.join(' ')) || []), row])
  }
  const result = new Map()
  for (const row of rows) {
    if (!row.peers.length) continue
    const peerFields = new Set(row.peers.flatMap((peer) => peer.fields.map((field) => field.key)))
    const distinctive = row.fields.filter((field) => !peerFields.has(field.key))
    const shown = distinctive.length ? distinctive : row.fields
    result.set(row.agent.id, {
      id: row.agent.id,
      inputContext: shown.length
        ? `${distinctive.length ? 'Distinct fields' : 'Inputs'}: ${shown
            .slice(0, 3)
            .map((field) => field.label)
            .join(' · ')}${shown.length > 3 ? ` · +${shown.length - 3} more` : ''}`
        : 'Input metadata unavailable',
      matches: row.peers
        .map((peer) => ({ id: peer.agent.id, name: peer.agent.name }))
        .sort((a, b) => order(a.name, b.name) || order(a.id, b.id)),
    })
  }
  return result
}
