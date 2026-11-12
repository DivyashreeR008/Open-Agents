import { describe, expect, it } from 'vitest'
import { MAX_CATCH_UP_RUNS, planDueRuns } from './missedRuns'

describe('missed-run catch-up limit validation', () => {
  it('falls back to the default limit when maxCatchUp is not numeric', () => {
    const due = { count: 5, first: 0, last: 4000, intervalMs: 1000, lastOnTime: false }

    const plan = planDueRuns(due, 'catch_up', { maxCatchUp: 'two' })

    expect(plan.runWindows).toHaveLength(MAX_CATCH_UP_RUNS)
    expect(plan.runWindows.at(-1)).toBe(4000)
  })
})
