import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      { id: 'minimal-agent', name: 'Minimal Agent' },
      {
        id: 'code-reviewer',
        name: 'Code Reviewer Agent',
        description: 'Automated PR reviewer',
        category: 'Engineering',
      },
    ],
  }),
}))

vi.mock('../lib/useCollections', () => ({
  useCollections: () => ({
    collections: [
      { id: 'empty-bundle', name: 'Empty Bundle' },
      { id: 'trio-bundle', name: 'Trio Bundle', agentIds: ['a', 'b', 'c'] },
    ],
  }),
}))

vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: vi.fn(),
}))

import { fetchWorkflows } from '../hooks/useWorkflows'
import CommandPalette from './CommandPalette'

beforeEach(() => {
  vi.clearAllMocks()
  fetchWorkflows.mockReturnValue(new Promise(() => {}))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CommandPalette filtering edge cases', () => {
  it('matches category and keyword queries and ignores keys when nothing matches', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')

    fireEvent.change(input, { target: { value: 'engineering' } })
    expect(screen.getByText('Code Reviewer Agent')).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'credentials' } })
    expect(screen.getByText('Settings')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'nothing-matches-this-query' } })
    expect(screen.getByText(/No results found/i)).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('selects an option when the pointer enters it', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    )

    const options = screen.getAllByRole('option')
    fireEvent.mouseEnter(options[2])

    expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('keeps static destinations usable when workflow loading fails', async () => {
    fetchWorkflows.mockRejectedValueOnce(new Error('offline'))
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() => expect(fetchWorkflows).toHaveBeenCalledTimes(1))
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('Pipeline Flow')).not.toBeInTheDocument()
  })
})
