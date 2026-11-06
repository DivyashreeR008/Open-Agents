import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
vi.mock('./RecommendationResults', () => ({ default: () => <div>Wizard results</div> }))

import RecommendationWizardModal from './RecommendationWizardModal'

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.style.overflow = ''
  document.body.classList.remove('recommendation-wizard-open')
})

describe('RecommendationWizardModal focus and scroll lock', () => {
  it('renders nothing while closed', () => {
    render(<RecommendationWizardModal isOpen={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locks the body and moves focus to the heading when opened', () => {
    render(<RecommendationWizardModal isOpen onClose={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: 'Find the right agent' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.classList.contains('recommendation-wizard-open')).toBe(true)
    act(() => vi.runAllTimers())
    expect(screen.getByRole('heading', { name: 'Find the right agent' })).toHaveFocus()
  })

  it('restores the body state after closing', () => {
    document.body.style.overflow = 'auto'
    const { rerender } = render(<RecommendationWizardModal isOpen onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<RecommendationWizardModal isOpen={false} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('auto')
    expect(document.body.classList.contains('recommendation-wizard-open')).toBe(false)
  })
})
