import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePromptHistory clear without favorites', () => {
  it('empties the library when no prompt is favorited', () => {
    const nonFavoritePrompts = [
      { id: 'p1', text: 'Prompt 1', favorite: false, createdAt: 1000 },
      { id: 'p2', text: 'Prompt 2', favorite: false, createdAt: 2000 },
      { id: 'p3', text: 'Prompt 3', favorite: false, createdAt: 3000 },
    ]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nonFavoritePrompts))

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toHaveLength(3)
    expect(result.current.favorites).toHaveLength(0)

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.prompts).toEqual([])
    expect(result.current.favorites).toEqual([])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toEqual([])
  })

  it('keeps only favorited prompts when clearing history with mixed favorites', () => {
    const mixedPrompts = [
      { id: 'p1', text: 'Regular Prompt', favorite: false, createdAt: 1000 },
      { id: 'p2', text: 'Favorited Prompt', favorite: true, createdAt: 2000 },
    ]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mixedPrompts))

    const { result } = renderHook(() => usePromptHistory())

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.prompts).toHaveLength(1)
    expect(result.current.prompts[0].id).toBe('p2')
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe('p2')
  })
})
