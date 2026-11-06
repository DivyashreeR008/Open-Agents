import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RecommendationWizardStep from './RecommendationWizardStep'

const preferences = {
  primaryGoal: 'coding-development',
  experienceLevel: 'beginner',
  providerPreference: 'openai',
  budgetPreference: 'fast',
  extraPreferences: ['open-source'],
  freeTextGoal: 'abcd',
}

function renderStep(stepIndex, overrides = {}) {
  return render(
    <RecommendationWizardStep
      stepIndex={stepIndex}
      preferences={preferences}
      errors={{}}
      setPreference={vi.fn()}
      toggleExtraPreference={vi.fn()}
      {...overrides}
    />
  )
}

describe('RecommendationWizardStep', () => {
  it('renders the goal step, selected state, and validation alert', () => {
    const setPreference = vi.fn()
    renderStep(0, {
      setPreference,
      errors: { primaryGoal: 'Choose a goal to continue.' },
    })

    expect(
      screen.getByRole('heading', { level: 2, name: 'What do you want help with today?' })
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a goal to continue.')
    expect(
      screen.getByRole('button', { name: /Coding & Development/ })
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: /Research & Analysis/ }))
    expect(setPreference).toHaveBeenCalledWith('primaryGoal', 'research-analysis')
  })

  it('renders the experience step and writes the experience preference', () => {
    const setPreference = vi.fn()
    renderStep(1, { setPreference })

    expect(
      screen.getByRole('heading', { level: 2, name: 'How much guidance do you want?' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Advanced/ }))
    expect(setPreference).toHaveBeenCalledWith('experienceLevel', 'advanced')
  })

  it('renders the provider helper and writes the provider preference', () => {
    const setPreference = vi.fn()
    renderStep(2, { setPreference })

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Do you prefer a specific AI provider?',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText("This helps prioritize compatible agents. It won't exclude others.")
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Anthropic/ }))
    expect(setPreference).toHaveBeenCalledWith('providerPreference', 'anthropic')
  })

  it('renders the ranking step and writes the budget preference', () => {
    const setPreference = vi.fn()
    renderStep(3, { setPreference })

    expect(
      screen.getByRole('heading', { level: 2, name: "What's most important to you?" })
    ).toBeInTheDocument()
    expect(
      screen.getByText('This guides ranking only; it does not use pricing or cost data.')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Balanced/ }))
    expect(setPreference).toHaveBeenCalledWith('budgetPreference', 'balanced')
  })

  it('toggles extra preferences and writes the optional free-text goal', () => {
    const setPreference = vi.fn()
    const toggleExtraPreference = vi.fn()
    renderStep(4, { setPreference, toggleExtraPreference })

    expect(
      screen.getByRole('heading', { level: 2, name: 'Any extra preferences?' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tool Calling' })
    ).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByRole('button', { name: 'Open Source' })
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Tool Calling' }))
    expect(toggleExtraPreference).toHaveBeenCalledWith('tool-calling')

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('abcd')
    expect(textarea).toHaveAttribute('maxLength', '220')
    expect(screen.getByText('4/220 characters')).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: 'hello' } })
    expect(setPreference).toHaveBeenCalledWith('freeTextGoal', 'hello')
  })
})
