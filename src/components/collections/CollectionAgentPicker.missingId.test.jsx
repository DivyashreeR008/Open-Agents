import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CollectionAgentPicker from './CollectionAgentPicker'

describe('CollectionAgentPicker malformed catalogue entries', () => {
  it('ignores a checkbox for an agent that has no id', () => {
    const onAddAgent = vi.fn()
    const onRemoveAgent = vi.fn()

    render(
      <CollectionAgentPicker
        collection={null}
        agents={[{ name: 'Untitled entry', description: 'Missing identifier' }]}
        onAddAgent={onAddAgent}
        onRemoveAgent={onRemoveAgent}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onAddAgent).not.toHaveBeenCalled()
    expect(onRemoveAgent).not.toHaveBeenCalled()
  })
})
