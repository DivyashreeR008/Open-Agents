import { beforeEach, describe, expect, it, vi } from 'vitest'

const backend = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
  getUser: vi.fn(),
  channel: vi.fn(() => ({
    on() {
      return this
    },
    subscribe() {
      return this
    },
  })),
  removeChannel: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: { getUser: backend.getUser },
    from: backend.from,
    rpc: backend.rpc,
    channel: backend.channel,
    removeChannel: backend.removeChannel,
  },
}))

import {
  deleteWorkflow,
  fetchWorkflowById,
  fetchWorkflows,
  incrementUsage,
  saveWorkflow,
  subscribeToAllWorkflows,
  subscribeToWorkflow,
  updateWorkflow,
} from './useWorkflows'

const STORAGE_KEY = 'open-agents-workflows'

beforeEach(() => {
  localStorage.clear()
  backend.from.mockReset()
  backend.rpc.mockReset()
  backend.getUser.mockReset()
  backend.channel.mockClear()
})

describe('useWorkflows local fallback', () => {
  it('saves, lists, reads, edits, increments, and deletes without a backend', async () => {
    const saved = await saveWorkflow({
      title: 'Research chain',
      description: 'Find and summarize sources',
      agents: ['researcher', 'writer'],
    })

    expect(saved.error).toBeNull()
    expect(saved.data).toMatchObject({
      title: 'Research chain',
      description: 'Find and summarize sources',
      agents: ['researcher', 'writer'],
      is_public: true,
      usage_count: 0,
      user_id: 'local-user',
    })
    expect(saved.data.id).toBeTruthy()
    expect(saved.data.created_at).toBeTruthy()

    const listed = await fetchWorkflows()
    expect(listed.error).toBeNull()
    expect(listed.data).toHaveLength(1)
    expect(listed.data[0].id).toBe(saved.data.id)

    const fetched = await fetchWorkflowById(saved.data.id)
    expect(fetched).toEqual({ data: saved.data, error: null })

    const updated = await updateWorkflow(saved.data.id, {
      title: 'Research and publish',
      agents: ['researcher'],
    })
    expect(updated.error).toBeNull()
    expect(updated.data).toMatchObject({
      id: saved.data.id,
      title: 'Research and publish',
      agents: ['researcher'],
    })

    await expect(incrementUsage(saved.data.id)).resolves.toEqual({ error: null })
    const afterIncrement = await fetchWorkflowById(saved.data.id)
    expect(afterIncrement.data.usage_count).toBe(1)

    await expect(deleteWorkflow(saved.data.id)).resolves.toEqual({ error: null })
    await expect(fetchWorkflows()).resolves.toEqual({ data: [], error: null })

    const missing = await fetchWorkflowById(saved.data.id)
    expect(missing.data).toBeNull()
    expect(missing.error.message).toContain('not found in local storage')
    expect(backend.from).not.toHaveBeenCalled()
    expect(backend.rpc).not.toHaveBeenCalled()
    expect(backend.getUser).not.toHaveBeenCalled()
  })

  it('lists the newest saved workflow first', async () => {
    await saveWorkflow({ title: 'First', agents: ['a'] })
    await saveWorkflow({ title: 'Second', agents: ['b'] })

    const { data } = await fetchWorkflows()

    expect(data.map((workflow) => workflow.title)).toEqual(['Second', 'First'])
  })

  it('surfaces unreadable storage with the key to clear instead of overwriting it', async () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    const listed = await fetchWorkflows()
    expect(listed.data).toEqual([])
    expect(listed.error.message).toContain('unreadable')
    expect(listed.error.message).toContain(STORAGE_KEY)

    const saved = await saveWorkflow({ title: 'Draft', agents: ['a'] })
    expect(saved.data).toBeNull()
    expect(saved.error.message).toContain(STORAGE_KEY)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{not-json')
  })

  it('does not report success when browser storage rejects a write', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })

    const saved = await saveWorkflow({ title: 'Draft', agents: ['a'] })

    setItem.mockRestore()
    expect(saved.data).toBeNull()
    expect(saved.error.message).toContain('Could not store the workflow')
    expect(saved.error.message).toContain('Quota exceeded')
    expect(saved.error.message).toContain('Delete unused workflows')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('reports missing rows for edit, delete, and usage updates', async () => {
    await expect(updateWorkflow('missing', { title: 'New' })).resolves.toEqual({
      data: null,
      error: expect.objectContaining({ message: expect.stringContaining('not found') }),
    })
    await expect(deleteWorkflow('missing')).resolves.toEqual({
      error: expect.objectContaining({ message: expect.stringContaining('not found') }),
    })
    await expect(incrementUsage('missing')).resolves.toEqual({
      error: expect.objectContaining({ message: expect.stringContaining('not found') }),
    })
  })

  it('returns local subscription placeholders without opening a backend channel', () => {
    const callback = vi.fn()

    const one = subscribeToWorkflow('w1', callback)
    const all = subscribeToAllWorkflows(callback)

    expect(one).toHaveProperty('on')
    expect(all).toHaveProperty('subscribe')
    expect(backend.channel).toHaveBeenCalledWith('workflow-usage-w1')
    expect(backend.channel).toHaveBeenCalledWith('workflow-usage-all')
    expect(backend.from).not.toHaveBeenCalled()
  })
})
