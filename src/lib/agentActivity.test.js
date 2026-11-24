import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readAgentActivity } from './agentActivity'

const put = (key, value) => localStorage.setItem(key, JSON.stringify(value))
beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('retained agent activity', () => {
  it('joins all three sources by exact agent IDs with stable namespaced original IDs', () => {
    put('OpenAgents_history', [
      { id: 'same', agentId: 'a', timestamp: 1, output: 'manual' },
      { id: 'other', agentId: 'b', agentName: 'Same name', timestamp: 99 },
    ])
    put('oa_automation_runs_v2', [
      {
        id: 'same',
        automationId: 'auto',
        startedAt: 3,
        scheduledFor: 2,
        status: 'success',
        output: 'automation',
      },
    ])
    put('oa_automations_v2', [{ id: 'auto', agentId: 'a' }])
    put('oa_scheduler_results', [{ id: 'same', jobId: 'job', ranAt: 2, output: 'legacy' }])
    put('oa_scheduled_jobs', [{ id: 'job', agentId: 'a' }])
    const snapshot = readAgentActivity('a')
    expect(snapshot.unavailable).toEqual([])
    expect(
      snapshot.runs.map(({ key, id, trigger, output }) => ({ key, id, trigger, output }))
    ).toEqual([
      { key: 'automation:same', id: 'same', trigger: 'scheduled', output: 'automation' },
      { key: 'scheduler:same', id: 'same', trigger: 'unknown', output: 'legacy' },
      { key: 'manual:same', id: 'same', trigger: 'manual', output: 'manual' },
    ])
  })

  it('keeps explicit future agent identity after its scheduling definition is removed', () => {
    put('oa_automation_runs_v2', [
      {
        id: 'new',
        agentId: 'a',
        automationId: 'deleted',
        trigger: 'manual',
        startedAt: 5,
        status: 'failed',
        error: 'failure',
        output: 'partial',
      },
    ])
    expect(readAgentActivity('a').runs[0]).toMatchObject({
      id: 'new',
      trigger: 'manual',
      status: 'failed',
      error: 'failure',
      output: 'partial',
    })
  })

  it('never guesses missing or ambiguous legacy agent links from names', () => {
    put('oa_automation_runs_v2', [
      { id: 'lost', automationId: 'deleted', agentName: 'Agent A' },
      { id: 'ambiguous', automationId: 'duplicate' },
      { id: 'no-foreign-id' },
    ])
    put('oa_automations_v2', [
      { id: 'duplicate', agentId: 'a' },
      { id: 'duplicate', agentId: 'b' },
      { agentId: 'a' },
    ])
    expect(readAgentActivity('a').runs).toEqual([])
  })

  it('retains missing or invalid timestamps as unknown and orders ties deterministically', () => {
    put('OpenAgents_history', [
      { id: 'b', agentId: 'a', timestamp: 1 },
      { id: 'a', agentId: 'a', timestamp: 1 },
      { id: 'unknown', agentId: 'a', timestamp: 1e300 },
      { id: 'missing', agentId: 'a' },
    ])
    expect(readAgentActivity('a').runs.map(({ id, timestamp }) => [id, timestamp])).toEqual([
      ['a', 1],
      ['b', 1],
      ['missing', null],
      ['unknown', null],
    ])
  })

  it('deduplicates only within a source and safely ignores malformed entries and fields', () => {
    put('OpenAgents_history', [
      null,
      [],
      7,
      {},
      { id: 'x', agentId: 'a', output: ['bad'] },
      { id: 'x', agentId: 'a', output: 'duplicate' },
    ])
    expect(readAgentActivity('a').runs).toHaveLength(1)
    expect(readAgentActivity('a').runs[0].output).toBe('')
    expect(readAgentActivity(null).runs).toEqual([])
  })

  it.each(['{broken', '{}', 'null'])(
    'reports corrupt stores without hiding readable sources: %s',
    (raw) => {
      localStorage.setItem('oa_automation_runs_v2', raw)
      put('OpenAgents_history', [{ id: 'x', agentId: 'a' }])
      expect(readAgentActivity('a')).toMatchObject({
        unavailable: ['automation'],
        runs: [expect.objectContaining({ id: 'x' })],
      })
    }
  )

  it('does not seed, migrate, truncate or otherwise write to any source', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem')
    expect(readAgentActivity('a')).toEqual({ runs: [], unavailable: [] })
    expect(write).not.toHaveBeenCalled()
  })

  it('reports blocked storage rather than claiming an empty complete history', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readAgentActivity('a')).toEqual({
      runs: [],
      unavailable: ['manual', 'automation', 'scheduler', 'automations', 'jobs'],
    })
  })

  it('preserves missed/skipped states and supports numeric legacy identifiers', () => {
    put('oa_automation_runs_v2', [
      { id: 1, agentId: 7, status: 'missed', scheduledFor: 1 },
      { id: 2, agentId: 7, status: 'skipped', trigger: 'scheduled' },
    ])
    expect(
      readAgentActivity('7').runs.map(({ id, status, trigger }) => [id, status, trigger])
    ).toEqual([
      ['1', 'missed', 'scheduled'],
      ['2', 'skipped', 'scheduled'],
    ])
  })
})
