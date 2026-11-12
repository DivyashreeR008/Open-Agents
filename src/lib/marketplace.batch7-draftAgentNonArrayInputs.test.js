import { describe, expect, it } from 'vitest'
import { buildDraftAgent } from './marketplace'

describe('buildDraftAgent input shape', () => {
  it('normalizes non-array inputs and falls back to the base provider', () => {
    const draft = {
      name: 'Imported',
      description: 'Desc',
      config: { baseAgentId: 'base', provider: 'not-a-provider' },
    }
    const agents = [{ id: 'base', provider: 'gemini', inputs: 'bad', systemPrompt: 'Prompt' }]

    const agent = buildDraftAgent(draft, agents)

    expect(agent.provider).toBe('gemini')
    expect(agent.inputs).toEqual([])
  })
})
