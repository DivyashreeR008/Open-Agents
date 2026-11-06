import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CollectionAgentPicker from './CollectionAgentPicker'

describe('CollectionAgentPicker null collection handling', () => {
  it('starts with zero selections and can add an agent when no collection is supplied', () => {
    const onAddAgent = vi.fn(() => true)
    render(
      <CollectionAgentPicker
        collection={null}
        agents={[{ id: 'a1', name: 'Alpha', description: 'First agent', category: 'Writing' }]}
        onAddAgent={onAddAgent}
        onRemoveAgent={vi.fn()}
      />
    )

    expect(screen.getByText('0 / 15 agents')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox'))

    expect(onAddAgent).toHaveBeenCalledWith('a1')
  })
})
