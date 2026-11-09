import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

const agent = {
  id: 'select-no-default',
  name: 'Select Agent',
  description: 'Select without a default',
  category: 'Test',
  inputs: [
    {
      id: 'format',
      label: 'Response format',
      type: 'select',
      required: true,
      options: ['brief', 'detailed'],
    },
  ],
}

function ArenaProbe() {
  const location = useLocation()
  return <div data-testid="arena-state">{JSON.stringify(location.state)}</div>
}

beforeEach(() => {
  agentState.agents = [agent]
  agentState.loading = false
  localStorage.clear()
})

describe('BattleModeSetup select without a default', () => {
  it('starts with the first select option and accepts a chosen option', () => {
    render(
      <MemoryRouter initialEntries={['/battle/setup']}>
        <Routes>
          <Route path="/battle/setup" element={<BattleModeSetup />} />
          <Route path="/battle/arena" element={<ArenaProbe />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Select Agent/ }))

    const select = screen.getByLabelText('Response format')
    expect(select).toHaveValue('brief')

    fireEvent.change(select, { target: { value: 'detailed' } })
    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-select' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start Battle' }))

    const state = JSON.parse(screen.getByTestId('arena-state').textContent)
    expect(state.inputs.format).toBe('detailed')
  })
})
