// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAutomation, loadAutomations } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)
const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000

describe('automation creation defaults', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fills safe defaults for a newly created daily automation', async () => {
    const created = await createAutomation({
      agentId: '42',
      agentName: 'Research Agent',
    })

    expect(created).toMatchObject({
      name: 'Research Agent Automation',
      agentId: '42',
      agentName: 'Research Agent',
      category: 'General',
      provider: 'openai',
      model: 'gpt-4o',
      schedule: 'daily',
      cron: '0 9 * * *',
      enabled: true,
      inputs: {},
      systemPrompt: '',
      emailNotification: false,
      notificationEmail: '',
      createdAt: NOW,
      lastRunAt: null,
      nextRunAt: NOW + DAY,
      hasKey: false,
    })
    expect(created.id).toMatch(/^auto_/)
    expect(loadAutomations()).toEqual([created])
  })

  it('honours supplied fields and the hourly preset', async () => {
    const created = await createAutomation({
      name: 'Hourly triage',
      agentId: '7',
      agentName: 'CI Failure Triage',
      category: 'Engineering',
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      schedule: 'hourly',
      enabled: false,
      inputs: { log: 'build failed' },
      systemPrompt: 'Triage the failure.',
      emailNotification: 1,
      notificationEmail: 'oncall@example.com',
    })

    expect(created).toMatchObject({
      name: 'Hourly triage',
      category: 'Engineering',
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      schedule: 'hourly',
      cron: '0 * * * *',
      enabled: false,
      inputs: { log: 'build failed' },
      systemPrompt: 'Triage the failure.',
      emailNotification: true,
      notificationEmail: 'oncall@example.com',
      nextRunAt: NOW + HOUR,
    })
  })

  it('falls back to an agent-based name and prepends the new row', async () => {
    localStorage.setItem(
      'oa_automations_v2',
      JSON.stringify([{ id: 'existing', name: 'Existing job' }])
    )

    const created = await createAutomation({
      name: '',
      agentId: '1',
      agentName: 'Agent',
      schedule: 'weekly',
    })

    expect(created.name).toBe('Agent Automation')
    expect(created.cron).toBe('0 9 * * 1')
    expect(loadAutomations().map((automation) => automation.id)).toEqual([created.id, 'existing'])
  })
})
