import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ConfirmDialog from './ConfirmDialog'

function renderDialog(overrides = {}) {
  const props = {
    title: 'Delete item?',
    description: 'This removes the item permanently.',
    confirmLabel: 'Delete item',
    onConfirm: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  }

  render(<ConfirmDialog {...props} />)
  return props
}

describe('ConfirmDialog', () => {
  it('describes the consequence and starts focus on the safe action', () => {
    renderDialog()

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAccessibleName('Delete item?')
    expect(dialog).toHaveAccessibleDescription('This removes the item permanently.')
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('runs the confirm handler only after the destructive button is pressed', () => {
    const props = renderDialog()

    expect(props.onConfirm).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }))
    expect(props.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('dismisses through cancel, the close control, and Escape without confirming', () => {
    const props = renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(props.onClose).toHaveBeenCalledTimes(3)
    expect(props.onConfirm).not.toHaveBeenCalled()
  })
})
