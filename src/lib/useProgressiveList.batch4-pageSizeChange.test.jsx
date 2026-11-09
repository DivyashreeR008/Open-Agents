import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useProgressiveList } from './useProgressiveList'

const items = Array.from({ length: 10 }, (_, index) => ({ id: `agent-${index}` }))

describe('progressive list page size changes', () => {
  it('restarts the window when the page size changes and continues from there', () => {
    const { result, rerender } = renderHook(
      ({ pageSize }) => useProgressiveList(items, { pageSize, resetKey: 'all' }),
      { initialProps: { pageSize: 2 } }
    )

    act(() => result.current.showMore())
    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(6)

    rerender({ pageSize: 3 })
    expect(result.current.visibleCount).toBe(3)
    expect(result.current.visibleItems).toHaveLength(3)

    act(() => result.current.showMore())
    expect(result.current.visibleCount).toBe(6)
    expect(result.current.remaining).toBe(4)
  })
})
