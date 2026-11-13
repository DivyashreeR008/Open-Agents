import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AgentsContext } from '../lib/useAgents'
import SuiteWizard from './SuiteWizard'

const agents = [{ id: 'agent-a', name: 'Agent A', description: 'First', category: 'Engineering' }]

function renderWizard(suite) {
  return render(
    <MemoryRouter>
      <AgentsContext.Provider
        value={{
          agents,
          loading: false,
          error: null,
          reloadAgents: vi.fn(),
          catalogSize: agents.length,
        }}
      >
        <SuiteWizard suite={suite} onBack={vi.fn()} />
      </AgentsContext.Provider>
    </MemoryRouter>
  )
}

const baseSuite = {
  id: 'edge-suite',
  name: 'Edge Suite',
  icon: 'Code2',
  color: '#111111',
  agents: ['agent-a'],
}

describe('SuiteWizard malformed and empty quiz data', () => {
  it('renders an empty-options state and can skip past it', () => {
    renderWizard({
      ...baseSuite,
      quiz: { questions: [{ id: 'q1', question: 'Pick one', options: [] }] },
    })

    expect(screen.getByText('Pick one')).toBeInTheDocument()
    expect(
      screen.getByText('No answer options are available for this question. Skip it to continue.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /Skip this question/ }))
    expect(screen.getByText('Agent A')).toBeInTheDocument()
  })

  it('renders a no-questions state and keeps the view-all path usable', () => {
    renderWizard({ ...baseSuite, quiz: { questions: [] } })

    expect(screen.getByText('This suite has no quiz questions.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'View all agents' }))
    expect(screen.getByText('Agent A')).toBeInTheDocument()
  })

  it('does not crash on missing option tags and never reports more than full progress', () => {
    renderWizard({
      ...baseSuite,
      quiz: {
        questions: [
          { id: 'q1', question: 'First', options: [{ label: 'No tags' }] },
          { id: 'q2', question: 'Second', options: [{ label: 'Still no tags' }] },
          null,
        ],
      },
    })

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')

    fireEvent.click(screen.getByText('No tags'))
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    fireEvent.click(screen.getByRole('button', { name: /Skip this question/ }))
    expect(screen.getByText('Agent A')).toBeInTheDocument()
  })

  it('renders a sane state when the quiz object is missing', () => {
    renderWizard({ ...baseSuite, quiz: null })
    expect(screen.getByText('This suite has no quiz questions.')).toBeInTheDocument()
  })
})
