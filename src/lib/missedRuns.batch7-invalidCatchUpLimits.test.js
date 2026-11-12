import { describe, expect, it } from 'vitest'
import { MAX_CATCH_UP_RUNS, dueWindows, planDueRuns } from './missedRuns'

const HOUR = 60 * 60 * 1000
const NOW = 1_800_000_000_000
const due = dueWindows({ nextRunAt: NOW - 5 * HOUR, intervalMs: HOUR, now: NOW })

describe('catch-up limit validation', () => {
  it('still runs one window for a negative or fractional limit', () => {
    expect(planDueRuns(due, 'catch_up', { maxCatchUp: -3 }).runWindows).toHaveLength(1)
    expect(planDueRuns(due, 'catch_up', { maxCatchUp: 1.9 }).runWindows).toHaveLength(1)
  })

  it('uses the documented default for a non-finite or non-numeric limit', () => {
    expect(planDueRuns(due, 'catch_up', { maxCatchUp: Number.NaN }).runWindows).toHaveLength(
      MAX_CATCH_UP_RUNS
    )
    expect(
      planDueRuns(due, 'catch_up', { maxCatchUp: Number.POSITIVE_INFINITY }).runWindows
    ).toHaveLength(MAX_CATCH_UP_RUNS)
  })
})
