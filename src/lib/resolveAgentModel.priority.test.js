import { describe, expect, it } from 'vitest'
import { MODEL_MAP, resolveAgentModel } from './resolveAgentModel'

describe('model resolution priority', () => {
  it('prefers a provider-specific agent model over the provider default', () => {
    const agent = {
      provider: 'anthropic',
      defaultProvider: 'openai',
      model: 'claude-3-opus-20240229',
    }

    expect(resolveAgentModel(agent, 'anthropic', null)).toBe('claude-3-opus-20240229')
  })

  it('prefers an explicit selection over every agent-level default', () => {
    const agent = {
      provider: 'anthropic',
      defaultProvider: 'anthropic',
      model: 'claude-3-opus-20240229',
      models: { anthropic: 'claude-3-5-haiku-20241022' },
    }

    expect(resolveAgentModel(agent, 'anthropic', 'claude-3-5-sonnet-20241022')).toBe(
      'claude-3-5-sonnet-20241022'
    )
  })

  it('does not reuse a selection that belongs to another provider', () => {
    const agent = { defaultProvider: 'openai', model: 'gpt-4o' }

    expect(resolveAgentModel(agent, 'gemini', 'gpt-4o-mini')).toBe(MODEL_MAP.gemini)
  })

  it('falls back safely when the agent model map is absent', () => {
    const agent = { provider: 'openai', models: null }

    expect(resolveAgentModel(agent, 'openai', null)).toBe(MODEL_MAP.openai)
  })
})
