import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

describe('prompt history duplicate policy', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('allows the same text again after another prompt and keeps ids unique', () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000)
    const { result } = renderHook(() => usePromptHistory())

    act(() => result.current.savePrompt({ text: 'Alpha' }))
    act(() => result.current.savePrompt({ text: 'Beta' }))
    act(() => result.current.savePrompt({ text: 'Alpha' }))

    expect(result.current.prompts.map((prompt) => prompt.text)).toEqual(['Alpha', 'Beta', 'Alpha'])
    expect(new Set(result.current.prompts.map((prompt) => prompt.id)).size).toBe(3)
  })
})
