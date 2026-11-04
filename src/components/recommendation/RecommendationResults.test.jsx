import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  })
})
