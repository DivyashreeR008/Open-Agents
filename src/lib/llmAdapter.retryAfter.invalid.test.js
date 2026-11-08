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

describe('invalid Retry-After headers', () => {
  it('falls back to exponential backoff when the header is not a number or date', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': 'soon' }),
      json: async () => ({ error: { message: 'slow down' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const settled = runAgent(args).then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(error.retryAfterMs).toBeNull()
    expect(error.message).toContain('Wait a moment and try again.')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('treats a negative Retry-After as no wait', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': '-4' }),
      json: async () => ({ error: { message: 'slow down' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const settled = runAgent(args).then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(error.retryAfterMs).toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('treats a past Retry-After date as no wait', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': 'Wed, 21 Oct 2015 07:28:00 GMT' }),
      json: async () => ({ error: { message: 'slow down' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const settled = runAgent(args).then(
      (value) => ({ value }),
      (error) => ({ error })
    )
    await vi.runAllTimersAsync()
    const { error } = await settled

    expect(error.retryAfterMs).toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
