import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BattleModeSetup from './BattleModeSetup'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))
const options = Array.from({ length: 6 }, (_, index) => `${index}-${'x'.repeat(1000)}`)

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

beforeEach(() => {
  localStorage.clear()
  agentState.loading = false
  agentState.agents = [
    {
      id: 'multi-input',
      name: 'Multi Input Agent',
      description: 'Exercises multiselect limits',
      category: 'Testing',
      inputs: [
        { id: 'tags', label: 'Tags', type: 'multiselect', required: true, options },
        { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'notes' },
      ],
    },
  ]
})

describe('BattleModeSetup multiselect limits', () => {
  it('rejects a combined selection above the multiselect limit and uses four textarea rows', () => {
    render(
      <MemoryRouter>
        <BattleModeSetup />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Multi Input Agent/ }))

    options.forEach((option) => {
      fireEvent.click(screen.getByRole('button', { name: option }))
    })

    expect(screen.getByText(/Tags exceeds maximum length/)).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '4')
  })
})
