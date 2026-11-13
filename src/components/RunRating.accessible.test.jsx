import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../lib/useAgentRatings.js', () => ({
  useAgentRatings: () => ({ rateAgent: vi.fn(), getRunVote: vi.fn(() => null) }),
}))

import RunRating from './RunRating'

describe('RunRating accessible control names', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes both icon controls by role and name', () => {
    render(<RunRating agentId="agent-1" />)

    expect(screen.getByRole('button', { name: 'Good output' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bad output' })).toBeInTheDocument()
  })

  it('does not expose decorative icons as separate accessible images', () => {
    const { container } = render(<RunRating agentId="agent-1" />)

    for (const icon of container.querySelectorAll('svg')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
