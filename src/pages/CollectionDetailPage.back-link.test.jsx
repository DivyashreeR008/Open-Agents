import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({ id: 'c1', name: 'Back Link', agentIds: [] }),
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(),
  }),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false, error: null }),
}))

vi.mock('../components/AgentCard', () => ({ default: () => null }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({ default: () => null }))

import CollectionDetailPage from './CollectionDetailPage'

describe('CollectionDetailPage breadcrumb', () => {
  it('links back to the collection index', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Collections' })).toHaveAttribute(
      'href',
      '/collections'
    )
  })
})
