import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
  flash: vi.fn(),
  createCollection: vi.fn(),
  renameCollection: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCollections: mocks.useCollections,
  }
})
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/useFlashNotice', () => ({
  useFlashNotice: () => ({ notice: null, flash: mocks.flash }),
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
    createCollection: mocks.createCollection,
    deleteCollection: vi.fn(),
    renameCollection: mocks.renameCollection,
    importCollection: vi.fn(),
    duplicateCollection: vi.fn(),
  })
})

describe('CollectionsPage dialogs', () => {
  it('keeps the create dialog open and shows a rejected name', () => {
    mocks.createCollection.mockReturnValue({ ok: false, error: 'Name already exists' })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /new collection/i }))
    fireEvent.change(screen.getByLabelText(/collection name/i), { target: { value: 'Launch' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create' }))

    expect(mocks.createCollection).toHaveBeenCalledWith('Launch')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Name already exists')).toBeInTheDocument()
  })

  it('closes the create dialog after a successful create', () => {
    mocks.createCollection.mockReturnValue({ ok: true })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /new collection/i }))
    fireEvent.change(screen.getByLabelText(/collection name/i), { target: { value: 'New group' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prefills rename, submits the new name, and closes on success', () => {
    mocks.renameCollection.mockReturnValue({ ok: true })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Rename Launch' }))
    const input = screen.getByLabelText(/collection name/i)
    expect(input).toHaveValue('Launch')
    fireEvent.change(input, { target: { value: 'Launches' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Save' }))

    expect(mocks.renameCollection).toHaveBeenCalledWith('launch', 'Launches')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps a rejected rename open and cancel closes it without submitting', () => {
    mocks.renameCollection.mockReturnValue({ ok: false, error: 'Keep the original name' })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Rename Launch' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Keep the original name')).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mocks.renameCollection).toHaveBeenCalledOnce()
  })
})
