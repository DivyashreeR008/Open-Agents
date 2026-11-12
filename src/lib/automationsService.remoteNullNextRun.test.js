// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => {
  const state = { updates: [] }
  const query = {
    insert: () => query,
    update: (payload) => {
      state.updates.push(payload)
      return query
    },
    eq: () => query,
    then: (resolve, reject) => Promise.resolve({ error: null }).then(resolve, reject),
  }
  return { state, query }
})

vi.mock('./supabase', () => ({
  supabase: { from: () => db.query },
  isSupabaseConfigured: true,
}))
vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => null,
}))

import { createAutomation, updateAutomation } from './automationsService'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('oa_automations_v2', '[]')
  db.state.updates = []
})

describe('automation remote schedule clearing', () => {
  it('sends a null next run time when the local schedule is cleared', async () => {
    const job = await createAutomation({
      name: 'Cleared schedule',
      agentId: '1',
      agentName: 'Agent',
      schedule: 'daily',
    })

    const updated = await updateAutomation(job.id, { nextRunAt: null })

    expect(updated.nextRunAt).toBeNull()
    expect(db.state.updates.at(-1)).toMatchObject({ next_run_at: null })
  })
})
