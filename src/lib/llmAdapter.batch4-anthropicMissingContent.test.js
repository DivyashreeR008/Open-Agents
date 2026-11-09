import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

describe('Anthropic response fallbacks', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns empty content and zero tokens for a sparse payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ content: [] }),
      })
    )

    await expect(
      runAgent({
        provider: 'anthropic',
        model: 'claude-3-5-haiku-20241022',
        apiKey: 'sk-ant',
        systemPrompt: 's',
        userMessage: 'u',
      })
    ).resolves.toMatchObject({ content: '', tokens: 0 })
  })
})
