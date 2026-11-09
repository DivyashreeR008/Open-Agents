import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

describe('prompt history capacity with favorites', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('drops the oldest non-favorite and keeps every favorite at the limit', () => {
    vi.spyOn(Date, 'now').mockReturnValue(10_000)
    const prompts = [
      ...Array.from({ length: 2 }, (_, index) => ({
        id: `fav-${index}`,
        text: `Favorite ${index}`,
        favorite: true,
        createdAt: 100 + index,
      })),
      ...Array.from({ length: 98 }, (_, index) => ({
        id: `plain-${index}`,
        text: `Plain ${index}`,
        favorite: false,
        createdAt: 1000 - index,
      })),
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Newest prompt' }))

    expect(result.current.prompts).toHaveLength(100)
    expect(result.current.favorites).toHaveLength(2)
    expect(result.current.prompts.some((prompt) => prompt.id === 'fav-0')).toBe(true)
    expect(result.current.prompts.some((prompt) => prompt.id === 'fav-1')).toBe(true)
    expect(result.current.prompts[0].text).toBe('Newest prompt')
    expect(result.current.prompts.some((prompt) => prompt.id === 'plain-97')).toBe(false)
  })
})
