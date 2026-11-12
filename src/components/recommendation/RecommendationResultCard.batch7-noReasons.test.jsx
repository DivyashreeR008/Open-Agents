import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResultCard from './RecommendationResultCard'

describe('RecommendationResultCard without reasons', () => {
  it('omits the explanation block when the result has no reasons array', () => {
    render(
      <MemoryRouter>
        <RecommendationResultCard
          rank={2}
          agent={{ id: 'a1', name: 'Agent One', description: 'Helpful', category: 'Research' }}
          result={{ matchPercentage: 55 }}
          onOpenAgent={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('55% match')).toBeInTheDocument()
    expect(screen.queryByText('Why this agent?')).not.toBeInTheDocument()
  })
})
