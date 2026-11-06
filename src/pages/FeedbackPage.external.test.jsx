import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <FeedbackPage />
    </MemoryRouter>
  )
}

describe('FeedbackPage external links', () => {
  it('applies one safety contract to every external destination', () => {
    const { container } = renderPage()
    const links = Array.from(container.querySelectorAll('a'))

    expect(links.length).toBeGreaterThanOrEqual(4)
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
      expect(link.textContent).toContain('(opens in new tab)')
    }
  })

  it('keeps decorative icons out of the accessible names', () => {
    const { container } = renderPage()
    const icons = container.querySelectorAll('a svg')
    expect(icons.length).toBeGreaterThan(0)
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true')
    }
  })
})
