import { describe, expect, it } from 'vitest'
import { classifyProviderError } from './llmAdapter'

describe('classifyProviderError uppercase wording', () => {
  it('recognizes a credit balance message regardless of case', () => {
    expect(classifyProviderError(400, 'CREDIT BALANCE IS TOO LOW')).toBe('quota_exhausted')
  })
})
