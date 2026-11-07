import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Privacy from './Privacy'

describe('Privacy policy content', () => {
  it('renders the legal heading and revision date', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText('June 2026')).toBeInTheDocument()
  })

  it('renders every policy section in order', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>
    )

    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    expect(headings).toEqual([
      'Information We Collect',
      'Cookies & Local Storage',
      'How We Use Your Information',
      'Data Security',
      'Your Privacy Rights',
      'Third-Party Services',
      'Policy Updates',
      'Contact Us',
      'Transparency and trust',
    ])
  })
})
