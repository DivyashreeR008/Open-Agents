import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePromptHistory } from './usePromptHistory'

const STORAGE_KEY = 'oa_prompt_history'

function seed(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('usePromptHistory favorites and persistence failures', () => {
  it('flips a favorite flag in state and storage', () => {
    seed([
      { id: 'p1', text: 'Keep this prompt', agentName: 'Writer', favorite: false, createdAt: 2 },
    ])

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.toggleFavorite('p1'))

    expect(result.current.prompts[0].favorite).toBe(true)
    expect(result.current.favorites.map((entry) => entry.id)).toEqual(['p1'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].favorite).toBe(true)
  })

  it('returns the trimmed prompt and logs when the quota is exceeded', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    })

    const { result } = renderHook(() => usePromptHistory())
    let saved
    act(() => {
      saved = result.current.savePrompt({ text: '  Unsaved but visible  ', agentName: 'Writer' })
    })

    expect(saved.text).toBe('Unsaved but visible')
    expect(errorSpy).toHaveBeenCalledWith(
      'LocalStorage quota exceeded. Prompt history might be truncated.'
    )
  })

  it('reports a non-quota storage error with the generic message', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('storage unavailable')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw failure
    })

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Another prompt' }))

    expect(errorSpy).toHaveBeenCalledWith('Error saving prompt history to localStorage:', failure)
  })

  it('ignores storage events for other keys and reloads matching ones', () => {
    seed([{ id: 'p1', text: 'First prompt', agentName: 'Writer', favorite: false, createdAt: 1 }])
    const { result } = renderHook(() => usePromptHistory())

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'p2', text: 'Second prompt', agentName: 'Writer', favorite: false, createdAt: 2 },
      ])
    )

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated_key' }))
    })
    expect(result.current.prompts.map((entry) => entry.id)).toEqual(['p1'])

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    })
    expect(result.current.prompts.map((entry) => entry.id)).toEqual(['p2'])
  })
})
