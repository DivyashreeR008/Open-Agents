import { describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ data: null, error: null }))

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({ data: state.data, error: state.error }),
        }),
      }),
    }),
  },
}))

import { fetchWorkflows } from './useWorkflows'

describe('fetchWorkflows null data', () => {
  it('normalizes a null payload to an empty list', async () => {
    await expect(fetchWorkflows()).resolves.toEqual({ data: [], error: null })
  })
})
