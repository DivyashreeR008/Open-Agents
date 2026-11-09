import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

describe('prompt history missing favorite id', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('leaves the list unchanged when the favorite target is absent', () => {
    const { result } = renderHook(() => usePromptHistory())

    act(() => result.current.savePrompt({ text: 'Keep me' }))
    const before = result.current.prompts

    act(() => result.current.toggleFavorite('missing-id'))

    expect(result.current.prompts).toEqual(before)
    expect(result.current.prompts[0].favorite).toBe(false)
  })
})
