import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const wizard = vi.hoisted(() => ({
  currentStepIndex: 1,
  hasCompleted: false,
  preferences: {},
  errors: {},
  results: [],
  openWizard: vi.fn(),
  closeWizard: vi.fn(),
  previousStep: vi.fn(),
  nextStep: vi.fn(),
  completeWizard: vi.fn(),
  refineAnswers: vi.fn(),
  resetWizard: vi.fn(),
  setPreference: vi.fn(),
  toggleExtraPreference: vi.fn(),
}))

vi.mock('../../hooks/useRecommendationWizard', () => ({
  useRecommendationWizard: () => wizard,
}))
vi.mock('./RecommendationWizardStep', () => ({ default: () => <div>Wizard step</div> }))
vi.mock('./RecommendationResults', () => ({ default: () => <div>Results</div> }))

import RecommendationWizardModal from './RecommendationWizardModal'

describe('RecommendationWizardModal landmarks and progress', () => {
  it('does not nest a second main landmark inside the app', () => {
    const { container } = render(<RecommendationWizardModal isOpen onClose={vi.fn()} />)

    expect(container.querySelector('main')).toBeNull()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('exposes the step progress as a progressbar with values', () => {
    render(<RecommendationWizardModal isOpen onClose={vi.fn()} />)

    const progress = screen.getByRole('progressbar', { name: 'Step 2 of 5' })
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    expect(progress).toHaveAttribute('aria-valuenow', '40')
    expect(progress).toHaveAttribute('aria-valuetext', 'Step 2 of 5')
  })
})
