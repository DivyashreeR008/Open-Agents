import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

function streamResponse(lines) {
  return {
    ok: true,
    status: 200,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode(lines))
        controller.close()
      },
    }),
  }
}

async function run(lines) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(streamResponse(lines)))
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

describe('stream error event messages', () => {
  it('uses a string error payload directly', async () => {
    await expect(run('data: {"error":"upstream failed"}\n\n')).rejects.toMatchObject({
      type: 'stream_error',
      message: 'upstream failed',
    })
  })

  it('falls back to the error type when no message is present', async () => {
    await expect(run('data: {"error":{"type":"overloaded"}}\n\n')).rejects.toMatchObject({
      type: 'stream_error',
      message: 'overloaded',
    })
  })

  it('falls back to the error status when message and type are absent', async () => {
    await expect(run('data: {"error":{"status":503}}\n\n')).rejects.toMatchObject({
      type: 'stream_error',
      message: '503',
    })
  })

  it('uses a readable default when the error object is empty', async () => {
    await expect(run('data: {"error":{}}\n\n')).rejects.toMatchObject({
      type: 'stream_error',
      message: 'The provider reported an error while streaming.',
    })
  })

  it('keeps the text that arrived before the error', async () => {
    const pending = run(
      'data: {"choices":[{"delta":{"content":"partial"}}]}\n\ndata: {"error":{"type":"overloaded"}}\n\n'
    )
    await expect(pending).rejects.toMatchObject({
      type: 'stream_error',
      partialContent: 'partial',
    })
  })
})
