import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

import HomePage from './HomePage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('HomePage search clearing', () => {
  it('clears the search query and restores the full catalogue', async () => {
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <HomePage />
      </MemoryRouter>
    )

    const search = screen.getByPlaceholderText(/search agents/i)
    fireEvent.change(search, { target: { value: 'alpha' } })

    await waitFor(() => {
      expect(screen.queryByText('Beta Agent')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(search).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    })
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
  })
})
