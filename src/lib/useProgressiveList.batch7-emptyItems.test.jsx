import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useProgressiveList } from './useProgressiveList'

describe('useProgressiveList empty items', () => {
  it('reports no pages and ignores showMore when items array is empty', () => {
    const { result } = renderHook(() => useProgressiveList([]))

    expect(result.current.visibleItems).toEqual([])
    expect(result.current.visibleCount).toBe(0)
    expect(result.current.total).toBe(0)
    expect(result.current.hasMore).toBe(false)
    expect(result.current.remaining).toBe(0)

    act(() => {
      result.current.showMore()
    })

    expect(result.current.visibleItems).toEqual([])
    expect(result.current.visibleCount).toBe(0)
    expect(result.current.hasMore).toBe(false)
  })
})
