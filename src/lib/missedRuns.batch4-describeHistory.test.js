import { describe, expect, it } from 'vitest'
import { describeUnexecutedRun, summarizeHistory } from './missedRuns'

describe('unexecuted run descriptions and history summary', () => {
  it('describes missed runs with their policy and skipped runs with the no-key reason', () => {
    const missed = describeUnexecutedRun({
      status: 'missed',
      missedCount: 2,
      firstWindow: 1000,
      lastWindow: 2000,
      policy: 'catch_up',
    })
    expect(missed.title).toBe('2 runs missed')
    expect(missed.detail).toContain('Catch up')

    const skipped = describeUnexecutedRun({
      status: 'skipped',
      skippedCount: 1,
      startedAt: 1000,
      reason: 'no_key',
    })
    expect(skipped.title).toBe('1 run skipped')
    expect(skipped.detail).toContain('no API key')
  })

  it('counts ran, skipped, and missed records', () => {
    expect(
      summarizeHistory([
        { status: 'success' },
        { status: 'missed', missedCount: 3 },
        { status: 'skipped' },
        { status: 'skipped', skippedCount: 2 },
        null,
      ])
    ).toEqual({ ran: 1, skipped: 3, missed: 3 })
  })
})
