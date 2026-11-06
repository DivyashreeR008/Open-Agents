import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const state = vi.hoisted(() => ({
  agents: [],
  catalogSize: 0,
}))

vi.mock('../../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents, catalogSize: state.catalogSize }),
}))

import AboutFeatures from './AboutFeatures'

describe('AboutFeatures', () => {
  beforeEach(() => {
    state.agents = []
    state.catalogSize = 0
  })

  it('uses the loaded agent count for the first feature', () => {
    state.agents = [{ id: 'a1' }, { id: 'a2' }]
    state.catalogSize = 500
    render(<AboutFeatures />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Key Platform Capabilities' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: '2 Specialized AI Agents' })
    ).toBeInTheDocument()
    expect(screen.queryByText('500 Specialized AI Agents')).not.toBeInTheDocument()
  })

  it('falls back to the catalogue size while the list is empty', () => {
    state.catalogSize = 500
    render(<AboutFeatures />)

    expect(
      screen.getByRole('heading', { level: 3, name: '500 Specialized AI Agents' })
    ).toBeInTheDocument()
  })

  it('renders the six capability cards in order', () => {
    state.catalogSize = 12
    render(<AboutFeatures />)
    const headings = screen.getAllByRole('heading', { level: 3 })

    expect(headings.map((heading) => heading.textContent)).toEqual([
      '12 Specialized AI Agents',
      'Multi-LLM Provider Support',
      'Battle Mode Arena',
      'AI Workflow Builder',
      '100% Client-Side Privacy (BYOK)',
      'Suites & Custom Collections',
    ])
    expect(screen.getByText(/Pit three AI models head-to-head/)).toBeInTheDocument()
    expect(screen.getByText(/Your API key never leaves your browser/)).toBeInTheDocument()
  })

  it('renders six hidden feature icons', () => {
    const { container } = render(<AboutFeatures />)
    const icons = [...container.querySelectorAll('svg')]

    expect(icons).toHaveLength(6)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
