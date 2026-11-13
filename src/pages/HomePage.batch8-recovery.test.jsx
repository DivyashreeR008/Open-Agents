import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
]

const state = vi.hoisted(() => ({
  error: null,
  reloadAgents: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents,
    loading: false,
    error: state.error,
    reloadAgents: state.reloadAgents,
    catalogSize: agents.length,
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
  getGlobalKeys: () => ({ openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

import HomePage from './HomePage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  state.error = null
  state.reloadAgents.mockClear()
  localStorage.clear()
})

describe('HomePage catalogue recovery', () => {
  it.each([
    ['an object', { id: 'alpha' }],
    ['a string', 'alpha'],
    ['malformed JSON', '{not-json'],
  ])('ignores %s in recent agent storage', (_label, stored) => {
    localStorage.setItem(
      'recentAgents',
      typeof stored === 'string' ? stored : JSON.stringify(stored)
    )

    renderPage()

    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'All entries' })).toBeInTheDocument()
  })

  it('shows a retryable error instead of an empty catalogue', () => {
    state.error = new Error('registry unavailable')

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent('The agent catalogue could not be loaded')
    expect(screen.getByRole('status', { name: 'Agent catalogue status' })).toHaveTextContent(
      'Agent catalogue could not be loaded.'
    )
    expect(screen.queryByText('No agents match those filters')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry loading agents' }))

    expect(state.reloadAgents).toHaveBeenCalledTimes(1)
  })
})
