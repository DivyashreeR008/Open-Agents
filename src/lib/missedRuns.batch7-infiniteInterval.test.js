import { describe, expect, it } from 'vitest'
import { dueWindows } from './missedRuns'

describe('dueWindows infinite interval', () => {
  it('returns null because an infinite schedule has no finite windows', () => {
    expect(dueWindows({ nextRunAt: 0, intervalMs: Infinity, now: 1000 })).toBeNull()
  })
})
