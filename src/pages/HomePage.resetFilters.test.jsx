import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

const state = vi.hoisted(() => ({
  collections: [],
  keys: { openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' },
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false, catalogSize: agents.length }),
}))
vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    isFavorite: () => false,
    toggleFavorite: vi.fn(),
  }),
}))
vi.mock('../lib/useHistory', () => ({
  useHistory: () => ({ history: [], deleteRun: vi.fn(), clearHistory: vi.fn() }),
}))
vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all',
  useCollections: () => ({
    collections: state.collections,
    getAgentCollectionId: () => 'all',
    moveAgentToCollection: () => ({ ok: true }),
  }),
}))
vi.mock('../lib/globalKeys', () => ({ getGlobalKeys: () => state.keys }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

import HomePage from './HomePage'

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid="location-search">{search}</output>
}

function renderPage(initialEntry = '/agents') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

describe('HomePage filter reset controls', () => {
  beforeEach(() => {
    localStorage.clear()
    state.collections = [{ id: 'design-picks', name: 'Design picks', agentIds: ['beta'] }]
    state.keys = { openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' }
  })

  it('clears search and rails while keeping the active collection', () => {
    renderPage('/agents?collection=design-picks&q=draws&category=Design&provider=anthropic')

    expect(screen.getByRole('heading', { level: 1, name: 'Design picks' })).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('collection=design-picks')
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('q=draws')
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('category=Design')
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('provider=anthropic')
    expect(screen.getByRole('heading', { level: 1, name: 'Design picks' })).toBeInTheDocument()
    expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reset' })).toBeNull()
  })

  it('leaves the collection scope from the results header', async () => {
    renderPage('/agents?collection=design-picks&q=draws')

    fireEvent.click(screen.getByRole('button', { name: 'Show all' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('')
    expect(screen.getByRole('heading', { level: 1, name: 'Agents' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    })
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })
})
