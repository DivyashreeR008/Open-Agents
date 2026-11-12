import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CharCounter from './CharCounter'

describe('CharCounter with a zero limit', () => {
  it('marks the limit as reached for empty input', () => {
    render(<CharCounter value="" maxLength={0} showLimit />)

    expect(screen.getByText(/0 \/ 0 characters/)).toBeInTheDocument()
    expect(screen.getByText('Limit reached')).toBeInTheDocument()
  })
})
