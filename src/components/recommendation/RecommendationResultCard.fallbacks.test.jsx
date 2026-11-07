import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

describe('RecommendationResultCard fallback content', () => {
  it('shows a zero score and unknown provider without losing the rank', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard
          rank={1}
          agent={{ id: 'mystery', name: 'Mystery Agent', icon: 'not-real', provider: 'acme' }}
          result={{ matchPercentage: 0, reasons: [] }}
        />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument()
    expect(screen.getByText('0% match')).toBeInTheDocument()
    expect(screen.getByText('acme')).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
  })

  it('caps the reasons list at four entries', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard
          rank={2}
          agent={{ id: 'writer', name: 'Writer', icon: 'PenLine', category: 'Content Writing' }}
          result={{
            matchPercentage: 88,
            reasons: ['one', 'two', 'three', 'four', 'five'],
          }}
        />
      </MemoryRouter>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.queryByText('five')).not.toBeInTheDocument()
  })
})
