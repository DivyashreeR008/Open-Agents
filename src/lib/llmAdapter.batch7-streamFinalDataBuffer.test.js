import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

function body(text) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('streamAgent final data buffer', () => {
  it('processes a final data line without a trailing newline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        body: body('data: {"choices":[{"delta":{"content":"tail"},"finish_reason":"stop"}]}'),
      })
    )

    const chunks = []
    const result = await streamAgent({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
      onChunk: (chunk) => chunks.push(chunk),
    })

    expect(result.content).toBe('tail')
    expect(chunks).toEqual(['tail'])
  })
})
