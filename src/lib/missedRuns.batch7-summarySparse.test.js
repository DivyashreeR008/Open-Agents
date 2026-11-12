import { describe, expect, it } from 'vitest'
import { summarizeHistory } from './missedRuns'

describe('summarizeHistory sparse records', () => {
  it('ignores null entries and treats a zero missed count as one missed run', () => {
    expect(
      summarizeHistory([
        null,
        'not a run',
        { status: 'missed', missedCount: 0 },
        { status: 'skipped', skippedCount: 2 },
        { status: 'done' },
      ])
    ).toEqual({ ran: 1, skipped: 2, missed: 1 })
  })
})
