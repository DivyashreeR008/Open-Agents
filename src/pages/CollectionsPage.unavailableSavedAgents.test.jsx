import { beforeEach, describe, expect, it, vi } from 'vitest'
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

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents: [], loading: false, error: null })
  mocks.useCollections.mockReturnValue({
    collections: [
      { id: 'all-agents', name: 'All Agents', agentIds: [] },
      { id: 'research', name: 'Research', agentIds: ['a1', 'a2'] },
    ],
    createCollection: vi.fn(),
    deleteCollection: vi.fn(),
    renameCollection: vi.fn(),
    importCollection: vi.fn(),
    duplicateCollection: vi.fn(),
  })
})

describe('CollectionsPage unavailable saved agents', () => {
  it('explains when a saved collection references agents that are not loaded', () => {
    render(
      <MemoryRouter>
        <CollectionsPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Saved agents are unavailable. Open the collection to review them.')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Empty collection. Add agents from the agent cards.')
    ).not.toBeInTheDocument()
  })
})
