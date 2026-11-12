import { describe, expect, it } from 'vitest'
import { escapeHtml } from './exportPdf'

describe('escapeHtml unusual values', () => {
  it('stringifies a symbol without throwing', () => {
    expect(escapeHtml(Symbol('key'))).toBe('Symbol(key)')
  })

  it('escapes ampersands before angle brackets', () => {
    expect(escapeHtml('<a & b>')).toBe('&lt;a &amp; b&gt;')
  })
})
