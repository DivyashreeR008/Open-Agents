import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

const agent = {
  id: 'field-agent',
  name: 'Field Agent',
  description: 'Exercises select and multiselect controls',
  category: 'Engineering',
  inputs: [
    {
      id: 'format',
      label: 'Response format',
      type: 'select',
      required: true,
      defaultValue: 'brief',
      options: ['brief', 'detailed'],
    },
    {
      id: 'channels',
      label: 'Channels',
      type: 'multiselect',
      required: true,
      defaultValue: ['email'],
      options: ['email', 'chat', 'phone'],
    },
    { id: 'subject', label: 'Subject', type: 'text', required: false },
  ],
}

function ArenaProbe() {
  const location = useLocation()
  return <div data-testid="arena-state">{JSON.stringify(location.state)}</div>
}

function renderSetup() {
  return render(
    <MemoryRouter initialEntries={['/battle/setup']}>
      <Routes>
        <Route path="/battle/setup" element={<BattleModeSetup />} />
        <Route path="/battle/arena" element={<ArenaProbe />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  agentState.agents = [agent]
  agentState.loading = false
})

describe('BattleModeSetup choice inputs', () => {
  it('submits select and multiselect values alongside a default-prefilled field', () => {
    renderSetup()
    fireEvent.click(screen.getByRole('button', { name: /Field Agent/ }))

    expect(screen.getByLabelText('Response format')).toHaveValue('brief')
    fireEvent.change(screen.getByLabelText('Response format'), { target: { value: 'detailed' } })
    fireEvent.click(screen.getByRole('button', { name: 'chat' }))
    fireEvent.click(screen.getByRole('button', { name: 'email' }))
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Quarterly update' } })
    fireEvent.change(screen.getByLabelText('Gemini API Key'), { target: { value: 'AIza-test' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start Battle' }))

    const state = JSON.parse(screen.getByTestId('arena-state').textContent)
    expect(state.agent.id).toBe('field-agent')
    expect(state.inputs).toEqual({
      format: 'detailed',
      channels: ['chat'],
      subject: 'Quarterly update',
    })
    expect(state.apiKeys.gemini).toBe('AIza-test')
  })
})
