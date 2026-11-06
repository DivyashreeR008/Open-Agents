import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useAgents: vi.fn(),
  useDocumentTitle: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: mocks.useDocumentTitle }))
vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div data-testid="runner">Runner for {agent.name}</div>,
}))
vi.mock('./NotFoundPage', () => ({
  default: () => <div>Missing agent page</div>,
}))

import AgentPage from './AgentPage'

const agent = { id: 'alpha', name: 'Alpha Agent' }

function renderPage(id = 'alpha') {
  return render(
    <MemoryRouter initialEntries={[`/agent/${id}`]}>
      <Routes>
        <Route path="/agent/:id" element={<AgentPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AgentPage state branches', () => {
  it('renders an accessible loading status while the catalogue resolves', () => {
    mocks.useAgents.mockReturnValue({ agents: [], loading: true, error: null, reloadAgents: vi.fn() })
    renderPage()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/Loading agent/)).toBeInTheDocument()
    expect(screen.queryByTestId('runner')).not.toBeInTheDocument()
  })

  it('renders the catalogue error and retries through the reload callback', () => {
    const reloadAgents = vi.fn()
    mocks.useAgents.mockReturnValue({
      agents: [],
      loading: false,
      error: new Error('Catalogue unavailable'),
      reloadAgents,
    })
    renderPage()

    expect(screen.getByText('Catalogue unavailable')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(reloadAgents).toHaveBeenCalledOnce()
  })

  it('renders the not-found page for an unknown id', () => {
    mocks.useAgents.mockReturnValue({ agents: [agent], loading: false, error: null, reloadAgents: vi.fn() })
    renderPage('missing')

    expect(screen.getByText('Missing agent page')).toBeInTheDocument()
    expect(screen.queryByTestId('runner')).not.toBeInTheDocument()
  })

  it('renders the runner once the id resolves', () => {
    mocks.useAgents.mockReturnValue({ agents: [agent], loading: false, error: null, reloadAgents: vi.fn() })
    renderPage()

    expect(screen.getByTestId('runner')).toHaveTextContent('Runner for Alpha Agent')
  })
})
