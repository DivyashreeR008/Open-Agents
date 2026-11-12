import { describe, expect, it } from 'vitest'
import { tokenEstimate } from './useTokenCounter'

describe('tokenEstimate whitespace handling', () => {
  it('counts tabs and newlines between single-letter words', () => {
    expect(tokenEstimate('a\tb\nc')).toBe(6)
  })

  it('returns zero for a whitespace-only string', () => {
    expect(tokenEstimate('\t \n')).toBe(0)
  })
})
