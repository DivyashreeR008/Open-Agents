import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

describe('Gemini streaming URL', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('uses the SSE endpoint with the model and key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            enc.encode(
              'data: {"candidates":[{"content":{"parts":[{"text":"hi"}]},"finishReason":"STOP"}]}\n\n'
            )
          )
          controller.close()
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await streamAgent({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: 'key-123',
      systemPrompt: 's',
      userMessage: 'u',
      onChunk: () => {},
    })

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=key-123'
    )
  })
})
