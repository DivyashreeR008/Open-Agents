import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useScheduler } from './useScheduler'

const STORAGE_KEY = 'oa_scheduled_jobs'
const ONE_DAY_MS = 86_400_000

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useScheduler unknown schedule', () => {
  it('schedules an unknown interval for one day later', () => {
    const fixedNow = 1_700_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow)

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    let createdJob
    act(() => {
      createdJob = result.current.addJob({
        label: 'Custom Job',
        agentId: 'test-agent',
        agentName: 'Test Agent',
        schedule: 'unknown-interval-type',
        apiKey: 'test-key',
      })
    })

    expect(createdJob).toBeDefined()
    expect(createdJob.createdAt).toBe(fixedNow)
    expect(createdJob.nextRunAt).toBe(fixedNow + ONE_DAY_MS)

    const storedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    expect(storedJobs).toHaveLength(1)
    expect(storedJobs[0].nextRunAt).toBe(fixedNow + ONE_DAY_MS)
  })

  it('falls back to one day later when schedule is undefined or null', () => {
    const fixedNow = 1_700_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow)

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    let createdJob
    act(() => {
      createdJob = result.current.addJob({
        label: 'Missing Schedule Job',
        agentId: 'test-agent',
        agentName: 'Test Agent',
        schedule: undefined,
      })
    })

    expect(createdJob.nextRunAt).toBe(fixedNow + ONE_DAY_MS)
  })
})
