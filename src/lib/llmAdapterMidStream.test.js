import { describe, it, expect, vi, afterEach } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

const sse = (obj) => `data: ${JSON.stringify(obj)}\n\n`

// Fake fetch returning a 200 response whose body streams the given SSE text.
function stubStream(chunks) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      body: new ReadableStream({
        start(c) {
          for (const chunk of chunks) c.enqueue(enc.encode(chunk))
          c.close()
        },
      }),
    }))
  )
}

const args = (provider, extra = {}) => ({
  provider,
  model: 'm',
  apiKey: 'key',
  systemPrompt: 'sys',
  userMessage: 'hi',
  onChunk: () => {},
  ...extra,
})

const openaiDelta = (text) => sse({ choices: [{ delta: { content: text } }] })
const anthropicDelta = (text) =>
  `event: content_block_delta\n${sse({ type: 'content_block_delta', delta: { text } })}`
const geminiText = (text, finishReason) =>
  sse({ candidates: [{ content: { parts: [{ text }] }, ...(finishReason ? { finishReason } : {}) }] })

describe('streamAgent provider error sent inside the stream', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('anthropic: throws on an error event and keeps the partial text', async () => {
    stubStream([
      anthropicDelta('partial answer '),
      `event: error\n${sse({ type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } })}`,
    ])
    const chunks = []
    const err = await streamAgent(args('anthropic', { onChunk: (c) => chunks.push(c) })).catch((e) => e)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Overloaded')
    expect(err.type).toBe('stream_error')
    expect(err.partialContent).toBe('partial answer ')
    expect(chunks).toEqual(['partial answer '])
  })

  it('openai: throws on a data: {"error": ...} chunk', async () => {
    stubStream([
      openaiDelta('partial answer '),
      sse({ error: { message: 'The server had an error while processing your request', type: 'server_error' } }),
    ])
    const err = await streamAgent(args('openai')).catch((e) => e)
    expect(err.message).toMatch(/server had an error/)
    expect(err.partialContent).toBe('partial answer ')
  })

  it('openrouter: throws on an error chunk', async () => {
    stubStream([openaiDelta('partial '), sse({ error: { message: 'Provider disconnected', code: 502 } })])
    const err = await streamAgent(args('openrouter')).catch((e) => e)
    expect(err.message).toBe('Provider disconnected')
  })

  it('gemini: throws on a top level error object', async () => {
    stubStream([
      geminiText('partial answer '),
      sse({ error: { code: 503, message: 'The model is overloaded.', status: 'UNAVAILABLE' } }),
    ])
    const err = await streamAgent(args('gemini')).catch((e) => e)
    expect(err.message).toBe('The model is overloaded.')
    expect(err.partialContent).toBe('partial answer ')
  })

  it('reports an error event that arrives as the last line without a trailing newline', async () => {
    stubStream([openaiDelta('partial '), `data: ${JSON.stringify({ error: { message: 'boom' } })}`])
    await expect(streamAgent(args('openai'))).rejects.toThrow('boom')
  })
})

describe('streamAgent stream that ends without a terminator', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it.each([
    ['openai', [openaiDelta('half a sent')]],
    ['openrouter', [openaiDelta('half a sent')]],
    ['anthropic', [anthropicDelta('half a sent')]],
    ['gemini', [geminiText('half a sent')]],
  ])('%s: throws a stream ended early error instead of resolving', async (provider, chunks) => {
    stubStream(chunks)
    const err = await streamAgent(args(provider)).catch((e) => e)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toMatch(/ended before the provider finished/)
    expect(err.partialContent).toBe('half a sent')
  })

  it('does not throw when the user aborted the request', async () => {
    const controller = new AbortController()
    stubStream([openaiDelta('half a sent')])
    controller.abort()
    const result = await streamAgent(args('openai', { signal: controller.signal }))
    expect(result.content).toBe('half a sent')
  })
})

describe('streamAgent normal completion still resolves', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('openai ends with [DONE]', async () => {
    stubStream([openaiDelta('hello '), openaiDelta('world'), 'data: [DONE]\n\n'])
    const result = await streamAgent(args('openai'))
    expect(result.content).toBe('hello world')
  })

  it('openai ending on finish_reason length counts as a finished stream', async () => {
    stubStream([openaiDelta('cut by token limit'), sse({ choices: [{ delta: {}, finish_reason: 'length' }] })])
    const result = await streamAgent(args('openai'))
    expect(result.content).toBe('cut by token limit')
  })

  it('anthropic ends with message_stop', async () => {
    stubStream([anthropicDelta('hello'), `event: message_stop\n${sse({ type: 'message_stop' })}`])
    const result = await streamAgent(args('anthropic'))
    expect(result.content).toBe('hello')
  })

  it('gemini ends with a STOP finishReason', async () => {
    stubStream([geminiText('hello', 'STOP')])
    const result = await streamAgent(args('gemini'))
    expect(result.content).toBe('hello')
  })

  it('gemini ending on MAX_TOKENS is not treated as a dropped stream', async () => {
    stubStream([geminiText('long answer', 'MAX_TOKENS')])
    const result = await streamAgent(args('gemini'))
    expect(result.content).toBe('long answer')
  })
})
