import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePromptHistory } from './usePromptHistory'

beforeEach(() => localStorage.clear())

describe('usePromptHistory clear without favorites', () => {
  it('empties the library when no prompt is favorited', () => {
    const { result } = renderHook(() => usePromptHistory())

    act(() => {
      result.current.savePrompt({ text: 'one' })
      result.current.savePrompt({ text: 'two' })
      result.current.clearHistory()
    })

    expect(result.current.prompts).toEqual([])
    expect(result.current.favorites).toEqual([])
  })
})
