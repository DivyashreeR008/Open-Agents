import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState action row', () => {
  it('renders multiple actions in a dedicated wrapping cluster', () => {
    const { container } = render(
      <EmptyState
        title="No collections"
        description="Create one to get started."
        action={
          <>
            <button type="button">Create</button>
            <a href="/help">Learn more</a>
          </>
        }
      />
    )

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument()
    const row = container.querySelector('.mt-4')
    expect(row).not.toBeNull()
    expect(row).toHaveClass('flex-wrap')
  })
})
