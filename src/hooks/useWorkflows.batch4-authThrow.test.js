import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getUser: state.getUser },
    from: state.from,
  },
}))

import { saveWorkflow, updateWorkflow } from './useWorkflows'

describe('workflow auth lookup failures', () => {
  beforeEach(() => {
    state.getUser.mockReset()
    state.from.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('returns the authentication error when the user lookup throws', async () => {
    state.getUser.mockRejectedValue(new Error('auth offline'))

    await expect(
      saveWorkflow({ title: 'Draft', description: '', agents: ['agent-1'] })
    ).resolves.toEqual({
      data: null,
      error: {
        message: 'User must be authenticated to save workflows. Please log in first.',
      },
    })
    expect(state.from).not.toHaveBeenCalled()
  })

  it('refuses an update when the user lookup throws', async () => {
    state.getUser.mockRejectedValue(new Error('auth offline'))

    await expect(updateWorkflow('workflow-1', { title: 'New' })).resolves.toMatchObject({
      data: null,
      error: { message: expect.stringContaining('authenticated') },
    })
    expect(state.from).not.toHaveBeenCalled()
  })
})
