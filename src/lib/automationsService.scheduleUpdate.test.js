// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => {
  const state = { inserted: [], updates: [], filters: [] }
  const query = {
    insert: (payload) => {
      state.inserted.push(payload)
      return query
    },
    update: (payload) => {
      state.updates.push(payload)
      return query
    },
    eq: (column, value) => {
      state.filters.push([column, value])
      return query
    },
    then: (resolve, reject) => Promise.resolve({ error: null }).then(resolve, reject),
  }
  return {
    state,
    query,
    supabase: { from: () => query },
  }
})

vi.mock('./supabase', () => ({ supabase: db.supabase, isSupabaseConfigured: true }))

import { createAutomation, getAutomation, updateAutomation } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

async function makeJob(overrides = {}) {
  return createAutomation({
    name: 'Scheduled job',
    agentId: '1',
    agentName: 'Agent',
    schedule: 'daily',
    ...overrides,
  })
}

describe('automation schedule changes', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    db.state.inserted = []
    db.state.updates = []
    db.state.filters = []
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('recomputes the cron and next run when the cadence changes', async () => {
    const job = await makeJob()
    vi.setSystemTime(NOW + 5 * 60 * 1000)

    const updated = await updateAutomation(job.id, { schedule: 'hourly' })

    expect(updated.schedule).toBe('hourly')
    expect(updated.cron).toBe('0 * * * *')
    expect(updated.nextRunAt).toBe(NOW + 5 * 60 * 1000 + HOUR)
    expect(updated.updatedAt).toBe(NOW + 5 * 60 * 1000)
    expect(db.state.updates.at(-1)).toMatchObject({
      schedule: 'hourly',
      next_run_at: new Date(NOW + 5 * 60 * 1000 + HOUR).toISOString(),
    })
    expect(db.state.filters.at(-1)).toEqual(['id', job.id])
  })

  it('leaves the cadence alone when other fields change', async () => {
    const job = await makeJob()
    const nextRunAt = job.nextRunAt

    const updated = await updateAutomation(job.id, { name: 'Renamed job' })

    expect(updated.name).toBe('Renamed job')
    expect(updated.cron).toBe('0 9 * * *')
    expect(updated.nextRunAt).toBe(nextRunAt)
    expect(getAutomation(job.id).name).toBe('Renamed job')
  })

  it('does not move a schedule that is set to the same cadence', async () => {
    const job = await makeJob()
    vi.setSystemTime(NOW + 3 * HOUR)

    const updated = await updateAutomation(job.id, { schedule: 'daily' })

    expect(updated.nextRunAt).toBe(job.nextRunAt)
    expect(updated.cron).toBe('0 9 * * *')
    expect(updated.nextRunAt).toBe(NOW + DAY)
  })

  it('moves to the weekly preset from the daily preset', async () => {
    const job = await makeJob()

    const updated = await updateAutomation(job.id, { schedule: 'weekly' })

    expect(updated.cron).toBe('0 9 * * 1')
    expect(updated.nextRunAt).toBe(NOW + 7 * DAY)
  })
})
