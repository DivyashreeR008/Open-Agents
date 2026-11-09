import { describe, expect, it } from 'vitest'
import { parsePastedLines } from './batchRunner'

describe('batch pasted line parsing', () => {
  it('trims lines, drops blanks, and keeps Windows line endings', () => {
    expect(parsePastedLines('  one  \r\n\r\n two \n   \nthree')).toEqual(['one', 'two', 'three'])
    expect(parsePastedLines('')).toEqual([])
  })
})
