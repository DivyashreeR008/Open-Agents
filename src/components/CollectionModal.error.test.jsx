import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CollectionModal from './CollectionModal'

describe('CollectionModal validation feedback', () => {
  it('renders the supplied error without replacing the editable field', () => {
    render(
      <CollectionModal
        title="New collection"
        value=""
        onChange={vi.fn()}
        error="A collection with that name already exists."
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByText('A collection with that name already exists.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Collection name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
