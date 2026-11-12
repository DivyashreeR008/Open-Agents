import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecommendationWizard } from './useRecommendationWizard'

describe('useRecommendationWizard close reset', () => {
  it('clears answers and step progress when the wizard closes', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.openWizard())
    act(() => result.current.setPreference('freeTextGoal', 'draft a policy'))
    act(() => result.current.closeWizard())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.preferences.freeTextGoal).toBe('')
    expect(result.current.hasCompleted).toBe(false)
  })
})
