import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

const agent = {
  id: 'optional-empty',
  name: 'Optional Agent',
  description: 'Has an empty optional field',
  category: 'Test',
  inputs: [
    {
      id: 'topic',
      label: 'Topic',
      type: 'text',
      required: true,
      defaultValue: 'Default topic',
    },
    { id: 'notes', label: 'Notes', type: 'text', required: false },
  ],
}

beforeEach(() => {
  agentState.agents = [agent]
  agentState.loading = false
  localStorage.clear()
})

describe('BattleModeSetup empty optional input', () => {
  it('does not block the battle when an optional field is left empty', () => {
    render(
      <MemoryRouter initialEntries={['/battle/setup']}>
        <Routes>
          <Route path="/battle/setup" element={<BattleModeSetup />} />
          <Route path="/battle/arena" element={<div>arena</div>} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Optional Agent/ }))
    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-optional' },
    })

    expect(screen.getByLabelText('Notes')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Start Battle' })).toBeEnabled()
  })
})
