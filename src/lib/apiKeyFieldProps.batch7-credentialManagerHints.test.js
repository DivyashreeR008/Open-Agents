import { describe, expect, it } from 'vitest'
import { apiKeyFieldProps } from './apiKeyFieldProps'

describe('apiKeyFieldProps credential manager hints', () => {
  it('marks the field as a new secret without asking for saved credentials', () => {
    const props = apiKeyFieldProps('openai-key')

    expect(props).toMatchObject({
      name: 'openai-key',
      autoComplete: 'new-password',
      autoCapitalize: 'none',
      autoCorrect: 'off',
      spellCheck: false,
    })
    expect(props.autoComplete).not.toBe('username')
    expect(props.autoComplete).not.toBe('current-password')
  })

  it('asks common password managers and form classifiers to leave the field alone', () => {
    const props = apiKeyFieldProps('gemini-key')

    expect(props['data-1p-ignore']).toBe('true')
    expect(props['data-lpignore']).toBe('true')
    expect(props['data-bwignore']).toBe('true')
    expect(props['data-form-type']).toBe('other')
  })

  it('returns a fresh object for each provider name', () => {
    const first = apiKeyFieldProps('openai-key')
    const second = apiKeyFieldProps('openai-key')

    expect(first).not.toBe(second)
    first.name = 'changed'
    expect(second.name).toBe('openai-key')
  })
})
