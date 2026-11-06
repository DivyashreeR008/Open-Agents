import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
  useDocumentTitle: vi.fn(),
  flash: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCollections: mocks.useCollections,
  }
})
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: mocks.useDocumentTitle }))
vi.mock('../lib/useFlashNotice', () => ({
  useFlashNotice: () => ({ notice: null, flash: mocks.flash }),
}))

import CollectionsPage from './CollectionsPage'

const collection = (id, name = id) => ({ id, name, agentIds: [] })

function renderPage() {
  return render(
    <MemoryRouter>
      <CollectionsPage />
    </MemoryRouter>
  )
}

function collectionsFixture(custom) {
  mocks.useCollections.mockReturnValue({
    collections: [collection('all-agents', 'All Agents'), ...custom],
    createCollection: vi.fn(),
    deleteCollection: vi.fn(),
    renameCollection: vi.fn(),
    importCollection: vi.fn(),
    duplicateCollection: vi.fn(),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents: [], loading: false, error: null })
  collectionsFixture([])
})

describe('CollectionsPage empty and capacity states', () => {
  it('renders the empty state and a single create action', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'No collections yet' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /create collection/i })).toHaveLength(1)
  })

  it('renders one card per custom collection', () => {
    collectionsFixture([collection('launch', 'Launch'), collection('research', 'Research')])
    renderPage()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Launch' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Research' })).toBeInTheDocument()
  })

  it('disables create and import at the collection limit', () => {
    collectionsFixture(Array.from({ length: 10 }, (_, index) => collection(`c${index}`, `Collection ${index}`)))
    renderPage()
    expect(screen.getByRole('button', { name: /new collection/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /^import$/i })).toBeDisabled()
  })

  it('shows the loading preview copy while agents resolve', () => {
    collectionsFixture([collection('launch', 'Launch')])
    mocks.useAgents.mockReturnValue({ agents: [], loading: true, error: null })
    renderPage()
    expect(screen.getByText('Loading agent previews\u2026')).toBeInTheDocument()
  })
})
