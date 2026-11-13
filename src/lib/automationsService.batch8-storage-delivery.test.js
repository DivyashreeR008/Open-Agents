// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getEmailLogs,
  loadAutomations,
  loadRuns,
  sendResendNotification,
} from './automationsService'

beforeEach(() => {
  localStorage.clear()
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('automation storage shape recovery', () => {
  it('replaces an object automation store with the seed list', () => {
    localStorage.setItem('oa_automations_v2', JSON.stringify({ id: 'not-a-list' }))

    const automations = loadAutomations()

    expect(Array.isArray(automations)).toBe(true)
    expect(automations[0]).toHaveProperty('id')
    expect(JSON.parse(localStorage.getItem('oa_automations_v2'))).toEqual(automations)
  })

  it('rejects run lists containing primitive entries', () => {
    localStorage.setItem('oa_automation_runs_v2', JSON.stringify([null, 'bad']))

    const runs = loadRuns()

    expect(Array.isArray(runs)).toBe(true)
    expect(runs[0]).toHaveProperty('automationId')
  })
})

describe('notification delivery truthfulness', () => {
  const run = {
    to: 'owner@example.com',
    automationName: 'Daily digest',
    agentName: 'Research Agent',
    output: 'Three findings',
    status: 'success',
    duration: 900,
  }

  it('does not claim delivery without a sending credential', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const entry = await sendResendNotification(run)

    expect(entry).toMatchObject({
      status: 'Not sent',
      delivered: false,
      deliveryError: 'No email sending credential is configured.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(getEmailLogs()).toEqual([entry])
  })

  it('only records Delivered after the service accepts the message', async () => {
    vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const entry = await sendResendNotification(run)

    expect(entry).toMatchObject({ status: 'Delivered', delivered: true, deliveryError: null })
  })
})
