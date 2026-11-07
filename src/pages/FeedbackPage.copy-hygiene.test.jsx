import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'

describe('feedback copy hygiene', () => {
  it('ships no placeholder copy or unresolved template markers', () => {
    const { container } = render(
      <MemoryRouter>
        <FeedbackPage />
      </MemoryRouter>
    )
    const text = container.textContent

    expect(text).not.toMatch(/lorem ipsum/i)
    expect(text).not.toMatch(/\bTODO\b/)
    expect(text).not.toContain('example.com')
    expect(text).not.toContain('[insert')
  })
})
