import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { GOAL_OPTIONS } from '../lib/agentRecommendation/constants.js'
import { useRecommendationWizard } from './useRecommendationWizard'

describe('useRecommendationWizard completion validation', () => {
  it('stops at the experience question when only a goal is selected', () => {
    const { result } = renderHook(() => useRecommendationWizard([]))

    act(() => result.current.openWizard())
    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))

    let completed
    act(() => {
      completed = result.current.completeWizard()
    })

    expect(completed).toBe(false)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.errors.experienceLevel).toBe('Choose how much guidance you want.')
  })
})
