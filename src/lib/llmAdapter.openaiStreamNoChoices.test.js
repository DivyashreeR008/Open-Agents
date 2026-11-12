import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('OpenAI stream events without a choice payload', () => {
  it('ignores an event with no choices and still completes on the done marker', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode('data: {"id":"chatcmpl-1"}\n\ndata: [DONE]\n\n'))
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

    expect(chunks).toEqual([])
    expect(result.content).toBe('')
  })
})
