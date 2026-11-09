import { describe, expect, it } from 'vitest'
import { resolveTemplate } from './pipelineBranching'

describe('template array edge cases', () => {
  const context = { steps: { scores: [0, 8], empty: [] } }

  it('renders a zero value instead of treating it as missing', () => {
    expect(resolveTemplate('{{ steps.scores[0] }}', context)).toBe('0')
  })

  it('renders an empty string for missing indexes and missing contexts', () => {
    expect(resolveTemplate('{{ steps.scores[5] }}', context)).toBe('')
    expect(resolveTemplate('{{ steps.empty[0] }}', context)).toBe('')
    expect(resolveTemplate('{{ steps.scores[0] }}', null)).toBe('')
  })

  it('accepts an optional dot before a bracketed index', () => {
    expect(resolveTemplate('{{ steps.scores.[1] }}', context)).toBe('8')
  })
})
