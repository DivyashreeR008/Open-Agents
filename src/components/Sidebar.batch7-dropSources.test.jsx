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
    collections: [
      { id: 'all-agents', name: 'All Agents', agentIds: ['agent-1'] },
      { id: 'custom-picks', name: 'Custom Picks', agentIds: [] },
    ],
    moveAgentToCollection,
  }),
}))

import Sidebar from './Sidebar'

beforeEach(() => {
  localStorage.clear()
  moveAgentToCollection.mockReset()
})

function dropOnCollection() {
  render(
    <MemoryRouter initialEntries={['/agents']}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )

  fireEvent.drop(screen.getByRole('link', { name: /Custom Picks/ }), {
    dataTransfer: { getData: () => 'agent-1' },
  })
}

describe('Sidebar drop feedback source lists', () => {
  it('names no source when the agent was not in another collection', () => {
    moveAgentToCollection.mockReturnValue({ ok: true, movedFrom: [] })
    dropOnCollection()

    expect(screen.getByText('Moved to Custom Picks.')).toBeInTheDocument()
  })

  it('joins two source collections with and', () => {
    moveAgentToCollection.mockReturnValue({
      ok: true,
      movedFrom: [{ name: 'Alpha Picks' }, { name: 'Beta Picks' }],
    })
    dropOnCollection()

    expect(
      screen.getByText('Moved to Custom Picks from Alpha Picks and Beta Picks.')
    ).toBeInTheDocument()
  })
})
