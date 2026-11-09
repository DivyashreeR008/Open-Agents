import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('markdown stripping edge cases', () => {
  it('keeps inline and fenced code content while dropping fences', () => {
    expect(stripMarkdown('Use `**literal**` here')).toBe('Use **literal** here')
    expect(stripMarkdown('```js\nconst a = 1\n```')).toBe('const a = 1')
  })

  it('does not strip snake_case names or escaped markers', () => {
    expect(stripMarkdown('max_retry_count and my_module_name.py')).toBe(
      'max_retry_count and my_module_name.py'
    )
    expect(stripMarkdown('\\*not emphasis\\*')).toBe('*not emphasis*')
  })

  it('handles headings, links, and task list markers', () => {
    expect(stripMarkdown('## Title\n- [x] done\n[link](https://example.com)')).toBe(
      'Title\ndone\nlink'
    )
  })
})
