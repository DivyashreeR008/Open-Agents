export const RECENT_AGENTS_KEY = 'oa_recent_agents'
export const HISTORY_KEY = 'OpenAgents_history'
export const MAX_RECENT_AGENTS = 8

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeEntry(entry) {
  if (!isRecord(entry) || typeof entry.id !== 'string' || !entry.id) return null
  return {
    id: entry.id,
    name: typeof entry.name === 'string' && entry.name ? entry.name : entry.id,
    category: typeof entry.category === 'string' ? entry.category : '',
    lastUsedAt: Number.isFinite(Number(entry.lastUsedAt)) ? Number(entry.lastUsedAt) : null,
  }
}

export function sanitizeRecentAgents(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  return value
    .map(normalizeEntry)
    .filter((entry) => entry && !seen.has(entry.id) && seen.add(entry.id))
    .slice(0, MAX_RECENT_AGENTS)
}

export function buildRecentAgentsFromHistory(runs = []) {
  if (!Array.isArray(runs)) return []
  const seen = new Set()
  return runs
    .filter(
      (run) => isRecord(run) && run.agentId && !seen.has(run.agentId) && seen.add(run.agentId)
    )
    .slice(0, MAX_RECENT_AGENTS)
    .map((run) =>
      normalizeEntry({
        id: run.agentId,
        name: run.agentName || run.agentId,
        category: run.agentCategory || run.category || '',
        lastUsedAt: run.timestamp,
      })
    )
    .filter(Boolean)
}

export function persistRecentAgents(entries) {
  try {
    localStorage.setItem(RECENT_AGENTS_KEY, JSON.stringify(sanitizeRecentAgents(entries)))
    return true
  } catch {
    return false
  }
}

export function loadRecentAgents() {
  try {
    const raw = localStorage.getItem(RECENT_AGENTS_KEY)
    if (raw !== null) {
      return sanitizeRecentAgents(JSON.parse(raw))
    }

    // One-time migration for browsers that already have run history but no
    // index. After this write, page entry only reads the small index.
    const historyRaw = localStorage.getItem(HISTORY_KEY)
    if (!historyRaw) return []
    const history = JSON.parse(historyRaw)
    const migrated = buildRecentAgentsFromHistory(history)
    persistRecentAgents(migrated)
    return migrated
  } catch {
    return []
  }
}

export function recordRecentAgent(run) {
  if (!run?.agentId) return loadRecentAgents()
  const current = loadRecentAgents()
  const next = sanitizeRecentAgents([
    {
      id: run.agentId,
      name: run.agentName || run.agentId,
      category: run.agentCategory || run.category || '',
      lastUsedAt: run.timestamp ?? Date.now(),
    },
    ...current.filter((entry) => entry.id !== run.agentId),
  ])
  persistRecentAgents(next)
  return next
}

export function replaceRecentAgentsFromHistory(runs) {
  const next = buildRecentAgentsFromHistory(runs)
  persistRecentAgents(next)
  return next
}

export function clearRecentAgents() {
  try {
    localStorage.removeItem(RECENT_AGENTS_KEY)
  } catch {
    // Storage may be unavailable; callers still clear their in-memory copy.
  }
}
