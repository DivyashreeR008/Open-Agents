import { describe, expect, it } from 'vitest'
import { planDueRuns } from './missedRuns'

describe('planDueRuns non-finite catch-up limit', () => {
  it('falls back to the default catch-up limit', () => {
    const plan = planDueRuns(
      { count: 5, first: 0, last: 4, intervalMs: 1, lastOnTime: false },
      'catch_up',
      { maxCatchUp: -Infinity }
    )

    expect(plan.runWindows).toEqual([2, 3, 4])
    expect(plan.missed).toEqual({ count: 2, first: 0, last: 1 })
  })
})
