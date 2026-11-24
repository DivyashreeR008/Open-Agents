import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

afterEach(() => {
  localStorage.clear()
})

describe('usePromptHistory agent name search', () => {
  it('matches an agent name even when the prompt text does not contain the query', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'prompt-1',
          text: 'Explain quantum entanglement simply',
          agentId: 'physics-tutor',
          agentName: 'Physics Specialist',
          favorite: false,
          createdAt: 100,
        },
        {
          id: 'prompt-2',
          text: 'Summarize today headlines in five bullet points',
          agentId: 'news-brief',
          agentName: 'Daily Digest',
          favorite: false,
          createdAt: 200,
        },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())

    const matched = result.current.searchPrompts('Specialist')

    expect(matched).toHaveLength(1)
    expect(matched[0].id).toBe('prompt-1')
    expect(matched[0].agentName).toBe('Physics Specialist')
  })
})
