import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('credential stripping through arrays', () => {
  it('sanitizes nested objects inside arrays without touching primitive values', () => {
    const input = {
      steps: [
        { name: 'one', api_key: 'secret', nested: { token: 'hidden', keep: 'visible' } },
        ['safe', { password: 'hidden', keep: true }],
      ],
      createdAt: 1767225600000,
    }

    expect(stripCredentialFields(input)).toEqual({
      steps: [{ name: 'one', nested: { keep: 'visible' } }, ['safe', { keep: true }]],
      createdAt: 1767225600000,
    })
  })
})
