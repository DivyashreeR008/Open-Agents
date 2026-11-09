import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const workflows = vi.hoisted(() => ({ fetchWorkflows: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useCollections', () => ({ useCollections: () => ({ collections: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({ fetchWorkflows: workflows.fetchWorkflows }))

import CommandPalette from './CommandPalette'

describe('CommandPalette workflow description fallback', () => {
  it('uses the generic subtitle when a workflow has no description', async () => {
    workflows.fetchWorkflows.mockResolvedValue({
      data: [{ id: 'pipeline-1', title: 'Pipeline Flow' }],
    })
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )

    expect(await screen.findByText('Pipeline Flow')).toBeInTheDocument()
    expect(screen.getByText('Custom multi-agent workflow')).toBeInTheDocument()
  })
})
