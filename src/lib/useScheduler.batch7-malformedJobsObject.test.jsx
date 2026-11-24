import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useScheduler } from './useScheduler'

const STORAGE_KEY = 'oa_scheduled_jobs'

describe('useScheduler malformed jobs storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('starts with no jobs when the stored value is an object', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array', job: 'invalid' }))

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    expect(result.current.jobs).toEqual([])
    expect(Array.isArray(result.current.jobs)).toBe(true)
    expect(result.current.jobs).toHaveLength(0)
  })
})
