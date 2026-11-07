import { describe, expect, it } from 'vitest'
import { EXTRA_PREFERENCE_OPTIONS } from './constants'
import { CAPABILITY_KEYWORDS } from './rules'

describe('extra preference capability mapping', () => {
  it('gives every extra preference a keyword table entry', () => {
    for (const option of EXTRA_PREFERENCE_OPTIONS) {
      expect(CAPABILITY_KEYWORDS[option.capability], option.id).toEqual(expect.any(Array))
      expect(CAPABILITY_KEYWORDS[option.capability].length).toBeGreaterThan(0)
    }
  })
})
