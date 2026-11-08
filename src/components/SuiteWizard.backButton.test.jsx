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

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SuiteWizard back navigation', () => {
  it('returns to the suites view from the header', () => {
    const onBack = vi.fn()
    renderWizard(onBack)

    fireEvent.click(screen.getByRole('button', { name: 'Back to suites' }))

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('steps back to the previous question after advancing', () => {
    renderWizard()

    const previous = screen.getByRole('button', { name: 'Previous' })
    expect(previous).toBeDisabled()

    fireEvent.click(screen.getByText('Writing or reviewing code'))
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Writing or reviewing code')).toBeInTheDocument()
  })
})
