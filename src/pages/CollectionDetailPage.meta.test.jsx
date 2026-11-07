import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useCollections: vi.fn(), useAgents: vi.fn() }))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useCollections: mocks.useCollections }
})
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({ default: () => null }))
vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>{agent.name}</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

function makeAgent(index) {
  return { id: `a${index}`, name: `Agent ${index}` }
}

function renderWith(collection, agents) {
  mocks.useCollections.mockReturnValue({
    getCollectionById: () => collection,
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(() => ({ ok: true })),
  })
  mocks.useAgents.mockReturnValue({ agents, loading: false, error: null })
  return render(
    <MemoryRouter initialEntries={['/collections/c1']}>
      <Routes>
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('CollectionDetailPage metadata', () => {
  it('reports unavailable ids separately from runnable agents', () => {
    renderWith({ id: 'c1', name: 'Launch', agentIds: ['a1', 'gone'] }, [makeAgent(1)])
    expect(screen.getAllByText('1 / 15').length).toBeGreaterThan(0)
    expect(screen.getByText(/1 unavailable hidden/)).toBeInTheDocument()
  })

  it('uses the normal description when every stored id resolves', () => {
    renderWith({ id: 'c1', name: 'Launch', agentIds: ['a1'] }, [makeAgent(1)])
    expect(screen.getByText('runnable agents')).toBeInTheDocument()
    expect(screen.queryByText(/unavailable hidden/)).not.toBeInTheDocument()
  })

  it('keeps the capacity labels aligned at the limit', () => {
    const agents = Array.from({ length: 15 }, (_, index) => makeAgent(index + 1))
    renderWith({ id: 'c1', name: 'Full', agentIds: agents.map((item) => item.id) }, agents)
    expect(screen.getAllByText('15 / 15').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('runnable agents')).toBeInTheDocument()
  })
})
