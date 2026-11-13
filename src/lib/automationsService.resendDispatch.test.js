// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getEmailLogs, sendResendNotification } from './automationsService'

const BASE_RUN = {
  to: 'owner@example.com',
  automationName: 'Daily digest',
  agentName: 'Research Agent',
  output: 'Three findings',
  status: 'success',
  duration: 4200,
}

describe('Resend notification dispatch', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('posts the report to Resend with the configured key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await sendResendNotification(BASE_RUN)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe('Bearer re_test_key')

    const body = JSON.parse(options.body)
    expect(body.from).toBe('Open Agents Hub <automations@openagentshub.dev>')
    expect(body.to).toEqual(['owner@example.com'])
    expect(body.subject).toBe('[Open Agents Hub] Completed: Daily digest')
    expect(body.html).toContain('Three findings')
    expect(body.html).toContain('4.20s')
  })

  it('records a failed delivery when Resend rejects the request', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const entry = await sendResendNotification(BASE_RUN)

    expect(entry).toMatchObject({
      status: 'Failed',
      delivered: false,
      deliveryError: 'network down',
    })
    expect(getEmailLogs()).toEqual([entry])
    expect(warn).toHaveBeenCalledWith('Resend API dispatch error:', expect.any(Error))
  })

  it('records an unsuccessful HTTP response as a failed delivery', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }))

    const entry = await sendResendNotification(BASE_RUN)

    expect(entry.status).toBe('Failed')
    expect(entry.deliveryError).toContain('HTTP 429')
  })

  it('skips the network call without a key or recipient', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const missingRecipient = await sendResendNotification({ ...BASE_RUN, to: '' })
    vi.stubEnv('VITE_RESEND_API_KEY', '')
    const missingKey = await sendResendNotification(BASE_RUN)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(missingRecipient).toMatchObject({
      status: 'Not sent',
      delivered: false,
      deliveryError: 'No recipient email is configured.',
    })
    expect(missingKey).toMatchObject({
      status: 'Not sent',
      delivered: false,
      deliveryError: 'No email sending credential is configured.',
    })
    expect(getEmailLogs()).toHaveLength(2)
  })
})
