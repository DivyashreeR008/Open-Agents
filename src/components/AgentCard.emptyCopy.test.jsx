import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

vi.mock('./CollectionPicker', () => ({
  default: () => null,
}))

import AgentCard from './AgentCard'

describe('AgentCard copy without any prompt text', () => {
  let clipboardDescriptor

  beforeEach(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  })

  afterEach(() => {
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
    else delete navigator.clipboard
    vi.restoreAllMocks()
  })

  it('stays idle when an agent has neither a system prompt nor a description', () => {
    const writeText = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    render(
      <MemoryRouter>
        <AgentCard agent={{ id: 'blank-agent', name: 'Blank Agent' }} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }))

    expect(writeText).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Prompt copied' })).not.toBeInTheDocument()
  })
})
