import { describe, expect, it } from 'vitest'
import { buildBatchUserMessage } from './batchRunner'

describe('batch user message with falsy but meaningful values', () => {
  it('includes numeric zero and boolean false instead of dropping them', () => {
    const agent = {
      inputs: [
        { id: 'count', label: 'Count' },
        { id: 'flag', label: 'Flag' },
        { id: 'text', label: 'Text' },
      ],
    }

    const message = buildBatchUserMessage(
      agent,
      { count: 0, flag: false, text: 'hello' },
      'text',
      'batch item'
    )

    expect(message).toBe('Count: 0\n\nFlag: false\n\nText: batch item')
  })
})
