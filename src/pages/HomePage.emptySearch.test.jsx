import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false, catalogSize: agents.length }),
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
  getGlobalKeys: () => ({ openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' }),
}))

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

vi.mock('../components/recommendation/RecommendationWizardEntry', async () => {
  const { forwardRef } = await import('react')
  return {
    default: forwardRef(function MockEntry({ onOpen, disabled }, ref) {
      return (
        <button ref={ref} type="button" onClick={onOpen} disabled={disabled}>
          Find my agent
        </button>
      )
    }),
  }
})

vi.mock('../components/recommendation/RecommendationWizardModal', () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div role="dialog" aria-label="Recommendation wizard">
        <button type="button" onClick={onClose}>
          Close recommendation
        </button>
      </div>
    ) : null,
}))

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

describe('HomePage empty search recovery', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('echoes the query and explains which filters are narrowing the view', () => {
    renderPage('/agents?q=quantum&category=Design&provider=anthropic')

    expect(
      screen.getByRole('heading', { level: 3, name: 'No agents match "quantum"' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Nothing in/)).toHaveTextContent(
      'Nothing in the catalogue matches "quantum". The view is also limited by category Design and provider Anthropic.'
    )
    expect(screen.getByText(/collection or several filters narrow the view/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear search query from results' }))

    expect(screen.getByTestId('location-search')).not.toHaveTextContent('q=quantum')
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
  })

  it('clears every active filter from the empty state', () => {
    renderPage('/agents?q=quantum&category=Design&provider=anthropic')

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('')
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('offers categories as a route back into the catalogue', () => {
    renderPage('/agents?q=quantum')

    expect(screen.getByText(/Check the spelling first/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Browse Engineering (1 agent)' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('category=Engineering')
    expect(screen.getByTestId('location-search')).not.toHaveTextContent('q=quantum')
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.queryByText('Beta Agent')).not.toBeInTheDocument()
  })

  it('opens the guided recommendation flow from the empty state', () => {
    renderPage('/agents?q=quantum')

    expect(screen.queryByRole('dialog', { name: 'Recommendation wizard' })).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: 'Open recommendation wizard for this search' })
    )

    expect(screen.getByRole('dialog', { name: 'Recommendation wizard' })).toBeInTheDocument()
  })
})
