import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

const agent = {
  id: 'agent-1',
  name: 'Code Reviewer',
  icon: 'Code',
  category: 'Engineering',
  provider: 'openai',
  description: 'Reviews changes for correctness.',
}

const recommendation = {
  agentId: 'agent-1',
  matchPercentage: 92,
  reasons: [
    'Strong category match',
    'Matches your goal',
    'Provider preference',
    'Experience level',
    'Extra reason',
  ],
}

function renderCard(overrides = {}) {
  return render(
    <MemoryRouter>
      <RecommendationResultCard
        rank={1}
        agent={agent}
        result={recommendation}
        onOpenAgent={vi.fn()}
        {...overrides}
      />
    </MemoryRouter>
  )
}

describe('RecommendationResultCard', () => {
  it('renders the rank, identity, score, and category', () => {
    renderCard()

    expect(screen.getByLabelText('Rank 1')).toHaveTextContent('1')
    expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
    expect(screen.getByText('92% match')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
    expect(screen.getByText('Reviews changes for correctness.')).toBeInTheDocument()
  })

  it('renders only four reasons in the listed order', () => {
    renderCard()
    const reasons = screen.getAllByRole('listitem')

    expect(reasons).toHaveLength(4)
    expect(reasons.map((reason) => reason.textContent)).toEqual([
      'Strong category match',
      'Matches your goal',
      'Provider preference',
      'Experience level',
    ])
  })

  it('links to the agent detail page and calls the open callback', () => {
    const onOpenAgent = vi.fn()
    renderCard({ onOpenAgent })

    const link = screen.getByRole('link', { name: /Open agent/ })
    expect(link).toHaveAttribute('href', '/agent/agent-1')

    fireEvent.click(link)
    expect(onOpenAgent).toHaveBeenCalledTimes(1)
  })

  it('uses fallback category, description, and provider values', () => {
    renderCard({
      agent: { id: 'agent-2', name: 'Plain Agent', provider: 'mystery' },
      result: { matchPercentage: 10, reasons: [] },
    })

    expect(screen.getByText('Uncategorized')).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.getByText('mystery')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('marks the decorative icons as hidden from assistive technology', () => {
    const { container } = renderCard()

    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
    for (const icon of container.querySelectorAll('svg')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
