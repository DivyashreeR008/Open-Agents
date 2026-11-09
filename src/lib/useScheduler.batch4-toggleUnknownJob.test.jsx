import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useScheduler } from './useScheduler'

const JOBS_KEY = 'oa_scheduled_jobs'
const HISTORY_KEY = 'oa_scheduler_results'

describe('scheduler missing identifiers', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem(
      JOBS_KEY,
      JSON.stringify([{ id: 'job-1', label: 'Keep me', enabled: true }])
    )
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ id: 'result-1', jobId: 'job-1', output: 'ok' }])
    )
  })

  it('leaves jobs and results untouched for unknown ids', () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    act(() => result.current.toggleJob('missing-job'))
    act(() => result.current.deleteResult('missing-result'))
    act(() => result.current.deleteJob('missing-job'))

    expect(result.current.jobs).toHaveLength(1)
    expect(result.current.jobs[0]).toMatchObject({ id: 'job-1', enabled: true })
    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].id).toBe('result-1')
  })
})
