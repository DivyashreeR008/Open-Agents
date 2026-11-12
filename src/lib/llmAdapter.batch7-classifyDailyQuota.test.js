import { describe, expect, it } from 'vitest'
import { classifyProviderError } from './llmAdapter'

describe('classifyProviderError daily wording', () => {
  it('treats a daily limit as exhausted quota', () => {
    expect(classifyProviderError(429, 'Daily limit reached')).toBe('quota_exhausted')
  })
})
