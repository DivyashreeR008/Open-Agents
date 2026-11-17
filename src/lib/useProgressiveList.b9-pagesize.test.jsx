import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { DEFAULT_PAGE_SIZE, useProgressiveList } from './useProgressiveList'

const makeItems = (count) => Array.from({ length: count }, (_, index) => ({ id: `agent-${index}` }))

describe('progressive list page size guards', () => {
  it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
    'falls back to the default page size for %s',
    (pageSize) => {
      const items = makeItems(DEFAULT_PAGE_SIZE + 5)
      const { result } = renderHook(() => useProgressiveList(items, { pageSize, resetKey: 'all' }))

      expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
      expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE)
      expect(result.current.remaining).toBe(5)

      act(() => result.current.showMore())
      expect(result.current.visibleCount).toBe(items.length)
    }
  )

  it('never exposes a fractional window when a caller supplies one', () => {
    const { result } = renderHook(() =>
      useProgressiveList(makeItems(20), { pageSize: 2.9, resetKey: 'all' })
    )

    expect(result.current.visibleCount).toBe(2)
  })
})
