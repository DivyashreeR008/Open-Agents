import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Gemini model catalogue labels', () => {
  it('falls back to the stripped model name when displayName is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          models: [
            {
              name: 'models/gemini-2.0-flash',
              supportedGenerationMethods: ['generateContent'],
            },
            {
              name: 'models/text-embedding-004',
              displayName: 'Embedding',
              supportedGenerationMethods: ['embedContent'],
            },
          ],
        }),
      })
    )

    await expect(fetchGeminiModels('AIza-test')).resolves.toEqual([
      { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
    ])
  })
})
