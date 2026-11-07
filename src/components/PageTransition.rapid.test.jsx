import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'

const router = vi.hoisted(() => ({ location: { pathname: '/agents', search: '' } }))
vi.mock('react-router-dom', () => ({ useLocation: () => router.location }))

const { default: PageTransition } = await import('./PageTransition')

describe('PageTransition rapid navigation', () => {
  beforeEach(() => {
    router.location = { pathname: '/agents', search: '' }
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('keeps one pending timer and uses the latest direction', () => {
    const { container, rerender } = render(
      <PageTransition>
        <p>content</p>
      </PageTransition>
    )
    router.location = { pathname: '/workflows', search: '' }
    rerender(
      <PageTransition>
        <p>content</p>
      </PageTransition>
    )
    router.location = { pathname: '/agents', search: '' }
    rerender(
      <PageTransition>
        <p>content</p>
      </PageTransition>
    )

    expect(vi.getTimerCount()).toBe(1)
    expect(container.querySelector('.page-transition-overlay-prev')).not.toBeNull()

    act(() => vi.advanceTimersByTime(650))
    expect(container.querySelector('.fixed.inset-0')).toBeNull()
  })
})
