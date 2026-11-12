import { describe, expect, it } from 'vitest'
import {
  MAX_BADGE_COHORT_SIZE,
  MAX_NEW_BADGES,
  isRecentCreation,
  selectNewAgentIds,
} from './agentFreshness'

const NOW = Date.parse('2026-11-12T12:00:00.000Z')
const DAY_MS = 24 * 60 * 60 * 1000

describe('agent freshness', () => {
  it('accepts dates inside the window and rejects future, old, or invalid dates', () => {
    expect(isRecentCreation('2026-11-12', NOW)).toBe(true)
    expect(isRecentCreation(new Date(NOW - 7 * DAY_MS).toISOString(), NOW)).toBe(true)
    expect(isRecentCreation(new Date(NOW - 7 * DAY_MS - 1).toISOString(), NOW)).toBe(false)
    expect(isRecentCreation('2026-11-13', NOW)).toBe(false)
    expect(isRecentCreation('2026-10-20', NOW)).toBe(false)
    expect(isRecentCreation('not-a-date', NOW)).toBe(false)
    expect(isRecentCreation(undefined, NOW)).toBe(false)
  })

  it('selects only dated recent agents for the new badge', () => {
    const ids = selectNewAgentIds(
      [
        { id: 'recent', createdAt: '2026-11-12' },
        { id: 'old', createdAt: '2026-10-20' },
        { id: 'invalid', createdAt: 'not-a-date' },
        { id: 'missing' },
        { id: 'future', createdAt: '2026-11-20' },
      ],
      NOW
    )

    expect([...ids]).toEqual(['recent'])
  })

  it('suppresses date groups that look like bulk imports', () => {
    const bulk = Array.from({ length: MAX_BADGE_COHORT_SIZE + 1 }, (_, index) => ({
      id: `bulk-${index}`,
      createdAt: '2026-11-10',
    }))
    const normal = { id: 'normal', createdAt: '2026-11-11' }

    expect([...selectNewAgentIds([...bulk, normal], NOW)]).toEqual(['normal'])
  })

  it('caps the total number of badges and keeps the newest candidates', () => {
    const newest = Array.from({ length: MAX_BADGE_COHORT_SIZE }, (_, index) => ({
      id: `a-${String(index).padStart(2, '0')}`,
      createdAt: '2026-11-12',
    }))
    const older = Array.from({ length: MAX_BADGE_COHORT_SIZE }, (_, index) => ({
      id: `b-${String(index).padStart(2, '0')}`,
      createdAt: '2026-11-11',
    }))

    const ids = selectNewAgentIds([...older, ...newest], NOW)

    expect(ids.size).toBe(MAX_NEW_BADGES)
    expect([...ids].slice(0, MAX_BADGE_COHORT_SIZE)).toEqual(newest.map((entry) => entry.id))
    expect([...ids].slice(MAX_BADGE_COHORT_SIZE)).toEqual(['b-00', 'b-01', 'b-02', 'b-03'])
  })

  it('returns an empty set for a missing or malformed catalogue', () => {
    expect(selectNewAgentIds(null, NOW).size).toBe(0)
    expect(selectNewAgentIds({ id: 'not-an-array' }, NOW).size).toBe(0)
  })
})
