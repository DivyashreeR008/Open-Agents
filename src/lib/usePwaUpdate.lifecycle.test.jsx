import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaUpdate } from './usePwaUpdate'

function worker() {
  return {
    state: 'installed',
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
  }
}

describe('usePwaUpdate lifecycle', () => {
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
      controller: {},
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

  it('announces a waiting worker after registration', async () => {
    const { result } = renderHook(() => usePwaUpdate())

    await waitFor(() => expect(serviceWorker.register).toHaveBeenCalledWith('/sw.js'))
    await waitFor(() => expect(result.current.updateAvailable).toBe(true))
  })

  it('shows a later update after an earlier notice was dismissed', async () => {
    const { result } = renderHook(() => usePwaUpdate())
    await waitFor(() => expect(result.current.updateAvailable).toBe(true))

    act(() => result.current.dismiss())
    expect(result.current.updateAvailable).toBe(false)

    const nextWorker = worker()
    nextWorker.state = 'installing'
    registration.installing = nextWorker
    act(() => updateFound())
    const stateChange = nextWorker.addEventListener.mock.calls.find(
      ([event]) => event === 'statechange'
    )[1]
    nextWorker.state = 'installed'
    act(() => stateChange())

    expect(result.current.updateAvailable).toBe(true)
    expect(result.current.waitingWorker).toBe(nextWorker)
  })

  it('posts the skip message to the waiting worker', async () => {
    const { result } = renderHook(() => usePwaUpdate())
    await waitFor(() => expect(result.current.updateAvailable).toBe(true))

    act(() => result.current.applyUpdate())

    expect(registration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
  })
})
