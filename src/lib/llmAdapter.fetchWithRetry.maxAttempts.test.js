import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

function response(status, headers = new Headers(), body = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => body,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('retry policy limits', () => {
  it('retries a plain 429 three times and reports the retry count', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(response(429, new Headers(), { error: { message: 'rate limited' } }))
    vi.stubGlobal('fetch', fetchMock)

    const settled = runAgent(args).then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(error.type).toBe('rate_limited')
    expect(error.message).toContain('Retried 2 times')
  })

  it('does not retry a server error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(500, new Headers(), {}))
    vi.stubGlobal('fetch', fetchMock)

    await expect(runAgent(args)).rejects.toThrow('The API server encountered an error')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('succeeds on the second attempt after a 429', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(429, new Headers(), { error: { message: 'wait' } }))
      .mockResolvedValueOnce(
        response(200, new Headers(), {
          choices: [{ message: { content: 'after retry' } }],
          usage: { prompt_tokens: 1, completion_tokens: 1 },
        })
      )
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args)
    await vi.runAllTimersAsync()
    await expect(pending).resolves.toMatchObject({ content: 'after retry' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry when the requested wait exceeds the cap', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        response(429, new Headers({ 'retry-after': '25' }), { error: { message: 'wait' } })
      )
    vi.stubGlobal('fetch', fetchMock)

    await expect(runAgent(args)).rejects.toMatchObject({
      type: 'rate_limited',
      retryAfterMs: 25000,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
