import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

afterEach(() => {
  localStorage.clear()
})

describe('usePromptHistory edge cases', () => {
  it('searches prompt text and agent names case-insensitively and ignores blank queries', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'p1',
          text: 'Compare pricing pages',
          agentName: 'Researcher',
          favorite: false,
          createdAt: 2,
        },
        {
          id: 'p2',
          text: 'Write a launch note',
          agentName: 'Writer',
          favorite: true,
          createdAt: 1,
        },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.searchPrompts('   ')).toHaveLength(2)
    expect(result.current.searchPrompts('PRICING').map((p) => p.id)).toEqual(['p1'])
    expect(result.current.searchPrompts('writer').map((p) => p.id)).toEqual(['p2'])
    expect(result.current.searchPrompts('absent')).toEqual([])
  })

  it('removes one prompt without disturbing favorites or the persisted list', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'p1', text: 'Keep me', agentName: 'Writer', favorite: true, createdAt: 2 },
        { id: 'p2', text: 'Delete me', agentName: 'Writer', favorite: false, createdAt: 1 },
      ])
    )

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.deletePrompt('p2'))

    expect(result.current.prompts.map((p) => p.id)).toEqual(['p1'])
    expect(result.current.favorites.map((p) => p.id)).toEqual(['p1'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1)
  })
})
