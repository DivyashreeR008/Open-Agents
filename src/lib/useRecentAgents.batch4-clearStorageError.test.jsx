import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecentAgents } from './useRecentAgents'

describe('recent agents clear storage error', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([{ agentId: 'agent-1', agentName: 'Agent One', timestamp: 1 }])
    )
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('clears in-memory recents even when storage removal throws', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toHaveLength(1)

    act(() => result.current.clearHistory())

    expect(result.current.recentAgents).toEqual([])
  })
})
