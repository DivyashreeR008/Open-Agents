import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = Array.from({ length: 24 }, (_, index) => ({
  id: `a${index + 1}`,
  name: `Agent ${index + 1}`,
}))

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({
      id: 'c1',
      name: 'Full Collection',
      agentIds: agents.map((agent) => agent.id),
    }),
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(),
  }),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false, error: null }),
}))

vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>card:{agent.name}</div>,
}))

vi.mock('../components/collections/CollectionAgentPicker', () => ({
  default: ({ maxAgents }) => <div>max-agents:{maxAgents}</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

describe('CollectionDetailPage capacity', () => {
  it('shows the same full count in the header and section heading', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getAllByText('24 / 24')).toHaveLength(2)
    expect(screen.getByText('max-agents:24')).toBeInTheDocument()
    expect(screen.getByText('runnable agents')).toBeInTheDocument()
  })
})
