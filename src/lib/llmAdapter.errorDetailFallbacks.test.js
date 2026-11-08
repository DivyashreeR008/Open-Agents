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
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function failedResponse(status, json) {
  return { ok: false, status, headers: new Headers(), json }
}

describe('provider error detail fallbacks', () => {
  it('serializes a non-standard error body into the details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(failedResponse(500, async () => ({ foo: 'bar' })))
    )

    await expect(runAgent(args)).rejects.toThrow('Details: {"foo":"bar"}')
  })

  it('omits the details line when the body cannot be parsed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        failedResponse(500, async () => {
          throw new Error('no body')
        })
      )
    )

    const error = await runAgent(args).catch((reason) => reason)
    expect(error.message).toContain('The API server encountered an error')
    expect(error.message).not.toContain('Details:')
  })

  it('uses a placeholder detail for an invalid key response without a body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        failedResponse(401, async () => {
          throw new Error('no body')
        })
      )
    )

    await expect(runAgent(args)).rejects.toMatchObject({
      type: 'invalid_api_key',
      detail: 'No additional details',
    })
  })

  it('reports a generic 429 wait when the body cannot be parsed', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue(
      failedResponse(429, async () => {
        throw new Error('no body')
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args).catch((reason) => reason)
    await vi.advanceTimersByTimeAsync(30000)
    const error = await pending

    expect(error).toMatchObject({ type: 'rate_limited', retryAfterMs: null })
    expect(error.message).toContain('Wait a moment and try again.')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
