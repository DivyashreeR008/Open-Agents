import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

describe('retry delay cap', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('does not retry when the provider asks for more than twenty seconds', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': '30' }),
      json: async () => ({ error: { message: 'slow down' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      runAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
      })
    ).rejects.toMatchObject({ type: 'rate_limited', retryAfterMs: 30000 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
