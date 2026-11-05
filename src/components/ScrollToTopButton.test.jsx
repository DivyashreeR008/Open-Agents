import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ScrollToTopButton from './ScrollToTopButton'

function createMediaQuery(matches = false) {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  })
}

describe('ScrollToTopButton', () => {
  let media

  beforeEach(() => {
    setScrollY(0)
    media = createMediaQuery(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media)
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    setScrollY(0)
  })

  it('starts hidden at the top of the page', () => {
    render(<ScrollToTopButton />)

    const button = document.querySelector('button')
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button.className).toContain('pointer-events-none')
  })

  it('becomes visible and focusable after scrolling past the threshold', async () => {
    render(<ScrollToTopButton />)
    const button = document.querySelector('button')

    setScrollY(301)
    fireEvent.scroll(window)

    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'false'))
    expect(button).toHaveAttribute('tabindex', '0')
    expect(button.className).toContain('pointer-events-auto')
  })

  it('stays hidden at the exact threshold', async () => {
    render(<ScrollToTopButton />)
    const button = document.querySelector('button')

    setScrollY(300)
    fireEvent.scroll(window)

    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'true'))
  })

  it('scrolls to the top with smooth behaviour and hides itself', async () => {
    render(<ScrollToTopButton />)
    const button = document.querySelector('button')
    setScrollY(500)
    fireEvent.scroll(window)
    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'false'))

    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(button).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses instant scrolling when reduced motion is requested', () => {
    media = createMediaQuery(true)
    window.matchMedia.mockReturnValue(media)
    render(<ScrollToTopButton />)

    const button = document.querySelector('button')
    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('removes the scroll listener and media-query listener on unmount', () => {
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ScrollToTopButton />)

    unmount()

    expect(removeWindowListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('falls back to the legacy media-query listener methods', () => {
    media = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: undefined,
      removeEventListener: undefined,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }
    window.matchMedia.mockReturnValue(media)
    const { unmount } = render(<ScrollToTopButton />)

    expect(media.addListener).toHaveBeenCalledWith(expect.any(Function))
    unmount()
    expect(media.removeListener).toHaveBeenCalledWith(expect.any(Function))
  })
})
