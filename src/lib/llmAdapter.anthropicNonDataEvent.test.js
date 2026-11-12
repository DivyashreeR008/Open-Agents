import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Anthropic stream non-data events', () => {
  it('ignores event-only lines and keeps reading text deltas', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          enc.encode(
            'event: ping\n\ndata: {"type":"content_block_delta","delta":{"text":"Hi"}}\n\ndata: {"type":"message_stop"}\n\n'
          )
        )
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, body }))

    const result = await streamAgent({
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant',
      systemPrompt: 'sys',
      userMessage: 'hi',
      onChunk: () => {},
    })

    expect(result.content).toBe('Hi')
  })
})
