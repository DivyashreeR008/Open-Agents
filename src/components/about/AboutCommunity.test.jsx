import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutCommunity from './AboutCommunity'

describe('AboutCommunity', () => {
  it('renders a labelled section with the contributor promise', () => {
    render(<AboutCommunity />)

    expect(
      screen.getByRole('region', { name: 'Community & Contributor Appreciation' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Community & Contributor Appreciation',
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Every contributor who submits an agent/)).toBeInTheDocument()
  })

  it('renders the three contributor cards in order', () => {
    render(<AboutCommunity />)
    const headings = screen.getAllByRole('heading', { level: 3 })

    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Contributor First',
      'Hall of Fame',
      'Open Collaboration',
    ])
    expect(screen.getByText(/Our contribution guide/)).toBeInTheDocument()
    expect(screen.getByText(/permanently celebrated/)).toBeInTheDocument()
    expect(screen.getByText(/Join GitHub Discussions/)).toBeInTheDocument()
  })

  it('renders four decorative icons and hides them from assistive technology', () => {
    const { container } = render(<AboutCommunity />)
    const icons = [...container.querySelectorAll('svg')]

    expect(icons).toHaveLength(4)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
