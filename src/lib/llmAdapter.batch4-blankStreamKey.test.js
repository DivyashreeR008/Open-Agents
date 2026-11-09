import { describe, expect, it } from 'vitest'
import { streamAgent } from './llmAdapter'

describe('stream blank key', () => {
  it('rejects a whitespace-only key before calling fetch', async () => {
    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: '   ',
        systemPrompt: 's',
        userMessage: 'u',
        onChunk: () => {},
      })
    ).rejects.toThrow('Please provide an API key')
  })
})
