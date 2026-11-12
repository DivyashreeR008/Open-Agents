import { describe, expect, it } from 'vitest'
import { describeUnexecutedRun } from './missedRuns'

describe('describeUnexecutedRun zero skipped count', () => {
  it('still describes a single skipped run and the missing key reason', () => {
    const copy = describeUnexecutedRun({
      status: 'skipped',
      skippedCount: 0,
      reason: 'no_key',
      startedAt: 0,
    })

    expect(copy.title).toBe('1 run skipped')
    expect(copy.detail).toContain('no API key is stored for this automation')
  })
})
