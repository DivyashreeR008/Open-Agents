import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import ScrollToTopButton from './ScrollToTopButton'
import ScrollToBottom from './ScrollToBottom'

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

describe('floating scroll control layout', () => {
  it('stacks both scroll buttons above the feedback action with distinct offsets', () => {
    render(
      <>
        <ScrollToTopButton />
        <ScrollToBottom />
      </>
    )

    const top = document.querySelector('button[aria-label="Scroll to top"]')
    const bottom = document.querySelector('button[aria-label="Scroll to bottom"]')

    expect(top).toBeTruthy()
    expect(bottom).toBeTruthy()

    expect(top.className).toContain('fixed')
    expect(top.className).toContain('right-5')
    expect(top.className).toContain('bottom-36')
    expect(top.className).not.toContain('bottom-6 ')

    expect(bottom.className).toContain('fixed')
    expect(bottom.className).toContain('right-5')
    expect(bottom.className).toContain('bottom-24')
    expect(bottom.className).not.toContain('bottom-20 ')
  })

  it('uses 40px square touch targets with no rotation or scaling that could change their footprint', () => {
    render(
      <>
        <ScrollToTopButton />
        <ScrollToBottom />
      </>
    )

    for (const name of ['Scroll to top', 'Scroll to bottom']) {
      const button = document.querySelector(`button[aria-label="${name}"]`)
      expect(button).toBeTruthy()
      expect(button.className).toContain('w-10')
      expect(button.className).toContain('h-10')
      expect(button.className).not.toContain('scale-')
    }
  })
})
