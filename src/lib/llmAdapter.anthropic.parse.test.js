import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Anthropic one-shot request', () => {
  it('uses the messages endpoint, browser opt-in header, and usage totals', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        content: [{ text: 'claude answer' }],
        usage: { input_tokens: 9, output_tokens: 4 },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await runAgent({
      provider: 'anthropic',
      model: 'claude-sonnet-4',
      apiKey: 'sk-ant-test',
      systemPrompt: 'be direct',
      userMessage: 'hello',
    })

    expect(result.content).toBe('claude answer')
    expect(result.tokens).toBe(13)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(init.headers).toMatchObject({
      'x-api-key': 'sk-ant-test',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    })
    expect(JSON.parse(init.body)).toEqual({
      model: 'claude-sonnet-4',
      max_tokens: 4096,
      system: 'be direct',
      messages: [{ role: 'user', content: 'hello' }],
    })
  })
})
