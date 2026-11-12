import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('credential stripping with circular references', () => {
  it('preserves the cycle while removing credentials at every visited node', () => {
    const input = { name: 'root', apiKey: 'secret', nested: { token: 'hidden' } }
    input.self = input
    input.nested.parent = input

    const output = stripCredentialFields(input)

    expect(output.name).toBe('root')
    expect(output.apiKey).toBeUndefined()
    expect(output.nested.token).toBeUndefined()
    expect(output.self).toBe(output)
    expect(output.nested.parent).toBe(output)
  })

  it('reuses one sanitized object for a record referenced twice', () => {
    const shared = { password: 'hidden', keep: 1 }
    const output = stripCredentialFields({ first: shared, second: shared })

    expect(output.first).toEqual({ keep: 1 })
    expect(output.first).toBe(output.second)
  })
})
