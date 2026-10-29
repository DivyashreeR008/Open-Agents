import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'

describe('FeedbackPage', () => {
  it('points security reports to the private advisory route', () => {
    render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /report it privately/i })
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/DivyashreeR008/Open-Agents/security/advisories/new'
    )
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
