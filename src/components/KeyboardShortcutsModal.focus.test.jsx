import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'

describe('KeyboardShortcutsModal initial focus', () => {
  it('moves focus into the dialog and returns it to the opener on close', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const { unmount } = render(<KeyboardShortcutsModal isOpen onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    const close = screen.getByRole('button', { name: 'Close keyboard shortcuts dialog' })

    expect(dialog).toHaveAttribute('tabindex', '-1')
    expect(close).toHaveFocus()

    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('wraps tab focus inside the dialog', () => {
    render(<KeyboardShortcutsModal isOpen onClose={vi.fn()} />)
    const close = screen.getByRole('button', { name: 'Close keyboard shortcuts dialog' })

    fireEvent.keyDown(window, { key: 'Tab' })

    expect(close).toHaveFocus()
  })
})
