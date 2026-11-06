import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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

function renderWithoutId() {
  return render(
    <MemoryRouter initialEntries={['/agent']}>
      <Routes>
        <Route path="/agent" element={<AgentPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({
    agents: [agent],
    loading: false,
    error: null,
    reloadAgents: vi.fn(),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

describe('AgentPage edge behavior', () => {
  it('renders not found and records nothing when the route id is missing', () => {
    renderWithoutId()

    expect(screen.getByText('Missing agent page')).toBeInTheDocument()
    expect(screen.queryByTestId('runner')).not.toBeInTheDocument()
    expect(mocks.useDocumentTitle).toHaveBeenCalledWith('Agent')
    expect(localStorage.getItem('recentAgents')).toBeNull()
  })

  it('falls back to the generic error when the catalogue error has no message', () => {
    mocks.useAgents.mockReturnValue({
      agents: [],
      loading: false,
      error: new Error(''),
      reloadAgents: vi.fn(),
    })

    renderPage()

    expect(screen.getByText('Unable to load agents. Please try again.')).toBeInTheDocument()
  })

  it('records only string ids from mixed recent history', () => {
    localStorage.setItem(
      'recentAgents',
      JSON.stringify(['old', 42, null, { id: 'alpha' }, 'alpha', 'older'])
    )

    renderPage()

    expect(JSON.parse(localStorage.getItem('recentAgents'))).toEqual(['alpha', 'old', 'older'])
  })
})
