import { describe, expect, it } from 'vitest'
import { describeUnexecutedRun, dueWindows, summarizeHistory } from './missedRuns'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const NOW = Date.UTC(2026, 10, 3, 12, 0, 0)

describe('missed run clock edges', () => {
  it('waits until the exact window time and then counts each scheduled window', () => {
    expect(dueWindows({ nextRunAt: NOW, intervalMs: HOUR, now: NOW - 1 })).toBeNull()

    expect(dueWindows({ nextRunAt: NOW, intervalMs: HOUR, now: NOW + HOUR - 1 })).toMatchObject({
      count: 1,
      last: NOW,
      lastOnTime: false,
    })

    expect(dueWindows({ nextRunAt: NOW, intervalMs: HOUR, now: NOW + HOUR })).toMatchObject({
      count: 2,
      last: NOW + HOUR,
      lastOnTime: true,
    })
  })

  it('rejects a missing or non-finite clock value', () => {
    expect(dueWindows({ nextRunAt: NOW - 1, intervalMs: HOUR, now: NaN })).toBeNull()
    expect(dueWindows({ nextRunAt: NOW - 1, intervalMs: HOUR, now: Infinity })).toBeNull()
    expect(dueWindows({ nextRunAt: NOW - 1, intervalMs: HOUR, now: undefined })).toBeNull()
  })

  it('treats a stored zero count as one run and accepts a missing history list', () => {
    expect(
      summarizeHistory([
        { status: 'success' },
        { status: 'missed', missedCount: 0 },
        { status: 'skipped', skippedCount: 0 },
      ])
    ).toEqual({ ran: 1, missed: 1, skipped: 1 })

    expect(
      describeUnexecutedRun({
        status: 'missed',
        missedCount: 0,
        firstWindow: NOW,
        lastWindow: NOW,
      }).title
    ).toBe('1 run missed')
    expect(
      describeUnexecutedRun({
        status: 'skipped',
        skippedCount: 0,
        startedAt: NOW,
      }).title
    ).toBe('1 run skipped')

    expect(summarizeHistory(null)).toEqual({ ran: 0, skipped: 0, missed: 0 })
  })
})
