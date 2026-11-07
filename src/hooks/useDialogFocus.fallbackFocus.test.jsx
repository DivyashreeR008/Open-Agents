import { createElement, useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { useDialogFocus } from './useDialogFocus'

function Panel() {
  const ref = useRef(null)
  useDialogFocus(ref)
  return createElement(
    'div',
    { ref, role: 'dialog', 'aria-label': 'Fallback dialog' },
    createElement('button', null, 'Only action')
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useDialogFocus fallback paths', () => {
  it('does nothing when the container ref is still null', () => {
    const ref = { current: null }
    expect(() => renderHook(() => useDialogFocus(ref, { active: true }))).not.toThrow()
  })

  it('retries focus without options when the browser rejects preventScroll', () => {
    const nativeFocus = HTMLElement.prototype.focus
    const focusSpy = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(function focus(options) {
        if (options && options.preventScroll) {
          throw new TypeError('preventScroll is not supported')
        }
        return nativeFocus.call(this, options)
      })

    render(createElement(Panel))
    const action = screen.getByRole('button', { name: 'Only action' })
    fireEvent.keyDown(action, { key: 'Escape' })

    const attempts = focusSpy.mock.calls.filter(([options]) => options?.preventScroll)
    expect(attempts.length).toBeGreaterThan(0)
    expect(action).toHaveFocus()
  })
})
