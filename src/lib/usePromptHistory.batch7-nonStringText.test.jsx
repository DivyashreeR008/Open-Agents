import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

afterEach(() => {
  localStorage.clear()
})

describe('usePromptHistory non-string text', () => {
  it('ignores a stored prompt whose text is not a string', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'num-text', text: 12345, createdAt: 1 },
        { id: 'null-text', text: null, createdAt: 2 },
        { id: 'arr-text', text: ['not', 'a', 'string'], createdAt: 3 },
        { id: 'obj-text', text: { query: 'nested' }, createdAt: 4 },
        { id: 'bool-text', text: true, createdAt: 5 },
        { id: 'valid-prompt', text: 'Valid prompt text', createdAt: 6 },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toHaveLength(1)
    expect(result.current.prompts[0]).toMatchObject({
      id: 'valid-prompt',
      text: 'Valid prompt text',
    })
  })
})
