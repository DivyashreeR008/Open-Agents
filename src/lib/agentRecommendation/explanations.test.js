import { describe, expect, it } from 'vitest'
import { buildRecommendationReasons } from './explanations'

const agent = {
  category: 'Engineering',
  description: 'Reviews API changes and documents compatibility risks.',
}

const codingPreferences = { primaryGoal: 'coding-development' }

describe('buildRecommendationReasons', () => {
  it('explains a direct category match with the selected goal', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      exactCategory: true,
    })

    expect(reasons).toEqual(['Matches your coding and development workflow.'])
  })

  it('names a related category without repeating the category fallback', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      goalCategory: true,
    })

    expect(reasons).toContain('Listed in Engineering, a category related to this goal.')
    expect(reasons).not.toContain('Agent metadata identifies its focus as Engineering.')
  })

  it('turns matched task types into distinct task reasons', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      taskTypes: ['code', 'debug', 'technical'],
    })

    expect(reasons).toContain('Its metadata relates to coding tasks.')
    expect(reasons).toContain('Its stated focus includes debugging or troubleshooting.')
    expect(reasons).toContain('Its metadata relates to technical workflows.')
    expect(reasons.length).toBeLessThanOrEqual(4)
  })

  it('describes capability, provider, and free-text signals', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      capabilities: ['tool-calling'],
      provider: 'exact',
      freeTextTerms: ['release', 'migration', 'contract', 'ignored'],
    })

    expect(reasons).toContain('Its metadata suggests relevance to your tool calling preference.')
    expect(reasons).toContain('Aligns with your preferred provider.')
    expect(reasons).toContain('Matched terms from your goal: release, migration, contract.')
    expect(reasons.join(' ')).not.toContain('ignored')
  })

  it('describes provider compatibility separately from an exact provider match', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      provider: 'compatible',
    })

    expect(reasons).toContain('Uses flexible provider metadata compatible with your preference.')
    expect(reasons).not.toContain('Aligns with your preferred provider.')
  })

  it('explains budget and experience preferences', () => {
    const fastReasons = buildRecommendationReasons(agent, codingPreferences, {
      preference: 'fast',
      experience: 'beginner',
    })
    const capableReasons = buildRecommendationReasons(agent, codingPreferences, {
      preference: 'capable',
    })

    expect(fastReasons).toContain(
      'Its focused scope aligns with your fast, lightweight preference.'
    )
    expect(fastReasons).toContain('Its metadata aligns with your beginner guidance preference.')
    expect(capableReasons).toContain('Its detailed scope aligns with your capability preference.')
  })

  it('returns no evidence-free reasons when nothing matched', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {})

    expect(reasons).toEqual([])
  })

  it('still explains an agent that has no category or description', () => {
    const reasons = buildRecommendationReasons({}, codingPreferences, {
      exactCategory: true,
    })

    expect(reasons).toEqual(['Matches your coding and development workflow.'])
  })

  it('returns nothing when there is no goal and no matching signal', () => {
    expect(buildRecommendationReasons({}, {}, {})).toEqual([])
    expect(buildRecommendationReasons(undefined, {}, {})).toEqual([])
  })

  it('uses the generic workflow sentence for an unknown goal', () => {
    const reasons = buildRecommendationReasons(
      agent,
      { primaryGoal: 'unknown' },
      {
        exactCategory: true,
      }
    )

    expect(reasons[0]).toBe('Matches your selected workflow.')
  })

  it('collapses duplicate reasons and caps the list at four', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      taskTypes: ['code', 'code', 'debug', 'technical', 'review'],
      capabilities: ['tool-calling'],
    })

    expect(new Set(reasons).size).toBe(reasons.length)
    expect(reasons).toHaveLength(4)
  })

  it('ignores task and capability ids that have no explanation text', () => {
    const reasons = buildRecommendationReasons(agent, codingPreferences, {
      taskTypes: ['not-a-task'],
      capabilities: ['not-a-capability'],
    })

    expect(reasons).not.toContain('Its metadata relates to coding tasks.')
    expect(reasons.join(' ')).not.toContain('not-a-capability')
  })
})
