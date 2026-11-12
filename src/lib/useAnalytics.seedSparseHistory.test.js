import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAnalytics } from './useAnalytics'

beforeEach(() => {
  localStorage.clear()
})

describe('analytics seeding from sparse history', () => {
  it('fills provider and timestamp fallbacks for legacy history entries', () => {
    const before = Date.now()
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([{ id: 'legacy-run', agentId: 'legacy-agent', agentName: 'Legacy Agent' }])
    )

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0]).toMatchObject({
      id: 'legacy-run',
      provider: 'unknown',
    })
    expect(result.current.events[0].timestamp).toBeGreaterThanOrEqual(before)
  })
})
