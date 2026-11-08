// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sendResendNotification } from './automationsService'

const EMAIL_LOGS_KEY = 'oa_automation_email_logs_v2'

beforeEach(() => {
  localStorage.clear()
  vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('automation email HTML safety', () => {
  it('escapes user-controlled values before they reach the email body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    await sendResendNotification({
      to: 'user@example.com',
      automationName: '<img src=x onerror=alert(1)>',
      agentName: '<script>alert(1)</script>',
      output: '<b>bold</b> & "quoted"',
      status: 'success',
      duration: 1200,
      error: null,
    })

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(payload.html).not.toContain('<img src=x')
    expect(payload.html).not.toContain('<script>')
    expect(payload.html).not.toContain('<b>bold</b>')
    expect(payload.html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(payload.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(payload.html).toContain('&lt;b&gt;bold&lt;/b&gt; &amp; &quot;quoted&quot;')
  })

  it('escapes an error message used as the body when there is no output', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    await sendResendNotification({
      to: 'user@example.com',
      automationName: 'Safe name',
      agentName: 'Safe agent',
      output: '',
      status: 'failed',
      duration: 500,
      error: '<svg onload=alert(1)>',
    })

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(payload.html).not.toContain('<svg onload')
    expect(payload.html).toContain('&lt;svg onload=alert(1)&gt;')
  })

  it('still records the local delivery log without the remote API', async () => {
    vi.unstubAllEnvs()
    await sendResendNotification({
      to: 'user@example.com',
      automationName: 'Local only',
      agentName: 'Agent',
      output: 'done',
      status: 'success',
      duration: 100,
      error: null,
    })

    const logs = JSON.parse(localStorage.getItem(EMAIL_LOGS_KEY))
    expect(logs[0]).toMatchObject({
      to: 'user@example.com',
      automationName: 'Local only',
      status: 'Delivered',
    })
  })
})
