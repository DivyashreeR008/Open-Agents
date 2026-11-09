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
  id: 'back-suite',
  name: 'Back Suite',
  icon: 'Code2',
  color: '#000000',
  agents: ['agent-a'],
  quiz: {
    questions: [
      {
        question: 'What do you need?',
        options: [{ label: 'Agent A', tags: ['agent-a'] }],
      },
    ],
  },
}

describe('SuiteWizard results back navigation', () => {
  it('returns to the suites view from the results header', () => {
    const onBack = vi.fn()
    render(
      <MemoryRouter>
        <SuiteWizard suite={suite} onBack={onBack} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /View all agents/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Back to suites' }))

    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
