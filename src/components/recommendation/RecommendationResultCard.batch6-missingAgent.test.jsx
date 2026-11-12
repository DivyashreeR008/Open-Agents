import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

describe('RecommendationResultCard with missing data', () => {
  it('renders safe fallbacks when the agent and result are absent', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard rank={3} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Rank 3')).toBeInTheDocument()
    expect(screen.getByText('Unnamed Agent')).toBeInTheDocument()
    expect(screen.getByText('0% match')).toBeInTheDocument()
    expect(screen.getByText('Uncategorized')).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open agent/ })).toHaveAttribute('href', '/agent/')
  })
})
