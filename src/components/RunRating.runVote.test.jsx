import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import RunRating from './RunRating'

beforeEach(() => {
  localStorage.clear()
})

describe('RunRating per-output persistence', () => {
  it('restores the saved vote after remounting and confirms a repeat without another point', () => {
    const first = render(<RunRating agentId="agent-1" runId="run-1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Good output' }))
    expect(screen.getByRole('status')).toHaveTextContent('Thanks. Your rating is saved')
    first.unmount()

    render(<RunRating agentId="agent-1" runId="run-1" />)
    const good = screen.getByRole('button', { name: 'Good output' })
    expect(good).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('You rated this output as good.')

    fireEvent.click(good)
    expect(screen.getByRole('status')).toHaveTextContent('already saved')
    expect(JSON.parse(localStorage.getItem('oa_ratings'))['agent-1']).toMatchObject({
      up: 1,
      down: 0,
    })
  })

  it('records different runs independently', () => {
    const { rerender } = render(<RunRating agentId="agent-1" runId="run-1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Good output' }))

    rerender(<RunRating agentId="agent-1" runId="run-2" />)
    expect(screen.getByRole('button', { name: 'Good output' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Bad output' }))

    expect(JSON.parse(localStorage.getItem('oa_ratings'))['agent-1']).toMatchObject({
      up: 1,
      down: 1,
    })
  })
})
