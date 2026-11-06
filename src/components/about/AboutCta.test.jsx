import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AboutCta from './AboutCta'

function renderCta() {
  return render(
    <MemoryRouter>
      <AboutCta />
    </MemoryRouter>
  )
}

describe('AboutCta', () => {
  it('renders the labelled closing call to action', () => {
    renderCta()

    expect(
      screen.getByRole('region', { name: 'Ready to Shape the Future of Open AI Tools?' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Ready to Shape the Future of Open AI Tools?',
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Join 100+ Community Contributors')).toBeInTheDocument()
    expect(screen.getByText(/Whether you want to add a 5-minute agent/)).toBeInTheDocument()
  })

  it('makes both external links safe and understandable', () => {
    renderCta()

    const issues = screen.getByRole('link', { name: /Explore Open Issues/ })
    expect(issues).toHaveAttribute('href', 'https://github.com/DivyashreeR008/Open-Agents/issues')
    expect(issues).toHaveAttribute('target', '_blank')
    expect(issues).toHaveAttribute('rel', 'noopener noreferrer')
    expect(issues).toHaveTextContent('(opens in new tab)')

    const repository = screen.getByRole('link', { name: /Star on GitHub/ })
    expect(repository).toHaveAttribute('href', 'https://github.com/DivyashreeR008/Open-Agents')
    expect(repository).toHaveAttribute('target', '_blank')
    expect(repository).toHaveAttribute('rel', 'noopener noreferrer')
    expect(repository).toHaveTextContent('(opens in new tab)')
  })

  it('keeps the catalogue action inside the router', () => {
    renderCta()

    const catalogue = screen.getByRole('link', { name: 'Use AI Agents Now' })
    expect(catalogue).toHaveAttribute('href', '/agents')
    expect(catalogue).not.toHaveAttribute('target')
  })
})
