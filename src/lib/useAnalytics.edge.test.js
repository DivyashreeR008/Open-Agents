import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { recordAnalyticsRun, useAnalytics } from './useAnalytics'

const ANALYTICS_KEY = 'oa_analytics'
const SEED_FLAG = 'oa_analytics_seeded'

describe('useAnalytics stored data recovery', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('starts empty when stored analytics and history are malformed', () => {
    localStorage.setItem(ANALYTICS_KEY, '{broken')
    localStorage.setItem('OpenAgents_history', 'not-json')

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toEqual([])
    expect(result.current.stats.totalRuns).toBe(0)
    expect(localStorage.getItem(SEED_FLAG)).toBe('1')
  })

  it('marks seeding complete when recorded history is an empty list', () => {
    localStorage.setItem('OpenAgents_history', JSON.stringify([]))

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toEqual([])
    expect(localStorage.getItem(SEED_FLAG)).toBe('1')
  })

  it('warns on empty analytics and clears stored events', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const { result } = renderHook(() => useAnalytics())

    act(() => result.current.clearAnalytics())
    expect(alertSpy).toHaveBeenCalledWith('No analytics data to clear.')

    act(() =>
      recordAnalyticsRun({
        runId: 'edge-run',
        agentId: 'agent-edge',
        agentName: 'Edge Agent',
        provider: 'openai',
      })
    )
    expect(result.current.stats.totalRuns).toBe(1)

    act(() => result.current.clearAnalytics())
    expect(localStorage.getItem(ANALYTICS_KEY)).toBeNull()
    expect(result.current.events).toEqual([])
    expect(result.current.stats.totalRuns).toBe(0)
  })

  it('syncs from storage changes and removes both listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { result, unmount } = renderHook(() => useAnalytics())

    act(() =>
      recordAnalyticsRun({
        runId: 'live-run',
        agentId: 'agent-live',
        agentName: 'Live Agent',
        provider: 'openai',
      })
    )
    expect(result.current.stats.totalRuns).toBe(1)

    localStorage.setItem(
      ANALYTICS_KEY,
      JSON.stringify([
        {
          id: 'other-tab',
          agentId: 'agent-other',
          agentName: 'Other Agent',
          provider: 'gemini',
          timestamp: Date.now(),
        },
        {
          id: 'live-run',
          agentId: 'agent-live',
          agentName: 'Live Agent',
          provider: 'openai',
          timestamp: Date.now() - 1000,
        },
      ])
    )

    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' })))
    expect(result.current.stats.totalRuns).toBe(1)

    act(() => window.dispatchEvent(new StorageEvent('storage', { key: ANALYTICS_KEY })))
    expect(result.current.stats.totalRuns).toBe(2)

    unmount()
    expect(removeSpy).toHaveBeenCalledWith('oa_analytics_update', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function))
  })
})
