import { describe, expect, it } from 'vitest'
import { describeUnexecutedRun } from './missedRuns'

describe('unexecuted run history copy with invalid records', () => {
  it('does not print Invalid Date when a missed record has no timestamps', () => {
    const copy = describeUnexecutedRun({ status: 'missed', missedCount: 2, policy: 'run_once' })

    expect(copy.title).toBe('2 runs missed')
    expect(copy.detail).toContain('Due at an unknown time')
    expect(copy.detail).not.toMatch(/invalid date/i)
  })

  it('falls back to a single run for zero, negative, or non-numeric counts', () => {
    for (const skippedCount of [0, -3, 'many', Number.NaN]) {
      const copy = describeUnexecutedRun({
        status: 'skipped',
        skippedCount,
        startedAt: Date.now(),
        reason: 'no_key',
      })

      expect(copy.title).toBe('1 run skipped')
      expect(copy.detail).toContain('no API key is stored')
    }
  })

  it('keeps a valid range when both timestamps are present', () => {
    const copy = describeUnexecutedRun({
      status: 'missed',
      missedCount: 3,
      firstWindow: Date.UTC(2026, 0, 1, 9),
      lastWindow: Date.UTC(2026, 0, 1, 11),
    })

    expect(copy.title).toBe('3 runs missed')
    expect(copy.detail).not.toContain('unknown time')
    expect(copy.detail).toContain(' to ')
  })
})
