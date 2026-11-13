import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  collection: { id: 'c1', name: 'Launch', agentIds: [] },
  deleteCollection: vi.fn(),
}))

vi.mock('../lib/useCollections', () => ({
  MAX_AGENTS_PER_COLLECTION: 15,
  useCollections: () => ({
    getCollectionById: () => state.collection,
    deleteCollection: state.deleteCollection,
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

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/collections/${state.collection.id}`]}>
      <Routes>
        <Route path="/collections" element={<div>Collections index</div>} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function confirmDelete() {
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete collection' }))
}

beforeEach(() => {
  state.deleteCollection.mockReset()
  state.collection = { id: 'c1', name: 'Launch', agentIds: [] }
})

describe('CollectionDetailPage refused deletion', () => {
  it('keeps a protected collection in place and explains why it cannot be deleted', () => {
    state.collection = { id: 'all-agents', name: 'All Agents', agentIds: [], isDefault: true }
    state.deleteCollection.mockReturnValue({
      ok: false,
      error: 'The default collection cannot be deleted.',
    })
    renderPage()

    confirmDelete()

    expect(state.deleteCollection).toHaveBeenCalledWith('all-agents')
    expect(screen.getByRole('alert')).toHaveTextContent('The default collection cannot be deleted.')
    expect(screen.getByRole('heading', { name: 'All Agents' })).toBeInTheDocument()
    expect(screen.queryByText('Collections index')).not.toBeInTheDocument()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('distinguishes a missing target from a successful delete', () => {
    state.deleteCollection.mockReturnValue({ ok: false, error: 'Collection not found.' })
    renderPage()

    confirmDelete()

    expect(screen.getByRole('alert')).toHaveTextContent('Collection not found.')
    expect(screen.queryByText('Collections index')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('still navigates when deletion reports success', () => {
    state.deleteCollection.mockReturnValue({ ok: true })
    renderPage()

    confirmDelete()

    expect(screen.getByText('Collections index')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
