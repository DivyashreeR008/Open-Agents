import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

vi.mock('./CollectionPicker', () => ({
  default: ({ agentId, onClose }) => (
    <div role="dialog" aria-label="Collection picker">
      <span>{agentId}</span>
      <button type="button" onClick={onClose}>
        Close picker
      </button>
    </div>
  ),
}))

import AgentCard from './AgentCard'

const agent = {
  id: 'edge-agent',
  name: 'Edge Agent',
  description: 'Fallback description',
  category: 'Engineering',
  provider: 'openai',
  icon: 'Bot',
}

function renderCard() {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} />
    </MemoryRouter>
  )
}

describe('AgentCard copy and picker edge behavior', () => {
  let clipboardDescriptor
  let execCommandDescriptor

  beforeEach(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
    else delete navigator.clipboard
    if (execCommandDescriptor) Object.defineProperty(document, 'execCommand', execCommandDescriptor)
    else delete document.execCommand
    vi.restoreAllMocks()
  })

  it('copies the description when no system prompt exists and resets the label', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    renderCard()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith('Fallback description')
    expect(screen.getByRole('button', { name: 'Prompt copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
  })

  it('stays idle when clipboard access rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Clipboard blocked'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    renderCard()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith('Fallback description')
    expect(screen.queryByRole('button', { name: 'Prompt copied' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
  })

  it('falls back to a temporary textarea when the clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    })
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })

    renderCard()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
    expect(screen.getByRole('button', { name: 'Prompt copied' })).toBeInTheDocument()
  })

  it('opens and closes the collection picker without following the card link', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Add to collection' }))

    expect(screen.getByRole('dialog', { name: 'Collection picker' })).toHaveTextContent(
      'edge-agent'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close picker' }))
    expect(screen.queryByRole('dialog', { name: 'Collection picker' })).not.toBeInTheDocument()
  })
})
