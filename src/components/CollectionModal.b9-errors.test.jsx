import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CollectionModal from './CollectionModal'

vi.mock('../hooks/useDialogFocus', () => ({ useDialogFocus: vi.fn() }))

function renderModal(error = 'Name is required') {
  return render(
    <CollectionModal
      title="New collection"
      value=""
      onChange={vi.fn()}
      error={error}
      onClose={vi.fn()}
      onSubmit={vi.fn()}
    />
  )
}

describe('CollectionModal error association', () => {
  it('marks the name field invalid and points it at the alert', () => {
    renderModal()

    const input = screen.getByLabelText('Collection name')
    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('Name is required')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', alert.id)
  })

  it('clears the invalid state when the error is removed', () => {
    const { rerender } = renderModal()
    const input = screen.getByLabelText('Collection name')

    rerender(
      <CollectionModal
        title="New collection"
        value="Launch"
        onChange={vi.fn()}
        error=""
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
