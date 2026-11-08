import { afterEach, describe, expect, it, vi } from 'vitest'

const client = { from: vi.fn(), rpc: vi.fn() }
const createClient = vi.hoisted(() => vi.fn(() => client))

vi.mock('@supabase/supabase-js', () => ({ createClient }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
  createClient.mockClear()
})

describe('supabase client selection', () => {
  it('creates a real client when both environment values are present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    vi.resetModules()

    const module = await import('./supabase')

    expect(module.isSupabaseConfigured).toBe(true)
    expect(createClient).toHaveBeenCalledWith('https://example.supabase.co', 'anon-key')
    expect(module.supabase).toBe(client)
  })

  it('treats literal undefined strings as unconfigured', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'undefined')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'undefined')
    vi.resetModules()

    const module = await import('./supabase')

    expect(module.isSupabaseConfigured).toBe(false)
    expect(createClient).not.toHaveBeenCalled()
    await expect(module.supabase.rpc('noop')).resolves.toEqual({ data: null, error: null })
  })
})
