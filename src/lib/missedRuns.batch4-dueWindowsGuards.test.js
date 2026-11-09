import { describe, expect, it } from 'vitest'
import { dueWindows } from './missedRuns'

describe('due window guards', () => {
  it('returns null for missing times, unusable intervals, and future schedules', () => {
    expect(dueWindows({ nextRunAt: NaN, intervalMs: 1000, now: 2000 })).toBeNull()
    expect(dueWindows({ nextRunAt: 1000, intervalMs: 0, now: 2000 })).toBeNull()
    expect(dueWindows({ nextRunAt: 3000, intervalMs: 1000, now: 2000 })).toBeNull()
  })

  it('counts the window at the boundary as due and flags on-time windows', () => {
    expect(dueWindows({ nextRunAt: 1000, intervalMs: 1000, now: 4000, graceMs: 500 })).toEqual({
      count: 4,
      first: 1000,
      last: 4000,
      lastOnTime: true,
      intervalMs: 1000,
    })
    expect(
      dueWindows({ nextRunAt: 1000, intervalMs: 1000, now: 9600, graceMs: 500 }).lastOnTime
    ).toBe(false)
  })
})
