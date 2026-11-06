/**
 * Smoke test for the restructured HomePage.
 *
 * The build only proves the JSX parses — it cannot catch a stale identifier
 * reference. This renders the page for real with the data layer stubbed so a
 * runtime regression fails loudly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

const agents = [
  {
    id: 'alpha',
    name: 'Alpha Agent',
    description: 'Writes things',
    category: 'Engineering',
    provider: 'openai',
    icon: 'Bot',
    systemPrompt: 'Be helpful.',
  },
  {
    id: 'beta',
    name: 'Beta Agent',
    description: 'Draws things',
    category: 'Design',
    provider: 'anthropic',
    icon: 'Palette',
    systemPrompt: 'Be colourful.',
  },
]

// Mutable so individual tests can control the favourites list.
const state = vi.hoisted(() => ({ favorites: [] }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false }),
}))

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({
    favorites: state.favorites,
    isFavorite: (id) => state.favorites.includes(id),
    toggleFavorite: vi.fn(),
  }),
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
  getGlobalKeys: () => ({ openai: 'k', anthropic: '', gemini: '', openrouter: '' }),
}))

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

import HomePage from './HomePage'

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid="location-search">{search}</output>
}

function renderPage(initialEntries = ['/agents']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
    state.favorites = []
  })

  it('renders the masthead, filter rails and agent results', () => {
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: /agents/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search agents/i)).toBeInTheDocument()

    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Provider')).toBeInTheDocument()

    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('defaults to the index view and can switch to the grid view', () => {
    renderPage()

    const indexButton = screen.getByRole('button', { name: /index view/i })
    const gridButton = screen.getByRole('button', { name: /grid view/i })

    // The catalogue (numbered index) is the default presentation.
    expect(indexButton).toHaveAttribute('aria-pressed', 'true')
    expect(gridButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(gridButton)

    expect(gridButton).toHaveAttribute('aria-pressed', 'true')
    expect(indexButton).toHaveAttribute('aria-pressed', 'false')

    // Both agents still render after switching to the tile variant.
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('filters agents by search query', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'draws' },
    })

    expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('hydrates the search filter from the URL', () => {
    renderPage(['/agents?q=draws'])

    expect(screen.getByPlaceholderText(/search agents/i)).toHaveValue('draws')
    expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('writes search changes back to the URL', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'draws' },
    })

    expect(screen.getByTestId('location-search')).toHaveTextContent('q=draws')
  })

  it('focuses search when opened from the global search button', () => {
    renderPage([{ pathname: '/agents', state: { focusSearch: true } }])

    expect(screen.getByPlaceholderText(/search agents/i)).toHaveFocus()
  })

  it('shows the empty state when nothing matches', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'zzzz-nothing' },
    })

    expect(screen.getByRole('heading', { name: /no agents match/i })).toBeInTheDocument()
  })

  it('surfaces favourites in the pinned strip', () => {
    state.favorites = ['alpha']
    renderPage()

    expect(screen.getByText('Pinned')).toBeInTheDocument()
    // Once in the pinned strip, once in the index.
    expect(screen.getAllByText('Alpha Agent')).toHaveLength(2)
  })
})

describe('HomePage result collection semantics', () => {
  it('exposes the index as a labelled list with one item per visible agent', () => {
    renderPage()

    const list = screen.getByRole('list', { name: 'Agent catalogue, index view' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('status', { name: 'Agent catalogue status' })).toHaveTextContent(
      '2 agents are in the catalogue.'
    )
  })

  it('switches the list label with the view and keeps item boundaries', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /grid view/i }))

    const list = screen.getByRole('list', { name: 'Agent catalogue, grid view' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('announces the filtered count when the collection shrinks', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'draws' },
    })

    expect(screen.getByRole('status', { name: 'Agent catalogue status' })).toHaveTextContent(
      '1 agent matches the current filters.'
    )
    expect(
      within(screen.getByRole('list', { name: 'Agent catalogue, index view' })).getAllByRole(
        'listitem'
      )
    ).toHaveLength(1)
  })

  it('announces an empty collection instead of leaving blank space', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'zzzz-nothing' },
    })

    expect(screen.getByRole('status', { name: 'Agent catalogue status' })).toHaveTextContent(
      'No agents match the current search and filters.'
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /no agents match/i })).toBeInTheDocument()
  })
})
