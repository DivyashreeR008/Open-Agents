import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CollectionPicker from './CollectionPicker'

describe('CollectionPicker dialog', () => {
  it('exposes a labelled dialog and closes on Escape', () => {
    const onClose = vi.fn()
    render(<CollectionPicker agentId="a1" onClose={onClose} />)
    expect(screen.getByRole('dialog', { name: /Add to collection/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/New collection name/i)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves focus into the dialog and keeps it there on Tab', () => {
    render(<CollectionPicker agentId="a1" onClose={() => {}} />)
    const input = screen.getByLabelText(/New collection name/i)
    expect(input).toHaveFocus()
    const close = screen.getByRole('button', { name: /close dialog/i })
    const create = screen.getByRole('button', { name: /create/i })
    create.focus()
    fireEvent.keyDown(create, { key: 'Tab' })
    expect(close).toHaveFocus()
  })

  it('restores focus to the opener when closed', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()
    const { unmount } = render(<CollectionPicker agentId="a1" onClose={() => {}} />)
    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })
})
