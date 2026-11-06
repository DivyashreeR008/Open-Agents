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

function renderOpen(onClose = vi.fn(), triggerRef) {
  return render(<RecommendationWizardModal isOpen onClose={onClose} triggerRef={triggerRef} />)
}

describe('RecommendationWizardModal dismissal', () => {
  it('closes through the close button and restores trigger focus', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const onClose = vi.fn()
    renderOpen(onClose, { current: trigger })

    fireEvent.click(screen.getByRole('button', { name: 'Close recommendation wizard' }))
    expect(onClose).toHaveBeenCalledOnce()
    act(() => vi.runAllTimers())
    expect(trigger).toHaveFocus()
    trigger.remove()
  })

  it('closes through the backdrop', () => {
    const onClose = vi.fn()
    renderOpen(onClose)
    fireEvent.click(document.querySelector('div[aria-hidden="true"]'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes and prevents default on Escape', () => {
    const onClose = vi.fn()
    renderOpen(onClose)
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    document.dispatchEvent(event)
    expect(onClose).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true)
  })

  it('does not throw when the trigger reference is missing', () => {
    const onClose = vi.fn()
    renderOpen(onClose)
    expect(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
      act(() => vi.runAllTimers())
    }).not.toThrow()
    expect(onClose).toHaveBeenCalledOnce()
  })
})
