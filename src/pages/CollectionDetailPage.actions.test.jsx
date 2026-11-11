import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  deleteCollection: vi.fn(),
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
    addAgentToCollection: vi.fn(),
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

beforeEach(() => vi.clearAllMocks())

describe('CollectionDetailPage actions', () => {
  it('confirms before deleting the collection and returns to the index', () => {
    mocks.removeAgentFromCollection.mockReturnValue({ ok: true })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(mocks.deleteCollection).not.toHaveBeenCalled()

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('Delete collection?')
    expect(dialog).toHaveTextContent('"Launch"')
    expect(dialog).toHaveTextContent('1 saved agent stays available in All Agents')

    fireEvent.click(screen.getByRole('button', { name: 'Delete collection' }))

    expect(mocks.deleteCollection).toHaveBeenCalledWith('c1')
    expect(screen.getByText('Collections index')).toBeInTheDocument()
  })

  it('stays on the collection when deletion is cancelled', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mocks.deleteCollection).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Collections index')).not.toBeInTheDocument()
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
  })
})
