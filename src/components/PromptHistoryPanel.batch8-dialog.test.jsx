import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const state = vi.hoisted(() => ({
  prompts: [],
  copied: null,
  setCopied: vi.fn(),
}))

vi.mock('../lib/usePromptHistory', () => ({
  usePromptHistory: () => ({
    prompts: state.prompts,
    favorites: [],
    deletePrompt: vi.fn(),
    clearHistory: vi.fn(),
    toggleFavorite: vi.fn(),
    searchPrompts: () => state.prompts,
  }),
}))

vi.mock('../lib/useTimedState', () => ({
  useTimedState: () => [state.copied, state.setCopied],
}))

const { default: PromptHistoryPanel } = await import('./PromptHistoryPanel')

const entry = {
  id: 'prompt-1',
  text: 'Review the authentication flow.',
  favorite: false,
  agentName: 'Code Reviewer',
  createdAt: Date.now() - 30_000,
}

function renderPanel(onClose = vi.fn()) {
  return render(<PromptHistoryPanel open onClose={onClose} onUsePrompt={vi.fn()} />)
}

beforeEach(() => {
  state.prompts = [entry]
  state.copied = null
  state.setCopied.mockReset()
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe('PromptHistoryPanel dialog and copy feedback', () => {
  it('exposes a labelled modal dialog with an accessible close button', () => {
    renderPanel()

    expect(screen.getByRole('dialog', { name: 'Prompt History' })).toHaveAttribute(
      'aria-modal',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Close prompt history' })).toBeInTheDocument()
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    renderPanel(onClose)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('confirms a successful copy and exposes the copied state', async () => {
    renderPanel()

    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt to clipboard' }))

    await waitFor(() => {
      expect(state.setCopied).toHaveBeenCalledWith('prompt-1', 1500)
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(entry.text)
  })

  it('shows a failed copy instead of swallowing the error', async () => {
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('denied'))
    renderPanel()

    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt to clipboard' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Copy failed. Select the prompt text to copy it manually.'
    )
  })
})
