import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('OpenAI stream delta without content', () => {
  it('treats an empty delta as no text and continues', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          enc.encode(
            'data: {"choices":[{"delta":{}}]}\n\ndata: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n'
          )
        )
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, body }))

    const chunks = []
    const result = await streamAgent({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
      onChunk: (chunk) => chunks.push(chunk),
    })

    expect(chunks).toEqual(['ok'])
    expect(result.content).toBe('ok')
  })
})
