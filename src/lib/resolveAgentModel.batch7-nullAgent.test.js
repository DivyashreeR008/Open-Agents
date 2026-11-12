import { describe, expect, it } from 'vitest'
import { MODEL_MAP, resolveAgentModel } from './resolveAgentModel'

describe('resolveAgentModel missing agent definitions', () => {
  it('falls back to the provider default when the agent is null', () => {
    expect(resolveAgentModel(null, 'anthropic', null)).toBe(MODEL_MAP.anthropic)
  })

  it('falls back to the provider default when the agent is undefined', () => {
    expect(resolveAgentModel(undefined, 'gemini', 'not-a-model')).toBe(MODEL_MAP.gemini)
  })
})
