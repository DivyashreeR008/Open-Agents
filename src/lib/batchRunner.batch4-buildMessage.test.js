import { describe, expect, it } from 'vitest'
import { buildBatchUserMessage } from './batchRunner'

describe('batch user message assembly', () => {
  it('substitutes the batch field, joins arrays, and skips empty values', () => {
    const agent = {
      inputs: [
        { id: 'batch', label: 'Item' },
        { id: 'tags', label: 'Tags' },
        { id: 'empty', label: 'Empty' },
      ],
    }

    expect(
      buildBatchUserMessage(agent, { tags: ['a', 'b'], empty: '   ' }, 'batch', '  row value  ')
    ).toBe('Item: row value\n\nTags: a, b')
  })
})
