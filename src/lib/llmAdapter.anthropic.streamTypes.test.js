import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

function stream(lines) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(enc.encode(lines))
          controller.close()
        },
      }),
    })
  )
}

function call() {
  return streamAgent({
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    apiKey: 'sk-ant-test',
    systemPrompt: 'sys',
    userMessage: 'hi',
    onChunk: () => {},
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Anthropic stream event types', () => {
  it('reads text deltas and stops on message_stop while skipping setup events', async () => {
    stream(
      'data: {"type":"message_start"}\n\ndata: {"type":"content_block_start"}\n\ndata: {"type":"content_block_delta","delta":{"text":"Hel"}}\n\ndata: {"type":"content_block_delta","delta":{"text":"lo"}}\n\ndata: {"type":"message_stop"}\n\n'
    )

    const chunks = []
    const result = await streamAgent({
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant-test',
      systemPrompt: 'sys',
      userMessage: 'hi',
      onChunk: (chunk) => chunks.push(chunk),
    })

    expect(chunks).toEqual(['Hel', 'lo'])
    expect(result.content).toBe('Hello')
  })

  it('turns an Anthropic error event into a stream error with partial text', async () => {
    stream(
      'data: {"type":"content_block_delta","delta":{"text":"before"}}\n\ndata: {"type":"error","error":{"message":"overloaded"}}\n\n'
    )

    await expect(call()).rejects.toMatchObject({
      type: 'stream_error',
      message: 'overloaded',
      partialContent: 'before',
    })
  })

  it('treats a delta without text as empty content', async () => {
    stream(
      'data: {"type":"content_block_delta","delta":{}}\n\ndata: {"type":"content_block_delta","delta":{"text":"ok"}}\n\ndata: {"type":"message_stop"}\n\n'
    )

    await expect(call()).resolves.toMatchObject({ content: 'ok' })
  })
})
