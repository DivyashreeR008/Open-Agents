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
  id: 'enter-suite',
  name: 'Enter Suite',
  icon: 'Code2',
  color: '#000000',
  agents: ['agent-a'],
  quiz: {
    questions: [
      {
        question: 'First question?',
        options: [{ label: 'First option', tags: ['agent-a'] }],
      },
      {
        question: 'Second question?',
        options: [{ label: 'Second option', tags: ['agent-a'] }],
      },
    ],
  },
}

describe('SuiteWizard Enter without an answer', () => {
  it('does not advance when Enter is pressed before selecting an option', () => {
    render(
      <MemoryRouter>
        <SuiteWizard suite={suite} onBack={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('First question?')).toBeInTheDocument()
  })
})
