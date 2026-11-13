import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'

describe('KeyboardShortcutsModal coverage and dismissal', () => {
  it('lists every active binding, including all four providers', () => {
    render(<KeyboardShortcutsModal isOpen onClose={vi.fn()} />)

    const list = screen.getByRole('list', { name: 'Available keyboard shortcuts' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(6)
    expect(list).toHaveTextContent('Ctrl / Cmd + K')
    expect(list).toHaveTextContent('Ctrl + Enter')
    expect(list).toHaveTextContent('Alt + 1 / 2 / 3 / 4')
    expect(list).toHaveTextContent('OpenRouter')
    expect(list).toHaveTextContent('Run the current agent')
  })

  it('closes when the backdrop is clicked but stays open for panel clicks', () => {
    const onClose = vi.fn()
    render(<KeyboardShortcutsModal isOpen onClose={onClose} />)

    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(dialog.parentElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
