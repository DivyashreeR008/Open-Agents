import { describe, expect, it } from 'vitest'
import { buildBatchUserMessage } from './batchRunner'

describe('batch prompt with blank values', () => {
  it('returns an empty message when the batch item and fixed inputs are blank', () => {
    const message = buildBatchUserMessage(
      {
        inputs: [
          { id: 'topic', label: 'Topic' },
          { id: 'notes', label: 'Notes' },
        ],
      },
      { topic: '   ', notes: '\n\t' },
      'topic',
      '   '
    )

    expect(message).toBe('')
  })
})
