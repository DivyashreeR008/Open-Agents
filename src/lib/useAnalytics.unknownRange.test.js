import { describe, expect, it } from 'vitest'
import { computeStats } from './useAnalytics'

describe('computeStats defensive fallbacks', () => {
  it('returns the empty summary for a non-array input', () => {
    expect(computeStats(null)).toMatchObject({
      totalRuns: 0,
      uniqueAgents: 0,
      favoriteProvider: null,
      avgRunsPerDay: 0,
      mostProductiveDay: null,
      topAgents: [],
      recentRuns: [],
    })
  })

  it('uses provider and category fallbacks and an open window for an unknown range', () => {
    const stats = computeStats(
      [
        {
          id: 'event-1',
          agentId: 'agent-1',
          timestamp: new Date('2026-05-10T10:00:00Z').getTime(),
        },
      ],
      'quarter',
      new Date('2026-05-10T12:00:00Z')
    )

    expect(stats.totalRuns).toBe(1)
    expect(stats.favoriteProvider).toBe('unknown')
    expect(stats.categoryDistribution).toEqual([{ name: 'Uncategorized', count: 1, pct: 100 }])
    expect(stats.avgRunsPerDay).toBe(1)
  })
})
