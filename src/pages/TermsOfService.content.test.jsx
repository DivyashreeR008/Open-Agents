import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TermsOfService from './TermsOfService'

describe('Terms of Service content', () => {
  it('renders the legal heading and revision date', () => {
    render(
      <MemoryRouter>
        <TermsOfService />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument()
    expect(screen.getByText('June 2026')).toBeInTheDocument()
  })

  it('keeps the liability and warranty sections distinct', () => {
    render(
      <MemoryRouter>
        <TermsOfService />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'No Warranty' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Limitation of Liability' })
    ).toBeInTheDocument()
    expect(screen.getByText(/provided "as is"/)).toBeInTheDocument()
  })
})
