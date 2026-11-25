import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streamAgent final data buffer without trailing newline', () => {
  it('processes a final data line remaining in buffer without a trailing newline', async () => {
    // Deliver chunk where data line does not end with \n
    const chunk1 = 'data: {"choices":[{"delta":{"content":"Hello world"},"finish_reason":"stop"}]}'
    const response = {
      ok: true,
      status: 200,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(enc.encode(chunk1))
          controller.close()
        },
      }),
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    let streamedText = ''
    const onChunk = vi.fn((text) => {
      streamedText += text
    })

    const result = await streamAgent({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'test-key',
      systemPrompt: 'You are an assistant',
      userPrompt: 'Hi',
      onChunk,
    })

    expect(result.content).toBe('Hello world')
    expect(streamedText).toBe('Hello world')
    expect(onChunk).toHaveBeenCalledWith('Hello world')
  })
})
