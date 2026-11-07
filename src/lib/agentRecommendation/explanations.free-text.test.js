import { describe, expect, it } from 'vitest'
import { buildRecommendationReasons } from './explanations'

describe('free-text evidence in recommendation reasons', () => {
  it('mentions only the first three matched terms', () => {
    const reasons = buildRecommendationReasons(
      { name: 'Writer' },
      { primaryGoal: 'writing-content' },
      { freeTextTerms: ['alpha', 'beta', 'gamma', 'delta'] }
    )

    expect(reasons.join(' ')).toContain('alpha, beta, gamma')
    expect(reasons.join(' ')).not.toContain('delta')
  })
})
