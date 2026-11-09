import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
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

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  vi.spyOn(window, 'open').mockImplementation(() => null)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('HomePage agent request reset', () => {
  it('restores the request button after the GitHub handoff message times out', () => {
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <HomePage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Agent name'), {
      target: { value: 'Resume Matcher' },
    })
    fireEvent.change(screen.getByLabelText('What the agent should do'), {
      target: { value: 'Match a resume to a job description.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Request agent/i }))

    expect(screen.getByRole('button', { name: /Opening GitHub/i })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByRole('button', { name: /Request agent/i })).toBeInTheDocument()
  })
})
