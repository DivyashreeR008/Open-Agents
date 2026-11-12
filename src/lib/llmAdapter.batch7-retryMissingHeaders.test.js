import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('rate limit response without headers', () => {
  it('falls back to the default backoff', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'slow down' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: 'done' } }] }),
      })
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args)
    const settled = pending.then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { value, error } = await settled

    expect(error).toBeUndefined()
    expect(value.content).toBe('done')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
