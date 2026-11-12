import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useScheduler } from './useScheduler'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
})

afterEach(() => vi.restoreAllMocks())

describe('useScheduler unknown schedule', () => {
  it('schedules an unknown interval for one day later', () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    let job
    act(() => {
      job = result.current.addJob({ schedule: 'monthly', agentId: 'a1', agentName: 'Agent' })
    })

    expect(job.nextRunAt).toBe(1_000_000 + 86_400_000)
    expect(result.current.jobs).toHaveLength(1)
  })
})
