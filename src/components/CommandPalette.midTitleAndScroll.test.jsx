import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  fetchWorkflows: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mocks.navigate }
})

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      {
        id: 'code-reviewer',
        name: 'The Code Reviewer',
        description: 'Reviews pull requests',
        category: 'Engineering',
      },
    ],
  }),
}))

vi.mock('../lib/useCollections', () => ({
  useCollections: () => ({ collections: [] }),
}))

vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
}))

import CommandPalette from './CommandPalette'

beforeEach(() => {
  mocks.navigate.mockReset()
  mocks.fetchWorkflows.mockResolvedValue({ data: [] })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CommandPalette title substring scoring and scrolling', () => {
  it('matches a query that appears in the middle of an agent title and selects it', async () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'reviewer' } })

    expect(screen.getByText('The Code Reviewer')).toBeInTheDocument()
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/agent/code-reviewer'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('scrolls the active option into view when the palette opens', async () => {
    const scrollSpy = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollSpy

    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() => expect(scrollSpy).toHaveBeenCalledWith({ block: 'nearest' }))
  })
})
