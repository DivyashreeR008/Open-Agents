import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAnalyticsEvents, recordAnalyticsRun, useAnalytics } from './useAnalytics'

beforeEach(() => {
  localStorage.clear()
})

describe('clearing analytics usage records', () => {
  it('removes stored events and stops history from reseeding them', () => {
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([
        {
          id: 'run-1',
          agentId: 'a1',
          agentName: 'Agent One',
          timestamp: Date.now(),
        },
      ])
    )
    expect(clearAnalyticsEvents()).toBe(true)
    expect(localStorage.getItem('oa_analytics')).toBeNull()
    expect(localStorage.getItem('oa_analytics_seeded')).toBe('1')

    const { result } = renderHook(() => useAnalytics('all'))
    expect(result.current.stats.totalRuns).toBe(0)
    expect(localStorage.getItem('oa_analytics')).toBeNull()
  })

  it('clears hook state and reports that records were removed', () => {
    recordAnalyticsRun({ runId: 'run-1', agentId: 'a1', agentName: 'Agent One' })
    const { result } = renderHook(() => useAnalytics('all'))
    expect(result.current.stats.totalRuns).toBe(1)

    act(() => {
      expect(result.current.clearAnalytics()).toBe(true)
    })

    expect(result.current.stats.totalRuns).toBe(0)
    expect(localStorage.getItem('oa_analytics')).toBeNull()
  })

  it('notifies mounted analytics views after a direct clear', () => {
    const listener = vi.fn()
    window.addEventListener('oa_analytics_update', listener)
    clearAnalyticsEvents()
    window.removeEventListener('oa_analytics_update', listener)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
