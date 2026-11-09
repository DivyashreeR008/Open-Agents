import { describe, expect, it } from 'vitest'
import { MODEL_MAP, resolveAgentModel } from './resolveAgentModel'

describe('agent model resolution fallbacks', () => {
  it('keeps a selected model that is valid for the provider', () => {
    expect(resolveAgentModel({}, 'openai', 'gpt-4o-mini')).toBe('gpt-4o-mini')
  })

  it('uses provider-specific agent models and provider defaults', () => {
    expect(
      resolveAgentModel({ models: { anthropic: 'claude-3-5-haiku-20241022' } }, 'anthropic')
    ).toBe('claude-3-5-haiku-20241022')
    expect(resolveAgentModel({ model: 'custom-model', provider: 'gemini' }, 'gemini')).toBe(
      'custom-model'
    )
    expect(resolveAgentModel({}, 'openrouter')).toBe(MODEL_MAP.openrouter)
  })

  it('falls back to the OpenAI default for an unknown provider', () => {
    expect(resolveAgentModel({}, 'unknown')).toBe(MODEL_MAP.openai)
  })
})
