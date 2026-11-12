import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => vi.unstubAllGlobals())

describe('fetchGeminiModels empty display name', () => {
  it('uses the stripped model name when displayName is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          models: [
            {
              name: 'models/gemini-2.5-flash',
              displayName: '',
              supportedGenerationMethods: ['generateContent'],
            },
          ],
        }),
      })
    )

    await expect(fetchGeminiModels('key')).resolves.toEqual([
      { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    ])
  })
})
