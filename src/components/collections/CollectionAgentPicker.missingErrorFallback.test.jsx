import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CollectionAgentPicker from './CollectionAgentPicker'

describe('CollectionAgentPicker missing mutation error', () => {
  it('uses a generic fallback when an add result has no message', () => {
    render(
      <CollectionAgentPicker
        collection={{ agentIds: [] }}
        agents={[{ id: 'a1', name: 'Alpha', description: 'First agent', category: 'Writing' }]}
        onAddAgent={() => ({ ok: false })}
        onRemoveAgent={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByText('Unable to add this agent to the collection.')).toBeInTheDocument()
  })
})
