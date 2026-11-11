import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    systemPrompt: 'Help.',
  },
  {
    id: 'beta',
    name: 'Beta Agent',
    description: 'Draws things',
    category: 'Design',
    provider: 'anthropic',
    icon: 'Bot',
    systemPrompt: 'Help.',
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
  getGlobalKeys: () => ({ openai: 'key', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))

import HomePage from './HomePage'

beforeEach(() => {
  localStorage.clear()
})

describe('HomePage catalogue status grammar', () => {
  it('uses plural and singular forms for the catalogue and filtered counts', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const status = screen.getByRole('status', { name: 'Agent catalogue status' })
    expect(status).toHaveTextContent('2 agents are in the catalogue.')

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'Alpha' },
    })

    await waitFor(() => {
      expect(status).toHaveTextContent('1 agent matches the current filters.')
    })
  })
})
