import { describe, expect, it } from 'vitest'
import { EXPERIENCE_OPTIONS, PROVIDER_OPTIONS, BUDGET_OPTIONS } from './constants'

describe('recommendation option descriptions', () => {
  it('ends every preference description with sentence punctuation', () => {
    for (const options of [EXPERIENCE_OPTIONS, PROVIDER_OPTIONS, BUDGET_OPTIONS]) {
      for (const option of options) {
        expect(option.description, option.id).toMatch(/[.!?]$/)
      }
    }
  })
})
