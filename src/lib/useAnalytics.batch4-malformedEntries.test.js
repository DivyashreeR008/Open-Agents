import { describe, expect, it } from 'vitest'
import { computeStats } from './useAnalytics'

describe('analytics event sanitization', () => {
  it('drops null, primitive, and array entries before computing totals', () => {
    const now = new Date('2026-05-10T12:00:00.000Z')
    const stats = computeStats(
      [null, 42, 'event', [], { id: 'valid', agentId: 'agent-1', timestamp: now.getTime() - 1000 }],
      'all',
      now
    )

    expect(stats.totalRuns).toBe(1)
    expect(stats.uniqueAgents).toBe(1)
    expect(stats.favoriteProvider).toBe('unknown')
    expect(stats.categoryDistribution).toEqual([{ name: 'Uncategorized', count: 1, pct: 100 }])
    expect(stats.recentRuns[0]).toMatchObject({ id: 'valid', provider: undefined })
  })
})
