import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'
import { AgentsContext } from '../lib/useAgents'
import SuiteWizard from './SuiteWizard'
import { suites } from '../suites/suitesData'

const suite = suites.find((entry) => entry.id === 'developer')

const agents = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Review code changes',
    category: 'Engineering',
    provider: 'any',
  },
  {
    id: 'api-doc-generator',
    name: 'API Doc Generator',
    description: 'Generate API documentation',
    category: 'Engineering',
    provider: 'any',
  },
]

function AgentRoute() {
  const { agentId } = useParams()
  return <div>Agent route {agentId}</div>
}

function renderWizard(onBack = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/suites']}>
      <AgentsContext.Provider
        value={{
          agents,
          loading: false,
          error: null,
          reloadAgents: vi.fn(),
          catalogSize: agents.length,
        }}
      >
        <Routes>
          <Route path="/suites" element={<SuiteWizard suite={suite} onBack={onBack} />} />
          <Route path="/agent/:agentId" element={<AgentRoute />} />
        </Routes>
      </AgentsContext.Provider>
    </MemoryRouter>
  )
}

function answerDeveloperQuestions() {
  fireEvent.click(screen.getByText('Writing or reviewing code'))
  fireEvent.click(screen.getByRole('button', { name: /Next/i }))
  fireEvent.click(screen.getByText('Beginner'))
  fireEvent.click(screen.getByRole('button', { name: /Next/i }))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SuiteWizard recommendation navigation and keyboard guard', () => {
  it('opens the selected agent from a matched recommendation card', async () => {
    renderWizard()
    answerDeveloperQuestions()

    fireEvent.click(screen.getByText('Code Reviewer').closest('button'))

    expect(await screen.findByText('Agent route code-reviewer')).toBeInTheDocument()
  })

  it('opens an agent from the unmatched section of the suite', async () => {
    renderWizard()
    answerDeveloperQuestions()

    fireEvent.click(screen.getByText('API Doc Generator').closest('button'))

    expect(await screen.findByText('Agent route api-doc-generator')).toBeInTheDocument()
  })

  it('does not advance on Enter from another control but does from the selected option', () => {
    renderWizard()
    fireEvent.click(screen.getByText('Writing or reviewing code'))

    const skip = screen.getByRole('button', { name: /Skip this question/i })
    skip.focus()
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()

    const selected = screen.getByText('Writing or reviewing code').closest('button')
    selected.focus()
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })
})
