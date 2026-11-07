import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown placeholder boundaries', () => {
  it('preserves literal private-use characters in the input', () => {
    const text = 'keep \uE0001\uE001 exactly as written'
    expect(stripMarkdown(text)).toBe(text)
  })

  it('preserves a document that only contains private-use markers', () => {
    expect(stripMarkdown('\uE000\uE001')).toBe('\uE000\uE001')
    expect(stripMarkdown('\uE0000\uE001')).toBe('\uE0000\uE001')
  })

  it('still removes formatting around a literal marker', () => {
    expect(stripMarkdown('**keep \uE0001\uE001**')).toBe('keep \uE0001\uE001')
  })
})
