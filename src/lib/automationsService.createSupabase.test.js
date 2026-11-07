// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => {
  const state = { table: '', inserted: [], failInsert: false }
  const query = {
    insert: (payload) => {
      state.inserted.push(payload)
      if (state.failInsert) throw new Error('insert unavailable')
      return query
    },
    then: (resolve, reject) => Promise.resolve({ error: null }).then(resolve, reject),
  }
  return {
    state,
    query,
    supabase: {
      from: (table) => {
        state.table = table
        return query
      },
    },
  }
})

vi.mock('./supabase', () => ({ supabase: db.supabase, isSupabaseConfigured: true }))

import { createAutomation, loadAutomations } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)

describe('automation creation with a configured backend', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    db.state.table = ''
    db.state.inserted = []
    db.state.failInsert = false
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('mirrors a new automation into Supabase with snake_case columns', async () => {
    const created = await createAutomation({
      name: 'Weekly review',
      agentId: '9',
      agentName: 'Weekly Review Generator',
      category: 'Productivity',
      provider: 'anthropic',
      model: 'claude-sonnet-4',
      schedule: 'weekly',
      inputs: { notes: 'week 45' },
      emailNotification: true,
      notificationEmail: 'owner@example.com',
    })

    expect(db.state.table).toBe('automations')
    expect(db.state.inserted).toEqual([
      {
        id: created.id,
        name: 'Weekly review',
        agent_id: '9',
        agent_name: 'Weekly Review Generator',
        category: 'Productivity',
        provider: 'anthropic',
        model: 'claude-sonnet-4',
        schedule: 'weekly',
        cron: '0 9 * * 1',
        enabled: true,
        inputs: { notes: 'week 45' },
        email_notification: true,
        notification_email: 'owner@example.com',
        created_at: new Date(NOW).toISOString(),
        next_run_at: new Date(NOW + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ])
  })

  it('keeps the local automation when the backend insert fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    db.state.failInsert = true

    const created = await createAutomation({
      name: 'Unsynced job',
      agentId: '2',
      agentName: 'Agent Two',
    })

    expect(created.name).toBe('Unsynced job')
    expect(loadAutomations()).toEqual([created])
    expect(warn).toHaveBeenCalledWith('Supabase automation insert error:', expect.any(Error))
  })
})
