import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('runAgent optional request options', () => {
  it('runs a request when the options argument is omitted entirely', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'answer' } }],
        usage: { prompt_tokens: 2, completion_tokens: 3 },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await runAgent({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
    })

    expect(result).toMatchObject({ content: 'answer', tokens: 5 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1].signal).toBeUndefined()
  })
})
