import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_PAGE_SIZE, useProgressiveList } from './useProgressiveList'

const makeItems = (count) => Array.from({ length: count }, (_, index) => ({ id: `agent-${index}` }))

describe('progressive list defaults', () => {
  it('uses the default page size and an empty reset key', () => {
    const items = makeItems(DEFAULT_PAGE_SIZE + 1)
    const { result } = renderHook(() => useProgressiveList(items))

    expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE)
    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
    expect(result.current.remaining).toBe(1)
    expect(result.current.hasMore).toBe(true)

    act(() => result.current.showMore())
    expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE + 1)
    expect(result.current.hasMore).toBe(false)
  })

  it('clamps the first page to a shorter list', () => {
    const { result } = renderHook(() => useProgressiveList(makeItems(3)))

    expect(result.current.visibleCount).toBe(3)
    expect(result.current.visibleItems).toHaveLength(3)
    expect(result.current.remaining).toBe(0)
    expect(result.current.hasMore).toBe(false)
  })
})
