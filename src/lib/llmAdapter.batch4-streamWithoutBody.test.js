import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

describe('stream response without a body', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('reports that streaming is unavailable instead of throwing a TypeError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, body: null }))

    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 's',
        userMessage: 'u',
        onChunk: () => {},
      })
    ).rejects.toThrow('Streaming is not supported by this response')
  })
})
