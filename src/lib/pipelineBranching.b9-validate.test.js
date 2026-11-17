import { describe, expect, it } from 'vitest'
import { DEFAULT_BRANCH, validateConditionalStep } from './pipelineBranching'

describe('conditional branch validation de-duplication', () => {
  it('reports a repeated self-reference once', () => {
    const step = {
      id: 'route',
      condition: '{{ input }}',
      branches: { [DEFAULT_BRANCH]: ['route', 'route'] },
    }

    const problems = validateConditionalStep(step, [step])

    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('directly references the conditional step itself')
  })

  it('rejects malformed branch maps and non-object steps', () => {
    expect(validateConditionalStep(null)).toEqual(['Conditional step must be an object.'])
    expect(
      validateConditionalStep({
        id: 'route',
        condition: '{{ input }}',
        branches: ['billing'],
      })
    ).toContain('Conditional step defines no branches.')
  })

  it('rejects branch entries that are not usable agent ids', () => {
    const problems = validateConditionalStep({
      id: 'route',
      condition: '{{ input }}',
      branches: {
        billing: ['refund-writer', '', 42],
        [DEFAULT_BRANCH]: ['fallback-writer'],
      },
    })

    expect(problems).toEqual(['Branch "billing" contains an invalid agent id.'])
  })

  it('keeps every distinct problem for multi-branch cycles', () => {
    const step = {
      id: 'route',
      condition: '{{ input }}',
      branches: {
        billing: ['route'],
        technical: ['route'],
        [DEFAULT_BRANCH]: ['fallback-writer'],
      },
    }

    const problems = validateConditionalStep(step, [step])

    expect(problems.filter((problem) => problem.includes('directly references'))).toHaveLength(2)
    expect(new Set(problems).size).toBe(problems.length)
  })
})
