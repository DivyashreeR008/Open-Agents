import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useCollections', () => ({
  useCollections: () => ({
    collections: [
      { id: 'empty', name: 'Empty Bundle' },
      { id: 'one', name: 'One Bundle', agentIds: ['agent-1'] },
    ],
  }),
}))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: vi.fn().mockResolvedValue({ data: [] }),
}))

import CommandPalette from './CommandPalette'

describe('CommandPalette collection counts', () => {
  it('uses singular and plural agent counts for collection results', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'bundle' } })

    expect(screen.getByText('0 agents in collection')).toBeInTheDocument()
    expect(screen.getByText('1 agent in collection')).toBeInTheDocument()
  })
})
