import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import AgentCardSkeleton from './AgentCardSkeleton'

describe('AgentCardSkeleton variants', () => {
  it('renders a pulsing grid placeholder by default and for unknown variants', () => {
    const { container, rerender } = render(<AgentCardSkeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')

    rerender(<AgentCardSkeleton variant="unknown" />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('renders a static index row without button or link semantics', () => {
    const { container } = render(<AgentCardSkeleton variant="index" />)

    expect(container.firstChild).not.toHaveClass('animate-pulse')
    expect(container.querySelector('button, a')).toBeNull()
  })
})
