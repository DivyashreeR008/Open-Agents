import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

describe('Gemini model discovery HTTP errors', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('throws the status when the model list cannot be fetched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    await expect(fetchGeminiModels('key')).rejects.toThrow('HTTP 503')
  })
})
