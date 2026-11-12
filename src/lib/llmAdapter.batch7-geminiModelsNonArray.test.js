import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => vi.unstubAllGlobals())

describe('fetchGeminiModels malformed catalogue', () => {
  it('returns an empty list when models is not an array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ models: {} }) })
    )

    await expect(fetchGeminiModels('key')).resolves.toEqual([])
  })

  it('skips null entries and models without a string name', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          models: [
            null,
            { supportedGenerationMethods: ['generateContent'] },
            { name: 42, supportedGenerationMethods: ['generateContent'] },
            { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] },
          ],
        }),
      })
    )

    await expect(fetchGeminiModels('key')).resolves.toEqual([
      { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    ])
  })
})
