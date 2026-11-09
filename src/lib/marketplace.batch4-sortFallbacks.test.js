import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

describe('marketplace sort fallbacks', () => {
  it('places listings with missing or invalid publication dates last', () => {
    const sorted = sortListings(
      [
        { id: 'invalid', publishedAt: 'not-a-date' },
        { id: 'valid', publishedAt: '2026-01-02T00:00:00.000Z' },
        { id: 'missing' },
      ],
      'newest'
    )

    expect(sorted[0].id).toBe('valid')
    expect(sorted.slice(1).map((item) => item.id)).toEqual(['invalid', 'missing'])
  })

  it('falls back to id ordering when both dates are invalid and keeps the input untouched', () => {
    const input = [{ id: 'b' }, { id: 'a' }]
    const sorted = sortListings(input, 'oldest')

    expect(sorted.map((item) => item.id)).toEqual(['a', 'b'])
    expect(input.map((item) => item.id)).toEqual(['b', 'a'])
  })

  it('returns an empty list for a non-array input', () => {
    expect(sortListings(null)).toEqual([])
  })
})
