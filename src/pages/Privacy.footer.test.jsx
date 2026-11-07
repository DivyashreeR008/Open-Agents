import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Privacy from './Privacy'

describe('Privacy policy footer', () => {
  it('closes the policy with the transparency commitment', () => {
    render(<Privacy />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Transparency and trust' })
    ).toBeInTheDocument()
    expect(screen.getByText(/We're committed to an open-source AI ecosystem/)).toBeInTheDocument()
    expect(
      screen.getByText(/Continued use after an update constitutes acceptance/)
    ).toBeInTheDocument()
  })
})
