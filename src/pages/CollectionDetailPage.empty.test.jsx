import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({ id: 'c1', name: 'Empty Collection', agentIds: [] }),
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(),
  }),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false, error: null }),
}))

vi.mock('../components/AgentCard', () => ({ default: () => null }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({
  default: () => <div>agent-picker</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

describe('CollectionDetailPage empty collection', () => {
  it('points an empty collection at the picker below', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'No agents in this collection yet' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Use the checklist below to add agents/)).toBeInTheDocument()
    expect(screen.getByText('agent-picker')).toBeInTheDocument()
    expect(screen.getAllByText('0 / 24')).toHaveLength(2)
  })
})
