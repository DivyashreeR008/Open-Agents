import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('stripCredentialFields circular arrays', () => {
  it('preserves a self-referencing array while removing nested secrets', () => {
    const input = [{ token: 'secret', label: 'first' }]
    input.push(input)

    const result = stripCredentialFields(input)

    expect(result).not.toBe(input)
    expect(result[0]).toEqual({ label: 'first' })
    expect(result[1]).toBe(result)
  })

  it('preserves a cycle shared by an object and an array', () => {
    const input = { name: 'safe', rows: [] }
    input.rows.push(input)

    const result = stripCredentialFields(input)

    expect(result.name).toBe('safe')
    expect(result.rows[0]).toBe(result)
  })
})
