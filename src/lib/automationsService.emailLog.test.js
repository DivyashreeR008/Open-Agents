// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getEmailLogs, sendResendNotification } from './automationsService'

const EMAIL_LOGS_KEY = 'oa_automation_email_logs_v2'

describe('automation email delivery log', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('records a delivered run and truncates a long output preview', async () => {
    const output = 'A'.repeat(240)

    const entry = await sendResendNotification({
      to: 'owner@example.com',
      automationName: 'Daily digest',
      agentName: 'Research Agent',
      output,
      status: 'success',
      duration: 4200,
    })

    expect(entry).toMatchObject({
      to: 'owner@example.com',
      automationName: 'Daily digest',
      agentName: 'Research Agent',
      status: 'Delivered',
      subject: '[Open Agents Hub] Completed: Daily digest',
      preview: `${'A'.repeat(180)}...`,
    })
    expect(entry.id).toMatch(/^email_/)
    expect(getEmailLogs()).toEqual([entry])
  })

  it('marks a failed run and falls back to the error text in the preview', async () => {
    const entry = await sendResendNotification({
      to: 'owner@example.com',
      automationName: 'Nightly audit',
      agentName: 'Code Reviewer',
      output: '',
      status: 'failed',
      duration: 80,
      error: 'Provider returned 503',
    })

    expect(entry.runStatus).toBe('failed')
    expect(entry.status).toBe('Delivered')
    expect(entry.subject).toBe('[Open Agents Hub] Failed: Nightly audit')
    expect(entry.preview).toBe('Provider returned 503')
  })

  it('keeps only the fifty most recent deliveries', async () => {
    const existing = Array.from({ length: 55 }, (_, index) => ({
      id: `old_${index}`,
      sentAt: index,
    }))
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(existing))

    await sendResendNotification({
      to: 'owner@example.com',
      automationName: 'Hourly check',
      agentName: 'Agent',
      output: 'ok',
      status: 'success',
      duration: 10,
    })

    const logs = getEmailLogs()
    expect(logs).toHaveLength(50)
    expect(logs[0].automationName).toBe('Hourly check')
    expect(logs.some((log) => log.id === 'old_54')).toBe(false)
  })

  it('survives a corrupt log and reports an empty history', async () => {
    localStorage.setItem(EMAIL_LOGS_KEY, '{not-json')

    await expect(
      sendResendNotification({
        to: 'owner@example.com',
        automationName: 'Recovery run',
        agentName: 'Agent',
        output: '',
        status: 'failed',
        duration: 0,
        error: 'boom',
      })
    ).resolves.toMatchObject({ automationName: 'Recovery run' })
    expect(getEmailLogs()).toHaveLength(1)

    localStorage.setItem(EMAIL_LOGS_KEY, '{still-not-json')
    expect(getEmailLogs()).toEqual([])
  })
})
