import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runAgent, streamAgent, classifyProviderError } from './llmAdapter'

const enc = new TextEncoder()

function res(status, body, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => body,
  }
}

const rateLimitBody = {
  error: {
    message: 'Rate limit reached for gpt-4o-mini on tokens per min',
    type: 'tokens',
    code: 'rate_limit_exceeded',
  },
}
const quotaBody = {
  error: {
    message: 'You exceeded your current quota, please check your plan and billing details.',
    type: 'insufficient_quota',
    code: 'insufficient_quota',
  },
}
const okBody = {
  choices: [{ message: { content: 'hello' } }],
  usage: { prompt_tokens: 1, completion_tokens: 1 },
}

const baseArgs = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

function sseStream(chunks) {
  return new ReadableStream({
    start(c) {
      for (const text of chunks) {
        c.enqueue(
          enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n`)
        )
      }
      c.enqueue(enc.encode('data: [DONE]\n'))
      c.close()
    },
  })
}

// Start a call and capture its outcome so a rejection never goes unhandled
// while fake timers are being advanced.
function settle(promise) {
  return promise.then(
    (value) => ({ value }),
    (error) => ({ error })
  )
}

describe('classifyProviderError', () => {
  it('treats OpenAI insufficient_quota as quota_exhausted', () => {
    expect(classifyProviderError(429, quotaBody.error.message, quotaBody)).toBe('quota_exhausted')
  })

  it('treats a plain OpenAI 429 as rate_limited', () => {
    expect(classifyProviderError(429, rateLimitBody.error.message, rateLimitBody)).toBe(
      'rate_limited'
    )
  })

  it('splits Gemini RESOURCE_EXHAUSTED by wording', () => {
    const perMinute = {
      error: {
        status: 'RESOURCE_EXHAUSTED',
        message:
          'Quota exceeded for metric: generate_content_free_tier_requests PerMinute. Please retry in 8.2s.',
      },
    }
    const perDay = {
      error: {
        status: 'RESOURCE_EXHAUSTED',
        message: 'You exceeded your current quota. Quota exceeded for metric: ... PerDay',
      },
    }
    expect(classifyProviderError(429, perMinute.error.message, perMinute)).toBe('rate_limited')
    expect(classifyProviderError(429, perDay.error.message, perDay)).toBe('quota_exhausted')
  })

  it('treats empty balances (402, Anthropic 400) as quota_exhausted', () => {
    expect(classifyProviderError(402, 'Insufficient credits')).toBe('quota_exhausted')
    expect(
      classifyProviderError(400, 'Your credit balance is too low to access the Anthropic API.')
    ).toBe('quota_exhausted')
  })

  it('ignores other failures', () => {
    expect(classifyProviderError(500, 'boom')).toBeNull()
    expect(classifyProviderError(400, 'bad request')).toBeNull()
  })
})

describe('runAgent rate limit handling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('retries a 429 and returns the later success', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res(429, rateLimitBody))
      .mockResolvedValueOnce(res(200, okBody))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.advanceTimersByTimeAsync(1000)
    const { value, error } = await outcome

    expect(error).toBeUndefined()
    expect(value.content).toBe('hello')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('waits for the Retry-After header before retrying', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res(429, rateLimitBody, { 'retry-after': '5' }))
      .mockResolvedValueOnce(res(200, okBody))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.advanceTimersByTimeAsync(4900)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)
    const { value } = await outcome
    expect(value.content).toBe('hello')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('gives up after 3 attempts with a clear rate limit error', async () => {
    const fetchMock = vi.fn(async () => res(429, rateLimitBody))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(error.type).toBe('rate_limited')
    expect(error.message).toMatch(/rate limit hit/i)
    expect(error.message).toMatch(/retried 2 times/i)
  })

  it('does not retry a quota failure', async () => {
    const fetchMock = vi.fn(async () => res(429, quotaBody))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(error.type).toBe('quota_exhausted')
    expect(error.message).toMatch(/quota used up/i)
    expect(error.message).toMatch(/billing/i)
  })

  it('does not wait when Retry-After is very long, and says how long', async () => {
    const fetchMock = vi.fn(async () => res(429, rateLimitBody, { 'retry-after': '120' }))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(error.type).toBe('rate_limited')
    expect(error.message).toMatch(/2 minutes/)
  })

  it('does not retry other server errors', async () => {
    const fetchMock = vi.fn(async () => res(500, { error: { message: 'oops' } }))
    vi.stubGlobal('fetch', fetchMock)

    const outcome = settle(runAgent(baseArgs))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(error.type).toBeUndefined()
    expect(error.message).toMatch(/server encountered an error/i)
  })

  it('stops waiting when the user aborts during backoff', async () => {
    const fetchMock = vi.fn(async () => res(429, rateLimitBody))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    const outcome = settle(runAgent(baseArgs, { signal: controller.signal }))
    await vi.advanceTimersByTimeAsync(10)
    controller.abort()
    const { error } = await outcome

    expect(error.name).toBe('AbortError')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('streamAgent rate limit handling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('retries a 429 that arrives before any chunk and delivers each chunk once', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(res(429, rateLimitBody))
      .mockResolvedValueOnce({ ...res(200, null), body: sseStream(['Hel', 'lo']) })
    vi.stubGlobal('fetch', fetchMock)
    const onChunk = vi.fn()

    const outcome = settle(streamAgent({ ...baseArgs, onChunk }))
    await vi.advanceTimersByTimeAsync(1000)
    const { value, error } = await outcome

    expect(error).toBeUndefined()
    expect(value.content).toBe('Hello')
    expect(onChunk.mock.calls.map((c) => c[0])).toEqual(['Hel', 'lo'])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry a quota failure', async () => {
    const fetchMock = vi.fn(async () => res(429, quotaBody))
    vi.stubGlobal('fetch', fetchMock)
    const onChunk = vi.fn()

    const outcome = settle(streamAgent({ ...baseArgs, onChunk }))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(error.type).toBe('quota_exhausted')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(onChunk).not.toHaveBeenCalled()
  })

  it('never retries once streaming has started', async () => {
    // one good chunk, then the connection dies
    const read = vi
      .fn()
      .mockResolvedValueOnce({
        done: false,
        value: enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: 'Hi' } }] })}\n`),
      })
      .mockRejectedValueOnce(new Error('connection dropped'))
    const body = { getReader: () => ({ read }) }
    const fetchMock = vi.fn(async () => ({ ...res(200, null), body }))
    vi.stubGlobal('fetch', fetchMock)
    const onChunk = vi.fn()

    const outcome = settle(streamAgent({ ...baseArgs, onChunk }))
    await vi.runAllTimersAsync()
    const { error } = await outcome

    expect(error.message).toBe('connection dropped')
    expect(onChunk).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
