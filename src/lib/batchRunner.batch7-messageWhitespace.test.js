import { describe, expect, it } from 'vitest'
import { buildBatchUserMessage } from './batchRunner'

describe('buildBatchUserMessage whitespace handling', () => {
  it('trims scalar values and skips whitespace-only values', () => {
    const agent = {
      inputs: [
        { id: 'name', label: 'Name' },
        { id: 'notes', label: 'Notes' },
        { id: 'tags', label: 'Tags' },
      ],
    }

    expect(
      buildBatchUserMessage(agent, { name: '  Ada  ', notes: '   ', tags: [] }, 'name', 'Lovelace')
    ).toBe('Name: Lovelace')
  })
})
