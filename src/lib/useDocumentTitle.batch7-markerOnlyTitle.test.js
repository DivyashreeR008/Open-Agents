import { describe, expect, it } from 'vitest'
import { DEFAULT_TITLE, formatDocumentTitle } from './useDocumentTitle'

describe('formatDocumentTitle marker-only titles', () => {
  it('uses the default title when the page title contains only newlines and tabs', () => {
    expect(formatDocumentTitle('\n\t')).toBe(DEFAULT_TITLE)
  })
})
