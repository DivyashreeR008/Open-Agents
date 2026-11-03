import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useProgressiveList } from './useProgressiveList'

const makeItems = (count) => Array.from({ length: count }, (_, index) => ({ id: `agent-${index}` }))

describe('useProgressiveList', () => {
  it('renders one page and reveals more on demand', () => {
    const items = makeItems(75)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: 10, resetKey: 'all' })
    )

    expect(result.current.visibleItems).toHaveLength(10)
    expect(result.current.total).toBe(75)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.remaining).toBe(65)

    act(() => result.current.showMore())
    expect(result.current.visibleItems).toHaveLength(20)
    expect(result.current.visibleCount).toBe(20)

    for (let i = 0; i < 10; i += 1) {
      act(() => result.current.showMore())
    }

    expect(result.current.visibleCount).toBe(75)
    expect(result.current.hasMore).toBe(false)
    expect(result.current.remaining).toBe(0)
  })

  it('resets to the first page when the filter key changes', () => {
    const items = makeItems(75)
    const { result, rerender } = renderHook(
      ({ resetKey }) => useProgressiveList(items, { pageSize: 10, resetKey }),
      { initialProps: { resetKey: 'first' } }
    )

    act(() => result.current.showMore())
    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(30)

    rerender({ resetKey: 'second' })
    expect(result.current.visibleCount).toBe(10)

    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(20)

    // Returning to an old filter must not restore its expanded window.
    rerender({ resetKey: 'first' })
    expect(result.current.visibleCount).toBe(10)
  })

  it('clamps the window when the result set shrinks', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useProgressiveList(items, { pageSize: 10, resetKey: 'same' }),
      { initialProps: { items: makeItems(25) } }
    )

    act(() => result.current.showMore())
    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(25)

    rerender({ items: makeItems(8) })
    expect(result.current.visibleCount).toBe(8)
    expect(result.current.hasMore).toBe(false)
  })
})
