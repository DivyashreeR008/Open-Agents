import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

import BattleModeSetup from './BattleModeSetup'

beforeEach(() => {
  agentState.agents = [
    {
      id: 'code-agent',
      name: 'Code Agent',
      description: 'Reviews large code',
      category: 'Engineering',
      inputs: [{ id: 'code', label: 'Source code', type: 'code', required: true }],
    },
  ]
  agentState.loading = false
})

describe('BattleModeSetup code input length', () => {
  it('shows a character count and rejects code beyond the code limit', () => {
    render(
      <MemoryRouter initialEntries={['/battle/setup']}>
        <BattleModeSetup />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Code Agent/ }))
    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-live-key' },
    })
    const code = screen.getByLabelText('Source code')

    fireEvent.change(code, { target: { value: 'a'.repeat(50000) } })
    expect(screen.getByText('50000/50000 characters')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Battle' })).toBeEnabled()

    fireEvent.change(code, { target: { value: 'a'.repeat(50001) } })
    expect(
      screen.getByText('Source code exceeds maximum length (50001/50000 characters)')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Complete required agent inputs' })).toBeDisabled()
  })
})
