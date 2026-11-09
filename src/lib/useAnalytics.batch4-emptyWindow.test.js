import { describe, expect, it } from 'vitest'
import { computeStats } from './useAnalytics'

describe('analytics empty time window', () => {
  it('returns zeroed stats when every event is outside the selected range', () => {
    const now = new Date('2026-06-01T12:00:00.000Z')
    const stats = computeStats(
      [
        {
          id: 'old',
          agentId: 'agent-1',
          agentName: 'Old Agent',
          provider: 'openai',
          category: 'Engineering',
          timestamp: now.getTime() - 10 * 86400000,
        },
      ],
      '7d',
      now
    )

    expect(stats).toMatchObject({
      totalRuns: 0,
      uniqueAgents: 0,
      favoriteProvider: null,
      currentStreak: 0,
      longestStreak: 0,
      avgRunsPerDay: 0,
      mostProductiveDay: null,
      topAgents: [],
      providerDistribution: [],
      categoryDistribution: [],
      recentRuns: [],
    })
  })
})
