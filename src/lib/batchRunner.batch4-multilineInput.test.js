import { describe, expect, it } from 'vitest'
import { buildBatchUserMessage } from './batchRunner'

describe('batch prompt multiline values', () => {
  it('preserves internal line breaks and joins list values with commas', () => {
    const message = buildBatchUserMessage(
      {
        inputs: [
          { id: 'brief', label: 'Brief' },
          { id: 'sources', label: 'Sources' },
        ],
      },
      {
        brief: 'line one\nline two\n\nline four',
        sources: ['docs', 'tests'],
      },
      'topic',
      'unused'
    )

    expect(message).toBe('Brief: line one\nline two\n\nline four\n\nSources: docs, tests')
  })
})
