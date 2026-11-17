import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({ listings: [] }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [{ id: 'alpha', name: 'Alpha Agent' }],
    loading: false,
    error: null,
    reloadAgents: vi.fn(),
  }),
}))

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/marketplace', () => ({ loadListings: () => state.listings }))
vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div data-testid="runner">Runner for {agent.name}</div>,
}))
vi.mock('./NotFoundPage', () => ({ default: () => <div>Missing agent page</div> }))

import AgentPage from './AgentPage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agent/alpha']}>
      <Routes>
        <Route path="/agent/:id" element={<AgentPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  state.listings = []
})

describe('AgentPage provenance and untrusted-input guidance', () => {
  it('states that pasted material can steer the run', () => {
    renderPage()

    expect(screen.getByRole('note')).toHaveTextContent('Treat pasted emails')
    expect(screen.getByRole('note')).toHaveTextContent('as data, not instructions')
  })

  it('shows the marketplace listing that was built from this agent', () => {
    state.listings = [
      {
        id: 'listing-1',
        name: 'Alpha for support',
        author: 'Sam',
        config: { baseAgentId: 'alpha' },
      },
      {
        id: 'listing-2',
        name: 'Another agent',
        author: 'Alex',
        config: { baseAgentId: 'beta' },
      },
    ]
    renderPage()

    expect(screen.getByText('Marketplace listing by Sam: Alpha for support')).toBeInTheDocument()
    expect(screen.queryByText(/Another agent/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse the marketplace/ })).toHaveAttribute(
      'href',
      '/marketplace'
    )
  })

  it('omits the listing card when no listing points at this agent', () => {
    renderPage()

    expect(screen.queryByText(/Marketplace listing by/)).not.toBeInTheDocument()
    expect(screen.getByTestId('runner')).toHaveTextContent('Runner for Alpha Agent')
  })
})
