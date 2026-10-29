import { describe, it, expect, vi, afterEach } from 'vitest'
import { runAgent, streamAgent } from './llmAdapter'

describe('streamAgent response body', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('throws a clear error when the body is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, body: null })))
    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow(/streaming is not supported/i)
  })

  it('throws a clear error when getReader is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, body: {} })))
    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow(/streaming is not supported/i)
  })
})

describe('Gemini invalid key', () => {
  const geminiArgs = {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: 'bogus123',
    systemPrompt: 'sys',
    userMessage: 'hi',
  }

  // Shape returned by the real Google endpoint for a bad key.
  const badKeyBody = {
    error: {
      code: 400,
      message: 'API key not valid. Please pass a valid API key.',
      status: 'INVALID_ARGUMENT',
      details: [
        { '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason: 'API_KEY_INVALID' },
      ],
    },
  }

  const mockResponse = (status, body) =>
    vi.fn(async () => ({
      ok: false,
      status,
      headers: new Headers(),
      json: async () => body,
    }))

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('streamAgent reports invalid_api_key for a 400 API_KEY_INVALID', async () => {
    vi.stubGlobal('fetch', mockResponse(400, badKeyBody))
    await expect(streamAgent({ ...geminiArgs, onChunk: () => {} })).rejects.toMatchObject({
      type: 'invalid_api_key',
      provider: 'gemini',
    })
  })

  it('runAgent reports invalid_api_key for a 400 API_KEY_INVALID', async () => {
    vi.stubGlobal('fetch', mockResponse(400, badKeyBody))
    await expect(runAgent(geminiArgs)).rejects.toMatchObject({
      type: 'invalid_api_key',
      provider: 'gemini',
    })
  })

  it('also matches on the message when details are missing', async () => {
    vi.stubGlobal(
      'fetch',
      mockResponse(400, { error: { code: 400, message: 'API key not valid. Please pass a valid API key.' } })
    )
    await expect(runAgent(geminiArgs)).rejects.toMatchObject({ type: 'invalid_api_key' })
  })

  it('still treats other Gemini 400 errors as generic errors', async () => {
    vi.stubGlobal(
      'fetch',
      mockResponse(400, { error: { code: 400, message: 'Invalid JSON payload received.', status: 'INVALID_ARGUMENT' } })
    )
    const err = await runAgent(geminiArgs).catch((e) => e)
    expect(err.type).toBeUndefined()
    expect(err.message).toMatch(/API returned status 400/)
  })

  it('does not treat a 400 from another provider as an invalid key', async () => {
    vi.stubGlobal('fetch', mockResponse(400, badKeyBody))
    const err = await runAgent({ ...geminiArgs, provider: 'openai', model: 'gpt-4o-mini' }).catch((e) => e)
    expect(err.type).toBeUndefined()
  })
})
