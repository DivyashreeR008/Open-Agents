import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useCollections: vi.fn(),
  useAgents: vi.fn(),
}))

vi.mock('../lib/useCollections', async (importOriginal) => ({
  ...(await importOriginal()),
  useCollections: mocks.useCollections,
}))
vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/useFlashNotice', () => ({
  useFlashNotice: () => ({ notice: null, flash: vi.fn() }),
}))

import CollectionsPage from './CollectionsPage'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useCollections.mockReturnValue({
    collections: [
      { id: 'all-agents', name: 'All Agents', agentIds: [] },
      { id: 'reads', name: 'Reads', agentIds: ['a1'] },
    ],
    createCollection: vi.fn(),
    deleteCollection: vi.fn(),
    renameCollection: vi.fn(),
    importCollection: vi.fn(),
    duplicateCollection: vi.fn(),
  })
})

describe('CollectionsPage agent-preview failure state', () => {
  it('keeps the collection card and explains that previews are unavailable', () => {
    mocks.useAgents.mockReturnValue({
      agents: [],
      loading: false,
      error: new Error('catalog offline'),
    })

    render(
      <MemoryRouter>
        <CollectionsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Reads')).toBeInTheDocument()
    expect(
      screen.getByText('Agent previews unavailable. Open the collection to manage saved agents.')
    ).toBeInTheDocument()
  })
})
