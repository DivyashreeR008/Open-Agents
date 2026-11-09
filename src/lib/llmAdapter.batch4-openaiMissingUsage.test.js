import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

describe('OpenAI response fallbacks', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns empty content and zero tokens when choices and usage are missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
    )

    await expect(
      runAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 's',
        userMessage: 'u',
      })
    ).resolves.toMatchObject({ content: '', tokens: 0 })
  })
})
