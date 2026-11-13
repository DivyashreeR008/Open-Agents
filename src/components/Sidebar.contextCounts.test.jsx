import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const agents = [
  { id: 'w1', name: 'Write One', description: '', category: 'Writing', provider: 'openai' },
  { id: 'w2', name: 'Write Two', description: '', category: 'Writing', provider: 'openai' },
  { id: 'w3', name: 'Write Three', description: '', category: 'Writing', provider: 'anthropic' },
  { id: 'c1', name: 'Code One', description: '', category: 'Coding', provider: 'openai' },
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

const originalMatchMedia = window.matchMedia

function setViewport(isDesktop) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: isDesktop,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

beforeEach(() => {
  localStorage.clear()
  setViewport(true)
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )
}

describe('Sidebar catalogue context', () => {
  it('derives the all-agents and category counts from the active URL filters', () => {
    renderAt('/agents?q=write&category=Writing&provider=anthropic')

    const allAgents = screen.getByRole('link', { name: /All agents/ })
    expect(allAgents).toHaveTextContent('1')

    fireEvent.click(screen.getByRole('button', { name: /Writing/ }))
    expect(screen.getByTitle('Write Three · Writing')).toBeInTheDocument()
    expect(screen.queryByTitle('Write One · Writing')).not.toBeInTheDocument()
    expect(screen.queryByText('Coding')).not.toBeInTheDocument()
  })

  it('removes the off-canvas mobile drawer from the tab order until opened', () => {
    setViewport(false)
    const { container, rerender } = render(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open={false} onClose={() => {}} />
      </MemoryRouter>
    )

    const aside = container.querySelector('aside')
    expect(aside).toHaveAttribute('inert')
    expect(aside).toHaveAttribute('aria-hidden', 'true')

    rerender(
      <MemoryRouter initialEntries={['/agents']}>
        <Sidebar open onClose={() => {}} />
      </MemoryRouter>
    )

    expect(aside).not.toHaveAttribute('inert')
    expect(aside).not.toHaveAttribute('aria-hidden')
  })

  it('announces collapsed category panels and removes their links', () => {
    renderAt('/agents')
    const toggle = screen.getByRole('button', { name: /Writing/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group', { name: /Writing/ })).not.toBeInTheDocument()

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: /Writing/ })).toBeInTheDocument()
    expect(screen.getByTitle('Write One · Writing')).toBeInTheDocument()

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group', { name: /Writing/ })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Write One · Writing')).not.toBeInTheDocument()
  })
})
