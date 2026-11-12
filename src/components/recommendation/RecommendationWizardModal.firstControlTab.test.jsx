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
vi.mock('./RecommendationResults', () => ({ default: () => <div>Wizard recommendations</div> }))

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

describe('RecommendationWizardModal middle focus', () => {
  it('leaves forward Tab from the first control to the browser', () => {
    render(<RecommendationWizardModal isOpen onClose={() => {}} />)
    act(() => vi.runAllTimers())

    const close = screen.getByRole('button', { name: 'Close recommendation wizard' })
    close.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(false)
    expect(close).toHaveFocus()
  })
})
