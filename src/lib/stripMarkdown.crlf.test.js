import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown line endings', () => {
  it('normalizes CRLF and bare CR before applying block rules', () => {
    expect(stripMarkdown('**bold**\r\n\r\nnext\rline')).toBe('bold\n\nnext\nline')
  })
})
