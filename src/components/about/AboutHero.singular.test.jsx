import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ agents: [], catalogSize: 0 }))

vi.mock('../../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents, catalogSize: state.catalogSize }),
}))

import AboutHero from './AboutHero'

describe('AboutHero count grammar', () => {
  beforeEach(() => {
    state.agents = []
    state.catalogSize = 0
  })

  it('uses a singular call to action for one available agent', () => {
    state.agents = [{ id: 'only-agent' }]
    state.catalogSize = 500
    render(
      <MemoryRouter>
        <AboutHero />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Explore 1 Agent' })).toHaveAttribute('href', '/agents')
    expect(screen.queryByRole('link', { name: 'Explore 1 Agents' })).not.toBeInTheDocument()
  })

  it('keeps the plural form for multiple agents', () => {
    state.agents = [{ id: 'a1' }, { id: 'a2' }]
    render(
      <MemoryRouter>
        <AboutHero />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Explore 2 Agents' })).toBeInTheDocument()
  })
})
