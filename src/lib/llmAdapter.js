/**
 * LLM Adapter — unified interface for calling OpenAI, Anthropic, and Gemini APIs
 * directly from the browser. No backend required.
 *
 * Supports both one-shot (`runAgent`) and streaming (`streamAgent`) modes.
 */

/**
 * Pull a readable message out of a provider error object that arrives as an
 * event inside an already open (200) stream.
 */
function streamErrorMessage(err) {
  if (typeof err === 'string') return err
  return err?.message || err?.type || err?.status || 'The provider reported an error while streaming.'
}

const PROVIDER_CONFIGS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    buildBody: (model, systemPrompt, userMessage) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 4096,
    }),
    buildStreamBody: (model, systemPrompt, userMessage) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 4096,
      stream: true,
    }),
    parseResponse: (data) => ({
      content: data.choices?.[0]?.message?.content || '',
      tokens:
        (data.usage?.prompt_tokens || 0) +
        (data.usage?.completion_tokens || 0),
    }),
    /**
     * Parse an SSE line from OpenAI streaming.
     * Returns { content, done } or null if the line should be skipped.
     */
    parseStreamChunk: (line) => {
      if (line === 'data: [DONE]') return { content: '', done: true }
      if (!line.startsWith('data: ')) return null
      try {
        const json = JSON.parse(line.slice(6))
        if (json.error) return { content: '', done: false, error: streamErrorMessage(json.error) }
        const delta = json.choices?.[0]?.delta?.content || ''
        const reason = json.choices?.[0]?.finish_reason
        return { content: delta, done: reason === 'stop', terminated: Boolean(reason) }
      } catch {
        return null
      }
    },
  },

  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://open-agents.app',
      'X-Title': 'OpenAgents',
    }),
    buildBody: (model, systemPrompt, userMessage) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 4096,
    }),
    buildStreamBody: (model, systemPrompt, userMessage) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 4096,
      stream: true,
    }),
    parseResponse: (data) => ({
      content: data.choices?.[0]?.message?.content || '',
      tokens:
        (data.usage?.prompt_tokens || 0) +
        (data.usage?.completion_tokens || 0),
    }),
    parseStreamChunk: (line) => {
      if (line === 'data: [DONE]') return { content: '', done: true }
      if (!line.startsWith('data: ')) return null
      try {
        const json = JSON.parse(line.slice(6))
        if (json.error) return { content: '', done: false, error: streamErrorMessage(json.error) }
        const delta = json.choices?.[0]?.delta?.content || ''
        const reason = json.choices?.[0]?.finish_reason
        return { content: delta, done: reason === 'stop', terminated: Boolean(reason) }
      } catch {
        return null
      }
    },
  },

  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    }),
    buildBody: (model, systemPrompt, userMessage) => ({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
    buildStreamBody: (model, systemPrompt, userMessage) => ({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
    }),
    parseResponse: (data) => ({
      content: data.content?.[0]?.text || '',
      tokens:
        (data.usage?.input_tokens || 0) +
        (data.usage?.output_tokens || 0),
    }),
    parseStreamChunk: (line) => {
      if (!line.startsWith('data: ')) return null
      try {
        const json = JSON.parse(line.slice(6))
        if (json.type === 'error') {
          return { content: '', done: false, error: streamErrorMessage(json.error) }
        }
        if (json.type === 'content_block_delta') {
          return { content: json.delta?.text || '', done: false }
        }
        if (json.type === 'message_stop') {
          return { content: '', done: true }
        }
        // message_start, content_block_start, etc. — skip
        return null
      } catch {
        return null
      }
    },
  },

  gemini: {
    url: (model, apiKey) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    streamUrl: (model, apiKey) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    buildHeaders: () => ({
      'Content-Type': 'application/json',
    }),
    buildBody: (_model, systemPrompt, userMessage) => ({
      contents: [
        {
          parts: [{ text: systemPrompt + '\n\n' + userMessage }],
        },
      ],
    }),
    buildStreamBody: (_model, systemPrompt, userMessage) => ({
      contents: [
        {
          parts: [{ text: systemPrompt + '\n\n' + userMessage }],
        },
      ],
    }),
    parseResponse: (data) => ({
      content:
        data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      tokens:
        (data.usageMetadata?.promptTokenCount || 0) +
        (data.usageMetadata?.candidatesTokenCount || 0),
    }),
    parseStreamChunk: (line) => {
      if (!line.startsWith('data: ')) return null
      try {
        const json = JSON.parse(line.slice(6))
        if (json.error) return { content: '', done: false, error: streamErrorMessage(json.error) }
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const reason = json.candidates?.[0]?.finishReason
        return { content: text, done: reason === 'STOP', terminated: Boolean(reason) }
      } catch {
        return null
      }
    },
  },
}

