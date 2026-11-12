import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      { id: 'agent-a', name: 'Agent A', description: 'A', category: 'Test', provider: 'any' },
    ],
  }),
}))

import SuiteWizard from './SuiteWizard'

const suite = {
  id: 'unknown-icon-results',
  name: 'Unknown Icon Results',
  icon: 'NotARealIcon',
  color: '#000000',
  agents: ['agent-a'],
  quiz: {
    questions: [
      {
        question: 'Pick one',
        options: [{ label: 'Agent A', tags: ['agent-a'] }],
      },
    ],
  },
}

describe('SuiteWizard unknown icon results', () => {
  it('uses the fallback icon while ranking matched agents', () => {
    render(
      <MemoryRouter>
        <SuiteWizard suite={suite} onBack={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Agent A'))
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    expect(screen.getByText('Best matches for you')).toBeInTheDocument()
    expect(screen.getByText('Agent A')).toBeInTheDocument()
    expect(screen.getByText('Recommended based on your answers')).toBeInTheDocument()
  })
})
