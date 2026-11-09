import { describe, expect, it } from 'vitest'
import { planDueRuns } from './missedRuns'

const due = { count: 5, first: 1000, last: 5000, intervalMs: 1000, lastOnTime: false }

describe('missed run policies', () => {
  it('runs only the newest window with run_once and records the rest', () => {
    expect(planDueRuns(due, 'run_once')).toEqual({
      runWindows: [5000],
      missed: { count: 4, first: 1000, last: 4000 },
    })
  })

  it('caps catch_up runs and skips everything when not on time', () => {
    expect(planDueRuns(due, 'catch_up', { maxCatchUp: 2 }).runWindows).toEqual([4000, 5000])
    expect(planDueRuns(due, 'skip').runWindows).toEqual([])
    expect(planDueRuns({ ...due, lastOnTime: true }, 'skip').runWindows).toEqual([5000])
  })

  it('falls back to run_once for an unknown policy and returns an empty plan for null', () => {
    expect(planDueRuns(due, 'unknown').runWindows).toEqual([5000])
    expect(planDueRuns(null, 'catch_up')).toEqual({ runWindows: [], missed: null })
  })
})
