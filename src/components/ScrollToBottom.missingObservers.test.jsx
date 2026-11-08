import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollToBottom from './ScrollToBottom'

let originalMutationObserver
let originalResizeObserver

beforeEach(() => {
  originalMutationObserver = globalThis.MutationObserver
  originalResizeObserver = globalThis.ResizeObserver
  vi.stubGlobal('MutationObserver', undefined)
  vi.stubGlobal('ResizeObserver', undefined)
})

afterEach(() => {
  vi.stubGlobal('MutationObserver', originalMutationObserver)
  vi.stubGlobal('ResizeObserver', originalResizeObserver)
})

describe('ScrollToBottom observer guards', () => {
  it('renders and cleans up when both observers are unavailable', () => {
    const { unmount } = render(<ScrollToBottom />)

    const button = screen.getByRole('button', { hidden: true })
    expect(button).toHaveAttribute('aria-label', 'Scroll to bottom')
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(() => unmount()).not.toThrow()
  })
})
