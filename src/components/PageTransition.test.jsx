import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'

const router = vi.hoisted(() => ({
  location: { pathname: '/agents', search: '' },
}))

vi.mock('react-router-dom', () => ({
  useLocation: () => router.location,
}))

const { default: PageTransition } = await import('./PageTransition')

function renderTransition() {
  return render(
    <PageTransition>
      <p>Page content</p>
    </PageTransition>
  )
}

function overlay(container) {
  return container.querySelector('.fixed.inset-0')
}

describe('PageTransition', () => {
  beforeEach(() => {
    router.location = { pathname: '/agents', search: '' }
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children without an overlay on the first render', () => {
    const { container } = renderTransition()

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(overlay(container)).toBeNull()
    expect(container.querySelector('.relative.z-10')).toHaveClass('opacity-100')
  })

  it('shows the next overlay and dims content on a later pathname', () => {
    const { container, rerender } = renderTransition()
    router.location = { pathname: '/workflows', search: '' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )

    expect(overlay(container)).toHaveClass('page-transition-overlay-next')
    expect(overlay(container)).toHaveClass('pointer-events-none')
    expect(container.querySelector('.relative.z-10')).toHaveClass('opacity-50')
  })

  it('shows the previous overlay when the pathname moves backwards', () => {
    router.location = { pathname: '/workflows', search: '' }
    const { container, rerender } = renderTransition()
    router.location = { pathname: '/agents', search: '' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )

    expect(overlay(container)).toHaveClass('page-transition-overlay-prev')
  })

  it('removes the overlay and restores opacity after 650 milliseconds', () => {
    const { container, rerender } = renderTransition()
    router.location = { pathname: '/workflows', search: '' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )
    expect(overlay(container)).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(649)
    })
    expect(overlay(container)).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(overlay(container)).toBeNull()
    expect(container.querySelector('.relative.z-10')).toHaveClass('opacity-100')
  })

  it('does not start a transition when only the search string changes', () => {
    const { container, rerender } = renderTransition()
    router.location = { pathname: '/agents', search: '?q=review' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )

    expect(overlay(container)).toBeNull()
  })

  it('clears the pending timer on unmount', () => {
    const { rerender, unmount } = renderTransition()
    router.location = { pathname: '/workflows', search: '' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
    act(() => {
      vi.advanceTimersByTime(650)
    })
  })
})
