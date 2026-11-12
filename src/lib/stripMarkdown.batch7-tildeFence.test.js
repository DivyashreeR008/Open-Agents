import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown tilde fences', () => {
  it('keeps the code and drops a tilde fence with an info string', () => {
    const input = '~~~js\nconst total = 2 * 3\n~~~'
    expect(stripMarkdown(input)).toBe('const total = 2 * 3')
  })

  it('returns an empty string for a document made only of block markers', () => {
    expect(stripMarkdown('---\n>\n- ')).toBe('')
  })
})
