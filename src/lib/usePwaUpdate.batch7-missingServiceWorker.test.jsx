import { afterEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePwaUpdate } from './usePwaUpdate'

const descriptor = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')

afterEach(() => {
  if (descriptor) Object.defineProperty(navigator, 'serviceWorker', descriptor)
  else delete navigator.serviceWorker
})

describe('usePwaUpdate without a service worker', () => {
  it('renders the idle state when service workers are unavailable', () => {
    delete navigator.serviceWorker

    const { result } = renderHook(() => usePwaUpdate())

    expect(result.current.updateAvailable).toBe(false)
    expect(result.current.waitingWorker).toBeNull()
  })
})
