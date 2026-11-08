import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BattleModeSetup from './BattleModeSetup'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

beforeEach(() => {
  localStorage.clear()
  agentState.loading = false
  agentState.agents = [
    {
      id: 'custom-input',
      name: 'Custom Input Agent',
      description: 'Exercises the unknown input fallback',
      category: 'Testing',
      inputs: [{ id: 'value', type: 'mystery', required: true }],
    },
  ]
})

describe('BattleModeSetup unknown input type limits', () => {
  it('applies the default limit and labels an input without a label', () => {
    render(
      <MemoryRouter>
        <BattleModeSetup />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Custom Input Agent/ }))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'a'.repeat(2000) } })
    expect(screen.queryByText(/exceeds maximum length/)).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'a'.repeat(2001) } })
    expect(
      screen.getByText('Input exceeds maximum length (2001/2000 characters)')
    ).toBeInTheDocument()
  })
})
