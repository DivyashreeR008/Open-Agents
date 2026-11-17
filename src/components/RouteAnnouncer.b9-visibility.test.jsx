import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const router = vi.hoisted(() => ({ location: { pathname: '/agents' } }))

vi.mock('react-router-dom', () => ({ useLocation: () => router.location }))

import RouteAnnouncer from './RouteAnnouncer'

function installPage(headingStyle = '') {
  const main = document.createElement('main')
  main.id = 'main-content'
  main.tabIndex = -1
  const heading = document.createElement('h1')
  heading.textContent = 'Agent library'
  heading.style.visibility = headingStyle
  main.appendChild(heading)
  document.body.appendChild(main)
  return { main, heading }
}

beforeEach(() => {
  vi.useFakeTimers()
  router.location = { pathname: '/agents' }
})

afterEach(() => {
  vi.useRealTimers()
  document.getElementById('main-content')?.remove()
})

describe('RouteAnnouncer rendered-page detection', () => {
  it('waits for a visibility-hidden heading instead of announcing it', () => {
    const { heading } = installPage('hidden')
    const { rerender } = render(<RouteAnnouncer />)

    router.location = { pathname: '/workflows' }
    rerender(<RouteAnnouncer />)

    expect(screen.getByRole('status')).not.toHaveTextContent('Navigated to')

    heading.style.visibility = 'visible'
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(screen.getByRole('status')).toHaveTextContent('Navigated to Agent library')
  })

  it('ignores headings that are hidden from assistive technology', () => {
    const { main, heading } = installPage()
    heading.setAttribute('aria-hidden', 'true')
    main.setAttribute('aria-hidden', 'true')

    const { rerender } = render(<RouteAnnouncer />)
    router.location = { pathname: '/settings' }
    rerender(<RouteAnnouncer />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('status')).not.toHaveTextContent('Agent library')
    expect(screen.getByRole('status')).toHaveTextContent('Navigated to')
  })
})
