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
  getGlobalKeys: () => ({ openai: 'stored', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

import HomePage from './HomePage'

function RouteProbe() {
  const { pathname } = useLocation()
  return <output data-testid="route-path">{pathname}</output>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
      <RouteProbe />
    </MemoryRouter>
  )
}

describe('HomePage workflow and battle entry points', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('routes the hero battle action to the battle arena', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /battle/i }))

    expect(screen.getByTestId('route-path')).toHaveTextContent('/battle')
  })

  it('routes the workflow explore action to the workflow library', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /explore/i }))

    expect(screen.getByTestId('route-path')).toHaveTextContent('/workflows')
  })

  it('routes the workflow builder action to the build canvas', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /build a workflow/i }))

    expect(screen.getByTestId('route-path')).toHaveTextContent('/workflows/build')
  })
})
