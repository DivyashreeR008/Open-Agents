import { describe, expect, it } from 'vitest'
import { resolveTemplate } from './pipelineBranching'

describe('pipeline template prototype safety', () => {
  it('does not read inherited prototype properties', () => {
    expect(resolveTemplate('{{ constructor.name }}', {})).toBe('')
    expect(resolveTemplate('{{ __proto__.polluted }}', {})).toBe('')
    expect(resolveTemplate('{{ toString }}', {})).toBe('')
  })

  it('reads own properties with names that also exist on Object.prototype', () => {
    const context = { constructor: { name: 'own value' }, toString: 'own text' }

    expect(resolveTemplate('{{ constructor.name }}', context)).toBe('own value')
    expect(resolveTemplate('{{ toString }}', context)).toBe('own text')
  })
})
