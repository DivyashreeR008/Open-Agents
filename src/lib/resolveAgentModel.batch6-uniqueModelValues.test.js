import { describe, expect, it } from 'vitest'
import { MODELS } from './resolveAgentModel'

describe('provider model labels', () => {
  it('keeps every model value unique and every label non-empty', () => {
    const values = Object.values(MODELS)
      .flat()
      .map((model) => model.value)
    expect(new Set(values).size).toBe(values.length)
    for (const [provider, models] of Object.entries(MODELS)) {
      for (const model of models) {
        expect(model.value.trim().length, provider).toBeGreaterThan(0)
        expect(model.label.trim().length, provider + ':' + model.value).toBeGreaterThan(0)
      }
    }
  })
})
