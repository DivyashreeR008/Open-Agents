import { describe, expect, it } from 'vitest'
import { describeUnexecutedRun } from './missedRuns'

describe('describing a skipped run without a stored key reason', () => {
  it('uses the generic detail instead of claiming an API key is missing', () => {
    const result = describeUnexecutedRun({
      status: 'skipped',
      skippedCount: 2,
      firstWindow: Date.UTC(2026, 0, 1, 9),
      lastWindow: Date.UTC(2026, 0, 1, 10),
      reason: 'engine_error',
    })

    expect(result.title).toBe('2 runs skipped')
    expect(result.detail).toContain('could not start')
    expect(result.detail).not.toContain('no API key')
  })
})
