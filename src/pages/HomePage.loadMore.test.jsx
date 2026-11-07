import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const agents = Array.from({ length: 65 }, (_, index) => ({
  id: `agent-${index + 1}`,
  name: `Agent ${index + 1}`,
  description: `Description ${index + 1}`,
  category: 'Engineering',
  provider: 'openai',
  icon: 'Bot',
  systemPrompt: 'Be helpful.',
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
    collections: [],
    getAgentCollectionId: () => 'all',
    moveAgentToCollection: () => ({ ok: true }),
  }),
}))
vi.mock('../lib/globalKeys', () => ({
  getGlobalKeys: () => ({ openai: 'stored', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))
vi.mock('../components/AgentCard', () => ({
  default: ({ agent }) => <div>{agent.name}</div>,
}))

import HomePage from './HomePage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage catalogue pagination', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('OpenAgents_banner_dismissed', 'true')
  })

  it('reveals the final partial page without a second click', () => {
    renderPage()

    expect(screen.getByText('Showing 60 of 65')).toBeInTheDocument()
    expect(screen.getByText('Agent 60')).toBeInTheDocument()
    expect(screen.queryByText('Agent 61')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /load 5 more/i }))

    expect(screen.getByText('Showing 65 of 65')).toBeInTheDocument()
    expect(screen.getByText('Agent 65')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /load .* more/i })).toBeNull()
  })
})
