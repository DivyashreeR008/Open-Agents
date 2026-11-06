import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const ratings = vi.hoisted(() => ({
  rateAgent: vi.fn(),
}))

vi.mock('../lib/useAgentRatings.js', () => ({
  useAgentRatings: () => ({ rateAgent: ratings.rateAgent }),
}))

const { default: RunRating } = await import('./RunRating')

describe('RunRating', () => {
  beforeEach(() => {
    ratings.rateAgent.mockReset()
  })

  it('renders the prompt and both rating controls', () => {
    render(<RunRating agentId="agent-1" />)

    expect(screen.getByText('How was this output?')).toBeInTheDocument()
    expect(screen.getByTitle('Good output')).toBeInTheDocument()
    expect(screen.getByTitle('Bad output')).toBeInTheDocument()
  })

  it('submits an up rating with the agent id and enters the thank-you state', () => {
    render(<RunRating agentId="agent-1" />)

    fireEvent.click(screen.getByTitle('Good output'))

    expect(ratings.rateAgent).toHaveBeenCalledWith('agent-1', 'up')
    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument()
    expect(screen.queryByTitle('Good output')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Bad output')).not.toBeInTheDocument()
  })

  it('submits a down rating with the agent id', () => {
    render(<RunRating agentId="agent-7" />)

    fireEvent.click(screen.getByTitle('Bad output'))

    expect(ratings.rateAgent).toHaveBeenCalledWith('agent-7', 'down')
    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument()
  })

  it('shows the terminal state but skips the hook when no agent id is available', () => {
    render(<RunRating agentId={undefined} />)

    fireEvent.click(screen.getByTitle('Good output'))

    expect(ratings.rateAgent).not.toHaveBeenCalled()
    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument()
  })

  it('cannot submit a second rating after the first one', () => {
    render(<RunRating agentId="agent-1" />)

    fireEvent.click(screen.getByTitle('Good output'))

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(ratings.rateAgent).toHaveBeenCalledTimes(1)
  })
})
