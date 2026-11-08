import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({
  agents: [],
  loading: false,
  catalogSize: 42,
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: state.agents,
    loading: state.loading,
    catalogSize: state.catalogSize,
  }),
}))
vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ favorites: [], isFavorite: () => false, toggleFavorite: vi.fn() }),
}))
vi.mock('../lib/useHistory', () => ({
  useHistory: () => ({ history: [], deleteRun: vi.fn(), clearHistory: vi.fn() }),
}))
vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all',
  useCollections: () => ({
    collections: [],
    getAgentCollectionId: () => 'all',
    moveAgentToCollection: () => ({ ok: true }),
  }),
}))
vi.mock('../lib/globalKeys', () => ({
  getGlobalKeys: () => ({ openai: 'key', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../components/AgentCardSkeleton', () => ({
  default: ({ variant }) => <div data-testid="skeleton" data-variant={variant} />,
}))

import HomePage from './HomePage'

beforeEach(() => {
  localStorage.clear()
  state.agents = []
  state.loading = false
  state.catalogSize = 42
})

describe('HomePage catalogue fallbacks', () => {
  it('uses the reported catalogue size while the agent list is empty', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const ledger = screen.getByText('Agents', { selector: 'dt' }).parentElement
    expect(ledger).toHaveTextContent('42')
  })

  it('falls back to zero when neither agents nor a catalogue size exist', () => {
    state.catalogSize = 0
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const ledger = screen.getByText('Agents', { selector: 'dt' }).parentElement
    expect(ledger).toHaveTextContent('0')
  })

  it('falls back to a generic collection heading for an unknown collection id', () => {
    render(
      <MemoryRouter initialEntries={['/agents?collection=missing']}>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Collection' })).toBeInTheDocument()
    expect(screen.getByText(/This collection is empty/)).toBeInTheDocument()
  })

  it('uses the grid skeleton variant while loading in grid view', () => {
    state.loading = true
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Grid view' }))
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(9)
    expect(skeletons.every((node) => node.dataset.variant === 'grid')).toBe(true)
  })
})
