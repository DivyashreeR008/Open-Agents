import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecommendationWizard } from './useRecommendationWizard'

const agents = [
  { id: 'agent-a', name: 'Agent A', category: 'Engineering', description: 'code review', provider: 'openai' },
  { id: 'agent-b', name: 'Agent B', category: 'Design', description: 'visual design', provider: 'any' },
]

describe('useRecommendationWizard', () => {
  it('clears answers, progress, and completion when the wizard is closed', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.openWizard())
    act(() => result.current.setPreference('primaryGoal', 'coding-development'))
    act(() => result.current.setPreference('experienceLevel', 'beginner'))
    act(() => result.current.nextStep())
    act(() => result.current.completeWizard())

    expect(result.current.isOpen).toBe(true)
    expect(result.current.hasCompleted).toBe(true)
    expect(result.current.currentStepIndex).toBe(1)
    expect(result.current.preferences.primaryGoal).toBe('coding-development')

    act(() => result.current.closeWizard())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.preferences.primaryGoal).toBe('')
    expect(result.current.preferences.experienceLevel).toBe('')
    expect(result.current.preferences.categories).toEqual([])
    expect(result.current.results).toEqual([])
  })

  it('starts a fresh interaction after a completed session is closed', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.openWizard())
    act(() => result.current.setPreference('primaryGoal', 'coding-development'))
    act(() => result.current.nextStep())
    act(() => result.current.setPreference('experienceLevel', 'beginner'))
    act(() => result.current.completeWizard())
    act(() => result.current.closeWizard())

    act(() => result.current.openWizard())

    expect(result.current.isOpen).toBe(true)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.preferences.primaryGoal).toBe('')
  })
})
