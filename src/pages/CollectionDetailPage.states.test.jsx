import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCollections: mocks.useCollections,
  }
})
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({
  default: () => <div data-testid="picker" />,
}))
vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div data-testid="agent-card">{agent.name}</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

const agent = { id: 'a1', name: 'Alpha Agent' }

function renderPage(id = 'c1') {
  return render(
    <MemoryRouter initialEntries={[`/collections/${id}`]}>
      <Routes>
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function setCollection(collection = null) {
  mocks.useCollections.mockReturnValue({
    getCollectionById: () => collection,
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(() => ({ ok: true })),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents: [agent], loading: false, error: null })
})

describe('CollectionDetailPage state branches', () => {
  it('renders the missing collection state and a route back', () => {
    setCollection(null)
    renderPage('missing')
    expect(screen.getByRole('heading', { name: 'Collection not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to collections' })).toHaveAttribute(
      'href',
      '/collections'
    )
  })

  it('renders the loading state while agents resolve', () => {
    setCollection({ id: 'c1', name: 'Launch', agentIds: [] })
    mocks.useAgents.mockReturnValue({ agents: [], loading: true, error: null })
    renderPage()
    expect(screen.getByRole('heading', { name: 'Loading agents' })).toBeInTheDocument()
    expect(screen.getByText(/Preparing the agent list/)).toBeInTheDocument()
  })

  it('renders the catalogue error state', () => {
    setCollection({ id: 'c1', name: 'Launch', agentIds: [] })
    mocks.useAgents.mockReturnValue({ agents: [], loading: false, error: new Error('offline') })
    renderPage()
    expect(screen.getByRole('heading', { name: 'Unable to load agents' })).toBeInTheDocument()
  })

  it('renders resolved agent cards for a valid collection', () => {
    setCollection({ id: 'c1', name: 'Launch', agentIds: ['a1'] })
    renderPage()
    expect(screen.getByTestId('agent-card')).toHaveTextContent('Alpha Agent')
    expect(screen.getByTestId('picker')).toBeInTheDocument()
  })

  it('renders the empty collection copy when every id is valid but absent', () => {
    setCollection({ id: 'c1', name: 'Launch', agentIds: [] })
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'No agents in this collection yet' })
    ).toBeInTheDocument()
  })
})
