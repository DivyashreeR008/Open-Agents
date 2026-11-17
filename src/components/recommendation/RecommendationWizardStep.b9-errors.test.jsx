import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../lib/agentRecommendation/constants.js', () => ({
  GOAL_OPTIONS: [
    { id: 'write', label: 'Write content', description: 'Draft and edit' },
    { id: 'code', label: 'Write code', description: 'Build and review' },
  ],
  EXPERIENCE_OPTIONS: [
    { id: 'guided', label: 'Guide me', description: 'Step by step' },
    { id: 'expert', label: 'Expert mode', description: 'Just the answer' },
  ],
  PROVIDER_OPTIONS: [],
  BUDGET_OPTIONS: [],
  EXTRA_PREFERENCE_OPTIONS: [],
}))

import RecommendationWizardStep from './RecommendationWizardStep'

const baseProps = {
  preferences: { primaryGoal: '', experienceLevel: '', extraPreferences: [], freeTextGoal: '' },
  setPreference: vi.fn(),
  toggleExtraPreference: vi.fn(),
}

describe('RecommendationWizardStep error association', () => {
  it('points every goal choice at the goal error', () => {
    render(
      <RecommendationWizardStep
        {...baseProps}
        stepIndex={0}
        errors={{ primaryGoal: 'Choose the kind of help you need.' }}
      />
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Choose the kind of help you need.')
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAttribute('aria-describedby', alert.id)
    }
  })

  it('points experience choices at the experience error', () => {
    render(
      <RecommendationWizardStep
        {...baseProps}
        stepIndex={1}
        errors={{ experienceLevel: 'Choose how much guidance you want.' }}
      />
    )

    const alert = screen.getByRole('alert')
    expect(screen.getByRole('button', { name: /Guide me/ })).toHaveAttribute(
      'aria-describedby',
      alert.id
    )
    expect(screen.getByRole('button', { name: /Expert mode/ })).toHaveAttribute(
      'aria-describedby',
      alert.id
    )
  })

  it('does not describe choices when there is no error', () => {
    render(<RecommendationWizardStep {...baseProps} stepIndex={0} errors={{}} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Write content/ })).not.toHaveAttribute(
      'aria-describedby'
    )
  })
})
