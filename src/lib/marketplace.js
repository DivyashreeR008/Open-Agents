/**
 * Agent Marketplace storage layer.
 *
 * Published agents, import counts, and ratings live in localStorage so the
 * marketplace works fully client side, matching how favorites and collections
 * already persist in this app. Every function is storage-failure safe: a
 * blocked or full localStorage degrades to an empty marketplace instead of
 * throwing.
 */

const LISTINGS_KEY = 'oa_marketplace_listings'
const DRAFTS_KEY = 'oa_marketplace_drafts'
const VOTES_KEY = 'oa_marketplace_votes'

export const MARKETPLACE_CATEGORIES = [
  'Data Processing',
  'Content Generation',
  'Research',
]

// Config keys that must never be published as-is
const CREDENTIAL_KEY_PATTERN = /(api[_-]?key|token|secret|password|credential|auth)/i

/**
 * Deep-copy an agent config, replacing the value of any credential-like field
 * with an explicit placeholder. Returns { config, sanitizedFields } where
 * sanitizedFields lists the dotted paths that were replaced.
 * @param {object} config
 * @returns {{ config: object, sanitizedFields: string[] }}
 */
export function sanitizeAgentConfig(config) {
  const sanitizedFields = []

  const walk = (value, path) => {
    if (Array.isArray(value)) return value.map((v, i) => walk(v, `${path}[${i}]`))
    if (value && typeof value === 'object') {
      const out = {}
      for (const [key, v] of Object.entries(value)) {
        const childPath = path ? `${path}.${key}` : key
        if (CREDENTIAL_KEY_PATTERN.test(key) && typeof v === 'string' && v !== '') {
          out[key] = `YOUR_${key.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_HERE`
          sanitizedFields.push(childPath)
        } else {
          out[key] = walk(v, childPath)
        }
      }
      return out
    }
    return value
  }

  return { config: walk(config ?? {}, ''), sanitizedFields }
}

/**
 * Publish an agent to the marketplace. The config is always sanitized before
 * it is stored.
 * @param {{ name: string, description: string, tags: string[], category: string, readme?: string, author?: string, config: object }} entry
 * @returns {object} the stored listing
 */
