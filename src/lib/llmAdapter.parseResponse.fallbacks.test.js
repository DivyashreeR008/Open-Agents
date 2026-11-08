import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

function response(body) {
  return { ok: true, status: 200, json: async () => body }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('response parsing fallbacks', () => {
  it('returns empty OpenAI content and zero tokens when fields are missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({})))
    const result = await runAgent({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
    })
    expect(result.content).toBe('')
    expect(result.tokens).toBe(0)
  })

  it('returns empty Anthropic content and zero tokens when fields are missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({})))
    const result = await runAgent({
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant',
      systemPrompt: 'sys',
      userMessage: 'hi',
    })
    expect(result.content).toBe('')
    expect(result.tokens).toBe(0)
  })

  it('returns empty Gemini content and zero tokens when fields are missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({})))
    const result = await runAgent({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: 'AIza-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
    })
    expect(result.content).toBe('')
    expect(result.tokens).toBe(0)
  })

  it('keeps content while treating a missing usage block as zero tokens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response({ choices: [{ message: { content: 'answer' } }] }))
    )
    const result = await runAgent({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
    })
    expect(result.content).toBe('answer')
    expect(result.tokens).toBe(0)
  })
})
