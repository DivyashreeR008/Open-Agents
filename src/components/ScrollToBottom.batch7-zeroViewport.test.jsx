import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollToBottom from './ScrollToBottom'

const originalInnerHeight = window.innerHeight

afterEach(() => {
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight })
  vi.restoreAllMocks()
})

describe('ScrollToBottom with a zero viewport', () => {
  it('stays hidden when the viewport and document report no height', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 0 })
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(0)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(0)
    vi.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(0)

    render(<ScrollToBottom />)

    expect(screen.getByRole('button', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })
})
