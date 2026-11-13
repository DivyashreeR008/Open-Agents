import { describe, expect, it } from 'vitest'
import { validateProviderKey } from './providerKeyValidation'

const accepted = [
  ['openai', ''],
  ['openai', 'sk-live-key'],
  ['anthropic', 'sk-ant-live'],
  ['gemini', 'AIza-live'],
  ['openrouter', 'sk-or-live'],
  ['unknown-provider', 'sk-test'],
]

const mismatches = [
  ['openai', 'sk-ant-mismatched', /Anthropic key/],
  ['anthropic', 'AIza-live', /Gemini key/],
  ['gemini', 'sk-live-key', /OpenAI key/],
  ['openrouter', 'AIza-live', /Gemini key/],
]

describe('provider key validation', () => {
  it('accepts an empty value, matching prefixes, and unknown providers', () => {
    accepted.forEach(([provider, key]) => {
      expect(validateProviderKey(provider, key)).toBe('')
    })
  })

  it('names the provider that owns a mismatched key', () => {
    mismatches.forEach(([provider, key, expected]) => {
      expect(validateProviderKey(provider, key)).toMatch(expected)
    })
  })
})