const ERROR_MESSAGES = {
  401: 'invalid_api_key', // We'll use a key to help downstream logic
  403: 'Access forbidden. Your API key may not have the required permissions.',
  429: 'Rate limit hit. Wait a moment and try again.',
  500: 'The API server encountered an error. Try again shortly.',
  502: 'Bad gateway — the API is temporarily unavailable.',
  503: 'The API service is temporarily unavailable. Try again in a minute.',
};

// Retry policy for rate limited (429) responses. Only the request itself is
// retried, which happens before any response body is read, so the streaming
// path can never replay chunks the user has already seen.
const MAX_ATTEMPTS = 3
const BASE_RETRY_DELAY_MS = 1000
// If the provider asks us to wait longer than this, don't sit on a spinner for
// minutes: stop and tell the user how long to wait instead.
const MAX_RETRY_DELAY_MS = 20000

/**
 * Work out whether a failed response is a short-lived rate limit, an
 * exhausted quota / billing problem, or neither.
 *
 * @param {number} status HTTP status
 * @param {string} detail provider error message (may be empty)
 * @param {object|null} errBody parsed JSON error body (may be null)
 * @returns {'rate_limited'|'quota_exhausted'|null}
 */
export function classifyProviderError(status, detail = '', errBody = null) {
  const err = errBody?.error
  const codes = [err?.code, err?.type, err?.status]
    .filter(Boolean)
    .map((c) => String(c).toLowerCase())
  const text = String(detail || '').toLowerCase()

  // Anthropic reports an empty balance as a 400, OpenRouter as a 402.
  if (status === 402) return 'quota_exhausted'
  if (status === 400 && /credit balance is too low/.test(text)) {
    return 'quota_exhausted'
  }
  if (status !== 429) return null

  if (codes.includes('insufficient_quota') || /insufficient_quota/.test(text)) {
    return 'quota_exhausted'
  }
  if (/per ?day|daily/.test(text)) return 'quota_exhausted'
  // Gemini uses RESOURCE_EXHAUSTED for both, so look at the wording.
  if (/per ?min|retry in|retrydelay|too many requests/.test(text)) {
    return 'rate_limited'
  }
  if (/quota|billing|credit/.test(text)) return 'quota_exhausted'
  return 'rate_limited'
}

/**
 * Read how long the provider wants us to wait, in ms, or null if unknown.
 * Looks at the Retry-After header first, then the "retry in 8.2s" /
 * "try again in 20ms" wording Gemini and OpenAI put in the message.
 */
function getRetryAfterMs(response, detail) {
  const header = response.headers?.get?.('retry-after')
  if (header) {
    const seconds = Number(header)
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000)
    const date = Date.parse(header)
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now())
  }
  const match = /(?:retry|try again) in ([\d.]+) ?(ms|s)\b/i.exec(detail || '')
  if (match) {
    const value = Number(match[1])
    return Math.round(match[2].toLowerCase() === 'ms' ? value : value * 1000)
  }
  return null
}

function describeWait(ms) {
  const seconds = Math.max(1, Math.ceil(ms / 1000))
  return seconds >= 120
    ? `${Math.ceil(seconds / 60)} minutes`
    : `${seconds} second${seconds === 1 ? '' : 's'}`
}

