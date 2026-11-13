import { useState, useCallback, useEffect } from 'react'

export const PROMPT_HISTORY_STORAGE_KEY = 'oa_prompt_history'
export const MAX_PROMPTS = 100
export const MAX_PROMPT_HISTORY_BYTES = 80_000
export const LONG_PROMPT_MIN_BYTES = 8_000
export const PROMPT_HISTORY_RETENTION_RULE =
  'When the library is full or over its storage budget, long prompts are removed first, largest first. Then the oldest regular prompts are removed. Favorites are kept until you remove them.'

const STORAGE_KEY = PROMPT_HISTORY_STORAGE_KEY

const textEncoder = typeof TextEncoder === 'undefined' ? null : new TextEncoder()

function sanitizePrompts(value) {
  if (!Array.isArray(value)) return []
  return value.filter(
    (prompt) => prompt && typeof prompt === 'object' && typeof prompt.text === 'string'
  )
}

export function estimatePromptBytes(prompt) {
  const json = JSON.stringify(prompt ?? null)
  return textEncoder ? textEncoder.encode(json).length : json.length * 2
}

function estimatePromptsBytes(prompts) {
  const json = JSON.stringify(prompts)
  return textEncoder ? textEncoder.encode(json).length : json.length * 2
}

function compareEvictionPriority(a, b) {
  const aBytes = estimatePromptBytes(a)
  const bBytes = estimatePromptBytes(b)
  const aIsLong = aBytes >= LONG_PROMPT_MIN_BYTES
  const bIsLong = bBytes >= LONG_PROMPT_MIN_BYTES

  if (aIsLong !== bIsLong) return aIsLong ? -1 : 1
  if (aIsLong) return bBytes - aBytes || (a.createdAt || 0) - (b.createdAt || 0)
  return (a.createdAt || 0) - (b.createdAt || 0)
}

function findNextToEvict(prompts) {
  const candidates = prompts.filter((prompt) => !prompt.favorite)
  if (candidates.length === 0) return null
  return [...candidates].sort(compareEvictionPriority)[0]
}

function applyRetentionLimits(prompts, protectedId) {
  let updated = [...prompts]

  if (updated.length > MAX_PROMPTS) {
    const protectedEntry = protectedId ? updated.find((prompt) => prompt.id === protectedId) : null
    const favorites = updated.filter((prompt) => prompt.favorite)
    const others = updated.filter((prompt) => !prompt.favorite)
    const roomForOthers = Math.max(MAX_PROMPTS - favorites.length, protectedEntry ? 1 : 0)
    const protectedIsOther = protectedEntry && !protectedEntry.favorite
    const unprotected = others.filter((prompt) => prompt.id !== protectedId)
    const slotsForUnprotected = Math.max(roomForOthers - (protectedIsOther ? 1 : 0), 0)
    const evictionOrder = [...unprotected].sort(compareEvictionPriority)
    const dropped = new Set(
      evictionOrder
        .slice(0, Math.max(unprotected.length - slotsForUnprotected, 0))
        .map((prompt) => prompt.id)
    )
    const keptOthers = others.filter((prompt) => !dropped.has(prompt.id))

    updated = [...favorites, ...keptOthers].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }

  const protectedEntry = protectedId ? updated.find((prompt) => prompt.id === protectedId) : null
  const protectedBytes = protectedEntry ? estimatePromptBytes(protectedEntry) : 0
  const protectedIsLong = protectedBytes >= LONG_PROMPT_MIN_BYTES

  while (true) {
    const totalBytes = estimatePromptsBytes(updated)

    if (!protectedIsLong && totalBytes <= MAX_PROMPT_HISTORY_BYTES) break
    if (protectedIsLong) {
      const otherBytes = totalBytes - protectedBytes
      if (otherBytes <= MAX_PROMPT_HISTORY_BYTES) break
    }

    const next = findNextToEvict(updated.filter((prompt) => prompt.id !== protectedId))
    if (!next) break
    updated = updated.filter((prompt) => prompt.id !== next.id)
  }

  return updated
}

