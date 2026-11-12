import { describe, expect, it } from 'vitest'
import { MODELS, MODEL_MAP } from './resolveAgentModel'

describe('provider model defaults', () => {
  it('maps every provider to its first selectable model', () => {
    expect(Object.keys(MODEL_MAP).sort()).toEqual(Object.keys(MODELS).sort())
    for (const [provider, models] of Object.entries(MODELS)) {
      expect(MODEL_MAP[provider], provider).toBe(models[0].value)
    }
  })
})
