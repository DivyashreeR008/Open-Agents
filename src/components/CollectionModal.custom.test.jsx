import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CollectionModal from './CollectionModal'

describe('CollectionModal custom content', () => {
  it('replaces the default name input with supplied children', () => {
    render(
      <CollectionModal
        title="Delete collection"
        description="This cannot be undone."
        onClose={vi.fn()}
        onSubmit={vi.fn((event) => event.preventDefault())}
        submitLabel="Delete"
        destructive
      >
        <p>Confirm the removal.</p>
      </CollectionModal>
    )

    expect(screen.getByText('Confirm the removal.')).toBeInTheDocument()
    expect(screen.queryByLabelText(/Collection name/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('bg-zinc-600')
  })

  it('submits the form through the supplied submit handler', () => {
    const onSubmit = vi.fn((event) => event.preventDefault())
    render(
      <CollectionModal
        title="Rename"
        value="Old name"
        onChange={vi.fn()}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )

    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
