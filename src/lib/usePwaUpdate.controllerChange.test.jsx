import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

describe('usePwaUpdate controller change', () => {
  let serviceWorker
  let controllerChange
  let originalLocation

  beforeEach(() => {
    vi.stubEnv('MODE', 'development')
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' })

    serviceWorker = {
      controller: {},
      register: vi.fn().mockResolvedValue({
        waiting: null,
        installing: null,
        addEventListener: vi.fn(),
      }),
      addEventListener: vi.fn((event, handler) => {
        if (event === 'controllerchange') controllerChange = handler
      }),
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

  it('reloads exactly once when the active worker changes', async () => {
    renderHook(() => usePwaUpdate())
    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalledWith('/sw.js'))

    act(() => controllerChange())
    act(() => controllerChange())

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
