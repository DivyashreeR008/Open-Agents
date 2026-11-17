import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('markdown links with parentheses', () => {
  it('keeps the label when a destination contains balanced parentheses', () => {
    expect(stripMarkdown('[Foo](https://example.test/wiki/Foo_(bar))')).toBe('Foo')
    expect(stripMarkdown('Read [the spec](https://example.test/a_(b)/c) now.')).toBe(
      'Read the spec now.'
    )
  })

  it('handles image destinations with parentheses and an optional title', () => {
    expect(stripMarkdown('![diagram](https://example.test/image_(large).png "Architecture")')).toBe(
      'diagram'
    )
  })

  it('does not swallow text after an unbalanced destination', () => {
    expect(stripMarkdown('See [notes](https://example.test/a_(b) and keep this.')).toBe(
      'See [notes](https://example.test/a_(b) and keep this.'
    )
  })
})
