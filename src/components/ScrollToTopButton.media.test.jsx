import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import ScrollToTopButton from './ScrollToTopButton'

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  })
}

describe('ScrollToTopButton live motion preference', () => {
  let changeHandler

  beforeEach(() => {
    setScrollY(0)
    window.scrollTo = vi.fn()
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    setScrollY(0)
  })

  it('switches to instant scrolling when the preference changes after mount', async () => {
    render(<ScrollToTopButton />)
    act(() => changeHandler({ matches: true }))

    setScrollY(500)
    fireEvent.scroll(window)
    const button = screen.getByRole('button', { name: 'Scroll to top' })
    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'false'))

    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('removes the change listener it registered', () => {
    const { unmount } = render(<ScrollToTopButton />)
    const media = window.matchMedia.mock.results[0].value

    unmount()

    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
