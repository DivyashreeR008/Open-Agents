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

export const MARKETPLACE_CATEGORIES = ['Data Processing', 'Content Generation', 'Research']

export const MARKETPLACE_SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'imports', label: 'Most imported' },
]

// Field names that describe configuration rather than a secret value.
// A count or limit is not made secret by containing the word token or key.
const NON_SECRET_SUFFIXES = new Set([
  'count',
  'limit',
  'length',
  'max',
  'min',
  'total',
  'usage',
  'budget',
  'estimate',
  'price',
  'cost',
  'type',
  'name',
])
const NON_SECRET_PREFIXES = new Set(['max', 'min', 'num', 'total', 'limit'])
const CREDENTIAL_WORDS = new Set([
  'password',
  'passwd',
  'secret',
  'credential',
  'credentials',
  'authorization',
])

function keySegments(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function isCredentialField(key) {
  const segments = keySegments(key)
  if (!segments.length) return false
  if (segments.some((segment) => CREDENTIAL_WORDS.has(segment))) return true

  return segments.some((segment, index) => {
    if (segment !== 'key' && segment !== 'token') return false
    const next = segments[index + 1]
    const previous = segments[index - 1]
    if (next && NON_SECRET_SUFFIXES.has(next)) return false
    if (previous && NON_SECRET_PREFIXES.has(previous)) return false
    return true
  })
}

function normalizeTags(tags, { stringify = false } = {}) {
  const seen = new Set()
  return (Array.isArray(tags) ? tags : [])
    .filter((tag) => stringify || typeof tag === 'string')
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .filter((tag) => {
      const key = tag.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 8)
}

/**
 * Deep-copy an agent config, replacing the value of any credential-like field
 * with an explicit placeholder. Returns { config, sanitizedFields } where
 * sanitizedFields lists the dotted paths that were replaced.
 * @param {object} config
 * @returns {{ config: object, sanitizedFields: string[] }}
 */
export function sanitizeAgentConfig(config) {
  const sanitizedFields = []
  const seen = new WeakMap()

  const walk = (value, path) => {
    if (Array.isArray(value)) {
      if (seen.has(value)) return seen.get(value)
      const out = []
      seen.set(value, out)
      value.forEach((v, i) => out.push(walk(v, `${path}[${i}]`)))
      return out
    }
    if (value && typeof value === 'object') {
      if (seen.has(value)) return seen.get(value)
      const out = {}
      seen.set(value, out)
      for (const [key, v] of Object.entries(value)) {
        const childPath = path ? `${path}.${key}` : key
        if (isCredentialField(key) && typeof v === 'string' && v !== '') {
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
 * Copy the complete runnable definition of an agent for storage in a listing.
 * The snapshot is serializable and independent of the live catalogue, so an
 * imported listing keeps its inputs, model, defaults, and output settings even
 * when the source definition changes or disappears.
 * @param {object} agent
 * @returns {object|null}
 */
export function createAgentSnapshot(agent) {
  if (!agent || typeof agent !== 'object' || Array.isArray(agent)) return null
  try {
    return JSON.parse(JSON.stringify(agent))
  } catch {
    return null
  }
}

/**
 * Publish an agent to the marketplace. The config is always sanitized before
 * it is stored. New publish flows should include an `agentSnapshot` in the
 * config, created with createAgentSnapshot, so the listing is self-contained.
 * @param {{ name: string, description: string, tags: string[], category: string, readme?: string, author?: string, config: object }} entry
 * @returns {object} the stored listing
 */
export function publishAgent(entry) {
  const safeEntry = entry && typeof entry === 'object' && !Array.isArray(entry) ? entry : {}
  const { config, sanitizedFields } = sanitizeAgentConfig(safeEntry.config)
  const listing = {
    id: `mkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: String(safeEntry.name ?? '').trim(),
    description: String(safeEntry.description ?? '').trim(),
    tags: normalizeTags(safeEntry.tags, { stringify: true }),
    category: MARKETPLACE_CATEGORIES.includes(safeEntry.category)
      ? safeEntry.category
      : MARKETPLACE_CATEGORIES[0],
    readme: safeEntry.readme ? String(safeEntry.readme) : '',
    author: String(safeEntry.author ?? 'Anonymous').trim() || 'Anonymous',
    config,
    sanitizedFields,
    importCount: 0,
    ratingTotal: 0,
    ratingCount: 0,
    publishedAt: new Date().toISOString(),
  }
  const listings = loadListings()
  listings.unshift(listing)
  const persisted = saveJson(LISTINGS_KEY, listings)
  return { ...listing, persisted }
}

/**
 * All published listings, newest first.
 * @returns {Array<object>}
 */
export function loadListings() {
  const listings = loadJson(LISTINGS_KEY, [])
  const normalized = Array.isArray(listings) ? listings.map(normalizeListing).filter(Boolean) : []
  return reconcileListingsWithVotes(normalized)
}

const isRating = (value) => Number.isInteger(value) && value >= 1 && value <= 5

export function normalizeListing(listing) {
  if (!listing || typeof listing !== 'object' || Array.isArray(listing)) return null
  const id = typeof listing.id === 'string' ? listing.id.trim() : ''
  if (!id) return null

  const rawCount = Number.isFinite(listing.ratingCount) ? Math.floor(listing.ratingCount) : 0
  const rawTotal = Number.isFinite(listing.ratingTotal) ? listing.ratingTotal : 0
  const ratingCount = rawCount > 0 ? rawCount : 0
  // Total must be reachable by whole-star votes. If it is not, reset both
  // fields rather than render an average that no set of ratings could produce.
  const aggregateIsPlausible =
    ratingCount > 0 && rawTotal >= ratingCount && rawTotal <= ratingCount * 5
  const ratingTotal = aggregateIsPlausible ? rawTotal : 0

  return {
    ...listing,
    id,
    name:
      typeof listing.name === 'string' && listing.name.trim()
        ? listing.name.trim()
        : 'Untitled listing',
    description: typeof listing.description === 'string' ? listing.description : '',
    tags: normalizeTags(listing.tags),
    category:
      typeof listing.category === 'string' && listing.category
        ? listing.category
        : MARKETPLACE_CATEGORIES[0],
    readme: typeof listing.readme === 'string' ? listing.readme : '',
    author:
      typeof listing.author === 'string' && listing.author.trim()
        ? listing.author.trim()
        : 'Anonymous',
    config:
      listing.config && typeof listing.config === 'object' && !Array.isArray(listing.config)
        ? listing.config
        : {},
    sanitizedFields: Array.isArray(listing.sanitizedFields)
      ? listing.sanitizedFields.filter((field) => typeof field === 'string' && field)
      : [],
    importCount:
      Number.isFinite(listing.importCount) && listing.importCount > 0
        ? Math.floor(listing.importCount)
        : 0,
    ratingCount: aggregateIsPlausible ? ratingCount : 0,
    ratingTotal,
    publishedAt: typeof listing.publishedAt === 'string' ? listing.publishedAt : '',
  }
}

function loadVotes() {
  const votes = loadJson(VOTES_KEY, {})
  return votes && typeof votes === 'object' && !Array.isArray(votes) ? votes : {}
}

function reconcileListingsWithVotes(listings) {
  const votes = loadVotes()
  let listingsChanged = false
  const nextListings = listings.map((listing) => {
    const vote = votes[listing.id]
    if (!isRating(vote)) return listing
    if (listing.ratingCount > 0) return listing
    // A personal vote without an aggregate is a partial write or a cleared
    // listing record. Rebuild the smallest consistent aggregate from the vote.
    listingsChanged = true
    return { ...listing, ratingCount: 1, ratingTotal: vote }
  })

  if (listingsChanged) {
    saveJson(LISTINGS_KEY, nextListings)
  }

  const listingIds = new Set(nextListings.map((listing) => listing.id))
  const nextVotes = Object.fromEntries(
    Object.entries(votes).filter(([id, vote]) => listingIds.has(id) && isRating(vote))
  )
  if (Object.keys(nextVotes).length !== Object.keys(votes).length) {
    saveJson(VOTES_KEY, nextVotes)
  }

  return nextListings
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

  const drafts = loadDrafts()
  const existing = drafts.find((draft) => draft.sourceListingId === listing.id)
  if (existing) {
    // Importing the same listing twice creates duplicate drafts and inflates
    // its import count. Reuse the existing draft and let the caller say so.
    return { ...existing, alreadyImported: true }
  }

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

  if (!saveJson(DRAFTS_KEY, [draft, ...drafts])) {
    return { ...draft, persisted: false }
  }

  const nextListings = listings.map((item) =>
    item.id === listing.id ? { ...item, importCount: item.importCount + 1 } : item
  )
  if (!saveJson(LISTINGS_KEY, nextListings)) {
    // Do not leave a draft whose source count was never recorded.
    saveJson(DRAFTS_KEY, drafts)
    return { ...draft, persisted: false }
  }

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
  return saveJson(DRAFTS_KEY, next)
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

const hasCompleteSnapshot = (snapshot) =>
  Boolean(snapshot) &&
  typeof snapshot.id === 'string' &&
  Boolean(snapshot.id) &&
  Array.isArray(snapshot.inputs) &&
  typeof snapshot.systemPrompt === 'string'

/**
 * Turn a draft into something AgentRunner can run. Newer listings carry an
 * agentSnapshot with the complete definition; older listings only carry the
 * base id, provider, instructions, and output type, so the live catalogue is
 * still used as a fallback. The original id is preserved so history and
 * ratings stay attached to a real agent.
 * @param {object} draft
 * @param {Array<object>} agents
 * @returns {object|null}
 */
export function buildDraftAgent(draft, agents) {
  const config =
    draft?.config && typeof draft.config === 'object' && !Array.isArray(draft.config)
      ? draft.config
      : {}
  const baseId = config.baseAgentId
  const base = Array.isArray(agents) ? agents.find((a) => a.id === baseId) : null
  const snapshot =
    config.agentSnapshot &&
    typeof config.agentSnapshot === 'object' &&
    !Array.isArray(config.agentSnapshot)
      ? config.agentSnapshot
      : null
  const source = hasCompleteSnapshot(snapshot) ? { ...(base || {}), ...snapshot } : base
  if (!source) return null

  const provider = [config.provider, source.provider, base?.provider, 'openai'].find((value) =>
    DRAFT_PROVIDERS.includes(value)
  )
  const systemPrompt =
    [config.systemPrompt, source.systemPrompt, base?.systemPrompt].find(
      (value) => typeof value === 'string' && value.trim()
    ) ?? ''

  return {
    ...source,
    inputs: Array.isArray(source.inputs) ? source.inputs : [],
    name: draft.name,
    description: draft.description || source.description,
    provider: provider ?? 'openai',
    systemPrompt,
  }
}

/**
 * Rate a listing 1 to 5 stars, or retract the current vote with null or 0.
 * One vote per user per agent: re-rating replaces the previous vote instead of
 * adding a second one, and retracting removes it from both the vote count and
 * the running total.
 * @param {string} listingId
 * @param {number|null} stars 1..5, or null/0 to remove the vote
 * @returns {{ average: number, count: number, vote: number|null }|null}
 */
function ratingBase(listing, previous) {
  const count = Math.max(0, Math.floor(Number(listing?.ratingCount) || 0))
  const total = Math.max(0, Number(listing?.ratingTotal) || 0)
  if (count === 0) return { total: 0, count: 0 }
  if (previous) {
    // Remove the viewer's previous vote only when the aggregate can contain
    // it. A total below the vote means the two stores already disagree, so
    // rebuilding from the new vote is safer than subtracting into a negative.
    if (total < previous) return { total: 0, count: 0 }
    const withoutTotal = total - previous
    const withoutCount = count - 1
    if (withoutCount > 0 && (withoutTotal < withoutCount || withoutTotal > withoutCount * 5)) {
      return { total: 0, count: 0 }
    }
    return { total: withoutTotal, count: withoutCount }
  }
  if (total < count || total > count * 5) return { total: 0, count: 0 }
  return { total, count }
}

export function rateAgent(listingId, stars) {
  const listings = loadListings()
  const listing = listings.find((l) => l.id === listingId)
  if (!listing) return null

  const votes = loadVotes()
  const rawPrevious = votes[listingId]
  const previous = isRating(rawPrevious) ? rawPrevious : null
  const clearing = stars === null || stars === undefined || Number(stars) === 0

  if (clearing && rawPrevious === undefined) {
    return { average: getAverageRating(listing), count: listing.ratingCount, vote: null }
  }

  const numeric = Number(stars)
  if (!clearing && !Number.isFinite(numeric)) return null
  const value = clearing ? null : Math.min(5, Math.max(1, Math.round(numeric)))

  if (previous === value && rawPrevious === value) {
    return { average: getAverageRating(listing), count: listing.ratingCount, vote: value }
  }

  const base = ratingBase(listing, previous)
  const nextListing = {
    ...listing,
    ratingTotal: base.total + (value ?? 0),
    ratingCount: base.count + (value === null ? 0 : 1),
  }
  const nextVotes = { ...votes }
  if (value === null) delete nextVotes[listingId]
  else nextVotes[listingId] = value

  if (!saveJson(VOTES_KEY, nextVotes)) return null

  const nextListings = listings.map((item) => (item.id === listingId ? nextListing : item))
  if (!saveJson(LISTINGS_KEY, nextListings)) {
    // Put the personal vote back so a failed aggregate write does not leave
    // the two stores diverged by this operation.
    saveJson(VOTES_KEY, votes)
    return null
  }

  return {
    average: getAverageRating(nextListing),
    count: nextListing.ratingCount,
    vote: value,
  }
}

/**
 * Every valid personal vote, keyed by listing id. Callers that render a list
 * of cards should read this once instead of asking storage per card.
 * @returns {Record<string, number>}
 */
export function loadUserVotes() {
  return Object.fromEntries(Object.entries(loadVotes()).filter(([, vote]) => isRating(vote)))
}

/**
 * The current user's vote for a listing, or null.
 * @param {string} listingId
 * @returns {number|null}
 */
export function getUserVote(listingId) {
  const vote = loadVotes()[listingId]
  return isRating(vote) ? vote : null
}

/**
 * Average rating to one decimal, 0 when unrated or the stored total is not a
 * finite number.
 * @param {object} listing
 * @returns {number}
 */
export function getAverageRating(listing) {
  const total = Number(listing?.ratingTotal)
  const count = Number(listing?.ratingCount)
  if (!Number.isFinite(total) || !Number.isFinite(count) || count <= 0 || total <= 0) return 0
  if (total < count || total > count * 5) return 0
  return Math.round((total / count) * 10) / 10
}

/**
 * Filter listings by free-text search (name and tags) and category.
 * @param {Array<object>} listings
 * @param {{ search?: string, category?: string }} filters
 * @returns {Array<object>}
 */
export function filterListings(listings, { search = '', category = '' } = {}) {
  const q = search.trim().toLowerCase()
  const safeListings = Array.isArray(listings) ? listings : []
  return safeListings.filter((l) => {
    if (!l || typeof l !== 'object') return false
    if (category && l.category !== category) return false
    if (!q) return true
    const tags = Array.isArray(l.tags) ? l.tags : []
    return (
      String(l.name || '')
        .toLowerCase()
        .includes(q) ||
      String(l.author || '')
        .toLowerCase()
        .includes(q) ||
      String(l.description || '')
        .toLowerCase()
        .includes(q) ||
      tags.some((t) => String(t).toLowerCase().includes(q))
    )
  })
}

function publishedTime(listing) {
  const parsed = Date.parse(listing?.publishedAt ?? '')
  return Number.isFinite(parsed) ? parsed : null
}

function compareNewest(a, b) {
  const aTime = publishedTime(a)
  const bTime = publishedTime(b)
  if (aTime === null && bTime === null) return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  if (aTime === null) return 1
  if (bTime === null) return -1
  if (aTime !== bTime) return bTime - aTime
  return String(a.id ?? '').localeCompare(String(b.id ?? ''))
}

function compareOldest(a, b) {
  const aTime = publishedTime(a)
  const bTime = publishedTime(b)
  if (aTime === null && bTime === null) return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  if (aTime === null) return 1
  if (bTime === null) return -1
  if (aTime !== bTime) return aTime - bTime
  return String(a.id ?? '').localeCompare(String(b.id ?? ''))
}

function compareByRating(a, b) {
  const averageDiff = getAverageRating(b) - getAverageRating(a)
  if (averageDiff !== 0) return averageDiff
  const countDiff = (b.ratingCount ?? 0) - (a.ratingCount ?? 0)
  if (countDiff !== 0) return countDiff
  return compareNewest(a, b)
}

function compareByImports(a, b) {
  const importDiff = (b.importCount ?? 0) - (a.importCount ?? 0)
  if (importDiff !== 0) return importDiff
  return compareByRating(a, b)
}

/**
 * Order listings without mutating the input. Unknown publication dates sort
 * last in both age directions, and ties fall back to the next meaningful
 * signal instead of an arbitrary order.
 * @param {Array<object>} listings
 * @param {'newest'|'oldest'|'rating'|'imports'} sort
 * @returns {Array<object>}
 */
export function sortListings(listings, sort = 'newest') {
  if (!Array.isArray(listings)) return []
  const copy = [...listings]
  switch (sort) {
    case 'oldest':
      return copy.sort(compareOldest)
    case 'rating':
      return copy.sort(compareByRating)
    case 'imports':
      return copy.sort(compareByImports)
    case 'newest':
    default:
      return copy.sort(compareNewest)
  }
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
    return true
  } catch {
    // Storage unavailable or full. Callers must not report success unless
    // this returns true.
    return false
  }
}
