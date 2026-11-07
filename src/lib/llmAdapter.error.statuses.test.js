import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('provider status messages', () => {
  it('maps server and permission statuses without losing the provider detail', async () => {
    const cases = [
      [403, 'Access forbidden'],
      [500, 'The API server encountered an error'],
      [502, 'Bad gateway'],
      [503, 'The API service is temporarily unavailable'],
    ]

    for (const [status, expected] of cases) {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status,
          headers: new Headers(),
          json: async () => ({ error: { message: `detail for ${status}` } }),
        })
      )

      await expect(runAgent(args)).rejects.toThrow(
        new RegExp(`${expected}[\\s\\S]*detail for ${status}`)
      )
    }
  })

  it('falls back to a configured-status message when the error body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 418,
        headers: new Headers(),
        json: async () => {
          throw new SyntaxError('not json')
        },
      })
    )

    await expect(runAgent(args)).rejects.toThrow(
      'API returned status 418. Please check your configuration.'
    )
  })
})
