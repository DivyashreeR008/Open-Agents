/**
 * Deterministic provider stand-in for development and tests.
 *
 * The adapter works at the fetch boundary, so existing provider code keeps
 * using its real request builders, stream parsers, retry policy, and error
 * handling. No network request leaves the process and no API key is required:
 * pass `MOCK_API_KEY` to satisfy the provider key guards.
 */

export const MOCK_API_KEY = 'mock-key'
export const MOCK_CHAT_MODEL = 'mock-chat-v1'

export const MOCK_SCENARIOS = Object.freeze([
  'success',
  'invalid-key',
  'rate-limit',
  'quota',
  'network',
  'server',
  'stream-cutoff',
])

export function mockResponseText(prompt) {
  const text = String(prompt ?? '').trim()
  return `Mock provider response to: ${text || '(empty prompt)'}`
}

function estimateTokens(value) {
  const text = String(value ?? '')
  return text.length === 0 ? 0 : Math.max(1, Math.ceil(text.length / 4))
}

function splitText(text, size = 12) {
  if (!text) return ['']
  const chunks = []
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size))
  }
  return chunks
}

function parseRequestBody(init) {
  if (typeof init?.body !== 'string') return null
  try {
    return JSON.parse(init.body)
  } catch {
    return null
  }
}

function providerFor(url) {
  const parsed = new URL(url, 'http://localhost')

  if (parsed.hostname === 'openrouter.ai') return 'openrouter'
  if (parsed.hostname === 'api.anthropic.com') return 'anthropic'
  if (parsed.hostname === 'generativelanguage.googleapis.com') return 'gemini'
  if (parsed.hostname === 'api.openai.com') return 'openai'
  return null
}

function promptFromBody(provider, body) {
  if (!body) return ''
  if (provider === 'gemini') {
    return body.contents?.[0]?.parts?.[0]?.text || ''
  }
  if (provider === 'anthropic') {
    const message = body.messages?.find?.((entry) => entry.role === 'user') || body.messages?.[0]
    return typeof message?.content === 'string' ? message.content : ''
  }
  const message = body.messages?.filter?.((entry) => entry.role === 'user').at(-1)
  return typeof message?.content === 'string' ? message.content : ''
}

function isStreamingRequest(provider, body, url) {
  if (provider === 'gemini') return String(url).includes(':streamGenerateContent')
  return body?.stream === true
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function sseResponse(events) {
  const encoder = new TextEncoder()
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const event of events) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        }
        controller.close()
      },
    }),
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
  )
}

function openAiStreamEvents(content) {
  const events = splitText(content).map((chunk) => ({
    choices: [{ delta: { content: chunk }, finish_reason: null }],
  }))
  events.push({ choices: [{ delta: {}, finish_reason: 'stop' }] })
  return { events, terminator: { done: true } }
}

function anthropicStreamEvents(content) {
  return {
    events: [
      { type: 'message_start', message: { role: 'assistant' } },
      ...splitText(content).map((chunk) => ({
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: chunk },
      })),
    ],
    terminator: { type: 'message_stop' },
  }
}

function geminiStreamEvents(content) {
  return {
    events: splitText(content).map((chunk) => ({
      candidates: [{ content: { parts: [{ text: chunk }] } }],
    })),
    terminator: { candidates: [{ content: { parts: [{ text: '' }] }, finishReason: 'STOP' }] },
  }
}

function streamEvents(provider, content) {
  if (provider === 'anthropic') return anthropicStreamEvents(content)
  if (provider === 'gemini') return geminiStreamEvents(content)
  return openAiStreamEvents(content)
}

function streamResponse(provider, content, scenario) {
  const { events, terminator } = streamEvents(provider, content)

  if (scenario === 'stream-cutoff') {
    // Keep the first content event but omit every end marker. A correct stream
    // parser must report a truncated response instead of accepting the prefix.
    const firstContentIndex = events.findIndex(
      (event) =>
        event.choices?.[0]?.delta?.content ||
        event.delta?.text ||
        event.candidates?.[0]?.content?.parts?.[0]?.text
    )
    return sseResponse(events.slice(0, Math.max(1, firstContentIndex + 1)))
  }

  return sseResponse([...events, terminator])
}

