import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'

const cases = [
  ['Report a bug', 'bug_report.yml'],
  ['Suggest a feature', 'feature_request.yml'],
  ['General feedback', 'general_feedback.yml'],
]

function renderPage() {
  return render(
    <MemoryRouter>
      <FeedbackPage />
    </MemoryRouter>
  )
}

describe('FeedbackPage option links', () => {
  it.each(cases)('routes %s to the matching GitHub template', (name, template) => {
    renderPage()
    const link = screen.getByRole('link', { name: new RegExp(name) })
    expect(link).toHaveAttribute('href', expect.stringContaining('issues/new'))
    expect(link.getAttribute('href')).toContain(`template=${template}`)
  })

  it('opens each option in a new tab with a safe relationship', () => {
    renderPage()
    for (const [name] of cases) {
      const link = screen.getByRole('link', { name: new RegExp(name) })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('tells assistive technology that focus leaves the page', () => {
    renderPage()
    for (const [name] of cases) {
      expect(
        screen.getByRole('link', { name: new RegExp(`${name}.*opens in new tab`) })
      ).toBeInTheDocument()
    }
  })
})
