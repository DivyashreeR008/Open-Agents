import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutVision from './AboutVision'

describe('AboutVision', () => {
  it('renders the labelled vision section and intro', () => {
    render(<AboutVision />)

    expect(
      screen.getByRole('region', { name: 'Project Vision & Future Roadmap' })
    ).toBeInTheDocument()
    expect(screen.getByText(/We believe the future of AI tooling/)).toBeInTheDocument()
  })

  it('renders four roadmap phases in order', () => {
    render(<AboutVision />)
    const headings = screen.getAllByRole('heading', { level: 3 })

    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Config-Driven AI Agent Ecosystem',
      'Workflows & Battle Arena',
      'Community Marketplace & Custom Suites',
      'Local LLMs & Privacy Extensions',
    ])
    expect(screen.getByText('Phase 1 \u2022 Core Foundation')).toBeInTheDocument()
    expect(screen.getByText('Phase 4 \u2022 Open Protocol')).toBeInTheDocument()
  })

  it('renders each roadmap status and description', () => {
    render(<AboutVision />)

    expect(screen.getAllByText('Active')).toHaveLength(2)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Vision')).toBeInTheDocument()
    expect(
      screen.getByText(/Expand a growing library of specialized single-purpose agents/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Support local model runtimes/)).toBeInTheDocument()
  })

  it('renders five hidden section and phase icons', () => {
    const { container } = render(<AboutVision />)
    const icons = [...container.querySelectorAll('svg')]

    expect(icons).toHaveLength(5)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
