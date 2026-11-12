import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const moveAgentToCollection = vi.fn()

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [{ id: 'agent-1', name: 'Alpha', description: 'First', category: 'Writing' }],
  }),
}))
vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all-agents',
  useCollections: () => ({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: ['agent-1'] }],
    moveAgentToCollection,
  }),
}))

import Sidebar from './Sidebar'

beforeEach(() => {
  localStorage.clear()
  moveAgentToCollection.mockReset()
})

describe('Sidebar all-collections drop target', () => {
  it('does not try to move an agent onto the collections index link', () => {
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={() => {}} />
      </MemoryRouter>
    )

    fireEvent.drop(screen.getByRole('link', { name: /All collections/ }), {
      dataTransfer: { getData: () => 'agent-1' },
    })

    expect(moveAgentToCollection).not.toHaveBeenCalled()
  })
})
