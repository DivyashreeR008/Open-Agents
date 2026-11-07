import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RecommendationWizardStep from './RecommendationWizardStep'
import { BUDGET_OPTIONS } from '../../lib/agentRecommendation/constants'

const preferences = {
  primaryGoal: '',
  experienceLevel: '',
  providerPreference: '',
  budgetPreference: '',
  extraPreferences: [],
  freeTextGoal: '',
}

function renderStep(stepIndex = 3) {
  return render(
    <RecommendationWizardStep
      stepIndex={stepIndex}
      preferences={preferences}
      errors={{}}
      setPreference={vi.fn()}
      toggleExtraPreference={vi.fn()}
    />
  )
}

describe('RecommendationWizardStep budget and free text', () => {
  it('renders every budget option in the fourth step', () => {
    renderStep(3)

    expect(screen.getByText('Step 4 of 5')).toBeInTheDocument()
    for (const option of BUDGET_OPTIONS) {
      expect(screen.getByRole('button', { name: new RegExp(option.label) })).toBeInTheDocument()
    }
  })

  it('shows an empty free-text counter and enforces the 220 character limit', () => {
    renderStep(4)
    const textarea = screen.getByPlaceholderText(/I need to optimize a SQL query/)

    expect(screen.getByText('0/220 characters')).toBeInTheDocument()
    expect(textarea).toHaveAttribute('maxlength', '220')
  })

  it('reports selection state with aria-pressed', () => {
    renderStep(3)
    const selected = screen.getByRole('button', { name: new RegExp(BUDGET_OPTIONS[0].label) })

    expect(selected).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(selected)
  })
})
