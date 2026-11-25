// A warning reference, not a detected browser quota. localStorage limits cannot
// be inferred from navigator.storage.estimate(), which measures the whole origin.
export const LOCAL_PLANNING_BYTES = 5 * 1024 * 1024

const GROUPS = [
  [
    /^OpenAgents_(?:openai|anthropic|gemini|openrouter)_key$|apikey|api_key|global_keys|encrypted_vault/i,
    'Credential storage',
  ],
  [/history|prompt_history/i, 'History and prompts'],
  [/^oa_analytics/, 'Analytics'],
  [/^oa_session_spend/, 'Spend records'],
  [/collection/i, 'Collections'],
  [/marketplace/i, 'Marketplace'],
  [/automation/i, 'Automations'],
  [/favou?rite/i, 'Favorites'],
  [/^(?:oa_|OpenAgents_)/, 'App preferences and other data'],
]

export function measureLocalStorage(getStorage = () => globalThis.localStorage) {
  try {
    const storage = getStorage()
    if (!storage) throw new Error('Storage unavailable')
    const groups = new Map()
    let totalBytes = 0
    let entryCount = 0
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index)
      if (key === null) continue
      const value = storage.getItem(key)
      if (value === null) continue // Another tab may remove an entry mid-snapshot.
      if (typeof key !== 'string' || typeof value !== 'string')
        throw new Error('Invalid storage entry')
      const bytes = 2 * (key.length + value.length)
      const label = GROUPS.find(([pattern]) => pattern.test(key))?.[1] || 'Other origin entries'
      const previous = groups.get(label) || { label, bytes: 0, entries: 0 }
      groups.set(label, { label, bytes: previous.bytes + bytes, entries: previous.entries + 1 })
      totalBytes += bytes
      entryCount++
    }
    // Only counts and fixed labels leave this function. Saved keys and values
    // are never returned, parsed, logged, transmitted, changed or deleted.
    return {
      status: 'available',
      totalBytes,
      entryCount,
      groups: [...groups.values()].sort(
        (a, b) => b.bytes - a.bytes || a.label.localeCompare(b.label)
      ),
    }
  } catch {
    return { status: 'unavailable', totalBytes: null, entryCount: null, groups: [] }
  }
}

export async function measureOriginStorage(storageManager) {
  try {
    if (storageManager === undefined) storageManager = globalThis.navigator?.storage
    if (typeof storageManager?.estimate !== 'function') return { status: 'unsupported' }
    const { usage, quota } = await storageManager.estimate()
    if (
      !Number.isFinite(usage) ||
      usage < 0 ||
      !Number.isFinite(quota) ||
      quota <= 0 ||
      usage > quota
    )
      return { status: 'unavailable' }
    return { status: 'available', usage, quota, fraction: usage / quota }
  } catch {
    return { status: 'unavailable' }
  }
}

export function formatStorageBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return 'Unavailable'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const index =
    bytes === 0
      ? 0
      : Math.max(0, Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024))))
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
