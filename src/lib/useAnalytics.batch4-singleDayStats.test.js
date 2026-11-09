import { describe, expect, it } from 'vitest'
import { computeStats } from './useAnalytics'

describe('analytics single-day statistics', () => {
  it('reports a one-day streak, active-day average, and productive weekday', () => {
    const now = new Date('2026-05-20T12:00:00.000Z')
    const stats = computeStats(
      [
        {
          id: 'run-1',
          agentId: 'agent-1',
          agentName: 'Agent One',
          provider: 'openai',
          category: 'Research',
          timestamp: now.getTime(),
        },
      ],
      'all',
      now
    )

    expect(stats.currentStreak).toBe(1)
    expect(stats.longestStreak).toBe(1)
    expect(stats.avgRunsPerDay).toBe(1)
    expect(stats.mostProductiveDay).toBe('Wednesday')
    expect(stats.favoriteProvider).toBe('openai')
  })
})
