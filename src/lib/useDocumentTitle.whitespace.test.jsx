import { describe, expect, it } from 'vitest'
import { DEFAULT_TITLE, formatDocumentTitle } from './useDocumentTitle'

describe('document title blank input handling', () => {
  it('treats whitespace-only titles as missing', () => {
    expect(formatDocumentTitle('   ')).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle('\n\t')).toBe(DEFAULT_TITLE)
  })

  it('preserves a real title while still appending the site name', () => {
    expect(formatDocumentTitle('Settings')).toBe('Settings \u2014 Open Agents')
  })
})
