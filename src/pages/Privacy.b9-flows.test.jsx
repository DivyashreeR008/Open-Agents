import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Privacy from './Privacy'

describe('Privacy policy data flows', () => {
  it('names where prompts go and who controls retention', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Prompts and Outputs' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/sent directly from your browser to the AI provider/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/provider controls how long it retains the request/i)
    ).toBeInTheDocument()
  })

  it('explains how API keys are stored and removed', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'API Keys' })).toBeInTheDocument()
    expect(screen.getByText(/encrypted local storage/i)).toBeInTheDocument()
    expect(screen.getByText(/not transmitted to OpenAgents servers/i)).toBeInTheDocument()
  })
})
