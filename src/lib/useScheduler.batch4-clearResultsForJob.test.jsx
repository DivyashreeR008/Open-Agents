import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useScheduler } from './useScheduler'

const HISTORY_KEY = 'oa_scheduler_results'

const result = (id, jobId) => ({
  id,
  jobId,
  jobLabel: `Job ${jobId}`,
  agentName: 'Agent',
  output: 'ok',
  ranAt: 1,
  duration: 1,
  error: null,
})

describe('scheduler clear results for one job', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem(HISTORY_KEY, JSON.stringify([result('r1', 'a'), result('r2', 'b')]))
  })

  it('removes only the selected job results and persists the remaining history', () => {
    const { result: hook } = renderHook(() => useScheduler({ autoRun: false }))

    expect(hook.current.results.map((entry) => entry.id)).toEqual(['r1', 'r2'])

    act(() => hook.current.clearResultsForJob('a'))

    expect(hook.current.results.map((entry) => entry.id)).toEqual(['r2'])
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY)).map((entry) => entry.id)).toEqual(['r2'])
  })
})
