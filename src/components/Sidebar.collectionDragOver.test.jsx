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
      { id: 'custom-picks', name: 'Custom Picks', agentIds: ['agent-1'] },
    ],
    moveAgentToCollection,
  }),
}))

import Sidebar from './Sidebar'

beforeEach(() => {
  localStorage.clear()
  moveAgentToCollection.mockReset()
})

describe('Sidebar collection drag over', () => {
  it('prevents the browser default when an agent is dragged over a collection', () => {
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={() => {}} />
      </MemoryRouter>
    )

    const target = screen.getByRole('link', { name: /Custom Picks/ })
    const notPrevented = fireEvent.dragOver(target)

    expect(notPrevented).toBe(false)
  })
})
