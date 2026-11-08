import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agents = [
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Writes briefs',
    category: 'Writing',
    icon: 'PenLine',
  },
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
    <MemoryRouter initialEntries={['/agent/alpha']}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('Sidebar active category collapse', () => {
  it('collapses and re-expands the category that owns the open agent', () => {
    renderSidebar()

    const category = screen.getByRole('button', { name: /Writing/ })
    expect(category).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha')).toBeInTheDocument()

    fireEvent.click(category)
    expect(category).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()

    fireEvent.click(category)
    expect(category).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})
