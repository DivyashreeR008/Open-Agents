import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const agents = [
  {
    id: 'no-provider',
    name: 'Default Provider Agent',
    description: 'No provider field',
    category: 'Engineering',
    icon: 'Bot',
    systemPrompt: 'Help.',
  },
  {
    id: 'mystery-provider',
    name: 'Mystery Agent',
    description: 'Unknown provider',
    category: 'Engineering',
    provider: 'mystery',
    icon: 'Bot',
    systemPrompt: 'Help.',
  },
  {
    id: 'openai-provider',
    name: 'OpenAI Agent',
    description: 'Known provider',
    category: 'Engineering',
    provider: 'openai',
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

describe('HomePage provider fallbacks', () => {
  it('groups a missing provider under Any Provider and keeps an unknown label', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /Any Provider/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mystery/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /OpenAI/ })).toBeInTheDocument()
  })

  it('filters the catalogue by an unknown provider value', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /mystery/ }))

    expect(screen.getByText('Mystery Agent')).toBeInTheDocument()
    expect(screen.queryByText('OpenAI Agent')).not.toBeInTheDocument()
    expect(screen.queryByText('Default Provider Agent')).not.toBeInTheDocument()
  })
})
