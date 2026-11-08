import { afterEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import usePromptHistory from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

afterEach(() => {
  localStorage.clear()
})

describe('usePromptHistory malformed storage', () => {
  it('treats a stored object as an empty prompt list', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }))

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toEqual([])
    expect(result.current.favorites).toEqual([])
    expect(result.current.searchPrompts('anything')).toEqual([])
  })

  it('drops non-object and textless entries from a stored array', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        null,
        42,
        'plain string',
        { id: 'missing-text' },
        { id: 'valid', text: 'Keep this prompt', favorite: false, createdAt: 1 },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toHaveLength(1)
    expect(result.current.prompts[0]).toMatchObject({ id: 'valid', text: 'Keep this prompt' })
    expect(result.current.searchPrompts('keep')).toHaveLength(1)
  })
})
