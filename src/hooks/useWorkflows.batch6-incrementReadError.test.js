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

import { incrementUsage } from './useWorkflows'

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

beforeEach(() => {
  state.getUser.mockReset()
  state.from.mockReset()
  state.rpc.mockReset()
  state.channel.mockReset()
})

describe('incrementUsage fallback read failures', () => {
  it('returns the fallback read error instead of reporting a missing workflow', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    state.rpc.mockResolvedValue({ error: { message: 'function unavailable' } })
    state.from.mockReturnValue(makeQuery({ data: null, error: { message: 'read failed' } }))

    const response = await incrementUsage('w1')

    expect(response.error).toEqual({ message: 'read failed' })
    warn.mockRestore()
  })
})
