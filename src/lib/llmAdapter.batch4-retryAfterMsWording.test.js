import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

describe('retry delay millisecond wording', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('reads a millisecond retry hint from the provider message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers(),
      json: async () => ({ error: { message: 'Please retry in 250ms' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const settled = runAgent(args).then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(error.retryAfterMs).toBe(250)
    expect(error.message).toContain('Wait about 1 second')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
