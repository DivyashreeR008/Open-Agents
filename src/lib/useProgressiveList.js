import { useEffect, useMemo, useState } from 'react'

export const DEFAULT_PAGE_SIZE = 60

/**
 * Keeps large catalogues cheap to render by exposing only a window of items
 * and letting the caller add another page on demand.
 *
 * `resetKey` should describe the active filter/search. When it changes, the
 * visible window returns to the first page so a new result set always starts
 * at the top. The reset is derived during render rather than waiting for an
 * effect, so a new result set never flashes the previous (larger) window.
 */
export function useProgressiveList(items, { pageSize = DEFAULT_PAGE_SIZE, resetKey = '' } = {}) {
  const requestedPageSize = Number(pageSize)
  const safePageSize =
    Number.isFinite(requestedPageSize) && requestedPageSize > 0
      ? Math.max(1, Math.floor(requestedPageSize))
      : DEFAULT_PAGE_SIZE

  const [windowState, setWindowState] = useState({
    resetKey,
    pageSize: safePageSize,
    visibleCount: safePageSize,
  })

  const isCurrentWindow = windowState.resetKey === resetKey && windowState.pageSize === safePageSize
  const visibleCount = isCurrentWindow ? windowState.visibleCount : safePageSize

  // Drop the stale window after a filter change so returning to an old filter
  // doesn't restore a previously expanded list.
  useEffect(() => {
    setWindowState((current) => {
      if (current.resetKey === resetKey && current.pageSize === safePageSize) {
        return current
      }
      return { resetKey, pageSize: safePageSize, visibleCount: safePageSize }
    })
  }, [safePageSize, resetKey])

  const total = items.length

  return useMemo(() => {
    const count = Math.min(Math.max(visibleCount, safePageSize), total)

    return {
      visibleItems: items.slice(0, count),
      visibleCount: count,
      total,
      hasMore: count < total,
      remaining: total - count,
      showMore: () => {
        setWindowState((current) => {
          const base =
            current.resetKey === resetKey && current.pageSize === safePageSize
              ? current.visibleCount
              : safePageSize

          return {
            resetKey,
            pageSize: safePageSize,
            visibleCount: Math.min(base + safePageSize, total),
          }
        })
      },
    }
  }, [items, safePageSize, resetKey, total, visibleCount])
}
