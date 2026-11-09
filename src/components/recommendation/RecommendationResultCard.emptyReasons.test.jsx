import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

describe('RecommendationResultCard empty reasons', () => {
  it('omits the reasons block when the recommendation has no reasons', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard
          rank={1}
          agent={{ id: 'writer', name: 'Writer', description: 'Writes things' }}
          result={{ matchPercentage: 50, reasons: [] }}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Writer')).toBeInTheDocument()
    expect(screen.queryByText('Why this agent?')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
