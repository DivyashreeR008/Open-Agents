// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getEmailLogs, sendResendNotification } from './automationsService'

const EMAIL_LOGS_KEY = 'oa_automation_email_logs_v2'

beforeEach(() => {
  localStorage.clear()
  vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  localStorage.clear()
})

const base = {
  to: 'user@example.com',
  automationName: 'Daily digest',
  agentName: 'Agent',
  status: 'success',
  duration: 1500,
  error: null,
}

describe('email preview and status fallbacks', () => {
  it('truncates a long output to the preview length', async () => {
    const output = 'x'.repeat(300)
    const log = await sendResendNotification({ ...base, output })
    expect(log.preview).toBe(`${'x'.repeat(180)}...`)
  })

  it('uses the error text when there is no output', async () => {
    const log = await sendResendNotification({
      ...base,
      output: '',
      status: 'failed',
      error: 'Provider unavailable',
    })
    expect(log.preview).toBe('Provider unavailable')
    expect(log.runStatus).toBe('failed')
    expect(log.status).toBe('Delivered')
    expect(log.subject).toContain('Failed: Daily digest')
  })

  it('uses a readable fallback when neither output nor error exists', async () => {
    const log = await sendResendNotification({ ...base, output: '', error: null })
    expect(log.preview).toBe('Run finished')
    expect(log.status).toBe('Delivered')
    expect(log.subject).toContain('Completed: Daily digest')
  })

  it('replaces a non-array email log store with a fresh log', async () => {
    localStorage.setItem(EMAIL_LOGS_KEY, '"not-an-array"')
    await sendResendNotification({ ...base, output: 'ok' })
    expect(getEmailLogs()).toHaveLength(1)
  })

  it('keeps the newest 50 delivery records', async () => {
    const existing = Array.from({ length: 60 }, (_, index) => ({ id: `old-${index}` }))
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(existing))

    await sendResendNotification({ ...base, output: 'ok' })

    const logs = getEmailLogs()
    expect(logs).toHaveLength(50)
    expect(logs[0].automationName).toBe('Daily digest')
    expect(logs.some((entry) => entry.id === 'old-48')).toBe(true)
    expect(logs.some((entry) => entry.id === 'old-49')).toBe(false)
  })
})
