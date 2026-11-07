import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ agents: [], catalogSize: 0 }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents, catalogSize: state.catalogSize }),
}))

import PortfolioPage from './PortfolioPage'

describe('PortfolioPage count grammar', () => {
  beforeEach(() => {
    state.agents = []
    state.catalogSize = 0
  })

  it('uses singular wording when the catalogue has one agent', () => {
    state.agents = [{ id: 'only' }]
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Pick from 1 definition,/)).toBeInTheDocument()
    expect(screen.getByText('1 agent, 22 categories')).toBeInTheDocument()
  })

  it('keeps plural wording for a larger catalogue', () => {
    state.catalogSize = 12
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Pick from 12 definitions,/)).toBeInTheDocument()
    expect(screen.getByText('12 agents, 22 categories')).toBeInTheDocument()
  })
})
