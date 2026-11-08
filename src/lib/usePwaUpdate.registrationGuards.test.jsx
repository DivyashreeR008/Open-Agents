import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

function worker(state = 'installed') {
  return {
    state,
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
  }
}

describe('usePwaUpdate registration guards', () => {
  let registration
  let serviceWorker
  let updateFound

  beforeEach(() => {
    vi.stubEnv('MODE', 'development')
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' })

    registration = {
      waiting: worker(),
      installing: null,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'updatefound') updateFound = handler
      }),
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
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('ignores a waiting worker when no controller is active', async () => {
    const { result } = renderHook(() => usePwaUpdate())
    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalled())

    expect(result.current.updateAvailable).toBe(false)
    expect(result.current.waitingWorker).toBeNull()
  })

  it('ignores update events without an installing worker or active controller', async () => {
    const { result } = renderHook(() => usePwaUpdate())
    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalled())

    act(() => updateFound())
    expect(result.current.updateAvailable).toBe(false)

    const nextWorker = worker('installing')
    registration.installing = nextWorker
    act(() => updateFound())
    const stateChange = nextWorker.addEventListener.mock.calls.find(
      ([event]) => event === 'statechange'
    )[1]
    nextWorker.state = 'installed'
    act(() => stateChange())

    expect(result.current.updateAvailable).toBe(false)
  })

  it('swallows a failed service worker registration', async () => {
    serviceWorker.register.mockRejectedValue(new Error('blocked'))

    const { result } = renderHook(() => usePwaUpdate())
    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalled())

    expect(result.current.updateAvailable).toBe(false)
  })
})
