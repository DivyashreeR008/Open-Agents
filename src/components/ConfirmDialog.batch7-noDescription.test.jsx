import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog without a description', () => {
  it('omits the described-by relationship and the description paragraph', () => {
    render(<ConfirmDialog title="Remove saved key?" onConfirm={vi.fn()} onClose={vi.fn()} />)

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAccessibleName('Remove saved key?')
    expect(dialog).not.toHaveAttribute('aria-describedby')
    expect(dialog.querySelectorAll('p')).toHaveLength(0)
  })
})
