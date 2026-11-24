import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')

afterEach(() => {
  vi.restoreAllMocks()
  if (originalServiceWorker) {
    Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker)
  } else {
    delete navigator.serviceWorker
  }
})

describe('usePwaUpdate missing service worker', () => {
  it('renders the idle state when service workers are unavailable', () => {
    delete navigator.serviceWorker

    const { result } = renderHook(() => usePwaUpdate())

    expect(result.current.updateAvailable).toBe(false)
    expect(result.current.waitingWorker).toBeNull()
    expect(typeof result.current.applyUpdate).toBe('function')
    expect(typeof result.current.dismiss).toBe('function')
  })
})
