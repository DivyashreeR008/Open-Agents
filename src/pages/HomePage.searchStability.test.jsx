import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

const coreAgents = [
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

const manyAgents = [
  ...coreAgents,
  ...Array.from({ length: 63 }, (_, index) => ({
    id: `agent-${index + 3}`,
    name: `Agent ${index + 3}`,
    description: 'Neutral entry',
    category: 'Engineering',
    provider: 'openai',
    icon: 'Bot',
    systemPrompt: 'Be helpful.',
  })),
]

const catalogue = vi.hoisted(() => ({ agents: [] }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: catalogue.agents,
    loading: false,
    catalogSize: catalogue.agents.length,
  }),
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

import HomePage from './HomePage'

function LocationProbe() {
  const { pathname, search } = useLocation()
  return (
    <>
      <output data-testid="location-pathname">{pathname}</output>
      <output data-testid="location-search">{search}</output>
    </>
  )
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

function getAgentLink(name) {
  return screen.getByText(name).closest('a')
}

beforeEach(() => {
  catalogue.agents = coreAgents
  localStorage.clear()
  localStorage.setItem('OpenAgents_banner_dismissed', 'true')
})

describe('HomePage search stability', () => {
  it('keeps the catalogue in place until rapid typing pauses', async () => {
    renderPage()

    const search = screen.getByPlaceholderText(/search agents/i)
    fireEvent.change(search, { target: { value: 'zzzz' } })
    fireEvent.change(search, { target: { value: 'draws' } })

    expect(search).toHaveValue('draws')
    expect(screen.getByTestId('location-search')).toHaveTextContent('q=draws')
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('does not collapse an expanded list while a new query is being typed', async () => {
    catalogue.agents = manyAgents
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /load 5 more/i }))
    expect(screen.getByText('Showing 65 of 65')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'draws' },
    })

    expect(screen.getByText('Showing 65 of 65')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 1')).toBeInTheDocument()
    })
  })

  it('cancels a click when filtering moved a different card under the pointer', async () => {
    renderPage()

    fireEvent.pointerDown(getAgentLink('Alpha Agent'), {
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
    })

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'draws' },
    })

    await waitFor(() => {
      expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()
    })

    fireEvent.click(getAgentLink('Beta Agent'), { detail: 1, button: 0 })

    expect(screen.getByTestId('location-pathname')).toHaveTextContent('/agents')
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('allows a click when the pressed card is still the activation target', async () => {
    renderPage()

    const betaLink = getAgentLink('Beta Agent')
    fireEvent.pointerDown(betaLink, {
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
    })
    fireEvent.click(betaLink, { detail: 1, button: 0 })

    await waitFor(() => {
      expect(screen.getByTestId('location-pathname')).toHaveTextContent('/agent/beta')
    })
  })
})
