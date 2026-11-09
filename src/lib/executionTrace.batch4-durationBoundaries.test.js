import { describe, expect, it } from 'vitest'
import { formatDuration } from './executionTrace'

describe('trace duration formatting boundaries', () => {
  it('switches units at one second and one minute', () => {
    expect(formatDuration(0)).toBe('0ms')
    expect(formatDuration(999)).toBe('999ms')
    expect(formatDuration(1000)).toBe('1.0s')
    expect(formatDuration(59999)).toBe('60.0s')
    expect(formatDuration(60000)).toBe('1m 0s')
    expect(formatDuration(61500)).toBe('1m 2s')
  })

  it('returns zero for invalid and negative durations', () => {
    expect(formatDuration(-1)).toBe('0ms')
    expect(formatDuration(Number.NaN)).toBe('0ms')
    expect(formatDuration(Infinity)).toBe('0ms')
  })
})
