import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const rateAgent = vi.fn()
vi.mock('../lib/useAgentRatings.js', () => ({
  useAgentRatings: () => ({ rateAgent }),
}))

import RunRating from './RunRating'

describe('RunRating without an agent id', () => {
  it('thanks the reader without recording an anonymous rating', () => {
    render(<RunRating agentId="" />)

    fireEvent.click(screen.getByTitle('Good output'))

    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument()
    expect(rateAgent).not.toHaveBeenCalled()
  })
})
