import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const COLLAPSED_KEY = 'sidebar-category-collapsed-state'
const agents = [
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Writes briefs',
    category: 'Writing',
    icon: 'PenLine',
  },
  { id: 'beta', name: 'Beta', description: 'Reads papers', category: 'Research', icon: 'Search' },
]

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

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('Sidebar search and category state edges', () => {
  it('shows a flat search result and an explicit empty state for no matches', () => {
    renderSidebar()

    const search = screen.getByLabelText('Search agents')
    fireEvent.change(search, { target: { value: 'beta' } })

    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'gamma' } })
    expect(screen.getByText('no entries')).toBeInTheDocument()
  })

  it('persists a category expanded state when the user opens it', () => {
    renderSidebar()

    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    const category = screen.getByRole('button', { name: /Writing/ })
    expect(category).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(category)

    expect(category).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(COLLAPSED_KEY))).toMatchObject({ Writing: false })
  })
})
