import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResults from './RecommendationResults'

describe('RecommendationResults plural stale entries', () => {
  it('uses plural grammar when more than one ranked entry is missing', () => {
    render(
      <MemoryRouter>
        <RecommendationResults
          agents={[{ id: 'a1', name: 'Live Agent', category: 'Engineering', icon: 'Code' }]}
          results={[
            { agentId: 'a1', matchPercentage: 70, isConfident: true, reasons: [] },
            { agentId: 'gone-1', matchPercentage: 60, isConfident: false, reasons: [] },
            { agentId: 'gone-2', matchPercentage: 50, isConfident: false, reasons: [] },
          ]}
          onRefine={vi.fn()}
          onStartOver={vi.fn()}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(
      screen.getByText('2 ranked entries are no longer in the catalogue and were left out.')
    ).toBeInTheDocument()
    expect(screen.getByText('Live Agent')).toBeInTheDocument()
  })
})
