import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState optional content', () => {
  it('omits the icon and description containers when only a title is supplied', () => {
    const { container } = render(<EmptyState title="Nothing here" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Nothing here' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('p')).toBeNull()
  })

  it('does not add an empty action row when no action is supplied', () => {
    const { container } = render(
      <EmptyState title="No runs" description="Run an agent to see it here." className="mt-8" />
    )

    expect(container.firstChild).toHaveClass('mt-8')
    expect(container.querySelector('.mt-4')).toBeNull()
    expect(screen.getByText('Run an agent to see it here.')).toBeInTheDocument()
  })
})
