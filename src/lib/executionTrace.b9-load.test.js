import { beforeEach, describe, expect, it } from 'vitest'
import { loadTraces } from './executionTrace'

const STORAGE_KEY = 'oa_execution_traces'

beforeEach(() => {
  localStorage.clear()
})

describe('loading stored execution traces', () => {
  it('drops primitive and structurally invalid entries but keeps valid traces', () => {
    const valid = { runId: 'run_1', steps: [], status: 'done' }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        null,
        'trace',
        [],
        {},
        { runId: 42, steps: [] },
        { runId: 'missing-steps' },
        valid,
      ])
    )

    expect(loadTraces()).toEqual([valid])
  })

  it('returns an empty list when the stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runId: 'run_1', steps: [] }))

    expect(loadTraces()).toEqual([])
  })

  it('caps a hand-edited oversized store at the normal retention limit', () => {
    const traces = Array.from({ length: 25 }, (_, index) => ({
      runId: `run_${index}`,
      steps: [],
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(traces))

    expect(loadTraces()).toHaveLength(20)
    expect(loadTraces()[0].runId).toBe('run_0')
  })
})
