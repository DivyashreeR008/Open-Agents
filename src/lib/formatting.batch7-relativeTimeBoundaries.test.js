import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './formatting'

describe('formatRelativeTime boundary timestamps', () => {
  it('treats a negative zero timestamp as the epoch', () => {
    expect(formatRelativeTime(-0, 0)).toBe('just now')
  })

  it('treats a boxed number timestamp as unsupported instead of coercing it', () => {
    expect(formatRelativeTime(new Number(1000), 2000)).toBe('unknown')
  })
})
