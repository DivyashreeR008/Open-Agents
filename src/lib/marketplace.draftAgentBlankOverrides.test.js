import { describe, expect, it } from 'vitest'
import { buildDraftAgent } from './marketplace'

const base = {
  id: 'base',
  name: 'Base agent',
  description: 'Base description',
  provider: 'openai',
  systemPrompt: 'Base prompt',
}

describe('marketplace draft agent overlay fallbacks', () => {
  it('keeps the base description and prompt when draft overrides are blank', () => {
    const agent = buildDraftAgent(
      {
        name: 'Imported agent',
        description: '',
        config: { baseAgentId: 'base', provider: 'gemini', systemPrompt: '   ' },
      },
      [base]
    )

    expect(agent).toMatchObject({
      id: 'base',
      name: 'Imported agent',
      description: 'Base description',
      provider: 'gemini',
      systemPrompt: 'Base prompt',
    })
  })
})
