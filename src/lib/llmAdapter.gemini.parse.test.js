import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Gemini one-shot request', () => {
  it('places the key in the generateContent URL and joins both prompts', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'gemini answer' }] } }],
        usageMetadata: { promptTokenCount: 3, candidatesTokenCount: 6 },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await runAgent({
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      apiKey: 'AIza-test',
      systemPrompt: 'system',
      userMessage: 'question',
    })

    expect(result.content).toBe('gemini answer')
    expect(result.tokens).toBe(9)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIza-test'
    )
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual({
      contents: [{ parts: [{ text: 'system\n\nquestion' }] }],
    })
  })
})
