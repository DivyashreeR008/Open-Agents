import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { DEFAULT_PAGE_SIZE, useProgressiveList } from './useProgressiveList'

const makeItems = (count) => Array.from({ length: count }, (_, index) => ({ id: `agent-${index}` }))

describe('useProgressiveList edge behavior', () => {
  it('uses the default page size when no options are provided', () => {
    const items = makeItems(DEFAULT_PAGE_SIZE + 3)
    const { result } = renderHook(() => useProgressiveList(items))

    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
    expect(result.current.remaining).toBe(3)
    expect(result.current.hasMore).toBe(true)

    act(() => result.current.showMore())

    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE + 3)
    expect(result.current.hasMore).toBe(false)
  })

  it('collapses to an empty window when the list shrinks to zero', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useProgressiveList(items, { pageSize: 10, resetKey: 'all' }),
      { initialProps: { items: makeItems(25) } }
    )

    act(() => result.current.showMore())
    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(25)

    rerender({ items: [] })

    expect(result.current.visibleItems).toEqual([])
    expect(result.current).toMatchObject({
      visibleCount: 0,
      total: 0,
      hasMore: false,
      remaining: 0,
    })

    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(0)

    rerender({ items: makeItems(4) })
    expect(result.current.visibleCount).toBe(4)
    expect(result.current.remaining).toBe(0)
  })

  it('ignores a stale showMore callback after the filter changes', () => {
    const items = makeItems(40)
    const { result, rerender } = renderHook(
      ({ resetKey }) => useProgressiveList(items, { pageSize: 10, resetKey }),
      { initialProps: { resetKey: 'first' } }
    )

    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(20)

    const staleShowMore = result.current.showMore
    rerender({ resetKey: 'second' })
    expect(result.current.visibleCount).toBe(10)

    act(() => staleShowMore())

    expect(result.current.visibleCount).toBe(10)
    expect(result.current.visibleItems).toHaveLength(10)
  })
})
