import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Gemini model catalogue edge cases', () => {
  it('returns an empty list when models is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
    )
    await expect(fetchGeminiModels('key')).resolves.toEqual([])
  })

  it('returns an empty list when no model supports generateContent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          models: [
            { name: 'models/embed', supportedGenerationMethods: ['embedContent'] },
            { name: 'models/other' },
          ],
        }),
      })
    )
    await expect(fetchGeminiModels('key')).resolves.toEqual([])
  })

  it('throws an HTTP status when the catalogue request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) })
    )
    await expect(fetchGeminiModels('key')).rejects.toThrow('HTTP 403')
  })
})
