import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const ratings = vi.hoisted(() => ({
  rateAgent: vi.fn(),
}))

vi.mock('../lib/useAgentRatings.js', () => ({
  useAgentRatings: () => ({ rateAgent: ratings.rateAgent, getRunVote: () => null }),
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

  it('submits an up rating with the agent id and keeps the selected state visible', () => {
    render(<RunRating agentId="agent-1" />)

    fireEvent.click(screen.getByTitle('Good output'))

    expect(ratings.rateAgent).toHaveBeenCalledWith('agent-1', 'up')
    expect(screen.getByRole('status')).toHaveTextContent('Thanks. Your rating is saved')
    expect(screen.getByTitle('Good output')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTitle('Bad output')).toHaveAttribute('aria-pressed', 'false')
  })

  it('submits a down rating with the agent id', () => {
    render(<RunRating agentId="agent-7" />)

    fireEvent.click(screen.getByTitle('Bad output'))

    expect(ratings.rateAgent).toHaveBeenCalledWith('agent-7', 'down')
    expect(screen.getByRole('status')).toHaveTextContent('Thanks. Your rating is saved')
    expect(screen.getByTitle('Bad output')).toHaveAttribute('aria-pressed', 'true')
  })

  it('disables both controls when no agent id is available', () => {
    render(<RunRating agentId={undefined} />)

    const good = screen.getByTitle('Good output')
    const bad = screen.getByTitle('Bad output')
    expect(good).toBeDisabled()
    expect(bad).toBeDisabled()
    fireEvent.click(good)
    expect(ratings.rateAgent).not.toHaveBeenCalled()
  })

  it('confirms a repeated rating without recording it twice', () => {
    render(<RunRating agentId="agent-1" />)

    fireEvent.click(screen.getByTitle('Good output'))
    fireEvent.click(screen.getByTitle('Good output'))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your rating is already saved for this output.'
    )
    expect(ratings.rateAgent).toHaveBeenCalledTimes(1)
  })
})
