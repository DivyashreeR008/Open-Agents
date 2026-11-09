import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

describe('usePromptHistory id collisions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('keeps two prompts saved in the same millisecond independently addressable', () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000)
    const { result } = renderHook(() => usePromptHistory())

    act(() => result.current.savePrompt({ text: 'First prompt' }))
    act(() => result.current.savePrompt({ text: 'Second prompt' }))

    expect(result.current.prompts.map((prompt) => prompt.id)).toEqual([
      'prompt_5000_1',
      'prompt_5000',
    ])

    act(() => result.current.toggleFavorite('prompt_5000_1'))
    act(() => result.current.deletePrompt('prompt_5000'))

    expect(result.current.prompts).toHaveLength(1)
    expect(result.current.prompts[0]).toMatchObject({
      id: 'prompt_5000_1',
      text: 'Second prompt',
      favorite: true,
    })
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1)
  })
})
