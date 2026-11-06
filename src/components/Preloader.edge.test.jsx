import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import Preloader from './Preloader'

const BOOT_MS = 350
const TOTAL_MS = 350 + 1000 + 150 + 750 + 500

function mockMatchMedia(matches = false) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

function advance(ms) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('Preloader edge behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.documentElement.classList.remove('preloader-active')
  })

  it('lets Tab through while blocking other app shortcuts', () => {
    const listener = vi.fn()
    render(<Preloader onFinish={vi.fn()} />)
    window.addEventListener('keydown', listener)

    fireEvent.keyDown(document.body, { key: 'Tab' })
    expect(listener).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(document.body, { key: '?' })
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener('keydown', listener)
  })

  it('treats a repeated finish request as a single hand-off', () => {
    const onFinish = vi.fn()
    render(<Preloader onFinish={onFinish} />)

    fireEvent.click(screen.getByRole('button', { name: /Skip intro/i }))
    fireEvent.keyDown(window, { key: 'Escape' })
    advance(TOTAL_MS)

    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('completes both timelines when no finish callback is provided', () => {
    mockMatchMedia(true)
    const reduced = render(<Preloader />)
    advance(1)
    expect(document.documentElement).toHaveClass('preloader-active')
    reduced.unmount()

    mockMatchMedia(false)
    render(<Preloader />)
    advance(TOTAL_MS)

    expect(screen.queryByRole('button', { name: /Skip intro/i })).not.toBeInTheDocument()
  })

  it('cancels pending hand-offs when unmounted before the timeline completes', () => {
    const normalFinish = vi.fn()
    const normal = render(<Preloader onFinish={normalFinish} />)
    advance(BOOT_MS + 400)
    normal.unmount()
    advance(TOTAL_MS)

    expect(normalFinish).not.toHaveBeenCalled()

    mockMatchMedia(true)
    const reducedFinish = vi.fn()
    const reduced = render(<Preloader onFinish={reducedFinish} />)
    reduced.unmount()
    advance(1)

    expect(reducedFinish).not.toHaveBeenCalled()
  })
})
