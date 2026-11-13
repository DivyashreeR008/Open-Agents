const PROVIDER_LABELS = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  openrouter: 'OpenRouter',
}

function providerLabel(provider) {
  return PROVIDER_LABELS[provider] || 'provider'
}

function errorText(error) {
  if (typeof error === 'string') return error
  return typeof error?.message === 'string' ? error.message : ''
}

function firstLine(error) {
  return (
    errorText(error)
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean) || ''
  )
    .replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]')
    .slice(0, 180)
}

/**
 * Turn provider and parser failures into an actionable suite-generation
 * message. Retry is only recommended for conditions that can change without
 * user configuration: rate limits, temporary outages, and malformed model
 * output.
 */
export function classifySuiteGenerationError(error, provider) {
  const text = errorText(error).toLowerCase()
  const status = Number(error?.status)
  const providerName = providerLabel(provider)

  const isAuth =
    status === 401 ||
    status === 403 ||
    /invalid_api_key|incorrect api key|api key not valid|unauthorized|authentication|permission denied/.test(
      text
    )
  if (isAuth) {
    return {
      kind: 'auth',
      retryable: false,
      message: `The ${providerName} API key was rejected. Replace the key, then generate again.`,
    }
  }

  const isQuota =
    status === 402 ||
    /quota used up|insufficient_quota|credit balance|billing|payment required/.test(text)
  if (isQuota) {
    return {
      kind: 'quota',
      retryable: false,
      message: `The ${providerName} account has no remaining quota or credits. Add billing or use another key; retrying now will not help.`,
    }
  }

  const isRateLimit =
    status === 429 || /rate limit|too many requests|retry in|retrydelay/.test(text)
  if (isRateLimit) {
    return {
      kind: 'rate-limit',
      retryable: true,
      message: `The ${providerName} rate limit was reached. Wait a moment, then retry.`,
    }
  }

  const isTransient =
    status >= 500 ||
    /couldn't reach|failed to fetch|network|timed out|timeout|temporarily unavailable|server encountered|bad gateway/.test(
      text
    )
  if (isTransient) {
    return {
      kind: 'transient',
      retryable: true,
      message: `The ${providerName} service could not be reached. Check your connection, then retry.`,
    }
  }

  const isOutputProblem =
    error?.name === 'SyntaxError' ||
    /generated suite was not usable|unexpected token|unexpected end of json|json/.test(text)
  if (isOutputProblem) {
    return {
      kind: 'output',
      retryable: true,
      message:
        'The model returned a suite that could not be read. Retry once; if it keeps happening, simplify the goal.',
    }
  }

  if (/unsupported provider/.test(text)) {
    return {
      kind: 'configuration',
      retryable: false,
      message: 'The selected provider is not supported. Choose another provider, then try again.',
    }
  }

  const detail = firstLine(error)
  return {
    kind: 'unknown',
    retryable: false,
    message: detail
      ? `Suite generation failed: ${detail}`
      : 'Suite generation failed for an unknown reason. Check the provider configuration, then try again.',
  }
}
