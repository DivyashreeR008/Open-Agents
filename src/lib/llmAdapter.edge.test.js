import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchGeminiModels edge behavior', () => {
  it('keeps only models that support generateContent and strips the model prefix', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          {
            name: 'models/gemini-2.5-pro',
            displayName: 'Gemini 2.5 Pro',
            supportedGenerationMethods: ['generateContent'],
          },
          { name: 'models/embedding-001', supportedGenerationMethods: ['embedContent'] },
          { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchGeminiModels('test-key')).resolves.toEqual([
      { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    ])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models?key=test-key'
    )
  })

  it('reports the HTTP status when the model catalogue request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))
    await expect(fetchGeminiModels('bad-key')).rejects.toThrow('HTTP 403')
  })
})
