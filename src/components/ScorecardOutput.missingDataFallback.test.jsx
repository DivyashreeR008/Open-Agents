import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScorecardOutput from './ScorecardOutput'

describe('ScorecardOutput missing data', () => {
  it('renders a JSON fallback when the scorecard payload is absent', () => {
    render(<ScorecardOutput data={null} />)

    expect(
      screen.getByText('Could not parse the response as a scorecard. Raw output:')
    ).toBeInTheDocument()
    expect(screen.getByText('null')).toBeInTheDocument()
  })
})
