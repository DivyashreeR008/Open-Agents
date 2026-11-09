import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { DEFAULT_TITLE, formatDocumentTitle, useDocumentTitle } from './useDocumentTitle'

describe('document title type guards', () => {
  it('uses the default title for non-string and whitespace-only values', () => {
    expect(formatDocumentTitle(42)).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle({ title: 'Settings' })).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle(['Settings'])).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle(false)).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle('   ')).toBe(DEFAULT_TITLE)
  })

  it('writes the default title when the hook receives a non-string value', () => {
    renderHook(() => useDocumentTitle(42))
    expect(document.title).toBe(DEFAULT_TITLE)
  })
})
