import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { DEFAULT_PAGE_SIZE, useProgressiveList } from './useProgressiveList'

const makeItems = (count) => Array.from({ length: count }, (_, index) => ({ id: `item-${index}` }))

describe('useProgressiveList pageSize sanitization (Issue #2588)', () => {
  it('falls back to DEFAULT_PAGE_SIZE when pageSize is 0', () => {
    const items = makeItems(100)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: 0, resetKey: 'test' })
    )

    expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE)
    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
    expect(result.current.hasMore).toBe(true)
  })

  it('falls back to DEFAULT_PAGE_SIZE when pageSize is negative', () => {
    const items = makeItems(100)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: -15, resetKey: 'test' })
    )

    expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE)
    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
  })

  it('falls back to DEFAULT_PAGE_SIZE when pageSize is NaN or invalid', () => {
    const items = makeItems(100)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: 'not-a-number', resetKey: 'test' })
    )

    expect(result.current.visibleItems).toHaveLength(DEFAULT_PAGE_SIZE)
    expect(result.current.visibleCount).toBe(DEFAULT_PAGE_SIZE)
  })

  it('floors fractional positive page sizes', () => {
    const items = makeItems(50)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: 12.8, resetKey: 'test' })
    )

    expect(result.current.visibleItems).toHaveLength(12)
    expect(result.current.visibleCount).toBe(12)
    expect(result.current.remaining).toBe(38)
  })

  it('keeps valid positive integer page sizes unchanged', () => {
    const items = makeItems(50)
    const { result } = renderHook(() =>
      useProgressiveList(items, { pageSize: 25, resetKey: 'test' })
    )

    expect(result.current.visibleItems).toHaveLength(25)
    expect(result.current.visibleCount).toBe(25)
  })
})
