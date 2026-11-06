import { describe, expect, it } from 'vitest'
import { isSupabaseConfigured, supabase } from './supabase'

describe('supabase fallback client', () => {
  it('treats an unconfigured environment as a safe no-op client', async () => {
    expect(typeof isSupabaseConfigured).toBe('boolean')

    const query = supabase
      .from('missing_table')
      .select('*')
      .eq('id', 'missing')
      .order('created_at')
      .range(0, 9)

    await expect(query).resolves.toEqual({ data: [], error: null })
    await expect(supabase.from('missing_table').single()).resolves.toEqual({
      data: null,
      error: null,
    })
    await expect(supabase.rpc('noop')).resolves.toEqual({ data: null, error: null })
  })

  it('returns a self-referential realtime channel and removes it quietly', async () => {
    const channel = supabase.channel('room')
    expect(channel.on('event', () => {})).toBe(channel)
    expect(channel.subscribe()).toBe(channel)
    await expect(supabase.removeChannel(channel)).resolves.toBeUndefined()
  })
})
