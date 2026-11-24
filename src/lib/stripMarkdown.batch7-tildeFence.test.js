import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown tilde fence with info string', () => {
  it('keeps the code and drops a tilde fence with an info string', () => {
    expect(stripMarkdown('~~~js\nconst a = 1\n~~~')).toBe('const a = 1')
    expect(stripMarkdown('~~~python\ndef greet():\n    return "hello"\n~~~')).toBe(
      'def greet():\n    return "hello"'
    )
  })

  it('preserves code formatting and characters that resemble markdown inside tilde fence with info string', () => {
    const input = '~~~bash\n# not a heading\necho "2 * 3 * 4"\n~~~'
    expect(stripMarkdown(input)).toBe('# not a heading\necho "2 * 3 * 4"')
  })

  it('handles surrounding content with a tilde fence and info string', () => {
    const doc = 'Before\n\n~~~json\n{\n  "status": "ok"\n}\n~~~\n\nAfter'
    expect(stripMarkdown(doc)).toBe('Before\n\n{\n  "status": "ok"\n}\n\nAfter')
  })

  it('handles unclosed tilde fence with an info string', () => {
    expect(stripMarkdown('Intro\n~~~ts\nconst value: number = 42\n')).toBe(
      'Intro\nconst value: number = 42'
    )
  })
})
