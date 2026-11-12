import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGeminiModels } from './llmAdapter'

afterEach(() => vi.unstubAllGlobals())

describe('fetchGeminiModels invalid JSON', () => {
  it('rejects with the JSON parse failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('bad json')
        },
      })
    )

    await expect(fetchGeminiModels('key')).rejects.toThrow('bad json')
  })
})
