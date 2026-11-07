import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Retry-After wording', () => {
  it('honours millisecond wording and reports the short wait on the final failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers(),
      json: async () => ({ error: { message: 'Please try again in 250ms' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args)
    const settled = pending.then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(error.type).toBe('rate_limited')
    expect(error.retryAfterMs).toBe(250)
    expect(error.message).toContain('Wait about 1 second')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
