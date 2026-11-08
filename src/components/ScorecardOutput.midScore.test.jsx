import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScorecardOutput from './ScorecardOutput'

describe('ScorecardOutput mid-range scores', () => {
  it('uses the middle color treatment for a score and criterion between forty and seventy', () => {
    render(
      <ScorecardOutput
        data={{
          matchScore: 55,
          recommendation: 'Maybe',
          criteria: { Clarity: 50 },
        }}
      />
    )

    expect(screen.getByText('55/100')).toBeInTheDocument()
    expect(screen.getByText('55', { selector: '.score-value' })).toHaveStyle({ color: '#8A8A8A' })
    expect(screen.getByText('50/100')).toBeInTheDocument()
  })
})
