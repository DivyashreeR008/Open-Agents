import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

beforeEach(() => {
  agentState.agents = []
  agentState.loading = true
  localStorage.clear()
})

describe('BattleModeSetup loading catalogue', () => {
  it('shows the loading message while agents are still being fetched', () => {
    render(
      <MemoryRouter initialEntries={['/battle/setup']}>
        <BattleModeSetup />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading agents...')).toBeInTheDocument()
  })
})
