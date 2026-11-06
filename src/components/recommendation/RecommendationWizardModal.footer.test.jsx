import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  wizard: {
    currentStepIndex: 0,
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
  },
}))

vi.mock('../../hooks/useRecommendationWizard', () => ({
  useRecommendationWizard: () => mocks.wizard,
}))
vi.mock('./RecommendationWizardStep', () => ({ default: () => <div>Wizard step</div> }))
vi.mock('./RecommendationResults', () => ({
  default: ({ results }) => <div data-testid="results">{results.length} recommendations</div>,
}))

import RecommendationWizardModal from './RecommendationWizardModal'

beforeEach(() => {
  vi.clearAllMocks()
  Object.assign(mocks.wizard, {
    currentStepIndex: 0,
    hasCompleted: false,
    results: [{ id: 'a' }],
  })
})

function renderOpen() {
  return render(<RecommendationWizardModal isOpen onClose={() => {}} />)
}

describe('RecommendationWizardModal footer', () => {
  it('disables Back on the first step and advances with Next', () => {
    renderOpen()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(mocks.wizard.nextStep).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument()
  })

  it('shows Skip after the second step and advances from it', () => {
    mocks.wizard.currentStepIndex = 2
    renderOpen()
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    expect(mocks.wizard.nextStep).toHaveBeenCalledOnce()
  })

  it('completes from the last step through Show results', () => {
    mocks.wizard.currentStepIndex = 4
    renderOpen()
    fireEvent.click(screen.getByRole('button', { name: 'Show results' }))
    expect(mocks.wizard.completeWizard).toHaveBeenCalledOnce()
  })

  it('hides the footer and renders results after completion', () => {
    mocks.wizard.hasCompleted = true
    renderOpen()
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.getByTestId('results')).toHaveTextContent('1 recommendations')
    expect(screen.getByRole('heading', { name: 'Recommended agents for you' })).toBeInTheDocument()
  })

  it('reports the current step and percentage', () => {
    renderOpen()
    expect(screen.getByLabelText('Step 1 of 5')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })
})
