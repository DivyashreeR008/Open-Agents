import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  channel: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getUser: state.getUser },
    from: state.from,
    rpc: state.rpc,
    channel: state.channel,
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

function makeQuery(terminal) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => Promise.resolve(terminal)),
    single: vi.fn(() => Promise.resolve(terminal)),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    then: (resolve, reject) => Promise.resolve(terminal).then(resolve, reject),
  }
  return query
}

function queueFrom(terminals) {
  let index = 0
  state.from.mockImplementation(() => makeQuery(terminals[index++]))
  return state.from
}

function signedIn(id = 'user-1') {
  state.getUser.mockResolvedValue({ data: { user: { id } }, error: null })
}

describe('workflow data helpers', () => {
  beforeEach(() => {
    state.getUser.mockReset()
    state.from.mockReset()
    state.rpc.mockReset()
    state.channel.mockReset()
    signedIn()
  })

  it('fetches public workflows newest first and normalizes missing data', async () => {
    const query = makeQuery({ data: [{ id: 'w1' }], error: null })
    state.from.mockReturnValue(query)

    const response = await fetchWorkflows()

    expect(response).toEqual({ data: [{ id: 'w1' }], error: null })
    expect(state.from).toHaveBeenCalledWith('workflows')
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.eq).toHaveBeenCalledWith('is_public', true)
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('normalizes a missing workflow list to an empty array', async () => {
    state.from.mockReturnValue(makeQuery({ data: null, error: null }))

    await expect(fetchWorkflows()).resolves.toEqual({ data: [], error: null })
  })

  it('fetches one workflow by id with a single-row read', async () => {
    const query = makeQuery({ data: { id: 'w1' }, error: null })
    state.from.mockReturnValue(query)

    await expect(fetchWorkflowById('w1')).resolves.toEqual({
      data: { id: 'w1' },
      error: null,
    })
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.eq).toHaveBeenCalledWith('id', 'w1')
    expect(query.single).toHaveBeenCalledTimes(1)
  })

  it('normalizes a missing single workflow to null', async () => {
    state.from.mockReturnValue(makeQuery({ data: null, error: null }))

    await expect(fetchWorkflowById('w1')).resolves.toEqual({ data: null, error: null })
  })

  it('refuses to save without an authenticated user', async () => {
    state.getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await saveWorkflow({ title: 'Draft', agents: ['a'] })

    expect(response.data).toBeNull()
    expect(response.error.message).toContain('must be authenticated')
    expect(state.from).not.toHaveBeenCalled()
  })

  it('saves a workflow with the current user and public defaults', async () => {
    signedIn('owner-9')
    const query = makeQuery({ data: { id: 'w2' }, error: null })
    state.from.mockReturnValue(query)

    const response = await saveWorkflow({
      title: 'Draft',
      agents: ['agent-a'],
    })

    expect(response).toEqual({ data: { id: 'w2' }, error: null })
    expect(query.insert).toHaveBeenCalledWith([
      {
        user_id: 'owner-9',
        title: 'Draft',
        description: '',
        agents: ['agent-a'],
        is_public: true,
        usage_count: 0,
      },
    ])
    expect(query.select).toHaveBeenCalledTimes(1)
    expect(query.single).toHaveBeenCalledTimes(1)
  })

  it('refuses an unauthenticated update without reading the row', async () => {
    state.getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await updateWorkflow('w1', { title: 'New' })

    expect(response.error.message).toContain('must be authenticated')
    expect(state.from).not.toHaveBeenCalled()
  })

  it('returns the fetch error before attempting an update', async () => {
    queueFrom([{ data: null, error: { message: 'lookup failed' } }])

    const response = await updateWorkflow('w1', { title: 'New' })

    expect(response).toEqual({ data: null, error: { message: 'lookup failed' } })
    expect(state.from).toHaveBeenCalledTimes(1)
  })

  it('reports a missing workflow when the ownership read returns nothing', async () => {
    queueFrom([{ data: null, error: null }])

    const response = await updateWorkflow('w1', { title: 'New' })

    expect(response.data).toBeNull()
    expect(response.error.message).toBe('Workflow not found.')
  })

  it('refuses an update from a user who is not the owner', async () => {
    queueFrom([{ data: { user_id: 'someone-else' }, error: null }])

    const response = await updateWorkflow('w1', { title: 'New' })

    expect(response.data).toBeNull()
    expect(response.error.message).toContain('Only the owner')
    expect(state.from).toHaveBeenCalledTimes(1)
  })

  it('updates after the owner check passes', async () => {
    signedIn('owner-1')
    queueFrom([
      { data: { user_id: 'owner-1' }, error: null },
      { data: { id: 'w1', title: 'New' }, error: null },
    ])

    const response = await updateWorkflow('w1', { title: 'New' })

    expect(response).toEqual({ data: { id: 'w1', title: 'New' }, error: null })
    const updateQuery = state.from.mock.results[1].value
    expect(updateQuery.update).toHaveBeenCalledWith({ title: 'New' })
    expect(updateQuery.eq).toHaveBeenNthCalledWith(1, 'id', 'w1')
    expect(updateQuery.eq).toHaveBeenNthCalledWith(2, 'user_id', 'owner-1')
    expect(updateQuery.select).toHaveBeenCalledTimes(1)
  })

  it('refuses an unauthenticated delete', async () => {
    state.getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await deleteWorkflow('w1')

    expect(response.error.message).toContain('must be authenticated')
    expect(state.from).not.toHaveBeenCalled()
  })

  it('refuses a delete from a non-owner', async () => {
    queueFrom([{ data: { user_id: 'someone-else' }, error: null }])

    const response = await deleteWorkflow('w1')

    expect(response.error.message).toContain('Only the owner')
    expect(state.from).toHaveBeenCalledTimes(1)
  })

  it('deletes after the owner check passes with both filters', async () => {
    signedIn('owner-1')
    queueFrom([
      { data: { user_id: 'owner-1' }, error: null },
      { error: null },
    ])

    const response = await deleteWorkflow('w1')

    expect(response).toEqual({ error: null })
    const deleteQuery = state.from.mock.results[1].value
    expect(deleteQuery.delete).toHaveBeenCalledTimes(1)
    expect(deleteQuery.eq).toHaveBeenNthCalledWith(1, 'id', 'w1')
    expect(deleteQuery.eq).toHaveBeenNthCalledWith(2, 'user_id', 'owner-1')
  })

  it('returns the database-function error when the preferred increment succeeds', async () => {
    state.rpc.mockResolvedValue({ error: null })

    await expect(incrementUsage('w1')).resolves.toEqual({ error: null })
    expect(state.rpc).toHaveBeenCalledWith('increment_workflow_usage', {
      workflow_id: 'w1',
    })
    expect(state.from).not.toHaveBeenCalled()
  })

  it('falls back to reading and writing the count when the increment function fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.rpc.mockResolvedValue({ error: { message: 'function unavailable' } })
    queueFrom([
      { data: { usage_count: 4 }, error: null },
      { error: null },
    ])

    await expect(incrementUsage('w1')).resolves.toEqual({ error: null })

    const updateQuery = state.from.mock.results[1].value
    expect(updateQuery.update).toHaveBeenCalledWith({ usage_count: 5 })
    expect(updateQuery.eq).toHaveBeenCalledWith('id', 'w1')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('reports a clear missing-row error when the fallback cannot find the workflow', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.rpc.mockResolvedValue({ error: { message: 'function unavailable' } })
    queueFrom([{ data: null, error: null }])

    const response = await incrementUsage('w1')

    expect(response.error.message).toContain('w1')
    expect(response.error.message).toContain('could not be found')
    warn.mockRestore()
  })

  it('returns the fallback update error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.rpc.mockResolvedValue({ error: { message: 'function unavailable' } })
    queueFrom([
      { data: { usage_count: 2 }, error: null },
      { error: { message: 'write failed' } },
    ])

    await expect(incrementUsage('w1')).resolves.toEqual({
      error: { message: 'write failed' },
    })
    warn.mockRestore()
  })

  it('subscribes to one workflow with the documented filter and forwards payloads', () => {
    const callback = vi.fn()
    const channel = { on: vi.fn(), subscribe: vi.fn() }
    channel.on.mockReturnValue(channel)
    channel.subscribe.mockReturnValue(channel)
    state.channel.mockReturnValue(channel)

    const returned = subscribeToWorkflow('w1', callback)

    expect(returned).toBe(channel)
    expect(state.channel).toHaveBeenCalledWith('workflow-usage-w1')
    expect(channel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflows',
        filter: 'id=eq.w1',
      },
      expect.any(Function)
    )
    const payload = { new: { usage_count: 3 } }
    channel.on.mock.calls[0][2](payload)
    expect(callback).toHaveBeenCalledWith(payload)
    expect(channel.subscribe).toHaveBeenCalledTimes(1)
  })

  it('subscribes to all workflows without a row filter', () => {
    const callback = vi.fn()
    const channel = { on: vi.fn(), subscribe: vi.fn() }
    channel.on.mockReturnValue(channel)
    channel.subscribe.mockReturnValue(channel)
    state.channel.mockReturnValue(channel)

    const returned = subscribeToAllWorkflows(callback)

    expect(returned).toBe(channel)
    expect(state.channel).toHaveBeenCalledWith('workflow-usage-all')
    expect(channel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflows',
      },
      expect.any(Function)
    )
    const payload = { new: { usage_count: 9 } }
    channel.on.mock.calls[0][2](payload)
    expect(callback).toHaveBeenCalledWith(payload)
  })
})
