import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
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
  useAgents: () => ({ agents: [{ id: 'a1', name: 'Alpha Agent' }], loading: false, error: null }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/collections/CollectionAgentPicker', () => ({ default: () => null }))
vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>{agent.name}</div>,
}))

import CollectionDetailPage from './CollectionDetailPage'

function renderPage(agentIds = ['a1']) {
  mocks.useCollections.mockReturnValue({
    getCollectionById: () => ({ id: 'c1', name: 'Launch', agentIds }),
    deleteCollection: mocks.deleteCollection,
    addAgentToCollection: mocks.addAgentToCollection,
    removeAgentFromCollection: mocks.removeAgentFromCollection,
  })
  return render(
    <MemoryRouter initialEntries={['/collections/c1']}>
      <Routes>
        <Route path="/collections" element={<div>Collections index</div>} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.addAgentToCollection.mockReturnValue({ ok: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CollectionDetailPage actions', () => {
  it('deletes the collection and returns to the index', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(mocks.deleteCollection).toHaveBeenCalledWith('c1')
    expect(screen.getByText('Collections index')).toBeInTheDocument()
  })

  it('removes an agent with both collection and agent ids', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent from collection' }))
    expect(mocks.removeAgentFromCollection).toHaveBeenCalledWith('c1', 'a1')
  })

  it('leaves the card in place when the remove callback rejects', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: false, error: 'Limit' })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent from collection' }))
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Limit')
    expect(screen.queryByRole('button', { name: /Undo removal/ })).not.toBeInTheDocument()
  })

  it('reports a successful removal and restores the agent through undo', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent from collection' }))

    expect(screen.getByRole('status')).toHaveTextContent('Removed Alpha Agent from Launch.')

    fireEvent.click(screen.getByRole('button', { name: 'Undo removal of Alpha Agent' }))

    expect(mocks.addAgentToCollection).toHaveBeenCalledWith('c1', 'a1')
    expect(screen.getByRole('status')).toHaveTextContent('Restored Alpha Agent to Launch.')
    expect(screen.queryByRole('button', { name: /Undo removal/ })).not.toBeInTheDocument()
  })

  it('keeps the undo action available until the recovery window closes', () => {
    vi.useFakeTimers()
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent from collection' }))
    expect(screen.getByRole('button', { name: 'Undo removal of Alpha Agent' })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(10000))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Undo removal/ })).not.toBeInTheDocument()
  })

  it('reports a failed undo instead of claiming the agent was restored', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    mocks.addAgentToCollection.mockReturnValue({
      ok: false,
      error: 'This agent is already in that collection.',
    })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha Agent from collection' }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo removal of Alpha Agent' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'This agent is already in that collection.'
    )
    expect(screen.queryByRole('button', { name: /Undo removal/ })).not.toBeInTheDocument()
  })
})
