import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePromptHistory } from './usePromptHistory'

beforeEach(() => localStorage.clear())

describe('usePromptHistory agent name search', () => {
  it('matches an agent name even when the prompt text does not contain the query', () => {
    const { result } = renderHook(() => usePromptHistory())

    act(() => {
      result.current.savePrompt({ text: 'draft a plan', agentName: 'Gemini Helper' })
      result.current.savePrompt({ text: 'other text' })
    })

    expect(result.current.searchPrompts('gemini')).toHaveLength(1)
    expect(result.current.searchPrompts('gemini')[0].text).toBe('draft a plan')
  })
})
