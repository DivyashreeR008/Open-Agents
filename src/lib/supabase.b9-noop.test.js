import { describe, expect, it } from 'vitest'
import { isSupabaseConfigured, supabase } from './supabase'

const skipUnlessUnconfigured = isSupabaseConfigured ? describe.skip : describe

skipUnlessUnconfigured('unconfigured Supabase no-op completeness', () => {
  it('supports delete, comparison filters, pagination, and maybeSingle', async () => {
    const query = supabase
      .from('workflows')
      .delete()
      .eq('user_id', 'demo')
      .neq('status', 'archived')
      .lt('created_at', '2026-01-01')
      .lte('updated_at', '2026-01-02')
      .in('id', ['a', 'b'])
      .is('deleted_at', null)
      .limit(10)

    await expect(query).resolves.toEqual({ data: [], error: null })
    await expect(query.maybeSingle()).resolves.toEqual({ data: null, error: null })
  })

  it('exposes an auth surface that reports an anonymous session', async () => {
    const { data, error } = await supabase.auth.getUser()

    expect(error).toBeNull()
    expect(data.user).toBeNull()
    await expect(supabase.auth.getSession()).resolves.toEqual({
      data: { session: null },
      error: null,
    })

    const subscription = supabase.auth.onAuthStateChange(() => {}).data.subscription
    expect(() => subscription.unsubscribe()).not.toThrow()
  })

  it('supports upsert chains without a backend', async () => {
    await expect(supabase.from('agent_runs').upsert({ id: 'run-1' }).select('*')).resolves.toEqual({
      data: [],
      error: null,
    })
  })
})
