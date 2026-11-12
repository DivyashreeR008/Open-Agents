const DAY_MS = 24 * 60 * 60 * 1000

export const NEW_BADGE_WINDOW_DAYS = 7
export const MAX_BADGE_COHORT_SIZE = 20
export const MAX_NEW_BADGES = 24

function creationTime(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.getTime()
  }
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

function recentCreationTime(value, now) {
  const time = creationTime(value)
  if (time === null || time > now) return null
  return now - time <= NEW_BADGE_WINDOW_DAYS * DAY_MS ? time : null
}

/**
 * Whether a creation date is recent enough to qualify for the new badge.
 * Future, missing, and invalid dates do not qualify.
 * @param {string | number | Date | null | undefined} value
 * @param {number} now
 * @returns {boolean}
 */
export function isRecentCreation(value, now = Date.now()) {
  return recentCreationTime(value, now) !== null
}

function utcDay(time) {
  return new Date(time).toISOString().slice(0, 10)
}

/**
 * Selects a small, stable set of agents for the new badge.
 *
 * A date shared by more than MAX_BADGE_COHORT_SIZE definitions is treated as
 * a bulk import rather than a launch signal, so that date is excluded. The
 * remaining candidates are capped to MAX_NEW_BADGES, newest first, with id as
 * the tie-breaker for definitions added on the same day.
 * @param {Array<{ id?: string, createdAt?: string }>} agents
 * @param {number} now
 * @returns {Set<string>}
 */
export function selectNewAgentIds(agents, now = Date.now()) {
  const cohorts = new Map()

  for (const agent of Array.isArray(agents) ? agents : []) {
    if (!agent?.id) continue
    const created = recentCreationTime(agent.createdAt, now)
    if (created === null) continue
    const day = utcDay(created)
    const cohort = cohorts.get(day)
    const entry = { id: agent.id, created }
    if (cohort) cohort.push(entry)
    else cohorts.set(day, [entry])
  }

  const candidates = []
  for (const cohort of cohorts.values()) {
    if (cohort.length <= MAX_BADGE_COHORT_SIZE) candidates.push(...cohort)
  }

  candidates.sort((left, right) => {
    return right.created - left.created || left.id.localeCompare(right.id)
  })

  return new Set(candidates.slice(0, MAX_NEW_BADGES).map((entry) => entry.id))
}
