import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'

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

function renderPanel() {
  return render(<PromptHistoryPanel open onClose={vi.fn()} onUsePrompt={vi.fn()} />)
}

describe('PromptHistoryPanel edge entries', () => {
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
      state.prompts.filter((prompt) => prompt.text.toLowerCase().includes(query.toLowerCase()))
    )
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders an entry with empty text and no agent label', () => {
    const { container } = renderPanelWith(makePrompt({ id: 'blank', text: '', agentName: null }))

    const body = container.querySelector('p.whitespace-pre-wrap')
    expect(body).toHaveTextContent('')
    expect(screen.queryByText('Code Reviewer')).not.toBeInTheDocument()
    expect(screen.getByText('just now')).toBeInTheDocument()
  })

  it('keeps the panel usable and skips copy feedback when the clipboard rejects', async () => {
    state.prompts = [makePrompt()]
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('permission denied'))
    renderPanel()

    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy to clipboard'))
      await Promise.resolve()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Review the authentication flow.')
    expect(state.setCopiedId).not.toHaveBeenCalled()
    expect(screen.getByTitle('Use this prompt')).toBeInTheDocument()
  })

  it('shows only the favorites group when every saved prompt is a favorite', () => {
    const favorite = makePrompt({ id: 'only-favorite', text: 'Saved favorite', favorite: true })
    state.prompts = [favorite]
    state.favorites = [favorite]

    renderPanel()

    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Saved favorite')).toBeInTheDocument()
    expect(screen.queryByText('History')).not.toBeInTheDocument()
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    expect(
      screen.queryByText('No saved prompts yet. Save a prompt from any agent to see it here.')
    ).not.toBeInTheDocument()
  })
})

function renderPanelWith(prompt) {
  state.prompts = [prompt]
  return renderPanel()
}
