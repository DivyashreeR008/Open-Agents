import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

describe('Gemini model label fallback', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('uses the stripped model name when displayName is absent and skips unsupported methods', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          models: [
            { name: 'models/gemini-flash', supportedGenerationMethods: ['generateContent'] },
            { name: 'models/embedding', supportedGenerationMethods: ['embedContent'] },
          ],
        }),
      })
    )

    await expect(fetchGeminiModels('key')).resolves.toEqual([
      { value: 'gemini-flash', label: 'gemini-flash' },
    ])
  })
})
