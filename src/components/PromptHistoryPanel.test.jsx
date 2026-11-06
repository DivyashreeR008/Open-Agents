import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'

const state = vi.hoisted(() => ({
  prompts: [],
  favorites: [],
  deletePrompt: vi.fn(),
  clearHistory: vi.fn(),
  toggleFavorite: vi.fn(),
  searchPrompts: vi.fn(),
  setCopiedId: vi.fn(),
}))

vi.mock('../lib/usePromptHistory', () => ({
  usePromptHistory: () => ({
    prompts: state.prompts,
    favorites: state.favorites,
    deletePrompt: state.deletePrompt,
    clearHistory: state.clearHistory,
    toggleFavorite: state.toggleFavorite,
    searchPrompts: state.searchPrompts,
  }),
}))

vi.mock('../lib/useTimedState', () => ({
  useTimedState: () => [null, state.setCopiedId],
}))

const { default: PromptHistoryPanel } = await import('./PromptHistoryPanel')

const now = new Date('2026-01-01T12:00:00.000Z').getTime()

function makePrompt(overrides = {}) {
  return {
    id: 'prompt-1',
    text: 'Review the authentication flow.',
    favorite: false,
    agentName: 'Code Reviewer',
    createdAt: now - 30_000,
    ...overrides,
  }
}

function renderPanel(overrides = {}) {
  return render(
    <PromptHistoryPanel
      open
      onClose={vi.fn()}
      onUsePrompt={vi.fn()}
      {...overrides}
    />
  )
}

describe('PromptHistoryPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
    state.prompts = []
    state.favorites = []
    state.deletePrompt.mockReset()
    state.clearHistory.mockReset()
    state.toggleFavorite.mockReset()
    state.setCopiedId.mockReset()
    state.searchPrompts.mockReset()
    state.searchPrompts.mockImplementation((query) =>
      state.prompts.filter((prompt) =>
        prompt.text.toLowerCase().includes(query.toLowerCase())
      )
    )
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing while closed', () => {
    const { container } = render(
      <PromptHistoryPanel open={false} onClose={vi.fn()} onUsePrompt={vi.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when no prompts are saved', () => {
    renderPanel()

    expect(screen.getByRole('heading', { name: 'Prompt History' })).toBeInTheDocument()
    expect(
      screen.getByText('No saved prompts yet. Save a prompt from any agent to see it here.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Favorites')).not.toBeInTheDocument()
    expect(screen.queryByText('History')).not.toBeInTheDocument()
  })

  it('renders favorites and non-favorite history in separate groups', () => {
    const favorite = makePrompt({ id: 'favorite', text: 'Favorite prompt', favorite: true })
    const history = makePrompt({ id: 'history', text: 'History prompt' })
    state.prompts = [favorite, history]
    state.favorites = [favorite]

    renderPanel()

    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Favorite prompt')).toBeInTheDocument()
    expect(screen.getByText('History prompt')).toBeInTheDocument()
    expect(screen.getAllByText('Favorite prompt')).toHaveLength(1)
  })

  it('truncates long prompt text and formats the relative time', () => {
    const longText = 'x'.repeat(160)
    state.prompts = [
      makePrompt({ id: 'long', text: longText, createdAt: now - 5 * 60_000 }),
    ]

    renderPanel()

    expect(
      screen.getByText((content) => content.startsWith('x'.repeat(140)) && content.endsWith('\u2026'))
    ).toBeInTheDocument()
    expect(screen.getByText('5m ago')).toBeInTheDocument()
  })

  it('formats just-now, hour, and day timestamps', () => {
    state.prompts = [
      makePrompt({ id: 'now', createdAt: now - 30_000 }),
      makePrompt({ id: 'hours', text: 'Hours prompt', createdAt: now - 2 * 60 * 60_000 }),
      makePrompt({ id: 'days', text: 'Days prompt', createdAt: now - 3 * 24 * 60 * 60_000 }),
    ]

    renderPanel()

    expect(screen.getByText('just now')).toBeInTheDocument()
    expect(screen.getByText('2h ago')).toBeInTheDocument()
    expect(screen.getByText('3d ago')).toBeInTheDocument()
  })

  it('filters both groups and shows the no-match message', () => {
    const favorite = makePrompt({ id: 'favorite', text: 'Favorite prompt', favorite: true })
    const history = makePrompt({ id: 'history', text: 'History prompt' })
    state.prompts = [favorite, history]
    state.favorites = [favorite]

    renderPanel()

    const search = screen.getByRole('textbox', { name: 'Search prompts' })
    fireEvent.change(search, { target: { value: 'favorite' } })

    expect(state.searchPrompts).toHaveBeenCalledWith('favorite')
    expect(screen.getByText('Favorite prompt')).toBeInTheDocument()
    expect(screen.queryByText('History prompt')).not.toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'zzz' } })

    expect(screen.getByText('No prompts match "zzz".')).toBeInTheDocument()
  })

  it('uses a prompt and closes the panel', () => {
    const onUsePrompt = vi.fn()
    const onClose = vi.fn()
    state.prompts = [makePrompt()]
    renderPanel({ onUsePrompt, onClose })

    fireEvent.click(screen.getByTitle('Use this prompt'))

    expect(onUsePrompt).toHaveBeenCalledWith('Review the authentication flow.')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('copies a prompt to the clipboard', async () => {
    state.prompts = [makePrompt()]
    renderPanel()

    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy to clipboard'))
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Review the authentication flow.'
    )
    expect(state.setCopiedId).toHaveBeenCalledWith('prompt-1', 1500)
  })

  it('toggles a favorite and deletes an entry through their handlers', () => {
    const favorite = makePrompt({ id: 'favorite', text: 'Favorite prompt', favorite: true })
    const history = makePrompt({ id: 'history', text: 'History prompt' })
    state.prompts = [favorite, history]
    state.favorites = [favorite]
    renderPanel()

    fireEvent.click(screen.getByTitle('Remove from favorites'))
    expect(state.toggleFavorite).toHaveBeenCalledWith('favorite')

    fireEvent.click(screen.getAllByTitle('Delete')[1])
    expect(state.deletePrompt).toHaveBeenCalledWith('history')
  })

  it('requires confirmation before clearing history', () => {
    state.prompts = [makePrompt(), makePrompt({ id: 'prompt-2', text: 'Second prompt' })]
    renderPanel()

    fireEvent.click(screen.getByText('Clear all'))
    expect(screen.getByText('Clear 2 prompts?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))
    expect(state.clearHistory).not.toHaveBeenCalled()
    expect(screen.getByText('Clear all')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Clear all'))
    fireEvent.click(screen.getByText('Confirm'))

    expect(state.clearHistory).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Clear all')).toBeInTheDocument()
  })

  it('closes from the header button and the backdrop', () => {
    const onClose = vi.fn()
    const { container } = renderPanel({ onClose })

    const closeButton = container.querySelector('button')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)

    const backdrop = container.querySelector('.absolute.inset-0')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
