import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AboutCta from './AboutCta'

describe('AboutCta light-theme contrast', () => {
  it('uses light-theme ink instead of white on an unbacked panel', () => {
    render(
      <MemoryRouter>
        <AboutCta />
      </MemoryRouter>
    )

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.classList.contains('text-gray-900')).toBe(true)
    expect(heading.classList.contains('dark:text-white')).toBe(true)

    const badge = screen.getByText('Join 100+ Community Contributors').parentElement
    expect(badge.classList.contains('text-zinc-700')).toBe(true)

    const issues = screen.getByRole('link', { name: /Explore Open Issues/ })
    expect(issues.classList.contains('bg-zinc-900')).toBe(true)
    expect(issues.classList.contains('text-white')).toBe(true)
  })
})
