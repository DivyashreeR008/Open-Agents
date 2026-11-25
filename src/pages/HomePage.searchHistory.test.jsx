import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

function Location() {
  return <output aria-label="Current location">{useLocation().search}</output>
}
describe('catalogue recent searches', () => {
  it('only saves explicit submissions and replays the exact scopes and view after navigation', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/agents?category=Engineering&provider=openai']}>
        <HomePage />
      </MemoryRouter>
    )
    const input = screen.getByRole('textbox', { name: 'Search agents' })
    fireEvent.change(input, { target: { value: 'alpha' } })
    expect(localStorage.getItem('oa_search_history_v1')).toBeNull()
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(localStorage.getItem('oa_search_history_v1')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Grid view' }))
    fireEvent.keyDown(input, { key: 'Enter' })
    const saved = JSON.parse(localStorage.getItem('oa_search_history_v1'))
    expect(saved).toHaveLength(1)
    expect(saved[0].view).toBe('grid')
    unmount()
    render(
      <MemoryRouter initialEntries={['/agents?provider=anthropic']}>
        <HomePage />
        <Location />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Recent searches (1)'))
    fireEvent.click(screen.getByRole('button', { name: /alpha.*grid view/i }))
    expect(screen.getByRole('textbox', { name: 'Search agents' })).toHaveValue('alpha')
    expect(screen.getByRole('textbox', { name: 'Search agents' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await waitFor(() =>
      expect(screen.getByLabelText('Current location')).toHaveTextContent('provider=openai')
    )
    expect(screen.getByLabelText('Current location')).toHaveTextContent('category=Engineering')
    fireEvent.click(screen.getByRole('button', { name: /Remove search alpha/ }))
    expect(screen.getByText('Recent searches (0)')).toHaveFocus()
    expect(JSON.parse(localStorage.getItem('oa_search_history_v1'))).toEqual([])
  })
})
