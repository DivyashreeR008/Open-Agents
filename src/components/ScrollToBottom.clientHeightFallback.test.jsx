import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import ScrollToBottom from './ScrollToBottom'

const originalInnerHeight = window.innerHeight

beforeEach(() => {
  window.innerHeight = 0
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: 600,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 1200,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(document.body, 'scrollHeight', {
    value: 1200,
    configurable: true,
    writable: true,
  })
  window.scrollY = 0
  window.scrollTo = vi.fn()
})

afterEach(() => {
  window.innerHeight = originalInnerHeight
  vi.restoreAllMocks()
})

describe('ScrollToBottom client height fallback', () => {
  it('uses the document element height when window.innerHeight is zero', async () => {
    let view
    await act(async () => {
      view = render(<ScrollToBottom />)
    })

    const button = view.container.querySelector('button[aria-label="Scroll to bottom"]')
    expect(button).toHaveAttribute('aria-hidden', 'false')
  })
})
