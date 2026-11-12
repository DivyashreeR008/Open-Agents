import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

describe('RecommendationResultCard empty agent identity', () => {
  it('uses unnamed, uncategorized, and any-provider fallbacks without reasons', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard rank={3} agent={{}} result={{ matchPercentage: 0 }} />
      </MemoryRouter>
    )

    expect(screen.getByText('Unnamed Agent')).toBeInTheDocument()
    expect(screen.getByText('Uncategorized')).toBeInTheDocument()
    expect(screen.getByText('Any Provider')).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.queryByText('Why this agent?')).not.toBeInTheDocument()
  })
})
