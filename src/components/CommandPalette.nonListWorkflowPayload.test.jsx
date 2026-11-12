import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const workflows = vi.hoisted(() => ({ fetchWorkflows: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useCollections', () => ({ useCollections: () => ({ collections: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({ fetchWorkflows: workflows.fetchWorkflows }))

import CommandPalette from './CommandPalette'

describe('CommandPalette non-list workflow payload', () => {
  it('keeps static destinations when the workflow response has no list', async () => {
    workflows.fetchWorkflows.mockResolvedValue({ data: null })
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() => expect(workflows.fetchWorkflows).toHaveBeenCalledTimes(1))
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('Pipeline Flow')).not.toBeInTheDocument()
  })
})