function successResponse(provider, content, prompt, streaming, scenario) {
  if (streaming) return streamResponse(provider, content, scenario)

  if (provider === 'anthropic') {
    return jsonResponse({
      content: [{ type: 'text', text: content }],
      usage: { input_tokens: estimateTokens(prompt), output_tokens: estimateTokens(content) },
    })
  }

  if (provider === 'gemini') {
    return jsonResponse({
      candidates: [{ content: { parts: [{ text: content }] }, finishReason: 'STOP' }],
      usageMetadata: {
        promptTokenCount: estimateTokens(prompt),
        candidatesTokenCount: estimateTokens(content),
      },
    })
  }

  return jsonResponse({
    choices: [{ message: { role: 'assistant', content }, finish_reason: 'stop' }],
    usage: {
      prompt_tokens: estimateTokens(prompt),
      completion_tokens: estimateTokens(content),
    },
  })
}

function failureResponse(scenario) {
  if (scenario === 'invalid-key') {
    return jsonResponse({ error: { message: 'Invalid mock API key.' } }, 401)
  }
  if (scenario === 'rate-limit') {
    return jsonResponse({ error: { message: 'Mock rate limit. Retry in 0s.' } }, 429, {
      'Retry-After': '0',
    })
  }
  if (scenario === 'quota') {
    return jsonResponse(
      { error: { code: 'insufficient_quota', message: 'Mock quota exhausted.' } },
      429
    )
  }
  if (scenario === 'server') {
    return jsonResponse({ error: { message: 'Mock server failure.' } }, 503)
  }
  return null
}

/**
 * Create a fetch-compatible fake for the four conversational providers.
 *
 * @param {object} [options]
 * @param {string} [options.scenario] one of MOCK_SCENARIOS
 * @param {string} [options.response] fixed response text instead of the echo
 * @param {(call: object) => void} [options.onRequest] observe each request
 */
export function createMockFetch({ scenario = 'success', response, onRequest } = {}) {
  if (!MOCK_SCENARIOS.includes(scenario)) {
    throw new TypeError(`Unknown mock provider scenario: ${scenario}`)
  }

  const calls = []

  async function mockFetch(url, init = {}) {
    const target = String(url)
    const provider = providerFor(target)
    const method = String(init.method || 'GET').toUpperCase()
    const parsedUrl = new URL(target, 'http://localhost')
    const body = parseRequestBody(init)
    const streaming = provider ? isStreamingRequest(provider, body, target) : false
    const prompt = provider ? promptFromBody(provider, body) : ''
    const call = {
      url: `${parsedUrl.origin}${parsedUrl.pathname}`,
      provider,
      method,
      streaming,
      prompt,
      body,
    }
    calls.push(call)
    onRequest?.(call)

    if (!provider) {
      return jsonResponse({ error: { message: 'Unsupported mock endpoint.' } }, 404)
    }

    if (init.signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }

    // The Gemini model list endpoint is useful in provider settings tests.
    if (provider === 'gemini' && method === 'GET' && parsedUrl.pathname.endsWith('/models')) {
      return jsonResponse({
        models: [
          {
            name: `models/${MOCK_CHAT_MODEL}`,
            displayName: 'Mock Chat',
            supportedGenerationMethods: ['generateContent'],
          },
        ],
      })
    }

    if (method !== 'POST') {
      return jsonResponse({ error: { message: 'Mock endpoint requires POST.' } }, 405)
    }

    if (scenario === 'network') {
      throw new TypeError('Failed to fetch')
    }

    const failure = failureResponse(scenario)
    if (failure) return failure

    const content = response ?? mockResponseText(prompt)
    return successResponse(provider, content, prompt, streaming, scenario)
  }

  mockFetch.calls = calls
  mockFetch.reset = () => {
    calls.length = 0
  }

  return mockFetch
}

/**
 * Replace global fetch for a local development session or a test.
 *
 * Returns a restore function so tests can always put the real fetch back.
 */
export function installMockFetch(options) {
  const originalFetch = globalThis.fetch
  const mockFetch = createMockFetch(options)
  globalThis.fetch = mockFetch

  return {
    fetch: mockFetch,
    calls: mockFetch.calls,
    restore() {
      if (globalThis.fetch === mockFetch) globalThis.fetch = originalFetch
    },
  }
}
