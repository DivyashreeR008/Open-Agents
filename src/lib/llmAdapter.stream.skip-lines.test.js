import { describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

describe('stream parser noise handling', () => {
  it('ignores comments, invalid JSON, and non-data lines while keeping the final buffer', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          enc.encode(
            ': keep-alive\n\nnot a data line\ndata: not-json\n\ndata: {"choices":[{"delta":{"content":"A"}}]}\n'
          )
        )
        controller.enqueue(enc.encode('data: [DONE]'))
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

    expect(chunks).toEqual(['A'])
    expect(result.content).toBe('A')
    vi.unstubAllGlobals()
  })
})
