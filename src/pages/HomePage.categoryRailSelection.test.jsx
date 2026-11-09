import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
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

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents, loading: false }) }))
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
  getGlobalKeys: () => ({ openai: 'k', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

import HomePage from './HomePage'

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid="location-search">{search}</output>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('HomePage category rail selection', () => {
  it('filters the catalogue and updates the query string from the category rail', () => {
    renderPage()

    const categoryButton = screen
      .getAllByText('Engineering')
      .find((node) => node.closest('button'))
      .closest('button')
    fireEvent.click(categoryButton)

    expect(screen.getByTestId('location-search')).toHaveTextContent('category=Engineering')
    const list = screen.getByRole('list', { name: 'Agent catalogue, index view' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.queryByText('Beta Agent')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Agent catalogue status' })).toHaveTextContent(
      '1 agent matches the current filters.'
    )
  })
})
