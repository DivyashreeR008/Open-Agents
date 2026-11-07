import { describe, expect, it } from 'vitest'
import { MODEL_MAP, resolveAgentModel } from './resolveAgentModel'

describe('resolveAgentModel prototype-safe providers', () => {
  it('does not treat inherited object keys as provider names', () => {
    expect(resolveAgentModel({}, 'toString', '')).toBe(MODEL_MAP.openai)
    expect(
      resolveAgentModel({ models: Object.create({ toString: 'leaked' }) }, 'toString', '')
    ).toBe(MODEL_MAP.openai)
  })

  it('keeps a valid selected model for a real provider', () => {
    expect(resolveAgentModel({}, 'openai', 'gpt-4o-mini')).toBe('gpt-4o-mini')
  })
})
