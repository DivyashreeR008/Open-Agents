import { describe, expect, it } from 'vitest'
import { MODELS } from './resolveAgentModel'
import { MODEL_PRICING } from './modelPricing'

describe('selectable model pricing coverage', () => {
  it('publishes pricing for every model offered by the provider selector', () => {
    for (const [provider, models] of Object.entries(MODELS)) {
      for (const model of models) {
        expect(MODEL_PRICING[model.value], provider + ':' + model.value).toBeDefined()
      }
    }
  })
})
