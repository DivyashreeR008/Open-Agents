import { describe, expect, it } from 'vitest'
import { apiKeyFieldProps } from './apiKeyFieldProps'

describe('apiKeyFieldProps without a field name', () => {
  it('returns the credential manager hints with an undefined name', () => {
    expect(apiKeyFieldProps()).toMatchObject({
      name: undefined,
      autoComplete: 'new-password',
      spellCheck: false,
    })
  })
})
