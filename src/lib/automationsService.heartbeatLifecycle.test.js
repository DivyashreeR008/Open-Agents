import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  localStorage.setItem('oa_automations_v2', '[]')
  localStorage.setItem('oa_automation_runs_v2', '[]')
  vi.resetModules()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('automation engine heartbeat', () => {
  it('starts one interval and ignores a second init call', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    const { initAutomationEngine } = await import('./automationsService')

    initAutomationEngine()
    initAutomationEngine()

    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)

    await vi.advanceTimersByTimeAsync(60000)
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
  })
})
