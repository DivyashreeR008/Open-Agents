import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [{ id: 'agent-1', name: 'Alpha', description: 'First', category: 'Writing' }],
  }),
}))

vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all-agents',
  useCollections: () => ({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: [] }],
    moveAgentToCollection: vi.fn(),
  }),
}))

import Sidebar from './Sidebar'

beforeEach(() => localStorage.clear())

describe('Sidebar close affordances', () => {
  it('closes the mobile rail from the feedback link', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={onClose} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('link', { name: /Feedback/ }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes the mobile rail from the backdrop', () => {
    const onClose = vi.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={onClose} />
      </MemoryRouter>
    )

    fireEvent.click(container.querySelector('.fixed.inset-0.z-30'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
