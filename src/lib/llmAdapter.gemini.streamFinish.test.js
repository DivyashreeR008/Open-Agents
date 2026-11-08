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
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: 'AIza-test',
    systemPrompt: 'sys',
    userMessage: 'hi',
    onChunk: () => {},
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Gemini stream finish handling', () => {
  it('accepts STOP as a complete response', async () => {
    stream(
      'data: {"candidates":[{"content":{"parts":[{"text":"done"}]},"finishReason":"STOP"}]}\n\n'
    )
    await expect(call()).resolves.toMatchObject({ content: 'done' })
  })

  it('accepts another finish reason as a terminated response', async () => {
    stream(
      'data: {"candidates":[{"content":{"parts":[{"text":"trimmed"}]},"finishReason":"MAX_TOKENS"}]}\n\n'
    )
    await expect(call()).resolves.toMatchObject({ content: 'trimmed' })
  })

  it('turns a Gemini error event into a stream error', async () => {
    stream('data: {"error":{"message":"quota exceeded"}}\n\n')
    await expect(call()).rejects.toMatchObject({
      type: 'stream_error',
      message: 'quota exceeded',
    })
  })

  it('treats a candidate without text as empty content', async () => {
    stream(
      'data: {"candidates":[{"content":{"parts":[]}}]}\n\ndata: {"candidates":[{"content":{"parts":[{"text":"ok"}]},"finishReason":"STOP"}]}\n\n'
    )
    await expect(call()).resolves.toMatchObject({ content: 'ok' })
  })
})
