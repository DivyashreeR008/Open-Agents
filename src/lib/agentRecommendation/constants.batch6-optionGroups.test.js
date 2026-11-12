import { describe, expect, it } from 'vitest'
import {
  EXPERIENCE_OPTIONS,
  PROVIDER_OPTIONS,
  BUDGET_OPTIONS,
  EXTRA_PREFERENCE_OPTIONS,
} from './constants'

describe('recommendation option groups', () => {
  it('keeps ids and labels unique inside every option group', () => {
    for (const [name, options] of Object.entries({
      experience: EXPERIENCE_OPTIONS,
      provider: PROVIDER_OPTIONS,
      budget: BUDGET_OPTIONS,
      extra: EXTRA_PREFERENCE_OPTIONS,
    })) {
      const ids = options.map((option) => option.id)
      const labels = options.map((option) => option.label)
      expect(new Set(ids).size, name).toBe(ids.length)
      expect(new Set(labels).size, name).toBe(labels.length)
    }
  })
})
