import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScrollToBottom from './ScrollToBottom'

const originalMatchMedia = window.matchMedia
const originalScrollTo = window.scrollTo

function setPageHeight(scrollHeight) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: 600,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.body, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
    writable: true,
  })
}

describe('ScrollToBottom edge behavior', () => {
  let originalInnerHeight
  let originalScrollY

  beforeEach(() => {
    originalInnerHeight = window.innerHeight
    originalScrollY = window.scrollY
    window.innerHeight = 600
    window.scrollY = 0
    window.scrollTo = vi.fn()
    setPageHeight(1200)
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    window.scrollTo = originalScrollTo
    window.innerHeight = originalInnerHeight
    window.scrollY = originalScrollY
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const getButton = () => document.querySelector('button[aria-label="Scroll to bottom"]')

  it('uses the legacy media query listener API and removes it on unmount', async () => {
    const mediaQuery = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }
    window.matchMedia = vi.fn(() => mediaQuery)

    let view
    await act(async () => {
      view = render(<ScrollToBottom />)
    })

    expect(mediaQuery.addListener).toHaveBeenCalledTimes(1)
    const listener = mediaQuery.addListener.mock.calls[0][0]

    act(() => {
      listener({ matches: true })
    })
    expect(getButton().className).not.toContain('transition-all')

    act(() => {
      view.unmount()
    })
    expect(mediaQuery.removeListener).toHaveBeenCalledWith(listener)
  })

  it('switches to an instant scroll when reduced motion is enabled later', async () => {
    let changeHandler
    const mediaQuery = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((eventName, handler) => {
        if (eventName === 'change') changeHandler = handler
      }),
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn(() => mediaQuery)

    let view
    await act(async () => {
      view = render(<ScrollToBottom />)
    })
    const button = getButton()
    expect(button.className).toContain('transition-all')

    act(() => {
      changeHandler({ matches: true })
    })
    expect(button.className).not.toContain('transition-all')

    await userEvent.click(button)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: 'auto' })

    act(() => {
      view.unmount()
    })
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', changeHandler)
  })

  it('recalculates visibility from a body resize callback and disconnects on unmount', async () => {
    const observers = []
    class FakeResizeObserver {
      constructor(callback) {
        this.callback = callback
        this.observe = vi.fn()
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
    window.scrollY = 600

    let view
    await act(async () => {
      view = render(<ScrollToBottom />)
    })
    const button = getButton()
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(observers).toHaveLength(1)
    expect(observers[0].observe).toHaveBeenCalledWith(document.body)
    expect(observers[0].observe).toHaveBeenCalledWith(document.documentElement)

    act(() => {
      window.scrollY = 100
      observers[0].callback()
    })

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-hidden', 'false')
    })

    act(() => {
      view.unmount()
    })
    expect(observers[0].disconnect).toHaveBeenCalled()
  })
})
