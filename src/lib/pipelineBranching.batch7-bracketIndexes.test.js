import { describe, expect, it } from 'vitest'
import { resolveTemplate } from './pipelineBranching'

describe('resolveTemplate bracket indexes', () => {
  it('resolves nested array indexes and leaves a missing index empty', () => {
    const context = { steps: { list: [{ output: 'first' }, { output: 'second' }] } }
    expect(resolveTemplate('{{ steps.list[1].output }}', context)).toBe('second')
    expect(resolveTemplate('{{ steps.list[9].output }}', context)).toBe('')
  })

  it('does not resolve inherited properties', () => {
    expect(resolveTemplate('{{ constructor.name }}', {})).toBe('')
  })
})
