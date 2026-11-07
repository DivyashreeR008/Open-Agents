import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const actions = vi.hoisted(() => ({ removeAgentFromCollection: vi.fn() }))

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({ id: 'c1', name: 'Release', agentIds: ['a1'] }),
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: actions.removeAgentFromCollection,
  }),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [{ id: 'a1', name: 'Code Reviewer' }],
    loading: false,
    error: null,
  }),
}))

vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>card:{agent.name}</div>,
}))
vi.mock('../components/collections/CollectionAgentPicker', () => ({ default: () => null }))

import CollectionDetailPage from './CollectionDetailPage'

describe('CollectionDetailPage agent removal', () => {
  it('removes the selected agent from the collection', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove Code Reviewer from collection' }))

    expect(actions.removeAgentFromCollection).toHaveBeenCalledWith('c1', 'a1')
  })
})
