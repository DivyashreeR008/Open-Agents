import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useProgressiveList } from './useProgressiveList'

describe('useProgressiveList empty items', () => {
  it('reports no pages and ignores showMore', () => {
    const { result } = renderHook(() => useProgressiveList([], { pageSize: 5 }))

    expect(result.current.visibleItems).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.hasMore).toBe(false)
    expect(result.current.remaining).toBe(0)

    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(0)
  })
})
