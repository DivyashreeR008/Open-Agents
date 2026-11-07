import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agents = [
  { id: 'zulu', name: 'Zulu', description: 'Last alphabetically', category: 'Writing' },
  { id: 'alpha', name: 'Alpha', description: 'First alphabetically', category: 'Writing' },
]

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all-agents',
  useCollections: () => ({
    collections: [{ id: 'all-agents', name: 'All Agents', agentIds: [] }],
    moveAgentToCollection: vi.fn(),
  }),
}))

import Sidebar from './Sidebar'

const COLLAPSED_KEY = 'sidebar-category-collapsed-state'

beforeEach(() => {
  localStorage.clear()
})

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('Sidebar state recovery and ordering', () => {
  it('survives corrupt collapsed-state storage and sorts agents by name', () => {
    localStorage.setItem(COLLAPSED_KEY, '{not-json')

    renderSidebar()

    fireEvent.click(screen.getByRole('button', { name: /Writing/ }))

    const alpha = screen.getByTitle('Alpha · Writing')
    const zulu = screen.getByTitle('Zulu · Writing')
    expect(alpha.compareDocumentPosition(zulu) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('clears a search query from the dedicated clear control', () => {
    renderSidebar()
    const search = screen.getByLabelText('Search agents')

    fireEvent.change(search, { target: { value: 'nothing matches' } })
    expect(screen.getByText('no entries')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(search).toHaveValue('')
    expect(screen.getByText('Writing')).toBeInTheDocument()
  })
})
