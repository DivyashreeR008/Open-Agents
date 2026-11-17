import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

const router = vi.hoisted(() => ({ location: { pathname: '/agents', search: '' } }))

vi.mock('react-router-dom', () => ({ useLocation: () => router.location }))

import PageTransition from './PageTransition'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PageTransition reduced motion', () => {
  it('skips the overlay and dimming when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    router.location = { pathname: '/agents', search: '' }

    const { container, rerender } = render(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )

    router.location = { pathname: '/workflows', search: '' }
    rerender(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )

    expect(container.querySelector('.page-transition-overlay-next')).toBeNull()
    expect(container.querySelector('.page-transition-overlay-prev')).toBeNull()
    expect(container.querySelector('.relative.z-10')).toHaveClass('opacity-100')
  })
})
