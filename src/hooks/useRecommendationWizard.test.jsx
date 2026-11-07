import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRecommendationWizard } from './useRecommendationWizard'
import { GOAL_OPTIONS } from '../lib/agentRecommendation/constants'

vi.mock('../lib/agentRecommendation/scoring.js', () => ({
  recommendAgents: vi.fn(() => [{ id: 'recommended-agent' }]),
}))

const agents = [{ id: 'agent-one' }, { id: 'agent-two' }]

function runStep(callback) {
  let accepted
  act(() => {
    accepted = callback()
  })
  return accepted
}

describe('useRecommendationWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts closed on the first question with no results', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.results).toEqual([])
    expect(result.current.preferences).toMatchObject({
      primaryGoal: '',
      categories: [],
      experienceLevel: '',
      providerPreference: 'any',
      budgetPreference: 'balanced',
      extraPreferences: [],
      freeTextGoal: '',
    })
  })

  it('closes with a clean session so the next open starts fresh', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.openWizard())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.setPreference('freeTextGoal', 'prepare a launch'))
    act(() => result.current.closeWizard())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.preferences.freeTextGoal).toBe('')
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.errors).toEqual({})
  })

  it('rejects a missing goal and exposes a field-specific error', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    expect(runStep(() => result.current.nextStep())).toBe(false)
    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.errors.primaryGoal).toBe('Choose a goal to continue.')
  })

  it('replaces categories when the primary goal changes and clears the error', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))
    const goal = GOAL_OPTIONS[0]

    runStep(() => result.current.nextStep())
    act(() => result.current.setPreference('primaryGoal', goal.id))

    expect(result.current.preferences.primaryGoal).toBe(goal.id)
    expect(result.current.preferences.categories).toEqual(goal.categories)
    expect(result.current.errors.primaryGoal).toBeUndefined()
  })

  it('clears categories when an unknown goal is selected', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', 'not-a-goal'))

    expect(result.current.preferences.categories).toEqual([])
  })

  it('requires an experience level on the second question', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))
    expect(runStep(() => result.current.nextStep())).toBe(true)
    expect(result.current.currentStepIndex).toBe(1)

    expect(runStep(() => result.current.nextStep())).toBe(false)
    expect(result.current.errors.experienceLevel).toBe('Choose how much guidance you want.')

    act(() => result.current.setPreference('experienceLevel', 'intermediate'))
    expect(result.current.errors.experienceLevel).toBeUndefined()
    expect(runStep(() => result.current.nextStep())).toBe(true)
    expect(result.current.currentStepIndex).toBe(2)
  })

  it('moves through the later questions and stops at the final index', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))
    act(() => result.current.setPreference('experienceLevel', 'beginner'))
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    expect(result.current.currentStepIndex).toBe(4)

    expect(runStep(() => result.current.nextStep())).toBe(true)
    expect(result.current.currentStepIndex).toBe(4)
  })

  it('computes results only after the wizard is completed', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))
    act(() => result.current.setPreference('experienceLevel', 'advanced'))
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())

    expect(result.current.results).toEqual([])
    expect(runStep(() => result.current.completeWizard())).toBe(true)
    expect(result.current.hasCompleted).toBe(true)
    expect(result.current.results).toEqual([{ id: 'recommended-agent' }])
  })

  it('returns from results to the final question before stepping backwards', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))
    act(() => result.current.setPreference('experienceLevel', 'advanced'))
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    runStep(() => result.current.nextStep())
    runStep(() => result.current.completeWizard())

    act(() => result.current.previousStep())
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.currentStepIndex).toBe(4)

    act(() => result.current.previousStep())
    expect(result.current.currentStepIndex).toBe(3)
  })

  it('toggles extra preferences without creating duplicates', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.toggleExtraPreference('tool-calling'))
    act(() => result.current.toggleExtraPreference('vision-support'))
    expect(result.current.preferences.extraPreferences).toEqual(['tool-calling', 'vision-support'])

    act(() => result.current.toggleExtraPreference('tool-calling'))
    expect(result.current.preferences.extraPreferences).toEqual(['vision-support'])
  })

  it('refines answers without clearing preferences', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[1].id))
    act(() => result.current.setPreference('experienceLevel', 'advanced'))
    runStep(() => result.current.completeWizard())
    act(() => result.current.refineAnswers())

    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.currentStepIndex).toBe(4)
    expect(result.current.preferences.primaryGoal).toBe(GOAL_OPTIONS[1].id)
  })

  it('restores every default when the wizard is reset', () => {
    const { result } = renderHook(() => useRecommendationWizard(agents))

    act(() => result.current.setPreference('primaryGoal', GOAL_OPTIONS[0].id))
    act(() => result.current.setPreference('experienceLevel', 'advanced'))
    act(() => result.current.setPreference('freeTextGoal', 'draft a policy'))
    act(() => result.current.toggleExtraPreference('open-source'))
    runStep(() => result.current.nextStep())
    runStep(() => result.current.completeWizard())
    act(() => result.current.resetWizard())

    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.hasCompleted).toBe(false)
    expect(result.current.errors).toEqual({})
    expect(result.current.preferences).toEqual({
      primaryGoal: '',
      categories: [],
      experienceLevel: '',
      providerPreference: 'any',
      budgetPreference: 'balanced',
      extraPreferences: [],
      freeTextGoal: '',
    })
  })
})
