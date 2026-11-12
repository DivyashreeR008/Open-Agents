import { describe, expect, it } from 'vitest'
import { resolveTemplate } from './pipelineBranching'

describe('template path lookup boundaries', () => {
  it('does not resolve inherited object properties', () => {
    expect(resolveTemplate('{{ constructor }}', {})).toBe('')
    expect(resolveTemplate('{{ __proto__ }}', {})).toBe('')
    expect(resolveTemplate('{{ secret }}', Object.create({ secret: 'leak' }))).toBe('')
  })

  it('still resolves own properties and array indexes', () => {
    expect(resolveTemplate('{{ steps.0.output }}', { steps: [{ output: 'ok' }] })).toBe('ok')
  })
})
