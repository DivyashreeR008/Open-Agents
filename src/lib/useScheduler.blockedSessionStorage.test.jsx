import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./llmAdapter', () => ({
  streamAgent: vi.fn(),
}))

vi.mock('./resolveAgentModel', () => ({
  resolveAgentModel: vi.fn(),
}))

vi.mock('./useAnalytics', () => ({
  recordAnalyticsRun: vi.fn(),
}))

import { useScheduler } from './useScheduler'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useScheduler storage isolation', () => {
  it('loads a job with an empty key when session storage access is blocked', () => {
    localStorage.setItem(
      'oa_scheduled_jobs',
      JSON.stringify([
        {
          id: 'job-blocked',
          agentId: 'agent-1',
          agentName: 'Code Reviewer',
          schedule: 'daily',
          nextRunAt: Date.now() + 60_000,
          enabled: true,
          label: 'Blocked key job',
        },
      ])
    )

    vi.spyOn(sessionStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage access denied', 'SecurityError')
    })

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    expect(result.current.jobs).toHaveLength(1)
    expect(result.current.jobs[0].apiKey).toBe('')
  })

  it('leaves an unrelated job untouched when toggling an id that is absent', () => {
    localStorage.setItem(
      'oa_scheduled_jobs',
      JSON.stringify([
        {
          id: 'job-present',
          agentId: 'agent-1',
          agentName: 'Code Reviewer',
          schedule: 'daily',
          nextRunAt: Date.now() + 60_000,
          enabled: true,
          label: 'Present job',
        },
      ])
    )

    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    act(() => result.current.toggleJob('job-missing'))

    expect(result.current.jobs).toHaveLength(1)
    expect(result.current.jobs[0]).toMatchObject({ id: 'job-present', enabled: true })
  })
})
