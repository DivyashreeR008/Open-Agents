import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  apiKey: 'AIza-bad',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Gemini bad key responses', () => {
  it('maps an API_KEY_INVALID detail to invalid_api_key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers(),
        json: async () => ({
          error: {
            message: 'Bad request',
            details: [{ reason: 'API_KEY_INVALID' }],
          },
        }),
      })
    )

    await expect(runAgent(args)).rejects.toMatchObject({
      type: 'invalid_api_key',
      provider: 'gemini',
    })
  })

  it('maps an API key not valid message to invalid_api_key', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers(),
        json: async () => ({
          error: { message: 'API key not valid. Please pass a valid API key.' },
        }),
      })
    )

    await expect(runAgent(args)).rejects.toMatchObject({
      type: 'invalid_api_key',
      provider: 'gemini',
    })
  })

  it('maps a 401 to invalid_api_key for every provider', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: new Headers(),
        json: async () => undefined,
      })
    )

    await expect(runAgent(args)).rejects.toMatchObject({
      type: 'invalid_api_key',
      detail: 'No additional details',
    })
  })
})
