import { act, render, screen, fireEvent } from '@testing-library/react'
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

function renderOpen() {
  return render(<RecommendationWizardModal isOpen onClose={() => {}} />)
}

describe('RecommendationWizardModal focus trap', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    Object.assign(mocks.wizard, {
      currentStepIndex: 0,
      hasCompleted: false,
      results: [],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.style.overflow = ''
    document.body.classList.remove('recommendation-wizard-open')
  })

  it('wraps Tab from the last control back to the first', () => {
    renderOpen()
    act(() => vi.runAllTimers())

    const close = screen.getByRole('button', { name: 'Close recommendation wizard' })
    const next = screen.getByRole('button', { name: 'Next' })
    next.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(close).toHaveFocus()
  })

  it('wraps Shift+Tab from the first control to the last', () => {
    renderOpen()
    act(() => vi.runAllTimers())

    const close = screen.getByRole('button', { name: 'Close recommendation wizard' })
    const next = screen.getByRole('button', { name: 'Next' })
    close.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(next).toHaveFocus()
  })

  it('wraps Shift+Tab when focus sits outside the focusable list', () => {
    renderOpen()
    act(() => vi.runAllTimers())

    const heading = screen.getByRole('heading', { name: 'Find the right agent' })
    const next = screen.getByRole('button', { name: 'Next' })
    heading.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(next).toHaveFocus()
  })
})
