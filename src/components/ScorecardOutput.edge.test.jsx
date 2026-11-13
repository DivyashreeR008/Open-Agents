import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScorecardOutput, { parseScorecardText } from './ScorecardOutput'

describe('parseScorecardText malformed delimiters', () => {
  it('returns null for a broken fence and for an invalid brace slice', () => {
    expect(parseScorecardText('```json\n{ "matchScore": 42 \n```')).toBeNull()
    expect(parseScorecardText('Score: {not valid json}')).toBeNull()
  })
})

describe('ScorecardOutput partial payloads', () => {
  it('renders defaults when optional sections are missing or the wrong shape', () => {
    const { container } = render(
      <ScorecardOutput
        data={{
          matchScore: 55,
          recommendation: '',
          criteria: [{ score: 90 }],
          strengths: [],
          gaps: 'missing',
        }}
      />
    )

    expect(screen.getByText('55/100')).toBeInTheDocument()
    expect(screen.getByText('N/A')).toBeInTheDocument()
    expect(screen.queryByText('Criteria Breakdown')).not.toBeInTheDocument()
    expect(screen.queryByText('Top Strengths')).not.toBeInTheDocument()
    expect(screen.queryByText('Top Gaps')).not.toBeInTheDocument()
    expect(screen.queryByText('Reasoning')).not.toBeInTheDocument()
    expect(container.querySelectorAll('circle')[1]).toHaveAttribute('stroke', 'currentColor')
    expect(container.querySelectorAll('circle')[1]).toHaveClass('stroke-amber-700')
  })

  it('renders a low score with mixed criterion values plus strengths and gaps', () => {
    const { container } = render(
      <ScorecardOutput
        data={{
          matchScore: 12,
          recommendation: 'Maybe',
          criteria: {
            Speed: 30,
            Clarity: { score: 75, comment: 'Clear enough' },
            Unscored: {},
          },
          strengths: ['Fast turnaround'],
          gaps: ['Limited examples'],
          reasoning: 'Based on the supplied evidence.',
        }}
      />
    )

    expect(screen.getByText('12/100')).toBeInTheDocument()
    expect(screen.getByText('Maybe')).toBeInTheDocument()
    expect(screen.getByText('Speed')).toBeInTheDocument()
    expect(screen.getByText('30/100')).toBeInTheDocument()
    expect(screen.getByText('75/100')).toBeInTheDocument()
    expect(screen.getByText('Clear enough')).toBeInTheDocument()
    expect(screen.getByText('Not scored')).toBeInTheDocument()
    expect(screen.getByText('Top Strengths')).toBeInTheDocument()
    expect(screen.getByText('Fast turnaround')).toBeInTheDocument()
    expect(screen.getByText('Top Gaps')).toBeInTheDocument()
    expect(screen.getByText('Limited examples')).toBeInTheDocument()
    expect(screen.getByText('Reasoning')).toBeInTheDocument()
    expect(screen.getByText('Based on the supplied evidence.')).toBeInTheDocument()
    expect(container.querySelectorAll('circle')[1]).toHaveAttribute('stroke', 'currentColor')
    expect(container.querySelectorAll('circle')[1]).toHaveClass('stroke-red-700')
  })
})