function getUsage(prompts) {
  const sizeBytes = estimatePromptsBytes(prompts)
  const count = prompts.length
  const nextToEvict = findNextToEvict(prompts)
  const nextBytes = nextToEvict ? estimatePromptBytes(nextToEvict) : 0
  const percentUsed = Math.min(
    100,
    Math.round(Math.max((count / MAX_PROMPTS) * 100, (sizeBytes / MAX_PROMPT_HISTORY_BYTES) * 100))
  )

  return {
    count,
    maxEntries: MAX_PROMPTS,
    entriesRemaining: Math.max(MAX_PROMPTS - count, 0),
    sizeBytes,
    maxBytes: MAX_PROMPT_HISTORY_BYTES,
    bytesRemaining: Math.max(MAX_PROMPT_HISTORY_BYTES - sizeBytes, 0),
    percentUsed,
    isAtEntryLimit: count >= MAX_PROMPTS,
    isOverByteBudget: sizeBytes > MAX_PROMPT_HISTORY_BYTES,
    isOverCapacity: count > MAX_PROMPTS || sizeBytes > MAX_PROMPT_HISTORY_BYTES,
    longPromptMinBytes: LONG_PROMPT_MIN_BYTES,
    nextToEvict,
    nextToEvictId: nextToEvict?.id || null,
    nextToEvictBytes: nextBytes,
    nextToEvictReason: !nextToEvict
      ? null
      : nextBytes >= LONG_PROMPT_MIN_BYTES
        ? 'Long prompts are removed first when storage is full.'
        : 'This is the oldest regular prompt.',
    rule: PROMPT_HISTORY_RETENTION_RULE,
  }
}

function loadPrompts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizePrompts(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function savePrompts(prompts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Prompt history might be truncated.')
    } else {
      console.error('Error saving prompt history to localStorage:', error)
    }
  }
}

// Global listeners so multiple components (e.g. panel + runner) stay in sync
const listeners = new Set()
function notify() {
  listeners.forEach((fn) => fn())
}

/**
 * Hook to manage a reusable prompt library, independent of any single
 * agent — prompts can be saved while using one agent and reused with
 * another. Persisted in localStorage and capped at 100 entries plus a
 * byte budget. When storage is full, long prompts leave first, largest
 * first, then the oldest regular prompts. Favorites are never evicted;
 * if favorites alone fill the cap, the newest prompt is still retained
 * and the library may briefly exceed the limits. A newly saved long
 * prompt may temporarily exceed the byte budget so it does not evict a
 * shelf of short prompts; it becomes the first entry removed on the next
 * save.
 */
export function usePromptHistory() {
  const [prompts, setPrompts] = useState(loadPrompts)

  useEffect(() => {
    const sync = () => setPrompts(loadPrompts())
    listeners.add(sync)
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) sync()
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      listeners.delete(sync)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  /**
   * Save a new prompt to history.
   * @param {Object} params
   * @param {string} params.text - The prompt text
   * @param {string} [params.agentId] - Agent it was used/saved from
   * @param {string} [params.agentName] - Display name of that agent
   */
  const savePrompt = useCallback(({ text, agentId, agentName }) => {
    const trimmed = (text || '').trim()
    if (!trimmed) return null

    const current = loadPrompts()

    // Avoid saving an exact duplicate of the most recent entry
    if (current[0]?.text === trimmed) return current[0]

    const baseId = `prompt_${Date.now()}`
    let id = baseId
    let suffix = 1
    while (current.some((prompt) => prompt.id === id)) {
      id = `${baseId}_${suffix}`
      suffix += 1
    }

    const entry = {
      id,
      text: trimmed,
      agentId: agentId || null,
      agentName: agentName || null,
      favorite: false,
      createdAt: Date.now(),
    }

    const updated = applyRetentionLimits([entry, ...current], entry.id)

    savePrompts(updated)
    setPrompts(updated)
    notify()
    return entry
  }, [])

  const deletePrompt = useCallback((id) => {
    const updated = loadPrompts().filter((p) => p.id !== id)
    savePrompts(updated)
    setPrompts(updated)
    notify()
  }, [])

  const clearHistory = useCallback(() => {
    // Preserve favorites when clearing history
    const favoritesOnly = loadPrompts().filter((p) => p.favorite)
    savePrompts(favoritesOnly)
    setPrompts(favoritesOnly)
    notify()
  }, [])

  const toggleFavorite = useCallback((id) => {
    const updated = loadPrompts().map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    savePrompts(updated)
    setPrompts(updated)
    notify()
  }, [])

  const searchPrompts = useCallback(
    (query) => {
      if (!query || !query.trim()) return prompts
      const q = query.trim().toLowerCase()
      return prompts.filter(
        (p) =>
          p.text.toLowerCase().includes(q) || (p.agentName && p.agentName.toLowerCase().includes(q))
      )
    },
    [prompts]
  )

  const favorites = prompts.filter((p) => p.favorite)
  const usage = getUsage(prompts)

  return {
    prompts,
    favorites,
    savePrompt,
    deletePrompt,
    clearHistory,
    toggleFavorite,
    searchPrompts,
    usage,
    stats: usage,
    capacity: usage,
    nextToEvict: usage.nextToEvict,
    nextEviction: usage.nextToEvict,
    retentionRule: PROMPT_HISTORY_RETENTION_RULE,
    storageKey: STORAGE_KEY,
  }
}

export default usePromptHistory
