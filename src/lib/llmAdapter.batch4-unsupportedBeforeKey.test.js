import { describe, expect, it } from 'vitest'
import { streamAgent } from './llmAdapter'

describe('stream provider validation order', () => {
  it('reports an unsupported provider before complaining about the key', async () => {
    await expect(
      streamAgent({
        provider: 'mistral',
        model: 'm',
        apiKey: '',
        systemPrompt: 's',
        userMessage: 'u',
        onChunk: () => {},
      })
    ).rejects.toThrow('Unsupported provider: mistral')
  })
})
