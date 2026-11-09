import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAnalytics } from './useAnalytics'

const ANALYTICS_KEY = 'oa_analytics'
const SEED_FLAG = 'oa_analytics_seeded'

beforeEach(() => {
  localStorage.clear()
})

describe('analytics seeding flag', () => {
  it('skips history seeding when the one-time flag is already set', () => {
    localStorage.setItem(SEED_FLAG, '1')
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([{ id: 'old-run', agentId: 'a', agentName: 'A', provider: 'openai' }])
    )

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toEqual([])
    expect(result.current.stats.totalRuns).toBe(0)
    expect(localStorage.getItem(ANALYTICS_KEY)).toBeNull()
  })
})
