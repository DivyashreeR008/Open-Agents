import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agents = Array.from({ length: 16 }, (_, index) => ({
  id: `agent-${index + 1}`,
  name: `Agent ${String(index + 1).padStart(2, '0')}`,
  description: 'Searchable agent',
  category: 'Writing',
  icon: 'Bot',
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../lib/useCollections', async (importOriginal) => ({
  ...(await importOriginal()),
  useCollections: () => ({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: [] }],
    moveAgentToCollection: vi.fn(),
  }),
}))

import Sidebar from './Sidebar'

beforeEach(() => localStorage.clear())

describe('Sidebar search result cap', () => {
  it('links to the full catalogue when more than fifteen agents match', () => {
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={() => {}} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Search agents'), { target: { value: 'agent' } })

    expect(screen.getByText('View all 16 matches')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View all 16 matches/ })).toHaveAttribute(
      'href',
      '/agents?q=agent'
    )
  })
})
