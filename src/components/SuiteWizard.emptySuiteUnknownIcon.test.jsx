import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))

import SuiteWizard from './SuiteWizard'

const suite = {
  id: 'empty-suite',
  name: 'Empty Suite',
  icon: 'NotARealIcon',
  color: '#000000',
  agents: [],
  quiz: {
    questions: [
      {
        question: 'What do you need?',
        options: [{ label: 'Nothing', tags: ['nothing'] }],
      },
    ],
  },
}

describe('SuiteWizard empty suite with an unknown icon', () => {
  it('renders the fallback icon and the no-agents result state', () => {
    render(
      <MemoryRouter>
        <SuiteWizard suite={suite} onBack={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Empty Suite')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /View all agents/i }))

    expect(screen.getByText('No agents found in this suite.')).toBeInTheDocument()
  })
})
