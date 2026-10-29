import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScrollToBottom from './ScrollToBottom'

describe('ScrollToBottom', () => {
  let originalInnerHeight
  let originalScrollY
  let scrollToSpy

  beforeEach(() => {
    originalInnerHeight = window.innerHeight
    originalScrollY = window.scrollY
    scrollToSpy = vi.fn()
    window.scrollTo = scrollToSpy

    // Default dimensions: viewport of 600px, content of 600px (not scrollable)
    window.innerHeight = 600
    window.scrollY = 0
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 600,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 600,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(document.body, 'scrollHeight', {
      value: 600,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    window.innerHeight = originalInnerHeight
    window.scrollY = originalScrollY
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  const getScrollButton = () => document.querySelector('button[aria-label="Scroll to bottom"]')

  it('is hidden initially when content does not exceed viewport height', async () => {
    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()
    expect(button).toBeTruthy()
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button.className).toContain('opacity-0')
    expect(button.className).toContain('invisible')
  })

  it('remains hidden when content is scrollable but user is already at the bottom', async () => {
    document.documentElement.scrollHeight = 1200
    document.body.scrollHeight = 1200
    window.scrollY = 600 // scrollY (600) + innerHeight (600) === scrollHeight (1200)

    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(button.className).toContain('invisible')
  })

  it('appears when user scrolls up away from the bottom', async () => {
    document.documentElement.scrollHeight = 1200
    document.body.scrollHeight = 1200
    window.scrollY = 600

    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()
    expect(button).toHaveAttribute('aria-hidden', 'true')

    // User scrolls up to scrollY = 200 (far from bottom)
    await act(async () => {
      window.scrollY = 200
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'false')
      expect(button).toHaveAttribute('tabindex', '0')
      expect(button.className).toContain('opacity-100')
      expect(button.className).toContain('visible')
    })
  })

  it('appears as streamed content grows past the visible area without user interaction', async () => {
    // Start with non-scrollable content and user at top
    document.documentElement.scrollHeight = 600
    document.body.scrollHeight = 600
    window.scrollY = 0

    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()
    expect(button).toHaveAttribute('aria-hidden', 'true')

    // Simulate model streaming tokens: content height grows taller and DOM elements/text are appended
    await act(async () => {
      document.documentElement.scrollHeight = 1500
      document.body.scrollHeight = 1500

      // Append streamed content element to DOM
      const streamedChunk = document.createElement('div')
      streamedChunk.textContent = 'Streaming chunk from LLM provider...'
      document.body.appendChild(streamedChunk)
    })

    // MutationObserver triggers checkVisibility automatically without scroll or resize events
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'false')
      expect(button.className).toContain('visible')
      expect(button.className).toContain('opacity-100')
    })
  })

  it('hides again when the user reaches the bottom of the streamed content', async () => {
    document.documentElement.scrollHeight = 1500
    document.body.scrollHeight = 1500
    window.scrollY = 0

    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()

    // Simulate DOM mutation from streaming
    await act(async () => {
      const chunk = document.createElement('p')
      chunk.textContent = 'Another output line'
      document.body.appendChild(chunk)
    })

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'false')
    })

    // User scrolls to the bottom
    await act(async () => {
      window.scrollY = 900 // 900 + 600 = 1500
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'true')
      expect(button.className).toContain('invisible')
    })
  })

  it('scrolls to bottom when clicked', async () => {
    document.documentElement.scrollHeight = 1600
    document.body.scrollHeight = 1600
    window.scrollY = 100

    await act(async () => {
      render(<ScrollToBottom />)
    })
    const button = getScrollButton()

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'false')
    })

    await userEvent.click(button)

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 1600,
      behavior: 'smooth',
    })
  })

  it('cleans up event listeners and observers on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    let unmountFn
    await act(async () => {
      const { unmount } = render(<ScrollToBottom />)
      unmountFn = unmount
    })

    act(() => {
      unmountFn()
    })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
