import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

function responseFor(text) {
  return {
    ok: true,
    status: 200,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode(text))
        controller.close()
      },
    }),
  }
}

function call() {
  return streamAgent({
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: 'sk-test',
    systemPrompt: 'sys',
    userMessage: 'hi',
    onChunk: () => {},
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('OpenAI stream termination', () => {
  it('accepts a finish reason other than stop as a complete response', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          responseFor(
            'data: {"choices":[{"delta":{"content":"cut"}}]}\n\ndata: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\n'
          )
        )
    )

    await expect(call()).resolves.toMatchObject({ content: 'cut' })
  })

  it('accepts the DONE marker and ignores an empty delta', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          responseFor(
            'data: {"choices":[{"delta":{}}]}\n\ndata: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n'
          )
        )
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

    expect(chunks).toEqual(['ok'])
    expect(result.content).toBe('ok')
  })

  it('rejects a stream that closes without a terminator', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          responseFor('data: {"choices":[{"delta":{"content":"unfinished"}}]}\n\n')
        )
    )

    await expect(call()).rejects.toMatchObject({
      type: 'stream_error',
      partialContent: 'unfinished',
    })
  })
})
