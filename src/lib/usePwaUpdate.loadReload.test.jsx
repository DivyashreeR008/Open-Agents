import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

describe('usePwaUpdate load event and reload fallback', () => {
  let registration
  let serviceWorker
  let originalLocation

  beforeEach(() => {
    vi.stubEnv('MODE', 'development')
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'loading' })

    registration = {
      waiting: null,
      installing: null,
      addEventListener: vi.fn(),
    }
    serviceWorker = {
      controller: null,
      register: vi.fn().mockResolvedValue(registration),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    })

    originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: vi.fn() },
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('waits for the window load event before registering the worker', async () => {
    renderHook(() => usePwaUpdate())

    expect(serviceWorker.register).not.toHaveBeenCalled()
    act(() => {
      window.dispatchEvent(new Event('load'))
    })

    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalledWith('/sw.js'))
  })

  it('reloads the page when applyUpdate runs without a waiting worker', () => {
    const { result } = renderHook(() => usePwaUpdate())

    act(() => result.current.applyUpdate())

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
