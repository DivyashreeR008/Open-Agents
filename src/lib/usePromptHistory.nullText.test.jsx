import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

beforeEach(() => {
  localStorage.clear()
})

describe('usePromptHistory null text', () => {
  it('rejects a null prompt without touching storage', () => {
    const { result } = renderHook(() => usePromptHistory())

    let saved
    act(() => {
      saved = result.current.savePrompt({ text: null })
    })

    expect(saved).toBeNull()
    expect(result.current.prompts).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
