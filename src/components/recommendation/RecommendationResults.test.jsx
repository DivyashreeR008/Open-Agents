import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResults from './RecommendationResults'

const agent = {
  id: 'agent-a',
  name: 'Alpha Agent',
  category: 'Engineering',
  provider: 'openai',
  description: 'Reviews code.',
}

const result = {
  agentId: 'agent-a',
  score: 30,
  isConfident: true,
  matchPercentage: 100,
  reasons: ['Matches your coding and development workflow.'],
  matchedSignals: { exactCategory: true },
}

const renderResults = (props = {}) =>
  render(
    <MemoryRouter>
      <RecommendationResults
        agents={[agent]}
        results={[result]}
        onRefine={vi.fn()}
        onStartOver={vi.fn()}
        onClose={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )

describe('RecommendationResults empty causes', () => {
  it('reports a genuinely empty catalogue when there are no agents', () => {
    renderResults({ agents: [], results: [] })

    expect(screen.getByText('No agents available yet')).toBeInTheDocument()
    expect(screen.getByText(/agent list is empty/i)).toBeInTheDocument()
    expect(screen.queryByText('No agents matched your answers')).not.toBeInTheDocument()
  })

  it('reports a questionnaire with no matching agents separately from an empty catalogue', async () => {
    const onRefine = vi.fn()
    renderResults({ results: [], onRefine })

    expect(screen.getByText('No agents matched your answers')).toBeInTheDocument()
    expect(screen.queryByText('No agents available yet')).not.toBeInTheDocument()
    expect(screen.queryByText(/try again after agents have loaded/i)).not.toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Adjust answers' }))
    expect(onRefine).toHaveBeenCalledTimes(1)
  })

  it('reports stale ranked entries as out of date rather than an empty catalogue', () => {
    renderResults({
      results: [{ ...result, agentId: 'removed-agent' }],
    })

    expect(screen.getByText('These recommendations are out of date')).toBeInTheDocument()
    expect(screen.getByText(/no longer in the catalogue/i)).toBeInTheDocument()
    expect(screen.queryByText('No agents available yet')).not.toBeInTheDocument()
  })

  it('separates unresolvable entries from the recommendations that still resolve', () => {
    renderResults({
      results: [result, { ...result, agentId: 'removed-agent' }],
    })

    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(
      screen.getByText('1 ranked entry is no longer in the catalogue and was left out.')
    ).toBeInTheDocument()
  })

  it('labels a weak list as closest matches instead of a confident recommendation', () => {
    renderResults({ results: [{ ...result, isConfident: false, score: 18, matchPercentage: 50 }] })

    expect(screen.getByText(/No strong match was found/i)).toBeInTheDocument()
    expect(screen.getByText(/at least one matching signal/i)).toBeInTheDocument()

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

function renderPrResults(overrides = {}) {
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
    renderPrResults({ results: [{ agentId: 'missing-agent' }], onRefine, onClose })

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
    renderPrResults()

    const ranks = screen.getAllByLabelText(/^Rank /)
    expect(ranks.map((rank) => rank.textContent)).toEqual(['1', '2'])
    expect(screen.getByText('Alpha Agent')).toBeInTheDocument()
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    expect(screen.queryByText('missing-agent')).not.toBeInTheDocument()
  })

  it('suppresses the closest-match note when one result is confident', () => {
    renderPrResults({ results: [results[0], results[2]] })

    expect(screen.queryByText(/closest agents/)).not.toBeInTheDocument()
  })

  it('shows the closest-match note when no result is confident', () => {
    renderPrResults({
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
    renderPrResults({ onStartOver, onRefine, onClose })

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
