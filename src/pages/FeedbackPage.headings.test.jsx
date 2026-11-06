import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <FeedbackPage />
    </MemoryRouter>
  )
}

afterEach(() => {
  document.title = ''
})

describe('FeedbackPage structure', () => {
  it('sets a descriptive document title', () => {
    renderPage()
    expect(document.title).toContain('Feedback')
    expect(document.title).toContain('Open Agents')
  })

  it('uses one page heading and one heading per feedback option', () => {
    renderPage()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)
  })

  it('names each option heading after its action', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 2, name: /Report a bug/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Suggest a feature/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /General feedback/ })).toBeInTheDocument()
  })
})
