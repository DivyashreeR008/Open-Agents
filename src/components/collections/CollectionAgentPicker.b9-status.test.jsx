import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('../../lib/useCollections', () => ({ MAX_AGENTS_PER_COLLECTION: 5 }))

import CollectionAgentPicker from './CollectionAgentPicker'

const agents = [
  { id: 'writer', name: 'Writer', description: 'Drafts copy', category: 'Writing' },
  { id: 'designer', name: 'Designer', description: 'Draws icons', category: 'Design' },
]

function renderPicker(overrides = {}) {
  return render(
    <CollectionAgentPicker
      collection={{ id: 'c1', agentIds: [] }}
      agents={agents}
      onAddAgent={vi.fn()}
      onRemoveAgent={vi.fn()}
      {...overrides}
    />
  )
}

describe('CollectionAgentPicker announcements', () => {
  it('announces the number of matching agents after a search', () => {
    renderPicker()
    expect(screen.getByText('2 agents available.')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search agents' }), {
      target: { value: 'writer' },
    })

    expect(screen.getByText('1 of 2 agents match your search.')).toBeInTheDocument()
  })

  it('announces a mutation failure as an alert', () => {
    renderPicker({
      onAddAgent: () => ({ ok: false, error: 'Storage is blocked.' }),
    })

    fireEvent.click(screen.getByRole('checkbox', { name: /Writer/ }))

    expect(screen.getByRole('alert')).toHaveTextContent('Storage is blocked.')
  })

  it('announces the selected count and the full state', () => {
    const { rerender } = renderPicker({ maxAgents: 1 })
    expect(screen.getByText('0 / 1 agents')).toBeInTheDocument()

    rerender(
      <CollectionAgentPicker
        collection={{ id: 'c1', agentIds: ['writer'] }}
        agents={agents}
        onAddAgent={vi.fn()}
        onRemoveAgent={vi.fn()}
        maxAgents={1}
      />
    )

    expect(screen.getByText('1 / 1 agents')).toBeInTheDocument()
    expect(screen.getByText(/Collection limit reached/)).toBeInTheDocument()
  })
})
