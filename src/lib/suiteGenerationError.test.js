import { describe, expect, it } from 'vitest'
import { classifySuiteGenerationError } from './suiteGenerationError'

describe('suite generation error classification', () => {
  it('treats rejected keys as configuration errors with no retry', () => {
    const result = classifySuiteGenerationError(
      Object.assign(new Error('invalid_api_key'), { status: 401 }),
      'openai'
    )
    expect(result.kind).toBe('auth')
    expect(result.retryable).toBe(false)
    expect(result.message).toContain('OpenAI API key was rejected')
  })

  it('separates exhausted quota from a short rate limit', () => {
    const quota = classifySuiteGenerationError(
      new Error('Quota used up. This is not a short rate limit, so retrying will not help.'),
      'gemini'
    )
    expect(quota.kind).toBe('quota')
    expect(quota.retryable).toBe(false)
    expect(quota.message).toContain('retrying now will not help')

    const rate = classifySuiteGenerationError(new Error('Rate limit hit. Wait a moment.'), 'openai')
    expect(rate.kind).toBe('rate-limit')
    expect(rate.retryable).toBe(true)
  })

  it('offers retry for provider outages and unusable model output', () => {
    const outage = classifySuiteGenerationError(
      Object.assign(new Error('bad gateway'), { status: 502 }),
      'anthropic'
    )
    expect(outage.kind).toBe('transient')
    expect(outage.retryable).toBe(true)

    const output = classifySuiteGenerationError(
      new SyntaxError('Unexpected token < in JSON'),
      'openrouter'
    )
    expect(output.kind).toBe('output')
    expect(output.retryable).toBe(true)
  })

  it('redacts key-like text from an unknown error message', () => {
    const result = classifySuiteGenerationError(new Error('boom sk-live-secret'), 'openai')
    expect(result.kind).toBe('unknown')
    expect(result.retryable).toBe(false)
    expect(result.message).not.toContain('sk-live-secret')
    expect(result.message).toContain('[redacted]')
  })
})
