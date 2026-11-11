import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const actions = vi.hoisted(() => ({ deleteCollection: vi.fn() }))

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({ id: 'c1', name: 'Release', agentIds: [] }),
    deleteCollection: actions.deleteCollection,
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

describe('CollectionDetailPage deletion', () => {
  it('deletes the collection and returns to the collection index', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/collections" element={<div>collection index</div>} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(actions.deleteCollection).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Delete collection' }))

    expect(actions.deleteCollection).toHaveBeenCalledWith('c1')
    expect(screen.getByText('collection index')).toBeInTheDocument()
  })
})
