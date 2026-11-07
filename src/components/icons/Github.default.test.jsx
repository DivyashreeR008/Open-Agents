import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import Github from './Github'

describe('local Github icon', () => {
  it('renders a current-color mark at the default size', () => {
    const { container } = render(<Github />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('fill', 'none')
  })

  it('passes custom size, class, and decorative attributes through', () => {
    const { container } = render(
      <Github size={32} className="brand-mark" aria-hidden="true" data-testid="github-mark" />
    )
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('brand-mark')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('data-testid', 'github-mark')
  })
})
