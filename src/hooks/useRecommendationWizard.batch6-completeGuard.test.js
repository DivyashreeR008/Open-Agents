import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecommendationWizard } from './useRecommendationWizard'

describe('useRecommendationWizard completion guard', () => {
  it('refuses to complete from the first question when the experience level is still missing', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.setPreference('primaryGoal', 'coding-development'))

    let completed
    act(() => {
      completed = result.current.completeWizard()
    })

    expect(completed).toBe(false)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.results).toEqual([])
    expect(result.current.errors.experienceLevel).toBe('Choose how much guidance you want.')
  })
})
