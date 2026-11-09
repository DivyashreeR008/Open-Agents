import { describe, expect, it } from 'vitest'
import { escapeHtml } from './exportPdf'

describe('PDF HTML escaping fallbacks', () => {
  it('turns nullish values into an empty string and keeps numeric zero', () => {
    expect(escapeHtml(undefined)).toBe('')
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(0)).toBe('0')
    expect(escapeHtml(false)).toBe('false')
  })
})
