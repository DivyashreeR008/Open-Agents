import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('runAgent network boundary', () => {
  it('turns a failed fetch into an actionable connection message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(
      runAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
      })
    ).rejects.toThrow("Couldn't reach the API. Check your internet connection and try again.")
  })
})
