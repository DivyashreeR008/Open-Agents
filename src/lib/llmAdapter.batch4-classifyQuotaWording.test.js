import { describe, expect, it } from 'vitest'
import { classifyProviderError } from './llmAdapter'

describe('provider error quota wording', () => {
  it('classifies 402 responses as exhausted quota', () => {
    expect(classifyProviderError(402, 'payment required')).toBe('quota_exhausted')
  })

  it('classifies daily limits and credit balances as exhausted quota', () => {
    expect(classifyProviderError(429, 'You exceeded your per day limit')).toBe('quota_exhausted')
    expect(classifyProviderError(400, 'Your credit balance is too low')).toBe('quota_exhausted')
    expect(classifyProviderError(429, '', { error: { code: 'insufficient_quota' } })).toBe(
      'quota_exhausted'
    )
  })

  it('classifies retry wording as a short rate limit', () => {
    expect(classifyProviderError(429, 'Please retry in 8.2s')).toBe('rate_limited')
    expect(classifyProviderError(429, 'too many requests')).toBe('rate_limited')
    expect(classifyProviderError(500, 'server error')).toBeNull()
  })
})
