import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecentAgents } from './useRecentAgents'

const HISTORY_KEY = 'OpenAgents_history'

function saveHistory(runs) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(runs))
}

describe('useRecentAgents', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('returns an empty list when no history is stored', () => {
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([])
  })

  it('returns an empty list for an empty history array', () => {
    saveHistory([])
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([])
  })

  it('maps valid runs into recent agent entries', () => {
    saveHistory([
      {
        agentId: 'coding',
        agentName: 'Coding Agent',
        agentCategory: 'Development',
        timestamp: 300,
      },
      { agentId: 'writing', agentName: 'Writing Agent', category: 'Content', timestamp: 200 },
    ])

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([
      { id: 'coding', name: 'Coding Agent', category: 'Development', lastUsedAt: 300 },
      { id: 'writing', name: 'Writing Agent', category: 'Content', lastUsedAt: 200 },
    ])
  })

  it('deduplicates by agentId, keeping the first run and its position', () => {
    saveHistory([
      { agentId: 'a', agentName: 'Newest A', timestamp: 300 },
      { agentId: 'b', agentName: 'B', timestamp: 200 },
      { agentId: 'a', agentName: 'Older A', timestamp: 100 },
    ])

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual(['a', 'b'])
    expect(result.current.recentAgents[0]).toMatchObject({ name: 'Newest A', lastUsedAt: 300 })
  })

  it('caps the result at eight distinct agents', () => {
    saveHistory(
      Array.from({ length: 10 }, (_, i) => ({ agentId: `agent-${i}`, timestamp: 10 - i }))
    )

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual(
      Array.from({ length: 8 }, (_, i) => `agent-${i}`)
    )
  })

  it('applies the eight-agent limit after removing duplicates', () => {
    saveHistory([
      { agentId: 'a', timestamp: 11 },
      { agentId: 'a', timestamp: 10 },
      ...Array.from({ length: 8 }, (_, i) => ({ agentId: `agent-${i}`, timestamp: 9 - i })),
    ])

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual([
      'a',
      ...Array.from({ length: 7 }, (_, i) => `agent-${i}`),
    ])
  })

  it('falls back to agentId and an empty category for missing metadata', () => {
    saveHistory([{ agentId: 'fallback', timestamp: 7 }])

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([
      { id: 'fallback', name: 'fallback', category: '', lastUsedAt: 7 },
    ])
  })

  it('ignores null entries and runs without an agentId', () => {
    saveHistory([
      null,
      false,
      {},
      { agentId: null },
      { agentId: '' },
      { agentId: 'valid', timestamp: 1 },
    ])

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([
      { id: 'valid', name: 'valid', category: '', lastUsedAt: 1 },
    ])
  })

  it.each(['{broken json', '{}', 'null', '42'])(
    'returns an empty list without throwing for invalid data: %s',
    (raw) => {
      localStorage.setItem(HISTORY_KEY, raw)
      const { result } = renderHook(() => useRecentAgents())
      expect(result.current.recentAgents).toEqual([])
    }
  )

  it('returns an empty list if localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([])
  })

  it('updates when history changes in another tab', () => {
    saveHistory([{ agentId: 'a', timestamp: 1 }])
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents[0].id).toBe('a')

    saveHistory([{ agentId: 'b', timestamp: 2 }])
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: HISTORY_KEY }))
    })

    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual(['b'])
  })

  it('clears both localStorage history and in-memory recent agents', () => {
    saveHistory([{ agentId: 'a', timestamp: 1 }])
    const { result } = renderHook(() => useRecentAgents())

    act(() => result.current.clearHistory())

    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
    expect(result.current.recentAgents).toEqual([])
  })
})
