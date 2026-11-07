import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streamAgent network boundary', () => {
  it('turns a failed fetch into the same actionable connection message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow("Couldn't reach the API. Check your internet connection and try again.")
  })
})
