import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

function ok(content, usage) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content } }],
      content: [{ text: content }],
      candidates: [{ content: { parts: [{ text: content }] } }],
      usage,
      usageMetadata: usage,
    }),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('provider request shapes', () => {
  it('sends OpenAI system and user messages with a bearer token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(ok('openai', { prompt_tokens: 3, completion_tokens: 2 }))
    vi.stubGlobal('fetch', fetchMock)

    await runAgent({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-openai',
      systemPrompt: 'system',
      userMessage: 'user',
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.openai.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer sk-openai')
    expect(JSON.parse(init.body)).toMatchObject({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'system' },
        { role: 'user', content: 'user' },
      ],
    })
  })

  it('sends Anthropic headers, a top-level system prompt, and user content', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(ok('anthropic', { input_tokens: 4, output_tokens: 1 }))
    vi.stubGlobal('fetch', fetchMock)

    await runAgent({
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant',
      systemPrompt: 'system',
      userMessage: 'user',
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(init.headers).toMatchObject({
      'x-api-key': 'sk-ant',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    })
    expect(JSON.parse(init.body)).toMatchObject({
      model: 'claude-3-5-haiku-20241022',
      system: 'system',
      messages: [{ role: 'user', content: 'user' }],
    })
  })

  it('puts the Gemini key in the URL and combines both prompts into one part', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(ok('gemini', { promptTokenCount: 5, candidatesTokenCount: 2 }))
    vi.stubGlobal('fetch', fetchMock)

    await runAgent({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: 'AIza-key',
      systemPrompt: 'system',
      userMessage: 'user',
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIza-key'
    )
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual({
      contents: [{ parts: [{ text: 'system\n\nuser' }] }],
    })
  })
})
