import { act, fireEvent, render, screen } from '@testing-library/react'
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
  Object.assign(mocks.wizard, {
    currentStepIndex: 0,
    hasCompleted: false,
    results: [],
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.style.overflow = ''
  document.body.classList.remove('recommendation-wizard-open')
})

describe('RecommendationWizardModal focus fallbacks', () => {
  it('retries focus without options when the trigger rejects preventScroll', () => {
    const onClose = vi.fn()
    const trigger = {
      focus: vi.fn((options) => {
        if (options?.preventScroll) throw new Error('preventScroll unsupported')
      }),
    }
    render(<RecommendationWizardModal isOpen onClose={onClose} triggerRef={{ current: trigger }} />)
    act(() => vi.runAllTimers())

    fireEvent.click(screen.getByRole('button', { name: 'Close recommendation wizard' }))
    expect(onClose).toHaveBeenCalled()
    act(() => vi.runAllTimers())

    expect(trigger.focus).toHaveBeenNthCalledWith(1, { preventScroll: true })
    expect(trigger.focus).toHaveBeenNthCalledWith(2)
  })

  it('leaves non-Tab keys to their normal browser behavior', () => {
    render(<RecommendationWizardModal isOpen onClose={() => {}} />)
    act(() => vi.runAllTimers())

    const event = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(false)
  })

  it('does not trap Tab when the panel has no focusable controls', () => {
    render(<RecommendationWizardModal isOpen onClose={() => {}} />)
    act(() => vi.runAllTimers())
    const dialog = screen.getByRole('dialog')
    vi.spyOn(dialog, 'querySelectorAll').mockReturnValue([])

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(false)
  })
})
