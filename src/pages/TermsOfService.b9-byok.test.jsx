import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsOfService from './TermsOfService'

describe('Terms of Service provider obligations', () => {
  it('states that the provider bills the user directly', () => {
    render(<TermsOfService />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'AI Providers and Charges' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/bills you directly for requests made with your key/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/does not provide model access, API credentials/i)).toBeInTheDocument()
  })

  it('makes third-party terms and output limits explicit', () => {
    render(<TermsOfService />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Third-Party Services' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/governed by their own terms and privacy policies/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/review it before relying on it/i)).toBeInTheDocument()
  })
})
