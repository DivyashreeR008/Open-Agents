import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

const enc = new TextEncoder()

function captureResponse(terminator = 'data: [DONE]\n\n') {
  return {
    ok: true,
    status: 200,
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode(terminator))
        controller.close()
      },
    }),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('provider streaming request shapes', () => {
  it('adds stream true to the OpenAI body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(captureResponse())
    vi.stubGlobal('fetch', fetchMock)

    await streamAgent({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-openai',
      systemPrompt: 'system',
      userMessage: 'user',
      onChunk: () => {},
    })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      stream: true,
      messages: [
        { role: 'system', content: 'system' },
        { role: 'user', content: 'user' },
      ],
    })
  })

  it('adds stream true to the Anthropic body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(captureResponse('data: {"type":"message_stop"}\n\n'))
    vi.stubGlobal('fetch', fetchMock)

    await streamAgent({
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      apiKey: 'sk-ant',
      systemPrompt: 'system',
      userMessage: 'user',
      onChunk: () => {},
    })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      stream: true,
      system: 'system',
      messages: [{ role: 'user', content: 'user' }],
    })
  })

  it('uses the Gemini SSE endpoint with alt=sse and the key', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        captureResponse(
          'data: {"candidates":[{"content":{"parts":[{"text":"ok"}]},"finishReason":"STOP"}]}\n\n'
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    await streamAgent({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: 'AIza-key',
      systemPrompt: 'system',
      userMessage: 'user',
      onChunk: () => {},
    })

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=AIza-key'
    )
  })

  it('uses the OpenRouter streaming endpoint and attribution headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(captureResponse())
    vi.stubGlobal('fetch', fetchMock)

    await streamAgent({
      provider: 'openrouter',
      model: 'openai/gpt-4o-mini',
      apiKey: 'sk-or',
      systemPrompt: 'system',
      userMessage: 'user',
      onChunk: () => {},
    })

    expect(fetchMock.mock.calls[0][0]).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({
      Authorization: 'Bearer sk-or',
      'HTTP-Referer': 'https://open-agents.app',
      'X-Title': 'OpenAgents',
    })
  })
})
