import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecentAgents } from './useRecentAgents'

const HISTORY_KEY = 'OpenAgents_history'

function saveHistory(runs) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(runs))
}

describe('useRecentAgents edge behavior', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('ignores storage events for unrelated keys', () => {
    saveHistory([{ agentId: 'stable', timestamp: 1 }])
    const { result } = renderHook(() => useRecentAgents())

    saveHistory([{ agentId: 'replacement', timestamp: 2 }])
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'some_other_key' }))
    })

    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual(['stable'])
  })

  it('resets to empty when another tab leaves malformed history', () => {
    saveHistory([{ agentId: 'kept', timestamp: 1 }])
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual(['kept'])

    localStorage.setItem(HISTORY_KEY, '{broken json')
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: HISTORY_KEY }))
    })

    expect(result.current.recentAgents).toEqual([])
  })

  it('falls back for blank name and category metadata', () => {
    saveHistory([
      {
        agentId: 'blank-name',
        agentName: '',
        agentCategory: '',
        category: '',
        timestamp: 2,
      },
      {
        agentId: 'named',
        agentName: 'Named Agent',
        agentCategory: 'Primary',
        category: 'Ignored',
        timestamp: 1,
      },
    ])

    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents).toEqual([
      { id: 'blank-name', name: 'blank-name', category: '', lastUsedAt: 2 },
      { id: 'named', name: 'Named Agent', category: 'Primary', lastUsedAt: 1 },
    ])
  })
})
