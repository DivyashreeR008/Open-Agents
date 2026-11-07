import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useHistory } from './useHistory'

const STORAGE_KEY = 'OpenAgents_history'
const run = (id) => ({ id, agentId: id, agentName: id, output: 'done', timestamp: 1 })

describe('useHistory cross-tab clear events', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reloads history when another tab clears all storage', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([run('before-clear')]))
    const { result } = renderHook(() => useHistory())

    expect(result.current.history.map((entry) => entry.id)).toEqual(['before-clear'])

    localStorage.setItem(STORAGE_KEY, JSON.stringify([run('after-clear')]))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: null, newValue: null }))
    })

    await waitFor(() => {
      expect(result.current.history.map((entry) => entry.id)).toEqual(['after-clear'])
    })
  })

  it('continues to sync events for the history key itself', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([run('first')]))
    const { result } = renderHook(() => useHistory())

    localStorage.setItem(STORAGE_KEY, JSON.stringify([run('second')]))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: 'changed' }))
    })

    await waitFor(() => {
      expect(result.current.history.map((entry) => entry.id)).toEqual(['second'])
    })
  })
})
