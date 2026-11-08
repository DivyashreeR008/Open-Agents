import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

function errorResponse(status, body) {
  return {
    ok: false,
    status,
    headers: new Headers(),
    json: async () => body,
  }
}

async function capture() {
  try {
    await runAgent(args)
    return null
  } catch (error) {
    return error
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('provider error classification fallbacks', () => {
  it('treats a 402 as exhausted quota', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(402, {})))
    const error = await capture()
    expect(error.type).toBe('quota_exhausted')
  })

  it('treats an Anthropic low balance 400 as exhausted quota', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          errorResponse(400, { error: { message: 'Your credit balance is too low' } })
        )
    )
    const error = await capture()
    expect(error.type).toBe('quota_exhausted')
  })

  it('treats insufficient_quota as exhausted quota', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          errorResponse(429, { error: { code: 'insufficient_quota', message: 'no funds' } })
        )
    )
    const error = await capture()
    expect(error.type).toBe('quota_exhausted')
  })

  it('treats a daily limit as exhausted quota', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(errorResponse(429, { error: { message: 'Daily limit reached' } }))
    )
    const error = await capture()
    expect(error.type).toBe('quota_exhausted')
  })

  it('treats a per-minute limit as rate limited', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(errorResponse(429, { error: { message: 'Per minute limit reached' } }))
    )
    const error = await capture()
    expect(error.type).toBe('rate_limited')
  })

  it('treats a generic quota message as exhausted quota', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          errorResponse(429, { error: { message: 'Quota exceeded for this project' } })
        )
    )
    const error = await capture()
    expect(error.type).toBe('quota_exhausted')
  })

  it('keeps a generic 429 without detail as rate limited', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(429, {})))
    const error = await capture()
    expect(error.type).toBe('rate_limited')
    expect(error.message).toContain('Rate limit hit.')
  })
})
