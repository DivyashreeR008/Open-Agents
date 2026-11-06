import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import AgentCardSkeleton from './AgentCardSkeleton'

describe('AgentCardSkeleton', () => {
  it('renders the default grid structure with a pulse wrapper', () => {
    const { container } = render(<AgentCardSkeleton />)
    const root = container.firstChild

    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('animate-pulse')
    expect(root.querySelectorAll('div').length).toBeGreaterThan(4)
    expect(root.textContent).toBe('')
  })

  it('renders the index row structure for the index variant', () => {
    const { container } = render(<AgentCardSkeleton variant="index" />)
    const root = container.firstChild

    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('border-b')
    expect(root.className).not.toContain('animate-pulse')
    expect(root.textContent).toBe('')
  })

  it('uses the grid layout for an unknown variant', () => {
    const { container } = render(<AgentCardSkeleton variant="unknown" />)
    const root = container.firstChild

    expect(root.className).toContain('animate-pulse')
    expect(root.classList.contains('border-b')).toBe(false)
  })

  it('hides every skeleton variant from assistive technology', () => {
    const { container } = render(
      <div>
        <AgentCardSkeleton />
        <AgentCardSkeleton variant="index" />
      </div>
    )

    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons).toHaveLength(2)
  })
})
