import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  error: 'network failed',
}))

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 24,
  useCollections: () => ({
    getCollectionById: () => ({ id: 'c1', name: 'Release', agentIds: ['a1'] }),
    deleteCollection: vi.fn(),
    addAgentToCollection: vi.fn(),
    removeAgentFromCollection: vi.fn(),
  }),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false, error: state.error }),
}))

vi.mock('../components/AgentCard', () => ({ default: () => null }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({ default: () => null }))

import CollectionDetailPage from './CollectionDetailPage'

describe('CollectionDetailPage agent load failure', () => {
  it('shows an actionable error instead of an empty collection', () => {
    render(
      <MemoryRouter initialEntries={['/collections/c1']}>
        <Routes>
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Unable to load agents' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Refresh the page and try opening this collection again/)
    ).toBeInTheDocument()
  })
})
