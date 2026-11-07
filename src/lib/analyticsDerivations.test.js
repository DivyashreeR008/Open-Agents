import { beforeEach, describe, expect, it } from 'vitest'
import { computeStats, recordAnalyticsRun } from './useAnalytics'

const NOW = new Date(2026, 4, 15, 12, 0, 0, 0)
const TODAY = NOW.getTime()
const VOTES_KEY = 'oa_analytics'

const at = (month, day, hour = 12, minute = 0) =>
  new Date(2026, month - 1, day, hour, minute, 0, 0).getTime()

const dateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

const event = (
  id,
  {
    agentId = 'agent-a',
    agentName = 'Agent A',
    provider = 'openai',
    category = 'Engineering',
    timestamp,
  } = {}
) => ({ id, agentId, agentName, provider, category, timestamp })

const activity = [
  event('today-1', { timestamp: at(5, 15, 9), agentId: 'agent-a' }),
  event('today-2', { timestamp: at(5, 15, 10), agentId: 'agent-a' }),
  event('today-3', {
    timestamp: at(5, 15, 11),
    agentId: 'agent-a',
    provider: 'anthropic',
    category: 'Research',
  }),
  event('today-4', {
    timestamp: at(5, 15, 12),
    agentId: 'agent-b',
    agentName: 'Agent B',
    category: 'Engineering',
  }),
  event('yesterday', {
    timestamp: at(5, 14),
    agentId: 'agent-b',
    agentName: 'Agent B',
    category: 'Research',
  }),
  event('two-days-ago', {
    timestamp: at(5, 13),
    agentId: 'agent-c',
    agentName: 'Agent C',
    provider: 'gemini',
    category: 'Engineering',
  }),
  event('last-sunday', {
    timestamp: at(5, 10),
    agentId: 'agent-a',
    category: 'Engineering',
  }),
  event('last-saturday', {
    timestamp: at(5, 9),
    agentId: 'agent-b',
    agentName: 'Agent B',
    provider: 'anthropic',
    category: 'Research',
  }),
]

beforeEach(() => {
  localStorage.clear()
})

describe('analytics totals and distributions', () => {
  it('derives counts, agents, providers, categories, and the most active day', () => {
    const stats = computeStats(activity, 'all', NOW)

    expect(stats.totalRuns).toBe(8)
    expect(stats.uniqueAgents).toBe(3)
    expect(stats.favoriteProvider).toBe('openai')
    expect(stats.topAgents).toEqual([
      { agentId: 'agent-a', agentName: 'Agent A', count: 4 },
      { agentId: 'agent-b', agentName: 'Agent B', count: 3 },
      { agentId: 'agent-c', agentName: 'Agent C', count: 1 },
    ])
    expect(
      stats.providerDistribution.map(({ name, count, pct }) => ({ name, count, pct }))
    ).toEqual([
      { name: 'openai', count: 5, pct: 63 },
      { name: 'anthropic', count: 2, pct: 25 },
      { name: 'gemini', count: 1, pct: 12 },
    ])
    expect(
      stats.categoryDistribution.map(({ name, count, pct }) => ({ name, count, pct }))
    ).toEqual([
      { name: 'Engineering', count: 5, pct: 63 },
      { name: 'Research', count: 3, pct: 37 },
    ])
    expect(stats.mostProductiveDay).toBe('Friday')
    expect(stats.avgRunsPerDay).toBe(1.6)
  })

  it('keeps the most recent ten events and preserves their stored order', () => {
    const many = Array.from({ length: 12 }, (_, index) =>
      event(`recent-${index}`, { timestamp: TODAY - index * 1000 })
    )

    const stats = computeStats(many, 'all', NOW)

    expect(stats.totalRuns).toBe(12)
    expect(stats.recentRuns.map((run) => run.id)).toEqual(many.slice(0, 10).map((run) => run.id))
  })

  it('ignores non-record entries without mutating the supplied event list', () => {
    const supplied = [null, 42, 'event', ['nested'], activity[0]]
    const snapshot = [...supplied]

    const stats = computeStats(supplied, 'all', NOW)

    expect(stats.totalRuns).toBe(1)
    expect(stats.uniqueAgents).toBe(1)
    expect(supplied).toEqual(snapshot)
  })
})

