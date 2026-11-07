import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown unclosed fences', () => {
  it('keeps code from an unclosed fence without leaving the fence marker', () => {
    expect(stripMarkdown('Intro\n```js\nconst value = 1\n')).toBe('Intro\nconst value = 1')
  })

  it('handles tilde fences and leaves inline tildes alone', () => {
    expect(stripMarkdown('~~~\nraw code\n~~~\n\nabout ~this~ text')).toBe(
      'raw code\n\nabout ~this~ text'
    )
  })
})
