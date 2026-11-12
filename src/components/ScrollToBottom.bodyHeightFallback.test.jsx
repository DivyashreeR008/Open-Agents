import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render } from '@testing-library/react'
import ScrollToBottom from './ScrollToBottom'

const originalInnerHeight = window.innerHeight
const originalScrollY = window.scrollY

beforeEach(() => {
  window.innerHeight = 600
  window.scrollY = 0
  window.scrollTo = vi.fn()
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: 600,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 0,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.body, 'scrollHeight', {
    value: 1400,
    configurable: true,
    writable: true,
  })
})

afterEach(() => {
  window.innerHeight = originalInnerHeight
  window.scrollY = originalScrollY
  vi.restoreAllMocks()
})

describe('ScrollToBottom body scroll height fallback', () => {
  it('scrolls to the body height when the document element height is zero', async () => {
    let view
    await act(async () => {
      view = render(<ScrollToBottom />)
    })

    const button = view.container.querySelector('button[aria-label="Scroll to bottom"]')
    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1400, behavior: 'smooth' })
  })
})
