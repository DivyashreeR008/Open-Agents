import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScheduler } from './useScheduler'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('useScheduler malformed jobs storage', () => {
  it('starts with no jobs when the stored value is an object', () => {
    localStorage.setItem('oa_scheduled_jobs', JSON.stringify({ not: 'an array' }))

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    expect(result.current.jobs).toEqual([])
  })
})
