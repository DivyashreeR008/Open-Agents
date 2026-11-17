import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsOfService from './TermsOfService'

describe('terms section structure', () => {
  it('renders nine numbered policy sections followed by the footer question', () => {
    render(<TermsOfService />)

    const headings = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)
    expect(headings).toHaveLength(10)
    expect(headings[0]).toBe('Acceptance of Terms')
    expect(headings[8]).toBe('Contact Us')
    expect(headings[9]).toBe('Questions about these terms?')
  })
})
