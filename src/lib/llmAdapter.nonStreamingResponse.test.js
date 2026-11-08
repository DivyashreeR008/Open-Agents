import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

function call(options = {}) {
  return streamAgent({
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: 'sk-test',
    systemPrompt: 'sys',
    userMessage: 'hi',
    onChunk: () => {},
    ...options,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streaming response guards', () => {
  it('rejects a response without a body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    await expect(call()).rejects.toThrow(
      'Streaming is not supported by this response. Please try again.'
    )
  })

  it('rejects a body without a reader', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, body: { getReader: null } })
    )
    await expect(call()).rejects.toThrow(
      'Streaming is not supported by this response. Please try again.'
    )
  })

  it('returns partial content when the signal is aborted before the stream closes', async () => {
    const enc = new TextEncoder()
    const controller = new AbortController()
    let release
    const gate = new Promise((resolve) => {
      release = resolve
    })
    const body = new ReadableStream({
      async start(streamController) {
        streamController.enqueue(enc.encode('data: {"choices":[{"delta":{"content":"kept"}}]}\n\n'))
        await gate
        streamController.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, body }))

    const pending = call({ signal: controller.signal })
    await Promise.resolve()
    controller.abort()
    release()
    await expect(pending).resolves.toMatchObject({ content: 'kept' })
  })

  it('returns partial content when the reader reports an abort', async () => {
    const enc = new TextEncoder()
    let readCount = 0
    const body = {
      getReader: () => ({
        read: async () => {
          readCount += 1
          if (readCount === 1) {
            return {
              done: false,
              value: enc.encode('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n'),
            }
          }
          throw new DOMException('The operation was aborted.', 'AbortError')
        },
      }),
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, body }))

    await expect(call()).resolves.toMatchObject({ content: 'partial' })
  })
})
