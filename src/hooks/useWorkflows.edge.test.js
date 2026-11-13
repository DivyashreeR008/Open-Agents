import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  channel: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: () => true,
  supabase: {
    auth: { getUser: state.getUser },
    from: state.from,
    rpc: state.rpc,
    channel: state.channel,
  },
}))

import { deleteWorkflow, incrementUsage, saveWorkflow, updateWorkflow } from './useWorkflows'

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

describe('useWorkflows empty data and ownership edges', () => {
  beforeEach(() => {
    state.getUser.mockReset()
    state.from.mockReset()
    state.rpc.mockReset()
    state.channel.mockReset()
    signedIn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('treats a failed authentication lookup as signed out', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.getUser.mockRejectedValue(new Error('auth offline'))

    const response = await saveWorkflow({ title: 'Draft', agents: [] })

    expect(response.data).toBeNull()
    expect(response.error.message).toContain('must be authenticated')
    expect(warn).toHaveBeenCalledWith('Failed to get current user:', expect.any(Error))
    expect(state.from).not.toHaveBeenCalled()
  })

  it('keeps duplicate-key errors and normalizes a missing inserted row', async () => {
    state.from
      .mockReturnValueOnce(
        makeQuery({
          data: null,
          error: { code: '23505', message: 'duplicate key value violates unique constraint' },
        })
      )
      .mockReturnValueOnce(makeQuery({ data: null, error: null }))

    await expect(saveWorkflow({ title: 'Draft', agents: ['agent-a'] })).resolves.toEqual({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    })
    await expect(saveWorkflow({ title: 'Draft', agents: [] })).resolves.toEqual({
      data: null,
      error: null,
    })
  })

  it('normalizes an empty update and stops a delete when the ownership read fails', async () => {
    signedIn('owner-1')
    queueFrom([
      { data: { user_id: 'owner-1' }, error: null },
      { data: null, error: null },
    ])

    await expect(updateWorkflow('w1', { title: 'Renamed' })).resolves.toEqual({
      data: null,
      error: null,
    })

    queueFrom([{ data: null, error: { message: 'lookup failed' } }])
    state.from.mockClear()
    const failedLookup = await deleteWorkflow('w1')

    expect(failedLookup).toEqual({ error: { message: 'lookup failed' } })
    expect(state.from).toHaveBeenCalledTimes(1)
    expect(state.from.mock.results[0].value.delete).not.toHaveBeenCalled()

    queueFrom([{ data: null, error: null }])
    const missingRow = await deleteWorkflow('w2')
    expect(missingRow.error.message).toBe('Workflow not found.')
  })

  it('increments from zero when the fallback row has no usage count', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.rpc.mockResolvedValue({ error: { message: 'function unavailable' } })
    queueFrom([{ data: { usage_count: null }, error: null }, { error: null }])

    await expect(incrementUsage('w9')).resolves.toEqual({ error: null })

    const updateQuery = state.from.mock.results[1].value
    expect(updateQuery.update).toHaveBeenCalledWith({ usage_count: 1 })
    expect(warn).toHaveBeenCalled()
  })
})
