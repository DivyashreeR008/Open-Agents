import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsOfService from './TermsOfService'

describe('Terms of service footer', () => {
  it('closes the terms with the community contact prompt', () => {
    render(<TermsOfService />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Questions about these terms?' })
    ).toBeInTheDocument()
    expect(screen.getByText(/built and maintained by its community/)).toBeInTheDocument()
    expect(screen.getAllByText(/official GitHub repository/).length).toBeGreaterThanOrEqual(1)
  })
})
