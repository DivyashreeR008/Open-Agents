import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CollectionAgentPicker from './CollectionAgentPicker'

function makeAgents(count = 3) {
  return Array.from({ length: count }, (_, index) => ({
    id: `agent-${index}`,
    name: `Agent ${index}`,
    description: index % 2 === 0 ? 'Engineering helper' : 'Marketing helper',
    category: index % 2 === 0 ? 'Engineering' : 'Marketing',
  }))
}

function renderPicker(overrides = {}) {
  const agents = overrides.agents ?? makeAgents()
  return render(
    <CollectionAgentPicker
      collection={{ agentIds: ['agent-0'] }}
      agents={agents}
      onAddAgent={vi.fn(() => true)}
      onRemoveAgent={vi.fn(() => ({ ok: true }))}
      {...overrides}
    />
  )
}

describe('CollectionAgentPicker', () => {
  it('renders the selected count, guidance, and checked state', () => {
    renderPicker({ maxAgents: 3 })

    expect(screen.getByRole('heading', { name: 'Manage agents' })).toBeInTheDocument()
    expect(screen.getByText('1 / 3 agents')).toBeInTheDocument()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
  })

  it('searches by name, description, and category', () => {
    renderPicker({ agents: makeAgents(6) })
    const search = screen.getByRole('searchbox', { name: 'Search agents' })

    fireEvent.change(search, { target: { value: 'marketing' } })
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByText('Agent 1')).toBeInTheDocument()
    expect(screen.queryByText('Agent 0')).not.toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'engineering helper' } })
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByText('Agent 0')).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'Agent 4' } })
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByText('Agent 4')).toBeInTheDocument()
  })

  it('shows different messages for an empty catalogue and an empty search', () => {
    const { rerender } = renderPicker({ agents: [] })
    expect(screen.getByText('No agents are available yet.')).toBeInTheDocument()

    rerender(
      <CollectionAgentPicker
        collection={{ agentIds: [] }}
        agents={makeAgents(2)}
        onAddAgent={vi.fn()}
        onRemoveAgent={vi.fn()}
      />
    )
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search agents' }), {
      target: { value: 'zzz' },
    })

    expect(screen.getByText('No agents match your search.')).toBeInTheDocument()
  })

  it('reveals another page of forty and resets the window after a search', () => {
    renderPicker({ agents: makeAgents(45), maxAgents: 45 })

    expect(screen.getAllByRole('checkbox')).toHaveLength(40)
    const showMore = screen.getByRole('button', { name: 'Show 5 more of 45' })
    fireEvent.click(showMore)
    expect(screen.getAllByRole('checkbox')).toHaveLength(45)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search agents' }), {
      target: { value: 'Marketing' },
    })
    expect(screen.getAllByRole('checkbox')).toHaveLength(22)
  })

  it('adds and removes agents through the supplied handlers', () => {
    const onAddAgent = vi.fn(() => true)
    const onRemoveAgent = vi.fn(() => ({ ok: true }))
    renderPicker({ onAddAgent, onRemoveAgent, agents: makeAgents(2) })

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    expect(onRemoveAgent).toHaveBeenCalledWith('agent-0')

    fireEvent.click(checkboxes[1])
    expect(onAddAgent).toHaveBeenCalledWith('agent-1')
  })

  it('renders mutation failures as feedback and clears them after a later success', () => {
    const onAddAgent = vi
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce({ ok: false, error: 'The collection is locked.' })
      .mockReturnValue({ ok: true })
    renderPicker({ onAddAgent, agents: makeAgents(3) })

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])
    expect(screen.getByText('Unable to add this agent to the collection.')).toBeInTheDocument()

    fireEvent.click(checkboxes[2])
    expect(screen.getByText('The collection is locked.')).toBeInTheDocument()

    fireEvent.click(checkboxes[1])
    expect(screen.queryByText('The collection is locked.')).not.toBeInTheDocument()
  })

  it('disables unchecked agents when the collection is full', () => {
    const agents = makeAgents(4)
    renderPicker({
      agents,
      maxAgents: 2,
      collection: { agentIds: ['agent-0', 'agent-1'] },
    })

    const checkboxes = screen.getAllByRole('checkbox')
    expect(screen.getByText('2 / 2 agents')).toBeInTheDocument()
    expect(checkboxes[0]).not.toBeDisabled()
    expect(checkboxes[1]).not.toBeDisabled()
    expect(checkboxes[2]).toBeDisabled()
    expect(checkboxes[3]).toBeDisabled()
    expect(
      screen.getByText(
        'Collection limit reached. Unchecked agents are disabled until you remove one of the selected agents.'
      )
    ).toBeInTheDocument()
  })
})
