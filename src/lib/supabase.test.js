import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockCreatedClient = {
  __brand: 'mock-supabase-client',
  from: vi.fn(),
  rpc: vi.fn(),
  channel: vi.fn(),
  removeChannel: vi.fn(),
}

const mockCreateClient = vi.fn(() => mockCreatedClient)

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args) => mockCreateClient(...args),
}))

describe('Supabase client module audit', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    mockCreateClient.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('isSupabaseConfigured flag', () => {
    it('is false when both URL and anon key are missing', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', '')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is false when VITE_SUPABASE_URL is missing', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', '')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is false when VITE_SUPABASE_ANON_KEY is missing', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is false when VITE_SUPABASE_URL is the literal string "undefined"', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'undefined')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'valid-anon-key')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is false when VITE_SUPABASE_ANON_KEY is the literal string "undefined"', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'undefined')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is false when both values are the literal string "undefined"', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'undefined')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'undefined')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(false)
    })

    it('is true only when both values are non-empty valid strings', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'valid-anon-key')

      const { isSupabaseConfigured } = await import('./supabase')
      expect(isSupabaseConfigured).toBe(true)
    })

    it('re-evaluates environment changes across module resets without stale memoization', async () => {
      vi.stubEnv('VITE_SUPABASE_URL', '')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
      const initial = await import('./supabase')
      expect(initial.isSupabaseConfigured).toBe(false)

      vi.resetModules()
      vi.stubEnv('VITE_SUPABASE_URL', 'https://reloaded.supabase.co')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'reloaded-key')
      const configured = await import('./supabase')
      expect(configured.isSupabaseConfigured).toBe(true)

      vi.resetModules()
      vi.stubEnv('VITE_SUPABASE_URL', 'undefined')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'reloaded-key')
      const invalid = await import('./supabase')
      expect(invalid.isSupabaseConfigured).toBe(false)
    })
  })

  describe('configured client branch', () => {
    it('calls createClient once with the exact URL and key when configured', async () => {
      const url = 'https://live-project.supabase.co'
      const key = 'live-anon-token-xyz'
      vi.stubEnv('VITE_SUPABASE_URL', url)
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', key)

      const { supabase, isSupabaseConfigured } = await import('./supabase')

      expect(isSupabaseConfigured).toBe(true)
      expect(mockCreateClient).toHaveBeenCalledTimes(1)
      expect(mockCreateClient).toHaveBeenCalledWith(url, key)
      expect(supabase).toBe(mockCreatedClient)
    })
  })

  describe('unconfigured fallback client branch', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_SUPABASE_URL', '')
      vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    })

    it('exports the no-op client without invoking createClient or making network calls', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch')
      const { supabase, isSupabaseConfigured } = await import('./supabase')

      expect(isSupabaseConfigured).toBe(false)
      expect(mockCreateClient).not.toHaveBeenCalled()
      expect(supabase).toBeDefined()
      expect(supabase).not.toBe(mockCreatedClient)

      await supabase.from('test_table').select('*')
      await supabase.rpc('test_rpc')
      expect(fetchSpy).not.toHaveBeenCalled()

      fetchSpy.mockRestore()
    })

    it('supports individual query methods without throwing: select, insert, update, eq, gte, order, range, single', async () => {
      const { supabase } = await import('./supabase')
      const query = supabase.from('sample_table')

      expect(typeof query.select).toBe('function')
      expect(typeof query.insert).toBe('function')
      expect(typeof query.update).toBe('function')
      expect(typeof query.eq).toBe('function')
      expect(typeof query.gte).toBe('function')
      expect(typeof query.order).toBe('function')
      expect(typeof query.range).toBe('function')
      expect(typeof query.single).toBe('function')

      expect(query.select('*')).toBe(query)
      expect(query.insert({ a: 1 })).toBe(query)
      expect(query.update({ a: 2 })).toBe(query)
      expect(query.eq('status', 'active')).toBe(query)
      expect(query.gte('created_at', '2026-01-01')).toBe(query)
      expect(query.order('created_at')).toBe(query)
      expect(query.range(0, 10)).toBe(query)

      const singleQuery = query.single()
      expect(typeof singleQuery.then).toBe('function')
    })

    it('resolves parent query with empty list and single query with null row and no error', async () => {
      const { supabase } = await import('./supabase')

      await expect(supabase.from('workflows')).resolves.toEqual({
        data: [],
        error: null,
      })

      await expect(supabase.from('workflows').single()).resolves.toEqual({
        data: null,
        error: null,
      })
    })

    it('exercises the fetchWorkflows service chain: .from.select.eq.order', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase
        .from('workflows')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      await expect(query).resolves.toEqual({
        data: [],
        error: null,
      })
    })

    it('exercises the fetchWorkflowById service chain: .from.select.eq.single', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase.from('workflows').select('*').eq('id', 'wf-audit-123').single()

      await expect(query).resolves.toEqual({
        data: null,
        error: null,
      })
    })

    it('exercises the saveWorkflow service chain: .from.insert.select.single', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase
        .from('workflows')
        .insert([
          {
            user_id: 'user-audit-1',
            title: 'Audit Workflow',
            description: 'Test description',
            agents: ['agent-1', 'agent-2'],
            is_public: true,
            usage_count: 0,
          },
        ])
        .select()
        .single()

      await expect(query).resolves.toEqual({
        data: null,
        error: null,
      })
    })

    it('exercises the updateWorkflow service chain: .from.update.eq.eq.select.single', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase
        .from('workflows')
        .update({ title: 'Updated Title' })
        .eq('id', 'wf-audit-123')
        .eq('user_id', 'user-audit-1')
        .select()
        .single()

      await expect(query).resolves.toEqual({
        data: null,
        error: null,
      })
    })

    it('exercises the metrics fetchRuns service chain: .from.select.gte.order', async () => {
      const { supabase } = await import('./supabase')

      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const query = supabase
        .from('agent_runs')
        .select('*')
        .gte('timestamp', since)
        .order('timestamp', { ascending: false })

      await expect(query).resolves.toEqual({
        data: [],
        error: null,
      })
    })

    it('exercises the logAgentRun service chain: .from.insert', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase.from('agent_runs').insert({
        agent_run_id: 'run-audit-456',
        model: 'gpt-4o',
        input_tokens: 120,
        output_tokens: 240,
        estimated_cost_usd: 0.0042,
        status: 'success',
        duration_ms: 850,
        timestamp: new Date().toISOString(),
      })

      await expect(query).resolves.toEqual({
        data: [],
        error: null,
      })
    })

    it('exercises pagination range queries: .from.select.order.range', async () => {
      const { supabase } = await import('./supabase')

      const query = supabase
        .from('public_directory')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 19)

      await expect(query).resolves.toEqual({
        data: [],
        error: null,
      })
    })

    it('returns an awaitable rpc result with { data: null, error: null }', async () => {
      const { supabase } = await import('./supabase')

      const rpcResult = await supabase.rpc('increment_workflow_usage', {
        workflow_id: 'wf-audit-123',
      })

      expect(rpcResult).toEqual({
        data: null,
        error: null,
      })
    })

    it('provides chainable and awaitable realtime channel lifecycle methods: channel, on, subscribe, removeChannel', async () => {
      const { supabase } = await import('./supabase')

      const channel = supabase.channel('workflow-usage-wf-audit-123')
      expect(channel).toBeDefined()

      const handler = vi.fn()
      const chainedChannel = channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workflows',
          filter: 'id=eq.wf-audit-123',
        },
        handler
      )
      expect(chainedChannel).toBe(channel)

      const subscribed = channel.subscribe()
      expect(subscribed).toBe(channel)

      const awaitedSubscription = await channel.subscribe()
      expect(awaitedSubscription).toBe(channel)

      await expect(supabase.removeChannel(channel)).resolves.toBeUndefined()
    })
  })
})