/**
 * Handle non-OK HTTP responses consistently.
 *
 * @param {Response} response
 * @param {string} provider
 * @param {number} retries how many times this request was already retried
 */
async function handleErrorResponse(response, provider = "unknown", retries = 0) {
  const errorKey = ERROR_MESSAGES[response.status] || null;
  let detail = '';
  let errBody = null;
  try {
    errBody = await response.json();
    detail = errBody?.error?.message || JSON.stringify(errBody);
  } catch {
    // Could not parse error body
  }

  // Google answers a bad key with 400 + API_KEY_INVALID instead of 401.
  const geminiBadKey =
    provider === 'gemini' &&
    response.status === 400 &&
    (errBody?.error?.details?.some?.((d) => d?.reason === 'API_KEY_INVALID') ||
      /API key not valid|API key expired/i.test(errBody?.error?.message || ''));

  if (errorKey === 'invalid_api_key' || geminiBadKey) {
    throw {
      type: "invalid_api_key",
      provider,
      detail: detail || 'No additional details',
    };
  }

  const kind = classifyProviderError(response.status, detail, errBody);
  if (kind) {
    const retryAfterMs = getRetryAfterMs(response, detail);
    let message;
    if (kind === 'quota_exhausted') {
      message =
        'Quota used up. This is not a short rate limit, so retrying will not help. ' +
        'Check your plan and billing with the provider, or use a different API key or provider.';
    } else {
      message = 'Rate limit hit.';
      if (retries > 0) {
        message += ` Retried ${retries} time${retries === 1 ? '' : 's'} and the provider is still limiting requests.`;
      }
      message += retryAfterMs
        ? ` Wait about ${describeWait(retryAfterMs)} and try again.`
        : ' Wait a moment and try again.';
    }
    const error = new Error(
      detail ? `${message}\n\nDetails: ${detail}` : message
    );
    error.type = kind;
    error.status = response.status;
    error.provider = provider;
    error.retryAfterMs = retryAfterMs;
    throw error;
  }

  const friendlyMessage =
    typeof ERROR_MESSAGES[response.status] === 'string'
      ? ERROR_MESSAGES[response.status]
      : `API returned status ${response.status}. Please check your configuration.`;

  throw new Error(
    detail ? `${friendlyMessage}\n\nDetails: ${detail}` : friendlyMessage
  );
}

/** setTimeout that rejects with an AbortError as soon as the signal aborts. */
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'))
      return
    }
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * fetch() that retries rate limited (429) responses with backoff, up to
 * MAX_ATTEMPTS tries in total. Quota failures and every other error are
 * thrown straight away. Resolves with the first OK response.
 */
async function fetchWithRetry(url, init, provider) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, init)
    if (response.ok) return response

    try {
      await handleErrorResponse(response, provider, attempt - 1)
    } catch (error) {
      if (error?.type !== 'rate_limited' || attempt >= MAX_ATTEMPTS) throw error

      const delay = error.retryAfterMs ?? BASE_RETRY_DELAY_MS * 2 ** (attempt - 1)
      if (delay > MAX_RETRY_DELAY_MS) throw error

      await sleep(delay, init.signal)
    }
  }
}

/**
 * Run an agent against the specified LLM provider (one-shot, non-streaming).
 *
 * @param {Object} params
 * @param {'openai'|'anthropic'|'gemini'|'openrouter'} params.provider
 * @param {string} params.model
 * @param {string} params.apiKey
 * @param {string} params.systemPrompt
 * @param {string} params.userMessage
 * @returns {Promise<{content: string, tokens: number, duration: number}>}
 */
export async function runAgent({ provider, model, apiKey, systemPrompt, userMessage }, options = {})  {
  const config = PROVIDER_CONFIGS[provider]
  const { signal } = options || {};

  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Please provide an API key to run this agent.')
  }

  const url =
    typeof config.url === 'function'
      ? config.url(model, apiKey)
      : config.url

  const headers = config.buildHeaders(apiKey)
  const body = config.buildBody(model, systemPrompt, userMessage)

  const startTime = performance.now()

  try {
    const response = await fetchWithRetry(
      url,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      },
      provider
    )

    const data = await response.json()
    const parsed = config.parseResponse(data)
    const duration = Math.round(performance.now() - startTime)

    return {
      content: parsed.content,
      tokens: parsed.tokens,
      duration,
    }
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(
        "Couldn't reach the API. Check your internet connection and try again."
      )
    }
    throw error
  }
}

