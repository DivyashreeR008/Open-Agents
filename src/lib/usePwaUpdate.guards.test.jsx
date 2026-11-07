import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  if (originalServiceWorker) {
    Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker)
  } else {
    delete navigator.serviceWorker
  }
})

describe('usePwaUpdate guards', () => {
  it('does not touch the service worker API when the browser has none', () => {
    delete navigator.serviceWorker
    const addEventListener = vi.spyOn(window, 'addEventListener')

    const { result } = renderHook(() => usePwaUpdate())

    expect(result.current.updateAvailable).toBe(false)
    expect(result.current.waitingWorker).toBeNull()
    expect(addEventListener).not.toHaveBeenCalledWith('load', expect.any(Function))
  })

  it('skips automatic registration while the test environment is active', () => {
    const register = vi.fn()
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: {},
        register,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    })

    renderHook(() => usePwaUpdate())

    expect(register).not.toHaveBeenCalled()
  })
})
