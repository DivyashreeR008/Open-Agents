import { describe, expect, it } from 'vitest'
import {
  getWorkflowStepInfo,
  getWorkflowStepSearchText,
  getWorkflowStepSummary,
} from './workflowStepDisplay'

const agents = [
  { id: 'a1', name: 'Router', category: 'Classification' },
  { id: 'a2', name: 'Writer', category: 'Writing' },
]

describe('workflow step display helpers', () => {
  it('keeps conditional entries structured and creates stable non-object keys', () => {
    const conditional = {
      type: 'conditional_branch',
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: { billing: ['a2'], default: ['a1'] },
    }

    const info = getWorkflowStepInfo(conditional, 1)
    expect(info.kind).toBe('conditional')
    expect(info.key).toBe('conditional-route-1')
    expect(info.labels).toEqual(['billing', 'default'])
    expect(String(info.key)).not.toContain('[object Object]')
  })

  it('degrades malformed entries without stringifying them', () => {
    expect(getWorkflowStepInfo(null, 2)).toMatchObject({
      kind: 'malformed',
      key: 'invalid-step-2',
    })
    expect(getWorkflowStepInfo({ nope: true }, 3).kind).toBe('malformed')
    expect(getWorkflowStepInfo(42, 4).kind).toBe('malformed')
  })

  it('summarizes conditional entries as steps instead of agents', () => {
    const summary = getWorkflowStepSummary([
      'a1',
      {
        type: 'conditional_branch',
        id: 'route',
        condition: 'x',
        branches: { default: ['a2'] },
      },
    ])

    expect(summary.label).toBe('2 steps')
    expect(summary.conditionalCount).toBe(1)
  })

  it('includes condition, branch labels, and branch agent text in search', () => {
    const searchText = getWorkflowStepSearchText(
      {
        type: 'conditional_branch',
        id: 'route',
        condition: '{{ steps.classify.output }}',
        branches: { billing: ['a2'], default: ['a1'] },
      },
      agents
    )

    expect(searchText).toContain('billing')
    expect(searchText).toContain('Writing')
    expect(searchText).toContain('Classification')
  })
})
