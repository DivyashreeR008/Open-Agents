import { describe, expect, it } from 'vitest'
import { buildDraftAgent } from './marketplace'

describe('buildDraftAgent empty snapshot prompt', () => {
  it('falls back to the base prompt when the snapshot prompt is blank', () => {
    const draft = {
      name: 'Imported',
      config: {
        baseAgentId: 'base',
        agentSnapshot: { id: 'snap', inputs: [], systemPrompt: '   ' },
      },
    }
    const agents = [{ id: 'base', provider: 'openai', inputs: [], systemPrompt: 'Base prompt' }]

    expect(buildDraftAgent(draft, agents).systemPrompt).toBe('Base prompt')
  })
})
