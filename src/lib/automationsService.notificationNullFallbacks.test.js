// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getEmailLogs, sendResendNotification } from './automationsService'

beforeEach(() => {
  localStorage.clear()
  vi.stubEnv('VITE_RESEND_API_KEY', '')
})

describe('automation notification fallbacks', () => {
  it('renders failed notifications with empty names and no output', async () => {
    const entry = await sendResendNotification({
      to: '',
      automationName: null,
      agentName: null,
      output: '',
      status: 'failed',
      duration: 0,
      error: null,
    })

    expect(entry).toMatchObject({
      automationName: null,
      agentName: null,
      status: 'Failed',
      subject: '[Open Agents Hub] Failed: ',
      preview: 'Run finished',
    })
    expect(getEmailLogs()).toEqual([entry])
  })
})
