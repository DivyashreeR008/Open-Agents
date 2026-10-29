import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CollectionModal from './CollectionModal'

describe('CollectionModal dialog', () => {
  it('is labelled by its title, focuses the name field and closes on Escape', () => {
    const onClose = vi.fn()
    render(<CollectionModal title="New Collection" value="" onChange={() => {}} onClose={onClose} onSubmit={(e) => e.preventDefault()} />)
    expect(screen.getByRole('dialog', { name: 'New Collection' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByLabelText(/Collection name/i)).toHaveFocus()
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('returns focus to the opener when it unmounts', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()
    const { unmount } = render(<CollectionModal title="Rename Collection" value="" onChange={() => {}} onClose={() => {}} onSubmit={() => {}} />)
    expect(opener).not.toHaveFocus()
    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })
})
