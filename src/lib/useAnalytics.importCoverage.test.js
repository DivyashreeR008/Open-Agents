import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { computeStats, recordAnalyticsRun, useAnalytics } from './useAnalytics'

beforeEach(() => localStorage.clear())

describe('history imports and metadata coverage', () => {
  it('retains recorded history metadata without inventing absent attributes', () => {
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([
        { id: 'sparse', agentId: 'a', timestamp: 2 },
        {
          id: 'rich',
          agentId: 'b',
          timestamp: 1,
          provider: 'openai',
          category: 'Research',
          model: 'saved-model',
          duration: 1200,
        },
      ])
    )
    const { result } = renderHook(() => useAnalytics())
    expect(result.current.events).toHaveLength(2)
    expect(result.current.events[0]).toMatchObject({
      id: 'sparse',
      origin: 'history-import',
      provider: 'unknown',
      category: '',
      model: '',
      duration: null,
    })
    expect(result.current.events[1]).toMatchObject({
      id: 'rich',
      origin: 'history-import',
      provider: 'openai',
      category: 'Research',
      model: 'saved-model',
      duration: 1200,
    })
    expect(result.current.stats.providerDistribution).toEqual([
      { name: 'openai', count: 1, pct: 100 },
    ])
    expect(result.current.stats.categoryDistribution).toEqual([
      { name: 'Research', count: 1, pct: 100 },
    ])
    expect(result.current.stats.metadataCoverage).toEqual({
      provider: { known: 1, unknown: 1 },
      category: { known: 1, unknown: 1 },
    })
    expect(result.current.stats.provenance).toEqual({ imported: 2, recorded: 0, unknown: 0 })
  })

  it('keeps already-seeded unmarked records unknown and does not import them again', () => {
    const legacy = [
      { id: 'same-id', agentId: 'a', provider: 'unknown', category: 'Uncategorized', timestamp: 1 },
    ]
    localStorage.setItem('oa_analytics', JSON.stringify(legacy))
    localStorage.setItem('oa_analytics_seeded', '1')
    localStorage.setItem('OpenAgents_history', JSON.stringify(legacy))
    const { result, unmount } = renderHook(() => useAnalytics())
    expect(result.current.stats).toMatchObject({
      totalRuns: 1,
      favoriteProvider: null,
      providerDistribution: [],
      categoryDistribution: [],
      provenance: { imported: 0, recorded: 0, unknown: 1 },
    })
    expect(result.current.stats.recentRuns[0].origin).toBe('unknown')
    expect(JSON.parse(localStorage.getItem('oa_analytics'))).toEqual(legacy)
    unmount()
    const again = renderHook(() => useAnalytics())
    expect(again.result.current.stats.totalRuns).toBe(1)
  })

  it('marks native events and preserves history/native ID deduplication', () => {
    recordAnalyticsRun({
      runId: 'shared',
      agentId: 'a',
      provider: 'gemini',
      category: 'Engineering',
    })
    localStorage.setItem('OpenAgents_history', JSON.stringify([{ id: 'shared', agentId: 'a' }]))
    const { result } = renderHook(() => useAnalytics())
    expect(result.current.stats.totalRuns).toBe(1)
    expect(result.current.stats.provenance).toEqual({ imported: 0, recorded: 1, unknown: 0 })
    expect(result.current.events[0].origin).toBe('recorded')
    act(() => recordAnalyticsRun({ runId: 'next', agentId: 'a' }))
    expect(result.current.stats.totalRuns).toBe(2)
    expect(result.current.stats.metadataCoverage.provider).toEqual({ known: 1, unknown: 1 })
  })

  it('keeps all activity while computing percentages only over known metadata in the selected window', () => {
    const now = new Date('2026-11-25T12:00:00Z')
    const events = [
      { id: 'old', agentId: 'a', origin: 'history-import', provider: 'openai', timestamp: 1 },
      ...['openai', 'gemini', 'anthropic'].map((provider, i) => ({
        id: `new-${i}`,
        agentId: 'a',
        provider,
        category: 'Research',
        origin: 'recorded',
        timestamp: now.getTime(),
      })),
      ...[undefined, ' Unknown ', 'any', 42, ''].map((provider, i) => ({
        id: `missing-${i}`,
        agentId: 'b',
        provider,
        category: ' Uncategorized ',
        origin: 'future-origin',
        timestamp: now.getTime(),
      })),
    ]
    const before = structuredClone(events)
    const stats = computeStats(events, '7d', now)
    expect(stats.totalRuns).toBe(8)
    expect(stats.providerDistribution.map((p) => p.pct)).toEqual([34, 33, 33])
    expect(stats.categoryDistribution).toEqual([{ name: 'Research', count: 3, pct: 100 }])
    expect(stats.metadataCoverage).toEqual({
      provider: { known: 3, unknown: 5 },
      category: { known: 3, unknown: 5 },
    })
    expect(stats.provenance).toEqual({ imported: 0, recorded: 3, unknown: 5 })
    expect(stats.topAgents.reduce((sum, a) => sum + a.count, 0)).toBe(8)
    expect(events).toEqual(before)
  })

  it('handles custom names safely and keeps the retention limit', () => {
    const stats = computeStats([
      { provider: '__proto__', category: 'constructor', timestamp: Date.now() },
    ])
    expect(stats.providerDistribution).toEqual([{ name: '__proto__', count: 1, pct: 100 }])
    expect(stats.categoryDistribution).toEqual([{ name: 'constructor', count: 1, pct: 100 }])
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify(
        Array.from({ length: 510 }, (_, i) => ({ id: `a_${i}`, agentId: 'a', timestamp: i + 1 }))
      )
    )
    const { result } = renderHook(() => useAnalytics())
    expect(result.current.events).toHaveLength(500)
    expect(result.current.events[0].id).toBe('a_509')
    expect(result.current.stats.provenance.imported).toBe(500)
  })
})
