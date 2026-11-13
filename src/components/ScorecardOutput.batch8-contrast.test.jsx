import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScorecardOutput from './ScorecardOutput'

describe('ScorecardOutput score clarity', () => {
  it('renders a missing score as absent rather than zero', () => {
    render(
      <ScorecardOutput
        data={{
          recommendation: 'Maybe',
          criteria: { Clarity: { comment: 'No score returned' } },
        }}
      />
    )

    expect(screen.getByText('Not provided')).toBeInTheDocument()
    expect(screen.queryByText('0/100')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Match score not provided' })).toBeInTheDocument()
    expect(screen.getAllByText('Not scored').length).toBeGreaterThanOrEqual(1)
  })

  it('keeps a genuine zero distinct from a missing score', () => {
    render(<ScorecardOutput data={{ matchScore: 0, recommendation: 'No' }} />)

    expect(screen.getByText('0/100')).toBeInTheDocument()
    expect(screen.getByText('Needs work')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Match score 0 out of 100' })).toBeInTheDocument()
    expect(screen.queryByText('Not provided')).not.toBeInTheDocument()
  })

  it('uses a readable score treatment plus a text label', () => {
    render(<ScorecardOutput data={{ matchScore: 85, recommendation: 'Strong Yes' }} />)

    expect(screen.getByText('85', { selector: '.score-value' })).toHaveClass('text-emerald-700')
    expect(screen.getByText('Strong')).toHaveClass('text-emerald-700')
    expect(screen.getByText('Strong Yes')).toHaveClass('text-emerald-800')
  })

  it('marks a low score with a readable treatment and label', () => {
    render(<ScorecardOutput data={{ matchScore: 20, recommendation: 'No' }} />)

    expect(screen.getByText('20', { selector: '.score-value' })).toHaveClass('text-red-700')
    expect(screen.getByText('Needs work')).toHaveClass('text-red-700')
  })
})