describe('analytics rolling windows', () => {
  it('builds thirty daily buckets ending today and counts events per local day', () => {
    const stats = computeStats(activity, 'all', NOW)
    const counts = Object.fromEntries(stats.dailyRuns.map((day) => [day.date, day.count]))

    expect(stats.dailyRuns).toHaveLength(30)
    expect(stats.dailyRuns[0].date).toBe(dateKey(new Date(2026, 3, 16)))
    expect(stats.dailyRuns.at(-1)).toEqual({ date: '2026-05-15', count: 4 })
    expect(counts[dateKey(at(5, 14))]).toBe(1)
    expect(counts[dateKey(at(5, 13))]).toBe(1)
    expect(counts[dateKey(at(5, 12))]).toBe(0)
    expect(counts[dateKey(at(5, 10))]).toBe(1)
    expect(counts[dateKey(at(5, 9))]).toBe(1)
  })

  it('builds eighty-four heatmap buckets and marks the final local weekday', () => {
    const stats = computeStats(activity, 'all', NOW)

    expect(stats.heatmapData).toHaveLength(84)
    expect(stats.heatmapData.at(-1)).toEqual({
      date: '2026-05-15',
      dayOfWeek: 5,
      count: 4,
    })
  })

  it('filters each rolling range inclusively at its start boundary', () => {
    const boundary = at(5, 8, 12)
    const events = [
      event('now', { timestamp: at(5, 15, 12) }),
      event('yesterday', { timestamp: at(5, 14, 12) }),
      event('boundary', { timestamp: boundary }),
      event('just-before', { timestamp: boundary - 1 }),
      event('fifteen-days', { timestamp: at(4, 30, 12) }),
      event('old', { timestamp: new Date(2025, 0, 1).getTime() }),
    ]

    const sevenDays = computeStats(events, '7d', NOW)
    const thirtyDays = computeStats(events, '30d', NOW)
    const all = computeStats(events, 'all', NOW)

    expect(sevenDays.recentRuns.map((run) => run.id)).toEqual(['now', 'yesterday', 'boundary'])
    expect(thirtyDays.recentRuns.map((run) => run.id)).toEqual([
      'now',
      'yesterday',
      'boundary',
      'just-before',
      'fifteen-days',
    ])
    expect(all.totalRuns).toBe(6)
  })

  it('returns empty windows when the range contains no events', () => {
    const old = [event('old', { timestamp: new Date(2025, 0, 1).getTime() })]

    const stats = computeStats(old, '7d', NOW)

    expect(stats).toEqual({
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
      dailyRuns: [],
      heatmapData: [],
      recentRuns: [],
    })
  })
})

describe('analytics streaks', () => {
  it('counts the current streak through today and the longest run of active days', () => {
    const stats = computeStats(activity, 'all', NOW)

    expect(stats.currentStreak).toBe(3)
    expect(stats.longestStreak).toBe(3)
  })

  it('continues a current streak from yesterday when today has no events', () => {
    const events = [
      event('yesterday', { timestamp: at(5, 14) }),
      event('two-days-ago', { timestamp: at(5, 13) }),
    ]

    expect(computeStats(events, 'all', NOW).currentStreak).toBe(2)
  })

  it('reports no current streak when the last activity is older than yesterday', () => {
    const events = [
      event('older', { timestamp: at(5, 10) }),
      event('older-still', { timestamp: at(5, 9) }),
    ]

    const stats = computeStats(events, 'all', NOW)

    expect(stats.currentStreak).toBe(0)
    expect(stats.longestStreak).toBe(2)
  })

  it('does not merge separate active runs across a gap', () => {
    const events = [
      event('april-30', { timestamp: at(4, 30) }),
      event('may-1', { timestamp: at(5, 1) }),
      event('may-2', { timestamp: at(5, 2) }),
      event('may-10', { timestamp: at(5, 10) }),
    ]

    expect(computeStats(events, 'all', NOW).longestStreak).toBe(3)
  })

  it('handles an empty event list without inventing a streak', () => {
    const stats = computeStats([], 'all', NOW)

    expect(stats.currentStreak).toBe(0)
    expect(stats.longestStreak).toBe(0)
    expect(stats.avgRunsPerDay).toBe(0)
  })
})

describe('analytics event cap and stored records', () => {
  it('keeps five hundred events, drops the oldest, and derives totals from the cap', () => {
    const existing = Array.from({ length: 500 }, (_, index) =>
      event(`old-${index}`, { timestamp: TODAY - index * 1000 })
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify(existing))

    recordAnalyticsRun({
      runId: 'newest',
      agentId: 'agent-new',
      agentName: 'New Agent',
      provider: 'openai',
      category: 'Engineering',
    })

    const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
    expect(stored).toHaveLength(500)
    expect(stored[0].id).toBe('newest')
    expect(stored.at(-1).id).toBe('old-498')
    expect(computeStats(stored, 'all', NOW).totalRuns).toBe(500)
  })

  it('drops non-record entries from storage before appending a new event', () => {
    localStorage.setItem(
      VOTES_KEY,
      JSON.stringify([null, 'bad', event('kept', { timestamp: TODAY })])
    )

    recordAnalyticsRun({
      runId: 'new',
      agentId: 'agent-new',
      agentName: 'New Agent',
      provider: 'openai',
      category: 'Engineering',
    })

    expect(JSON.parse(localStorage.getItem(VOTES_KEY)).map((item) => item.id)).toEqual([
      'new',
      'kept',
    ])
  })
})
