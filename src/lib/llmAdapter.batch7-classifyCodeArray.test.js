import { describe, expect, it } from 'vitest'
import { classifyProviderError } from './llmAdapter'

describe('classifyProviderError array codes', () => {
  it('recognizes insufficient quota inside an array code', () => {
    expect(classifyProviderError(429, '', { error: { code: ['insufficient_quota'] } })).toBe(
      'quota_exhausted'
    )
  })
})
