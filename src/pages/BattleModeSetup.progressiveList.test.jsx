import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

const agents = Array.from({ length: 30 }, (_, index) => ({
  id: `agent-${index + 1}`,
  name: `Agent ${index + 1}`,
  description: `Description ${index + 1}`,
  category: index % 2 === 0 ? 'Engineering' : 'Marketing',
  inputs: [],
}))

beforeEach(() => {
  agentState.agents = agents
  agentState.loading = false
})

describe('BattleModeSetup progressive catalogue', () => {
  it('shows the first page, expands it, and lets step one return to the landing page', () => {
    render(
      <MemoryRouter initialEntries={['/battle/setup']}>
        <Routes>
          <Route path="/battle/setup" element={<BattleModeSetup />} />
          <Route path="/battle" element={<div>battle landing</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /Agent 24/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agent 25/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show 6 more of 30' }))
    expect(screen.getByRole('button', { name: /Agent 30/ })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search agents'), { target: { value: 'Agent 2' } })
    expect(screen.getByRole('button', { name: /Agent 24/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agent 30/ })).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search agents'), { target: { value: '' } })
    expect(screen.queryByRole('button', { name: /Agent 25/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back to Battle Mode' }))
    expect(screen.getByText('battle landing')).toBeInTheDocument()
  })
})
