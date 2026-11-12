import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

const state = vi.hoisted(() => ({
  favorites: [],
  keys: { openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' },
  collections: [],
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false, catalogSize: agents.length }),
}))

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({
    favorites: state.favorites,
    isFavorite: (id) => state.favorites.includes(id),
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

vi.mock('../lib/globalKeys', () => ({
  getGlobalKeys: () => state.keys,
}))

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))

import HomePage from './HomePage'

function LocationProbe() {
  const { search } = useLocation()
  return <output data-testid="location-search">{search}</output>
}

function renderPage(initialEntries = ['/agents']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  state.favorites = []
  state.keys = { openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' }
  state.collections = []
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  localStorage.clear()
})

describe('HomePage edge states', () => {
  it('dismisses the first-time notice and remembers the choice', () => {
    state.keys = { openai: '', anthropic: '', gemini: '', openrouter: '' }
    renderPage()

    expect(screen.getByText('First time here?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss banner' }))

    expect(screen.queryByText('First time here?')).not.toBeInTheDocument()
    expect(localStorage.getItem('OpenAgents_banner_dismissed')).toBe('true')
  })

  it('focuses the catalogue search when the slash shortcut is pressed', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/search agents/i)
    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: '/' })

    expect(searchInput).toHaveFocus()
  })

  it('keeps a collection scoped, then clears it from the empty state', () => {
    state.collections = [{ id: 'design-picks', name: 'Design picks', agentIds: ['beta'] }]
    renderPage(['/agents?collection=design-picks'])

    expect(screen.getByRole('heading', { level: 1, name: 'Design picks' })).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'Agent catalogue, index view' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    expect(screen.queryByText('Alpha Agent')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
      target: { value: 'no-such-agent' },
    })
    expect(
      screen.getByRole('heading', { level: 3, name: 'No agents match "no-such-agent"' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Nothing in/)).toHaveTextContent(
      'Nothing in Design picks matches "no-such-agent".'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show all agents' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('')
    expect(screen.getByRole('heading', { level: 1, name: 'Agents' })).toBeInTheDocument()
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('opens a prefilled GitHub issue from the agent request form', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderPage()

    const requestButton = screen.getByRole('button', { name: /Request agent/i })
    expect(requestButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Agent name'), {
      target: { value: 'Resume Matcher' },
    })
    fireEvent.change(screen.getByLabelText('What the agent should do'), {
      target: { value: 'Match a resume to a job description.' },
    })
    expect(requestButton).toBeEnabled()

    fireEvent.click(requestButton)

    expect(openSpy).toHaveBeenCalledTimes(1)
    const [url, target] = openSpy.mock.calls[0]
    expect(target).toBe('_blank')
    expect(url).toContain('https://github.com/DivyashreeR008/Open-Agents/issues/new?')
    expect(url).toContain('labels=agent-request')
    expect(decodeURIComponent(url)).toContain('[Agent Request]: Resume Matcher')
    expect(decodeURIComponent(url)).toContain('Match a resume to a job description.')
    expect(screen.getByRole('button', { name: /Opening GitHub/i })).toBeInTheDocument()
  })
})
