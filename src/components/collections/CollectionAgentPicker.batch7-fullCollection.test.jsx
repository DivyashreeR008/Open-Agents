import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CollectionAgentPicker from './CollectionAgentPicker'

const agents = Array.from({ length: 16 }, (_, index) => ({
  id: 'a' + index,
  name: 'Agent ' + index,
  description: 'Description ' + index,
  category: 'Engineering',
}))

describe('CollectionAgentPicker at capacity', () => {
  it('reports the limit instead of adding a sixteenth agent', () => {
    const onAddAgent = vi.fn()
    render(
      <CollectionAgentPicker
        collection={{ id: 'c1', agentIds: agents.slice(0, 15).map((agent) => agent.id) }}
        agents={agents}
        onAddAgent={onAddAgent}
        onRemoveAgent={vi.fn()}
        maxAgents={15}
      />
    )

    fireEvent.click(screen.getByRole('checkbox', { name: /Agent 15/ }))

    expect(onAddAgent).not.toHaveBeenCalled()
    expect(
      screen.getByText('This collection is full. Remove an agent before adding another (15 max).')
    ).toBeInTheDocument()
  })
})
