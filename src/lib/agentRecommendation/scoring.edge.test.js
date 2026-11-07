import { afterEach, describe, expect, it } from 'vitest'
import { getMaxPossibleScore, recommendAgents, scoreAgent } from './scoring.js'
import {
  DEFAULT_RECOMMENDATION_WEIGHTS,
  EXTRA_PREFERENCE_OPTIONS,
  GOAL_OPTIONS,
} from './constants.js'

const baseGoalCount = GOAL_OPTIONS.length
const baseExtraCount = EXTRA_PREFERENCE_OPTIONS.length

afterEach(() => {
  GOAL_OPTIONS.length = baseGoalCount
  EXTRA_PREFERENCE_OPTIONS.length = baseExtraCount
})

describe('recommendation scoring edge inputs', () => {
  it('records a repeated free-text term once in matched signals', () => {
    const agent = {
      id: 'repeat-term-agent',
      name: 'Deploy Bot',
      description: 'Deployment helper.',
      category: 'Other',
    }

    const scored = scoreAgent(agent, { freeTextGoal: 'deploy deploy' })

    expect(scored.matchedSignals.freeTextTerms).toEqual(['deploy'])
  })

  it('preserves catalogue order when tied agents share the same name', () => {
    const first = { id: 'tie-first', name: 'Shared Agent', category: 'Shared Tools' }
    const second = { id: 'tie-second', name: 'Shared Agent', category: 'Shared Tools' }

    const ranked = recommendAgents([first, second], { categories: ['Shared Tools'] })

    expect(ranked.map((entry) => entry.agentId)).toEqual(['tie-first', 'tie-second'])
    expect(ranked[0].score).toBe(ranked[1].score)
  })

  it('ranks malformed agent records without crashing and drops unusable ones', () => {
    const ranked = recommendAgents(
      [
        null,
        undefined,
        { id: null, name: 'No Identifier' },
        {
          id: 'numeric-name',
          name: 42,
          description: undefined,
          category: 'Engineering',
          provider: null,
        },
        { id: 'empty-name', name: '', category: 'Engineering' },
      ],
      { categories: ['Engineering'] }
    )

    expect(ranked.map((entry) => entry.agentId)).toEqual(['empty-name', 'numeric-name'])
    expect(
      ranked.every((entry) => entry.score === DEFAULT_RECOMMENDATION_WEIGHTS.exactCategory)
    ).toBe(true)
    expect(ranked.every((entry) => !Object.hasOwn(entry, 'agent'))).toBe(true)
  })

  it('uses fallback keyword lists and tolerates a missing capability weight', () => {
    GOAL_OPTIONS.push({
      id: 'custom-edge-goal',
      label: 'Custom Edge',
      description: 'Edge-case goal.',
      categories: ['Custom Edge'],
      taskTypes: ['edgeTask'],
    })
    EXTRA_PREFERENCE_OPTIONS.push(
      { id: 'edge-tool', label: 'Edge Tool', capability: 'toolCalling' },
      { id: 'edge-unknown', label: 'Edge Unknown', capability: 'unknownCapability' }
    )

    const weightsWithoutCapability = {
      ...DEFAULT_RECOMMENDATION_WEIGHTS,
      capabilityKeyword: undefined,
    }
    const preferences = {
      primaryGoal: 'custom-edge-goal',
      extraPreferences: ['edge-tool', 'edge-unknown'],
    }
    const agent = {
      id: 'edge-agent',
      name: 'EdgeTask Worker',
      description: 'Handles api calls.',
      category: 'Custom Edge',
      provider: 'any',
    }

    const scored = scoreAgent(agent, preferences, weightsWithoutCapability)

    expect(scored.matchedSignals.taskTypes).toEqual(['edgeTask'])
    expect(scored.matchedSignals.capabilities).toEqual(['edge-tool'])
    expect(scored.score).toBe(
      DEFAULT_RECOMMENDATION_WEIGHTS.goalCategory + DEFAULT_RECOMMENDATION_WEIGHTS.taskType
    )
    expect(getMaxPossibleScore(preferences, weightsWithoutCapability)).toBe(scored.score)
  })
})
