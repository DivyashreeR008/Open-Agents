import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useAgents: vi.fn(),
  useDocumentTitle: vi.fn(),
  mounts: 0,
}))

vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: mocks.useDocumentTitle }))
vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => {
    mocks.mounts += 1
    return (
      <div>
        {agent.name} mount {mocks.mounts}
      </div>
    )
  },
}))
vi.mock('./NotFoundPage', () => ({ default: () => <div>Missing agent page</div> }))

import AgentPage from './AgentPage'

const agents = [
  { id: 'alpha', name: 'Alpha Agent' },
  { id: 'beta', name: 'Beta Agent' },
]

function Switcher() {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/agent/beta')}>Switch agent</button>
}

function renderPage(id = 'alpha') {
  return render(
    <MemoryRouter initialEntries={[`/agent/${id}`]}>
      <Switcher />
      <Routes>
        <Route path="/agent/:id" element={<AgentPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  mocks.mounts = 0
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents, loading: false, error: null, reloadAgents: vi.fn() })
})

describe('AgentPage title and remount', () => {
  it('uses the resolved agent name for the title', () => {
    renderPage()
    expect(mocks.useDocumentTitle).toHaveBeenCalledWith('Alpha Agent')
  })

  it('uses the generic fallback for an unknown or loading agent', () => {
    renderPage('missing')
    expect(mocks.useDocumentTitle).toHaveBeenCalledWith('Agent')
  })

  it('remounts the runner and updates the title when the id changes', () => {
    renderPage()
    expect(screen.getByText('Alpha Agent mount 1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Switch agent' }))

    expect(screen.getByText('Beta Agent mount 2')).toBeInTheDocument()
    expect(mocks.useDocumentTitle).toHaveBeenLastCalledWith('Beta Agent')
  })
})
