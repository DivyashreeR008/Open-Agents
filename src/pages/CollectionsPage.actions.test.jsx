import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
  flash: vi.fn(),
  duplicateCollection: vi.fn(),
  deleteCollection: vi.fn(),
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

const launch = { id: 'launch', name: 'Launch', agentIds: ['a1'] }

function renderPage() {
  return render(
    <MemoryRouter>
      <CollectionsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({
    agents: [{ id: 'a1', name: 'Alpha' }],
    loading: false,
    error: null,
  })
  mocks.useCollections.mockReturnValue({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: [] }, launch],
    createCollection: vi.fn(),
    deleteCollection: mocks.deleteCollection,
    renameCollection: vi.fn(),
    importCollection: vi.fn(),
    duplicateCollection: mocks.duplicateCollection,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CollectionsPage actions', () => {
  it('exports a JSON file and revokes the object URL', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:collection')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Export Launch' }))

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:collection')
    expect(click).toHaveBeenCalledOnce()
    expect(mocks.flash).toHaveBeenCalledWith('Exported "Launch".')
  })

  it('reports duplicate success and failure through the flash notice', () => {
    mocks.duplicateCollection
      .mockReturnValueOnce({
        ok: true,
        collection: { name: 'Launch copy' },
      })
      .mockReturnValueOnce({ ok: false, error: 'Limit reached' })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate Launch' }))
    expect(mocks.flash).toHaveBeenLastCalledWith('Created "Launch copy".')

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate Launch' }))
    expect(mocks.flash).toHaveBeenLastCalledWith('Limit reached')
  })

  it('deletes the selected collection by id', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Launch' }))
    expect(mocks.deleteCollection).toHaveBeenCalledWith('launch')
  })
})
