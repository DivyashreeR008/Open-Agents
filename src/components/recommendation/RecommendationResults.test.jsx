import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResults from './RecommendationResults'

const agents = [
  {
    id: 'agent-a',
    name: 'Alpha Agent',
    icon: 'Code',
    category: 'Engineering',
    provider: 'openai',
    description: 'First agent.',
  },
  {
    id: 'agent-b',
    name: 'Beta Agent',
    icon: 'Search',
    category: 'Research',
    provider: 'anthropic',
    description: 'Second agent.',
  },
]

const results = [
  { agentId: 'agent-a', matchPercentage: 80, isConfident: true, reasons: ['A'] },
  { agentId: 'missing-agent', matchPercentage: 70, isConfident: true, reasons: ['B'] },
  { agentId: 'agent-b', matchPercentage: 60, isConfident: false, reasons: ['C'] },
]

function renderResults(overrides = {}) {
  return render(
    <MemoryRouter>
      <RecommendationResults
        agents={agents}
        results={results}
        onRefine={vi.fn()}
        onStartOver={vi.fn()}
        onClose={vi.fn()}
        {...overrides}
      />
    </MemoryRouter>
  )
}

describe('RecommendationResults', () => {
  it('renders the empty panel with both recovery actions', () => {
    const onRefine = vi.fn()
    const onClose = vi.fn()
    renderResults({ results: [{ agentId: 'missing-agent' }], onRefine, onClose })

    expect(screen.getByText('No agents available yet')).toBeInTheDocument()
    expect(
      screen.getByText('The agent list is empty. Try again after agents have loaded.')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Adjust answers' }))
    fireEvent.click(screen.getByRole('button', { name: 'Browse all agents' }))

    expect(onRefine).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Recommended agents for you')).not.toBeInTheDocument()
  })

  it('filters stale ids and numbers the resolved agents in order', () => {
    renderResults()

    const ranks = screen.getAllByLabelText(/^Rank /)
    expect(ranks.map((rank) => rank.textContent)).toEqual(['1', '2'])
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    expect(screen.queryByText('missing-agent')).not.toBeInTheDocument()
  })

  it('suppresses the closest-match note when one result is confident', () => {
    renderResults({ results: [results[0], results[2]] })

    expect(screen.queryByText(/closest agents/)).not.toBeInTheDocument()
  })

  it('shows the closest-match note when no result is confident', () => {
    renderResults({
      results: [
        { ...results[0], isConfident: false },
        { ...results[2], isConfident: false },
      ],
    })

    expect(
      screen.getByText(
        "We couldn't find a perfect match, but here are the closest agents based on your preferences."
      )
    ).toBeInTheDocument()
  })

  it('wires start over, refine, browse all, and card open actions', () => {
    const onStartOver = vi.fn()
    const onRefine = vi.fn()
    const onClose = vi.fn()
    renderResults({ onStartOver, onRefine, onClose })

    fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
    fireEvent.click(screen.getByRole('button', { name: 'Refine answers' }))
    fireEvent.click(screen.getByRole('button', { name: 'Browse all agents' }))

    expect(onStartOver).toHaveBeenCalledTimes(1)
    expect(onRefine).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getAllByRole('link', { name: /Open agent/ })[0])
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
