import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecommendationWizard } from './useRecommendationWizard'

describe('useRecommendationWizard edge boundaries', () => {
  it('blocks completion on the first question when no goal is selected', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.openWizard())

    let completed
    act(() => {
      completed = result.current.completeWizard()
    })

    expect(completed).toBe(false)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.results).toEqual([])
    expect(result.current.errors.primaryGoal).toBe('Choose a goal to continue.')
  })

  it('stays on the first question when stepping back at the start', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.openWizard())
    act(() => result.current.previousStep())

    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.isOpen).toBe(true)
  })

  it('clears a validation error and returns to the first question on reset', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.openWizard())
    act(() => {
      result.current.nextStep()
    })
    expect(result.current.errors.primaryGoal).toBe('Choose a goal to continue.')

    act(() => result.current.setPreference('freeTextGoal', 'draft a policy'))
    act(() => result.current.resetWizard())

    expect(result.current.errors).toEqual({})
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.preferences.freeTextGoal).toBe('')
    expect(result.current.hasCompleted).toBe(false)
  })
})
