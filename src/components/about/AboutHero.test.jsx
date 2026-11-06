import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({
  agents: [],
  catalogSize: 0,
}))

vi.mock('../../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents, catalogSize: state.catalogSize }),
}))

import AboutHero from './AboutHero'

function renderHero() {
  return render(
    <MemoryRouter>
      <AboutHero />
    </MemoryRouter>
  )
}

describe('AboutHero', () => {
  beforeEach(() => {
    state.agents = []
    state.catalogSize = 0
  })

  it('uses the loaded agent count in the primary action and stat', () => {
    state.agents = [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }]
    state.catalogSize = 500
    renderHero()

    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to OpenAgents/ })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore 3 Agents' })).toBeInTheDocument()
    expect(screen.getByText('Ready-to-use Agents')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Explore 500 Agents' })).not.toBeInTheDocument()
  })

  it('falls back to the catalogue size when the list is empty', () => {
    state.catalogSize = 500
    renderHero()

    expect(screen.getByRole('link', { name: 'Explore 500 Agents' })).toBeInTheDocument()
  })

  it('keeps the catalogue and workflow actions inside the router', () => {
    state.catalogSize = 8
    renderHero()

    expect(screen.getByRole('link', { name: 'Explore 8 Agents' })).toHaveAttribute(
      'href',
      '/agents'
    )
    expect(screen.getByRole('link', { name: 'Browse Workflows' })).toHaveAttribute(
      'href',
      '/workflows'
    )
  })

  it('makes the repository link safe and explicitly labelled', () => {
    state.catalogSize = 8
    renderHero()

    const repository = screen.getByRole('link', {
      name: 'Star OpenAgents on GitHub (opens in new tab)',
    })
    expect(repository).toHaveAttribute('href', 'https://github.com/DivyashreeR008/Open-Agents')
    expect(repository).toHaveAttribute('target', '_blank')
    expect(repository).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the mission, badge, and three highlight stats', () => {
    state.catalogSize = 8
    renderHero()

    expect(screen.getByText(/Open Source/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getByText('AI Providers')).toBeInTheDocument()
    expect(screen.getByText('Browser Privacy')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
