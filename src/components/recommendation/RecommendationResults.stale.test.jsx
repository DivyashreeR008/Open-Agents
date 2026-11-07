import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecommendationResults from './RecommendationResults'

describe('RecommendationResults stale and partial matches', () => {
  it('reports one stale ranking with singular grammar and keeps the live card', () => {
    render(
      <MemoryRouter>
        <RecommendationResults
          agents={[{ id: 'a1', name: 'Live Agent', category: 'Engineering', icon: 'Code' }]}
          results={[
            { agentId: 'a1', matchPercentage: 70, isConfident: false, reasons: [] },
            { agentId: 'gone', matchPercentage: 60, isConfident: false, reasons: [] },
          ]}
          onRefine={vi.fn()}
          onStartOver={vi.fn()}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(
      screen.getByText('1 ranked entry is no longer in the catalogue and was left out.')
    ).toBeInTheDocument()
    expect(screen.getByText('Live Agent')).toBeInTheDocument()
    expect(screen.getByText(/No strong match was found/)).toBeInTheDocument()
  })

  it('gives the start over action priority when every result is stale', () => {
    const onStartOver = vi.fn()
    render(
      <MemoryRouter>
        <RecommendationResults
          agents={[{ id: 'a1', name: 'Live Agent' }]}
          results={[{ agentId: 'gone', matchPercentage: 70, reasons: [] }]}
          onStartOver={onStartOver}
          onRefine={vi.fn()}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Start over' }))

    expect(onStartOver).toHaveBeenCalledTimes(1)
  })
})
