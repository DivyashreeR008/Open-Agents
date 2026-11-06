import { describe, expect, it } from 'vitest'
import {
  BUDGET_OPTIONS,
  DEFAULT_RECOMMENDATION_WEIGHTS,
  EXPERIENCE_OPTIONS,
  EXTRA_PREFERENCE_OPTIONS,
  GOAL_OPTIONS,
  MIN_CONFIDENT_SCORE,
  PROVIDER_OPTIONS,
  RESULT_LIMIT,
  STOP_WORDS,
} from './constants'

const optionGroups = {
  goals: GOAL_OPTIONS,
  experience: EXPERIENCE_OPTIONS,
  provider: PROVIDER_OPTIONS,
  budget: BUDGET_OPTIONS,
  extraPreference: EXTRA_PREFERENCE_OPTIONS,
}

describe('recommendation option contract', () => {
  it('keeps every option id and label unique and non-empty', () => {
    for (const [groupName, options] of Object.entries(optionGroups)) {
      expect(options.length, groupName).toBeGreaterThan(0)
      expect(new Set(options.map((option) => option.id)).size, `${groupName} ids`).toBe(
        options.length
      )
      expect(new Set(options.map((option) => option.label)).size, `${groupName} labels`).toBe(
        options.length
      )

      for (const option of options) {
        expect(option.id.trim().length, `${groupName} id`).toBeGreaterThan(0)
        expect(option.label.trim().length, `${groupName} label`).toBeGreaterThan(0)
      }
    }
  })

  it('defines the public goal ids and labels in order', () => {
    expect(GOAL_OPTIONS.map((goal) => goal.id)).toEqual([
      'coding-development',
      'research-analysis',
      'writing-content',
      'automation',
      'data-analysis',
      'image-generation',
      'learning',
      'business-productivity',
    ])
    expect(GOAL_OPTIONS.map((goal) => goal.label)).toEqual([
      'Coding & Development',
      'Research & Analysis',
      'Writing & Content',
      'Automation',
      'Data Analysis',
      'Image Generation',
      'Learning',
      'Business & Productivity',
    ])
  })

  it('gives every goal a description, icon, category set, and task set', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(typeof goal.description).toBe('string')
      expect(goal.description.trim().length).toBeGreaterThan(0)
      expect(goal.icon).toBeTruthy()
      expect(goal.categories.length).toBeGreaterThan(0)
      expect(goal.taskTypes.length).toBeGreaterThan(0)
      expect(goal.categories.every((category) => typeof category === 'string')).toBe(true)
      expect(goal.taskTypes.every((task) => typeof task === 'string')).toBe(true)
    }
  })

  it('defines the wizard defaults used by the hook', () => {
    expect(EXPERIENCE_OPTIONS.map((option) => option.id)).toEqual([
      'beginner',
      'intermediate',
      'advanced',
      'any',
    ])
    expect(PROVIDER_OPTIONS.map((option) => option.id)).toEqual([
      'any',
      'openai',
      'anthropic',
      'gemini',
    ])
    expect(BUDGET_OPTIONS.map((option) => option.id)).toEqual([
      'fast',
      'balanced',
      'capable',
      'any',
    ])
    expect(EXTRA_PREFERENCE_OPTIONS.map((option) => option.capability)).toEqual([
      'toolCalling',
      'fastResponses',
      'visionSupport',
      'structuredOutput',
      'openSource',
      'frequentlyUpdated',
    ])
  })

  it('keeps scoring weights and thresholds positive', () => {
    expect(Number.isInteger(RESULT_LIMIT)).toBe(true)
    expect(RESULT_LIMIT).toBeGreaterThan(0)
    expect(Number.isInteger(MIN_CONFIDENT_SCORE)).toBe(true)
    expect(MIN_CONFIDENT_SCORE).toBeGreaterThan(0)

    expect(Object.keys(DEFAULT_RECOMMENDATION_WEIGHTS)).toEqual([
      'exactCategory',
      'goalCategory',
      'taskType',
      'providerExact',
      'providerAny',
      'freeTextName',
      'freeTextDescription',
      'experience',
      'urgency',
      'capabilityKeyword',
    ])
    for (const [signal, weight] of Object.entries(DEFAULT_RECOMMENDATION_WEIGHTS)) {
      expect(Number.isFinite(weight), signal).toBe(true)
      expect(weight, signal).toBeGreaterThan(0)
    }
  })

  it('keeps the stop-word set non-empty, lowercase, and free of duplicates', () => {
    expect(STOP_WORDS).toBeInstanceOf(Set)
    expect(STOP_WORDS.size).toBeGreaterThan(0)

    for (const word of STOP_WORDS) {
      expect(word).toBe(word.toLowerCase())
      expect(word.trim()).toBe(word)
      expect(word.length).toBeGreaterThan(0)
    }
    expect(STOP_WORDS.has('the')).toBe(true)
    expect(STOP_WORDS.has('please')).toBe(true)
  })
})
