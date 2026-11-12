import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePromptHistory } from './usePromptHistory'

beforeEach(() => localStorage.clear())

describe('usePromptHistory malformed text', () => {
  it('ignores a stored prompt whose text is not a string', () => {
    localStorage.setItem(
      'oa_prompt_history',
      JSON.stringify([
        { id: 'p1', text: 42 },
        { id: 'p2', text: 'kept' },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts.map((prompt) => prompt.id)).toEqual(['p2'])
  })
})
