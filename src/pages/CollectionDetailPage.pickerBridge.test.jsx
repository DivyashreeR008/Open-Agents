import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  deleteCollection: vi.fn(),
  addAgentToCollection: vi.fn(),
  removeAgentFromCollection: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useCollections: mocks.useCollections }
})
vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      { id: 'a1', name: 'Alpha Agent' },
      { id: 'a2', name: 'Beta Agent' },
    ],
    loading: false,
    error: null,
  }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({
  default: ({ onAddAgent, onRemoveAgent }) => (
    <div>
      <button
        onClick={() => {
          const outcome = onAddAgent('a2')
          document.body.dataset.addOutcome = JSON.stringify(outcome)
        }}
      >
        Add Beta Agent fixture
      </button>
      <button
        onClick={() => {
          const outcome = onRemoveAgent('a1')
          document.body.dataset.removeOutcome = JSON.stringify(outcome)
        }}
      >
        Remove Alpha Agent fixture
      </button>
    </div>
  ),
}))
vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>{agent.name}</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

function renderPage() {
  mocks.useCollections.mockReturnValue({
    getCollectionById: () => ({ id: 'c1', name: 'Launch', agentIds: ['a1'] }),
    deleteCollection: mocks.deleteCollection,
    addAgentToCollection: mocks.addAgentToCollection,
    removeAgentFromCollection: mocks.removeAgentFromCollection,
  })
  return render(
    <MemoryRouter initialEntries={['/collections/c1']}>
      <Routes>
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  delete document.body.dataset.addOutcome
  delete document.body.dataset.removeOutcome
})

describe('CollectionDetailPage picker bridge', () => {
  it('returns the add mutation outcome from the collection store to the picker', () => {
    mocks.addAgentToCollection.mockReturnValue({ ok: false, error: 'Collection is full.' })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add Beta Agent fixture' }))

    expect(mocks.addAgentToCollection).toHaveBeenCalledWith('c1', 'a2')
    expect(JSON.parse(document.body.dataset.addOutcome)).toEqual({
      ok: false,
      error: 'Collection is full.',
    })
  })

  it('returns the remove mutation outcome from the collection store to the picker', () => {
    mocks.removeAgentFromCollection.mockReturnValue(false)
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent fixture' }))

    expect(mocks.removeAgentFromCollection).toHaveBeenCalledWith('c1', 'a1')
    expect(JSON.parse(document.body.dataset.removeOutcome)).toBe(false)
  })
})
