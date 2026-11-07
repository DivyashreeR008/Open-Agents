import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('OpenRouter one-shot request', () => {
  it('sends the documented attribution headers and reads the chat completion', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'routed answer' } }],
        usage: { prompt_tokens: 7, completion_tokens: 5 },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await runAgent({
      provider: 'openrouter',
      model: 'openai/gpt-4o-mini',
      apiKey: 'sk-or-test',
      systemPrompt: 'system text',
      userMessage: 'user text',
    })

    expect(result.content).toBe('routed answer')
    expect(result.tokens).toBe(12)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer sk-or-test',
      'HTTP-Referer': 'https://open-agents.app',
      'X-Title': 'OpenAgents',
    })
    expect(JSON.parse(init.body)).toEqual({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'system text' },
        { role: 'user', content: 'user text' },
      ],
      max_tokens: 4096,
    })
  })
})
