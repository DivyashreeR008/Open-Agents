import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
  flash: vi.fn(),
  importCollection: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useCollections: mocks.useCollections }
})
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/useFlashNotice', () => ({
  useFlashNotice: () => ({ notice: null, flash: mocks.flash }),
}))
vi.mock('../components/collections/ImportCollectionModal', () => ({
  default: ({ onImport, onClose }) => (
    <div role="dialog">
      <button onClick={() => onImport({ format: 'fixture' })}>Submit import fixture</button>
      <button onClick={onClose}>Cancel import fixture</button>
    </div>
  ),
}))

import CollectionsPage from './CollectionsPage'

const launch = { id: 'launch', name: 'Launch', agentIds: [] }

function renderPage() {
  return render(
    <MemoryRouter>
      <CollectionsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents: [], loading: false, error: null })
  mocks.useCollections.mockReturnValue({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: [] }, launch],
    createCollection: vi.fn(),
    deleteCollection: vi.fn(),
    renameCollection: vi.fn(),
    importCollection: mocks.importCollection,
    duplicateCollection: vi.fn(),
  })
})

describe('CollectionsPage import handling', () => {
  it('closes the import dialog and flashes the imported collection name', () => {
    mocks.importCollection.mockReturnValue({
      ok: true,
      collection: { name: 'Research Pack' },
    })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit import fixture' }))

    expect(mocks.importCollection).toHaveBeenCalledWith({ format: 'fixture' })
    expect(mocks.flash).toHaveBeenCalledWith('Imported "Research Pack".')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the import dialog open on rejection and closes it on cancel', () => {
    mocks.importCollection.mockReturnValue({ ok: false, error: 'Invalid collection file.' })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit import fixture' }))

    expect(mocks.importCollection).toHaveBeenCalledWith({ format: 'fixture' })
    expect(mocks.flash).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel import fixture' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