export function publishAgent(entry) {
  const { config, sanitizedFields } = sanitizeAgentConfig(entry.config)
  const listing = {
    id: `mkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: String(entry.name ?? '').trim(),
    description: String(entry.description ?? '').trim(),
    tags: (entry.tags ?? []).map((t) => String(t).trim()).filter(Boolean).slice(0, 8),
    category: MARKETPLACE_CATEGORIES.includes(entry.category) ? entry.category : MARKETPLACE_CATEGORIES[0],
    readme: entry.readme ? String(entry.readme) : '',
    author: String(entry.author ?? 'Anonymous').trim() || 'Anonymous',
    config,
    sanitizedFields,
    importCount: 0,
    ratingTotal: 0,
    ratingCount: 0,
    publishedAt: new Date().toISOString(),
  }
  const listings = loadListings()
  listings.unshift(listing)
  saveJson(LISTINGS_KEY, listings)
  return listing
}

/**
 * All published listings, newest first.
 * @returns {Array<object>}
 */
export function loadListings() {
  const listings = loadJson(LISTINGS_KEY, [])
  return Array.isArray(listings) ? listings.map(normalizeListing) : []
}

export function normalizeListing(listing) {
  if (!listing || typeof listing !== 'object') return listing
  return {
    ...listing,
    tags: Array.isArray(listing.tags)
      ? listing.tags.filter((t) => typeof t === 'string')
      : [],
    sanitizedFields: Array.isArray(listing.sanitizedFields) ? listing.sanitizedFields : [],
    importCount: typeof listing.importCount === 'number' ? listing.importCount : 0,
  }
}

/**
 * Import a listing into the local workspace as a draft. The draft keeps the
 * sanitized config and flags which credential fields still need real values,
 * so it cannot run until the user fills them in.
 * @param {string} listingId
 * @returns {object|null} the created draft, or null when the listing is gone
 */
export function importAgent(listingId) {
  const listings = loadListings()
  const listing = listings.find((l) => l.id === listingId)
  if (!listing) return null

  const flagged = Array.isArray(listing.sanitizedFields)
    ? listing.sanitizedFields.filter((f) => typeof f === 'string')
    : []

  const draft = {
    id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sourceListingId: listing.id,
    name: `${listing.name} (imported)`,
    description: listing.description,
    tags: [...listing.tags],
    config: JSON.parse(JSON.stringify(listing.config ?? {})),
    pendingCredentialFields: flagged,
    readyToRun: flagged.length === 0,
    importedAt: new Date().toISOString(),
  }

  const drafts = loadDrafts()
  drafts.unshift(draft)
  saveJson(DRAFTS_KEY, drafts)

  listing.importCount = (listing.importCount ?? 0) + 1
  saveJson(LISTINGS_KEY, listings)

  return draft
}

const DRAFT_PROVIDERS = ['openai', 'anthropic', 'gemini', 'openrouter', 'any']
const PLACEHOLDER_PATTERN = /^YOUR_[A-Z0-9_]+_HERE$/

function normalizeDraft(draft) {
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) return null
  if (typeof draft.id !== 'string' || !draft.id) return null

  const config =
    draft.config && typeof draft.config === 'object' && !Array.isArray(draft.config)
      ? draft.config
      : {}
  const pending = Array.isArray(draft.pendingCredentialFields)
    ? draft.pendingCredentialFields.filter((f) => typeof f === 'string' && f)
    : []

  return {
    ...draft,
    name: typeof draft.name === 'string' && draft.name.trim() ? draft.name : 'Imported agent',
    description: typeof draft.description === 'string' ? draft.description : '',
    tags: Array.isArray(draft.tags) ? draft.tags.filter((t) => typeof t === 'string') : [],
    config,
    pendingCredentialFields: pending,
    readyToRun: pending.length === 0,
    importedAt: typeof draft.importedAt === 'string' ? draft.importedAt : '',
  }
}

/**
 * Imported drafts, newest first. Entries that are not usable drafts (wrong
 * shape, no id) are skipped so one bad record cannot break the list.
 * @returns {Array<object>}
 */
export function loadDrafts() {
  const drafts = loadJson(DRAFTS_KEY, [])
  return Array.isArray(drafts) ? drafts.map(normalizeDraft).filter(Boolean) : []
}

/**
 * @param {string} draftId
 * @returns {object|null}
 */
export function getDraft(draftId) {
  return loadDrafts().find((d) => d.id === draftId) ?? null
}

/**
 * Delete an imported draft. The source listing and its import count are left
 * alone.
 * @param {string} draftId
 * @returns {boolean} true when a draft was removed
 */
export function removeDraft(draftId) {
  const drafts = loadDrafts()
  const next = drafts.filter((d) => d.id !== draftId)
  if (next.length === drafts.length) return false
  saveJson(DRAFTS_KEY, next)
  return true
}

/**
 * Ids of the listings that currently have at least one draft in the workspace.
 * @returns {Set<string>}
 */
export function getImportedListingIds() {
  return new Set(
    loadDrafts()
      .map((d) => d.sourceListingId)
      .filter((id) => typeof id === 'string')
  )
}

/**
 * Flagged credential fields that still have no real value. Values are only
 * held by the caller (in memory); they are never written back to the drafts
 * store. A blank value or an untouched YOUR_..._HERE placeholder counts as
 * missing.
 * @param {object} draft
 * @param {Record<string, string>} values
 * @returns {string[]}
 */
export function getMissingDraftFields(draft, values = {}) {
  return (draft?.pendingCredentialFields ?? []).filter((field) => {
    const value = typeof values[field] === 'string' ? values[field].trim() : ''
    return !value || PLACEHOLDER_PATTERN.test(value)
  })
}

/**
 * Turn a draft into something AgentRunner can run: the base agent it was
 * published from, with the draft's name, provider and system prompt on top.
 * The base agent id is kept so history and ratings stay attached to a real
 * agent. Returns null when the base agent is no longer in the catalogue.
 * @param {object} draft
 * @param {Array<object>} agents
 * @returns {object|null}
 */
export function buildDraftAgent(draft, agents) {
  const baseId = draft?.config?.baseAgentId
  const base = Array.isArray(agents) ? agents.find((a) => a.id === baseId) : null
  if (!base) return null

  const { provider, systemPrompt } = draft.config
  return {
    ...base,
    name: draft.name,
    description: draft.description || base.description,
    provider: DRAFT_PROVIDERS.includes(provider) ? provider : base.provider,
    systemPrompt:
      typeof systemPrompt === 'string' && systemPrompt.trim() ? systemPrompt : base.systemPrompt,
  }
}

/**
 * Rate a listing 1 to 5 stars. One vote per user per agent: re-rating
 * replaces the previous vote instead of adding a second one.
 * @param {string} listingId
 * @param {number} stars 1..5
 * @returns {{ average: number, count: number }|null}
 */
export function rateAgent(listingId, stars) {
  const value = Math.min(5, Math.max(1, Math.round(stars)))
  const listings = loadListings()
  const listing = listings.find((l) => l.id === listingId)
  if (!listing) return null

  const votes = loadJson(VOTES_KEY, {})
  const previous = votes[listingId]

  if (previous) {
    listing.ratingTotal = listing.ratingTotal - previous + value
  } else {
    listing.ratingTotal = (listing.ratingTotal ?? 0) + value
    listing.ratingCount = (listing.ratingCount ?? 0) + 1
  }
  votes[listingId] = value

  saveJson(LISTINGS_KEY, listings)
  saveJson(VOTES_KEY, votes)
  return { average: getAverageRating(listing), count: listing.ratingCount }
}

/**
 * The current user's vote for a listing, or null.
 * @param {string} listingId
 * @returns {number|null}
 */
export function getUserVote(listingId) {
  const votes = loadJson(VOTES_KEY, {})
  return votes[listingId] ?? null
}

/**
 * Average rating to one decimal, 0 when unrated.
 * @param {object} listing
 * @returns {number}
 */
export function getAverageRating(listing) {
  if (!listing?.ratingCount) return 0
  return Math.round((listing.ratingTotal / listing.ratingCount) * 10) / 10
}

/**
 * Filter listings by free-text search (name and tags) and category.
 * @param {Array<object>} listings
 * @param {{ search?: string, category?: string }} filters
 * @returns {Array<object>}
 */
export function filterListings(listings, { search = '', category = '' } = {}) {
  const q = search.trim().toLowerCase()
  return listings.filter((l) => {
    if (category && l.category !== category) return false
    if (!q) return true
    const tags = Array.isArray(l.tags) ? l.tags : []
    return (
      String(l.name || '').toLowerCase().includes(q) ||
      tags.some((t) => String(t).toLowerCase().includes(q))
    )
  })
}

function loadJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? 'null')
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable or full; the UI keeps its in-memory state
  }
}
