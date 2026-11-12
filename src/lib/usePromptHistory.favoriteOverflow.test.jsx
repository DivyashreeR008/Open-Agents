import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

function favorite(index) {
  return {
    id: `fav-${index}`,
    text: `Favorite ${index}`,
    favorite: true,
    createdAt: 1000 + index,
  }
}

function storedPrompts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY))
}

describe('prompt history when favorites consume the cap', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('retains a newly saved prompt even when favorites already fill the limit', () => {
    const favorites = Array.from({ length: 100 }, (_, index) => favorite(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    vi.spyOn(Date, 'now').mockReturnValue(5000)

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Newest prompt' }))

    expect(result.current.prompts).toHaveLength(101)
    expect(result.current.prompts[0].text).toBe('Newest prompt')
    expect(result.current.favorites).toHaveLength(100)
    expect(result.current.searchPrompts('newest').map((prompt) => prompt.text)).toEqual([
      'Newest prompt',
    ])
    expect(storedPrompts()[0].text).toBe('Newest prompt')
  })

  it('keeps favorites that exceed the limit from existing storage', () => {
    const favorites = Array.from({ length: 105 }, (_, index) => favorite(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    vi.spyOn(Date, 'now').mockReturnValue(6000)

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Saved after legacy overflow' }))

    expect(result.current.prompts).toHaveLength(106)
    expect(result.current.favorites).toHaveLength(105)
    expect(result.current.prompts[0].text).toBe('Saved after legacy overflow')
  })

  it('uses the last free slot without exceeding the cap when favorites leave room', () => {
    const prompts = [
      ...Array.from({ length: 99 }, (_, index) => favorite(index)),
      { id: 'plain-1', text: 'Older prompt', favorite: false, createdAt: 900 },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
    vi.spyOn(Date, 'now').mockReturnValue(7000)

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Fills the final slot' }))

    expect(result.current.prompts).toHaveLength(100)
    expect(result.current.favorites).toHaveLength(99)
    expect(result.current.prompts[0].text).toBe('Fills the final slot')
    expect(result.current.prompts.some((prompt) => prompt.id === 'plain-1')).toBe(false)
  })

  it('drops the previous non-favorite on the next save rather than a favorite', () => {
    const favorites = Array.from({ length: 100 }, (_, index) => favorite(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    const { result } = renderHook(() => usePromptHistory())

    vi.spyOn(Date, 'now').mockReturnValueOnce(8000).mockReturnValueOnce(8000)
    act(() => result.current.savePrompt({ text: 'First overflow' }))
    vi.spyOn(Date, 'now').mockReturnValueOnce(9000).mockReturnValueOnce(9000)
    act(() => result.current.savePrompt({ text: 'Second overflow' }))

    expect(result.current.prompts).toHaveLength(101)
    expect(result.current.favorites).toHaveLength(100)
    expect(result.current.prompts[0].text).toBe('Second overflow')
    expect(result.current.prompts.some((prompt) => prompt.text === 'First overflow')).toBe(false)
  })
})
