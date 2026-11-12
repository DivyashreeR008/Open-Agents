import { describe, expect, it } from 'vitest'
import { MODEL_MAP, resolveAgentModel } from './resolveAgentModel'

describe('resolveAgentModel array agent', () => {
  it('ignores array properties and falls back to the provider default', () => {
    expect(resolveAgentModel([], 'gemini', 'not-a-model')).toBe(MODEL_MAP.gemini)
  })

  it('falls back to the OpenAI default for an unknown provider', () => {
    expect(resolveAgentModel(null, 'unknown', '')).toBe(MODEL_MAP.openai)
  })
})
