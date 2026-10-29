import { describe, it, expect } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

const sample = `## Review

Rename \`maxRetryCount\` to max_retry_count and keep user_id_list as is. In C# the method is async. Total = 2 * 3 * 4.

See my_module_name.py for details.

---

Done.`

describe('stripMarkdown', () => {
  it('removes the markers but keeps ordinary words intact (issue sample)', () => {
    expect(stripMarkdown(sample)).toBe(
      'Review\n\nRename maxRetryCount to max_retry_count and keep user_id_list as is. In C# the method is async. Total = 2 * 3 * 4.\n\nSee my_module_name.py for details.\n\nDone.',
    )
  })

  it('only treats # as a heading at the start of a line', () => {
    expect(stripMarkdown('# Title\nwe use C# and F# daily')).toBe('Title\nwe use C# and F# daily')
    expect(stripMarkdown('###### Deep heading ######')).toBe('Deep heading')
  })

  it('strips emphasis that hugs its text', () => {
    expect(stripMarkdown('a **bold** b *it* c _it_ d __bold__ e ~~gone~~ f')).toBe('a bold b it c it d bold e gone f')
  })

  it('leaves underscores inside identifiers alone', () => {
    expect(stripMarkdown('__init__ and snake_case_name and _private_')).toBe('init and snake_case_name and private')
    expect(stripMarkdown('use get_user_by_id() then set_user_id()')).toBe('use get_user_by_id() then set_user_id()')
  })

  it('leaves spaced out asterisks alone', () => {
    expect(stripMarkdown('2 * 3 * 4 = 24')).toBe('2 * 3 * 4 = 24')
  })

  it('removes list, task list, quote and numbered markers at line start', () => {
    expect(stripMarkdown('- one\n* two\n+ three\n- [x] done\n1. first\n2) second\n> quoted')).toBe(
      'one\ntwo\nthree\ndone\nfirst\nsecond\nquoted',
    )
  })

  it('removes horizontal rules only when they are a line on their own', () => {
    expect(stripMarkdown('a\n\n---\n\nb')).toBe('a\n\nb')
    expect(stripMarkdown('well---maybe and a--b')).toBe('well---maybe and a--b')
  })

  it('keeps link and image labels', () => {
    expect(stripMarkdown('[docs](https://x.dev/a_b_c) ![logo](a.png "t")')).toBe('docs logo')
  })

  it('keeps code content untouched', () => {
    const md = 'Run `my_var_name` first:\n\n```js\nconst a_b = 2 * 3 * 4\n# not a heading\n```\n'
    expect(stripMarkdown(md)).toBe('Run my_var_name first:\n\nconst a_b = 2 * 3 * 4\n# not a heading')
  })

  it('respects backslash escapes', () => {
    expect(stripMarkdown('2 \\* 3 \\* 4 and \\_not italic\\_')).toBe('2 * 3 * 4 and _not italic_')
  })

  it('handles empty input', () => {
    expect(stripMarkdown('')).toBe('')
    expect(stripMarkdown(undefined)).toBe('')
  })
})