/**
 * Run an agent with streaming output. Calls `onChunk` with each piece of text
 * as it arrives so the UI can render progressively.
 *
 * @param {Object} params
 * @param {'openai'|'anthropic'|'gemini'|'openrouter'} params.provider
 * @param {string} params.model
 * @param {string} params.apiKey
 * @param {string} params.systemPrompt
 * @param {string} params.userMessage
 * @param {(text: string) => void} params.onChunk — called with each token/chunk
 * @param {AbortSignal} [params.signal] — optional AbortSignal to cancel streaming
 * @returns {Promise<{content: string, duration: number}>}
 */
export async function streamAgent({ provider, model, apiKey, systemPrompt, userMessage, onChunk, signal }) {
  const config = PROVIDER_CONFIGS[provider]

  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Please provide an API key to run this agent.')
  }

  // Determine the streaming URL
  let url
  if (provider === 'gemini') {
    url = config.streamUrl(model, apiKey)
  } else {
    url = typeof config.url === 'function' ? config.url(model, apiKey) : config.url
  }

  const headers = config.buildHeaders(apiKey)
  const body = config.buildStreamBody(model, systemPrompt, userMessage)

  const startTime = performance.now()
  let fullContent = ''

  try {
    // Retries only wrap the request itself. Once we have an OK response and
    // start reading chunks, a failure is never retried (it would replay text).
    const response = await fetchWithRetry(
      url,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      },
      provider
    )

    if (!response.body || typeof response.body.getReader !== 'function') {
      throw new Error(
        'Streaming is not supported by this response. Please try again.'
      )
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    // Set once the provider sends its own end marker (message_stop, [DONE],
    // a finish reason). A stream that closes without one was cut off.
    let sawTerminator = false

    // Apply one parsed stream event. A provider error event is thrown, with
    // whatever text had already arrived kept on the error.
    const handleParsed = (parsed) => {
      if (!parsed) return
      if (parsed.error) {
        const streamError = new Error(parsed.error)
        streamError.type = 'stream_error'
        streamError.provider = provider
        streamError.partialContent = fullContent
        throw streamError
      }
      if (parsed.done || parsed.terminated) sawTerminator = true
      if (parsed.content) {
        fullContent += parsed.content
        onChunk(parsed.content)
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process complete lines from the buffer
      const lines = buffer.split('\n')
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        const parsed = config.parseStreamChunk(trimmed)
        if (!parsed) continue

        handleParsed(parsed)

        if (parsed.done) break
      }
    }

    // Process any remaining buffer content
    if (buffer.trim()) {
      handleParsed(config.parseStreamChunk(buffer.trim()))
    }

    if (!sawTerminator && !signal?.aborted) {
      const cutOff = new Error(
        'The response ended before the provider finished. The output may be incomplete, please try again.'
      )
      cutOff.type = 'stream_error'
      cutOff.provider = provider
      cutOff.partialContent = fullContent
      throw cutOff
    }

    const duration = Math.round(performance.now() - startTime)

    return {
      content: fullContent,
      duration,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      const duration = Math.round(performance.now() - startTime)
      return { content: fullContent, duration }
    }
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(
        "Couldn't reach the API. Check your internet connection and try again."
      )
    }
    throw error
  }
}

/**
 * Fetch supported Gemini models dynamically from the Google API.
 * Returns models that support generateContent (i.e. usable for chat/generation).
 *
 * @param {string} apiKey
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export async function fetchGeminiModels(apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return (data.models || [])
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    .map(m => ({
      value: m.name.replace('models/', ''),
      label: m.displayName || m.name.replace('models/', ''),
    }))
}
