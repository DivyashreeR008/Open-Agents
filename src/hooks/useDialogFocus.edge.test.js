import { createElement, useRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDialogFocus } from './useDialogFocus'

function Panel({ onClose, children }) {
  const ref = useRef(null)
  useDialogFocus(ref, { onClose })

  return createElement(
    'div',
    { ref, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Edge dialog' },
    children
  )
}

function Harness({ onClose, children }) {
  const [open, setOpen] = useState(false)

  return createElement(
    'div',
    null,
    createElement('button', { onClick: () => setOpen(true) }, 'Open'),
    createElement('button', null, 'Behind'),
    open ? createElement(Panel, { onClose }, children) : null
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useDialogFocus edge behavior', () => {
  it('moves focus to the element marked for autofocus before the first control', () => {
    render(
      createElement(
        Harness,
        { onClose: vi.fn() },
        createElement('button', { key: 'first' }, 'First'),
        createElement('input', {
          key: 'preferred',
          'data-autofocus': 'true',
          'aria-label': 'Preferred field',
        }),
        createElement('button', { key: 'last' }, 'Last')
      )
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByLabelText('Preferred field')).toHaveFocus()
    expect(screen.getByRole('button', { name: 'First' })).not.toHaveFocus()
  })

  it('keeps focus on the panel when it has no focusable controls', () => {
    render(
      createElement(
        Harness,
        { onClose: vi.fn() },
        createElement('span', { key: 'text' }, 'Nothing interactive here')
      )
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveFocus()
    expect(dialog).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(dialog).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(dialog).toHaveFocus()
  })

  it('calls the latest close handler after a rerender', () => {
    const firstClose = vi.fn()
    const secondClose = vi.fn()
    const children = createElement('button', { key: 'close' }, 'Close panel')
    const { rerender } = render(createElement(Harness, { onClose: firstClose }, children))

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    rerender(createElement(Harness, { onClose: secondClose }, children))
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })

    expect(secondClose).toHaveBeenCalledTimes(1)
    expect(firstClose).not.toHaveBeenCalled()
  })
})
